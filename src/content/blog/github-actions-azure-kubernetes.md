---
title: "Setup Github Action to deploy Angular web app to Azure Kubernetes (AKS)"
date: "2024-03-26"
author: "Ha Doan"
excerpt: "A comprehensive guide to setting up CI/CD pipeline for deploying Angular applications to Azure Kubernetes Service using GitHub Actions."
tags: ["GitHub Actions", "Azure", "Kubernetes", "Angular", "DevOps", "CI/CD"]
image: "/placeholder.svg"
---

# Setup GitHub Actions to Deploy Angular Web App to Azure Kubernetes (AKS)

Continuous deployment is essential for modern web applications. In this guide, we'll create a complete CI/CD pipeline using GitHub Actions to automatically build and deploy Angular applications to Azure Kubernetes Service (AKS).

## Architecture Overview

Our pipeline will:
1. Build the Angular application
2. Create a Docker image
3. Push to Azure Container Registry (ACR)
4. Deploy to AKS cluster
5. Update the Kubernetes deployment

## Prerequisites

- Angular application in GitHub repository
- Azure subscription with AKS cluster
- Azure Container Registry
- Docker Hub or ACR credentials
- kubectl access to your cluster

## Step 1: Prepare Your Angular Application

First, create a Dockerfile in your Angular project root:

```dockerfile
# Build stage
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build --prod

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist/your-app-name /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Create `nginx.conf` for serving your Angular app:

```nginx
events {
  worker_connections 1024;
}

http {
  include /etc/nginx/mime.types;
  default_type application/octet-stream;

  server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
      try_files $uri $uri/ /index.html;
    }

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
  }
}
```

## Step 2: Create Kubernetes Manifests

Create `k8s/deployment.yaml`:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: angular-app
  labels:
    app: angular-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: angular-app
  template:
    metadata:
      labels:
        app: angular-app
    spec:
      containers:
      - name: angular-app
        image: yourregistry.azurecr.io/angular-app:latest
        ports:
        - containerPort: 80
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "256Mi"
            cpu: "200m"
        livenessProbe:
          httpGet:
            path: /
            port: 80
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /
            port: 80
          initialDelaySeconds: 5
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: angular-app-service
spec:
  type: LoadBalancer
  selector:
    app: angular-app
  ports:
  - port: 80
    targetPort: 80
```

## Step 3: Setup GitHub Secrets

Add these secrets to your GitHub repository (Settings → Secrets and variables → Actions):

- `AZURE_CREDENTIALS`: Service principal credentials
- `ACR_USERNAME`: Azure Container Registry username
- `ACR_PASSWORD`: Azure Container Registry password
- `AKS_CLUSTER_NAME`: Your AKS cluster name
- `AKS_RESOURCE_GROUP`: Resource group name

## Step 4: Create GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Build and Deploy to AKS

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

env:
  REGISTRY: yourregistry.azurecr.io
  IMAGE_NAME: angular-app
  AKS_CLUSTER: ${{ secrets.AKS_CLUSTER_NAME }}
  RESOURCE_GROUP: ${{ secrets.AKS_RESOURCE_GROUP }}

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
    
    - name: Checkout code
      uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm run test -- --watch=false --browsers=ChromeHeadless
    
    - name: Build Angular app
      run: npm run build --prod
    
    - name: Login to Azure Container Registry
      uses: docker/login-action@v2
      with:
        registry: ${{ env.REGISTRY }}
        username: ${{ secrets.ACR_USERNAME }}
        password: ${{ secrets.ACR_PASSWORD }}
    
    - name: Build and push Docker image
      uses: docker/build-push-action@v4
      with:
        context: .
        push: true
        tags: |
          ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.sha }}
          ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:latest
    
    - name: Azure Login
      uses: azure/login@v1
      with:
        creds: ${{ secrets.AZURE_CREDENTIALS }}
    
    - name: Set AKS context
      uses: azure/aks-set-context@v3
      with:
        cluster-name: ${{ env.AKS_CLUSTER }}
        resource-group: ${{ env.RESOURCE_GROUP }}
    
    - name: Deploy to AKS
      run: |
        kubectl apply -f k8s/deployment.yaml
        kubectl set image deployment/angular-app \
          angular-app=${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.sha }}
        kubectl rollout status deployment/angular-app
        kubectl get services
```

## Step 5: Create Azure Service Principal

Run this Azure CLI command to create a service principal:

```bash
az ad sp create-for-rbac \
  --name "github-actions-aks" \
  --role contributor \
  --scopes /subscriptions/{subscription-id}/resourceGroups/{resource-group} \
  --sdk-auth
```

Copy the output JSON and add it as `AZURE_CREDENTIALS` secret.

## Step 6: Deploy!

Push your code to the main branch:

```bash
git add .
git commit -m "Setup GitHub Actions CI/CD"
git push origin main
```

Monitor the deployment in the Actions tab of your GitHub repository.

## Advanced Features

### Environment-specific Deployments

Add environment variables for different stages:

```yaml
- name: Deploy to staging
  if: github.ref == 'refs/heads/develop'
  run: |
    kubectl apply -f k8s/staging/
    
- name: Deploy to production
  if: github.ref == 'refs/heads/main'
  run: |
    kubectl apply -f k8s/production/
```

### Slack Notifications

Add notification step:

```yaml
- name: Notify Slack
  if: always()
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

## Troubleshooting

Common issues and solutions:

1. **Authentication failures**: Verify Azure credentials and ACR access
2. **Image pull errors**: Check ACR permissions in AKS
3. **Deployment timeouts**: Increase probe intervals
4. **Build failures**: Check Node.js version compatibility

## Conclusion

You now have a fully automated CI/CD pipeline for deploying Angular applications to AKS. This setup ensures consistent, reliable deployments with every code push.

## Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Azure Kubernetes Service](https://docs.microsoft.com/en-us/azure/aks/)
- [Angular Deployment Guide](https://angular.io/guide/deployment)

Happy deploying! 🎉