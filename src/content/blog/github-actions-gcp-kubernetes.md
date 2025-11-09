---
title: "Setup Github Actions to deploy Angular web app to GCP Kubernetes Engine (GKE)"
date: "2024-03-26"
author: "Ha Doan"
excerpt: "Master the art of deploying Angular applications to Google Kubernetes Engine using GitHub Actions for seamless CI/CD automation."
tags: ["GitHub Actions", "GCP", "GKE", "Angular", "Kubernetes", "DevOps"]
image: "/placeholder.svg"
---

# Setup GitHub Actions to Deploy Angular Web App to GCP Kubernetes Engine (GKE)

Deploying to Google Kubernetes Engine (GKE) provides scalable, reliable hosting for your Angular applications. This guide walks you through setting up a complete CI/CD pipeline using GitHub Actions.

## Why GKE?

Google Kubernetes Engine offers:
- **Auto-scaling**: Scale based on demand
- **Global load balancing**: Serve users worldwide
- **Integrated monitoring**: Built-in observability
- **Security**: VPC-native clusters and Workload Identity
- **Cost optimization**: Automatic resource management

## Prerequisites

- Angular application in GitHub
- Google Cloud Platform account
- GKE cluster created
- gcloud CLI installed locally (for initial setup)
- Docker registry (GCR or Artifact Registry)

## Step 1: Setup GCP Project

First, create a new GCP project and enable required APIs:

```bash
# Set your project
gcloud config set project YOUR_PROJECT_ID

# Enable required APIs
gcloud services enable container.googleapis.com
gcloud services enable containerregistry.googleapis.com
gcloud services enable cloudbuild.googleapis.com
```

## Step 2: Create GKE Cluster

Create a production-ready GKE cluster:

```bash
gcloud container clusters create angular-cluster \
  --zone us-central1-a \
  --num-nodes 3 \
  --machine-type n1-standard-2 \
  --enable-autoscaling \
  --min-nodes 2 \
  --max-nodes 10 \
  --enable-autorepair \
  --enable-autoupgrade \
  --workload-pool=YOUR_PROJECT_ID.svc.id.goog
```

Get cluster credentials:

```bash
gcloud container clusters get-credentials angular-cluster \
  --zone us-central1-a
```

## Step 3: Prepare Angular Application

Create a multi-stage `Dockerfile`:

```dockerfile
# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && \
    npm cache clean --force

# Copy source code
COPY . .

# Build the app
RUN npm run build -- --configuration production

# Stage 2: Production
FROM nginx:1.25-alpine

# Copy custom nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built app from builder
COPY --from=builder /app/dist/angular-app /usr/share/nginx/html

# Add non-root user
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --quiet --tries=1 --spider http://localhost:8080/ || exit 1

# Use non-root user
USER nginx

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
```

Optimized `nginx.conf`:

```nginx
worker_processes auto;
error_log /var/log/nginx/error.log warn;
pid /tmp/nginx.pid;

events {
    worker_connections 1024;
    use epoll;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # Logging
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';
    access_log /var/log/nginx/access.log main;

    # Performance
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript 
               application/json application/javascript application/xml+rss 
               application/rss+xml font/truetype font/opentype 
               application/vnd.ms-fontobject image/svg+xml;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    server {
        listen 8080;
        server_name _;
        root /usr/share/nginx/html;
        index index.html;

        # Angular routing
        location / {
            try_files $uri $uri/ /index.html;
        }

        # Cache static assets
        location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }

        # Security: deny access to hidden files
        location ~ /\. {
            deny all;
        }
    }
}
```

## Step 4: Kubernetes Manifests

Create `k8s/deployment.yaml`:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: angular-app
  labels:
    app: angular-app
    version: v1
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  selector:
    matchLabels:
      app: angular-app
  template:
    metadata:
      labels:
        app: angular-app
        version: v1
    spec:
      containers:
      - name: angular-app
        image: gcr.io/YOUR_PROJECT_ID/angular-app:latest
        ports:
        - containerPort: 8080
          protocol: TCP
        env:
        - name: NODE_ENV
          value: "production"
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /
            port: 8080
          initialDelaySeconds: 30
          periodSeconds: 10
          timeoutSeconds: 5
          failureThreshold: 3
        readinessProbe:
          httpGet:
            path: /
            port: 8080
          initialDelaySeconds: 10
          periodSeconds: 5
          timeoutSeconds: 3
          failureThreshold: 3
        securityContext:
          runAsNonRoot: true
          runAsUser: 101
          allowPrivilegeEscalation: false
          readOnlyRootFilesystem: false
---
apiVersion: v1
kind: Service
metadata:
  name: angular-app-service
  labels:
    app: angular-app
spec:
  type: LoadBalancer
  selector:
    app: angular-app
  ports:
  - port: 80
    targetPort: 8080
    protocol: TCP
    name: http
  sessionAffinity: ClientIP
---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: angular-app-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: angular-app
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
```

## Step 5: Setup GitHub Secrets

Create a service account with necessary permissions:

```bash
# Create service account
gcloud iam service-accounts create github-actions \
  --display-name="GitHub Actions"

# Grant permissions
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
  --member="serviceAccount:github-actions@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/container.developer"

gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
  --member="serviceAccount:github-actions@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/storage.admin"

# Create and download key
gcloud iam service-accounts keys create key.json \
  --iam-account=github-actions@YOUR_PROJECT_ID.iam.gserviceaccount.com
```

Add these secrets to GitHub:
- `GCP_PROJECT_ID`: Your GCP project ID
- `GCP_SA_KEY`: Contents of key.json (base64 encoded)
- `GKE_CLUSTER_NAME`: angular-cluster
- `GKE_ZONE`: us-central1-a

## Step 6: GitHub Actions Workflow

Create `.github/workflows/gke-deploy.yml`:

```yaml
name: Build and Deploy to GKE

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

env:
  PROJECT_ID: ${{ secrets.GCP_PROJECT_ID }}
  GKE_CLUSTER: ${{ secrets.GKE_CLUSTER_NAME }}
  GKE_ZONE: ${{ secrets.GKE_ZONE }}
  IMAGE: angular-app

jobs:
  setup-build-publish-deploy:
    name: Setup, Build, Publish, and Deploy
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v3

    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Lint
      run: npm run lint

    - name: Run tests
      run: npm run test -- --watch=false --browsers=ChromeHeadless --code-coverage

    - name: Build
      run: npm run build -- --configuration production

    - name: Setup Google Cloud SDK
      uses: google-github-actions/setup-gcloud@v1
      with:
        service_account_key: ${{ secrets.GCP_SA_KEY }}
        project_id: ${{ secrets.GCP_PROJECT_ID }}

    - name: Configure Docker for GCR
      run: |
        gcloud auth configure-docker

    - name: Build Docker image
      run: |
        docker build \
          --tag "gcr.io/$PROJECT_ID/$IMAGE:$GITHUB_SHA" \
          --tag "gcr.io/$PROJECT_ID/$IMAGE:latest" \
          --build-arg BUILD_DATE=$(date -u +'%Y-%m-%dT%H:%M:%SZ') \
          --build-arg VCS_REF=$GITHUB_SHA \
          .

    - name: Publish Docker image to GCR
      run: |
        docker push "gcr.io/$PROJECT_ID/$IMAGE:$GITHUB_SHA"
        docker push "gcr.io/$PROJECT_ID/$IMAGE:latest"

    - name: Get GKE credentials
      run: |
        gcloud container clusters get-credentials "$GKE_CLUSTER" \
          --zone "$GKE_ZONE"

    - name: Deploy to GKE
      run: |
        kubectl apply -f k8s/deployment.yaml
        kubectl set image deployment/angular-app \
          angular-app=gcr.io/$PROJECT_ID/$IMAGE:$GITHUB_SHA
        kubectl rollout status deployment/angular-app
        kubectl get services -o wide

    - name: Verify deployment
      run: |
        kubectl get pods -l app=angular-app
        kubectl get hpa angular-app-hpa
        
    - name: Get Load Balancer IP
      run: |
        echo "Application URL:"
        kubectl get service angular-app-service \
          -o jsonpath='{.status.loadBalancer.ingress[0].ip}'
```

## Step 7: Deploy

Commit and push your changes:

```bash
git add .
git commit -m "Setup GKE deployment with GitHub Actions"
git push origin main
```

## Monitoring and Logging

Access Google Cloud Console:

```bash
# View logs
gcloud logging read "resource.type=k8s_container AND resource.labels.container_name=angular-app" \
  --limit 50 --format json

# Monitor cluster
kubectl top nodes
kubectl top pods
```

## Cost Optimization Tips

1. Use Preemptible VMs for non-production
2. Enable cluster autoscaling
3. Set appropriate resource requests/limits
4. Use GKE Autopilot for hands-off optimization
5. Monitor with Cloud Monitoring for cost alerts

## Security Best Practices

- Enable Workload Identity
- Use Binary Authorization
- Implement Network Policies
- Regular security scanning
- Rotate service account keys

## Conclusion

You've successfully set up a production-grade CI/CD pipeline for deploying Angular apps to GKE! This setup provides automatic scaling, high availability, and seamless deployments.

## Next Steps

- Add SSL/TLS with Let's Encrypt
- Implement blue-green deployments
- Setup Cloud CDN for global performance
- Add monitoring with Prometheus and Grafana

Happy coding! 🚀