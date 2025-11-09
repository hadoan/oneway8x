---
title: "Automate SSL for Kubernetes Ingress by Cloudflare"
date: "2024-03-26"
author: "Ha Doan"
excerpt: "Learn how to automatically provision and manage SSL certificates for your Kubernetes ingress using Cloudflare's API and cert-manager."
tags: ["Kubernetes", "DevOps", "SSL", "Cloudflare", "Security"]
image: "/placeholder.svg"
---

# Automate SSL for Kubernetes Ingress by Cloudflare

Managing SSL certificates manually can be tedious and error-prone. In this guide, we'll set up automated SSL certificate provisioning for Kubernetes ingress using Cloudflare and cert-manager.

## Why Automate SSL?

- **Security**: Automated renewal prevents certificate expiration
- **Efficiency**: No manual intervention needed
- **Scalability**: Handle multiple domains effortlessly
- **Best Practices**: Let's Encrypt integration ensures trusted certificates

## Prerequisites

Before we begin, ensure you have:

- A Kubernetes cluster (1.19+)
- kubectl configured
- A domain managed by Cloudflare
- Cloudflare API token with DNS edit permissions

## Step 1: Install cert-manager

cert-manager is a Kubernetes add-on that automates the management and issuance of TLS certificates.

```bash
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml
```

Verify the installation:

```bash
kubectl get pods --namespace cert-manager
```

## Step 2: Create Cloudflare API Token Secret

Create a secret containing your Cloudflare API token:

```bash
kubectl create secret generic cloudflare-api-token \
  --from-literal=api-token=YOUR_CLOUDFLARE_API_TOKEN \
  -n cert-manager
```

## Step 3: Configure ClusterIssuer

Create a ClusterIssuer that uses Cloudflare DNS for certificate validation:

```yaml
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-cloudflare
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: your-email@example.com
    privateKeySecretRef:
      name: letsencrypt-cloudflare-key
    solvers:
    - dns01:
        cloudflare:
          apiTokenSecretRef:
            name: cloudflare-api-token
            key: api-token
```

Apply the configuration:

```bash
kubectl apply -f cluster-issuer.yaml
```

## Step 4: Configure Ingress with TLS

Update your ingress resource to request a certificate:

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: my-app-ingress
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-cloudflare
spec:
  tls:
  - hosts:
    - example.com
    - www.example.com
    secretName: example-com-tls
  rules:
  - host: example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: my-app-service
            port:
              number: 80
```

## Step 5: Verify Certificate Issuance

Check the certificate status:

```bash
kubectl get certificate
kubectl describe certificate example-com-tls
```

The certificate should be in "Ready" state within a few minutes.

## Troubleshooting

If you encounter issues:

1. Check cert-manager logs:
```bash
kubectl logs -n cert-manager deployment/cert-manager
```

2. Verify DNS propagation:
```bash
dig _acme-challenge.example.com TXT
```

3. Check certificate request status:
```bash
kubectl get certificaterequest
kubectl describe certificaterequest example-com-tls-xxxxx
```

## Conclusion

Automating SSL certificate management with Cloudflare and cert-manager provides a robust, scalable solution for Kubernetes environments. The DNS-01 challenge method works even for services not exposed to the internet, making it ideal for staging environments and internal services.

## Next Steps

- Set up monitoring for certificate expiration
- Configure automatic certificate renewal notifications
- Implement wildcard certificates for multiple subdomains
- Explore other DNS providers supported by cert-manager

Happy automating! 🚀