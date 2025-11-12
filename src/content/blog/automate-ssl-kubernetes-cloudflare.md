---
title: "Automate SSL for Kubernetes Ingress by Cloudflare"
date: "2024-03-26"
author: "Ha Doan"
excerpt: "Learn how to automatically provision and manage SSL certificates for your Kubernetes ingress using Cloudflare's DNS API and cert-manager with Let's Encrypt."
tags: ["Kubernetes", "DevOps", "SSL", "Cloudflare", "Security", "cert-manager"]
image: "/cloudflare.png"
---

# Automate SSL for Kubernetes Ingress by Cloudflare

Managing SSL certificates manually is a maintenance nightmare. Certificates expire, domains change, and manual renewal processes are error-prone. In this guide, I'll show you how to set up fully automated SSL certificate provisioning for your Kubernetes ingress using Cloudflare DNS validation and cert-manager with Let's Encrypt.

## Why Automate SSL Certificates?

Manual SSL management introduces several problems:

- **Expiration Risk**: Forgetting to renew certificates leads to downtime
- **Security Debt**: Manual processes are harder to audit and track
- **Operational Overhead**: Certificate renewal requires manual intervention
- **Scaling Challenges**: Managing certs across multiple domains becomes unmanageable
- **Environment Parity**: Easy to have inconsistent configurations across staging and production

Automated certificate management solves these issues by:

- **Automatic Renewal**: Certificates renew 30 days before expiration
- **Zero Downtime**: Renewal happens in-cluster without service interruption
- **Audit Trail**: All cert operations are logged in Kubernetes
- **DNS Validation**: Works with private clusters and non-public services
- **Cost Effective**: Free certificates from Let's Encrypt

## How It Works: DNS-01 Challenge

Unlike HTTP-01 validation which requires public internet access, DNS-01 uses DNS records for validation. Here's the flow:

1. **Request Initiation**: You annotate your Ingress with cert-manager issuer
2. **Challenge Creation**: cert-manager requests a certificate from Let's Encrypt
3. **DNS Validation**: Let's Encrypt asks cert-manager to prove domain ownership via DNS
4. **DNS Update**: cert-manager uses Cloudflare API to create a `_acme-challenge` TXT record
5. **Verification**: Let's Encrypt verifies the DNS record
6. **Certificate Issue**: Certificate is issued and stored in a Kubernetes Secret
7. **Cleanup**: TXT record is automatically removed

This approach works for:

- Private/internal Kubernetes clusters
- Services not exposed to the internet
- Wildcard certificates
- Staging environments

## Prerequisites

Before we begin, ensure you have:

- **Kubernetes cluster** (1.16+, though 1.19+ recommended)
- **kubectl** configured with cluster access
- **Cloudflare account** with a domain
- **Cloudflare API Token** with DNS edit permissions for your domain
- **helm** (optional, but recommended for cert-manager installation)

### Create Cloudflare API Token

1. Go to [Cloudflare API Tokens](https://dash.cloudflare.com/profile/api-tokens)
2. Click "Create Token"
3. Use "Edit zone DNS" template
4. Set permissions: `Zone:DNS:Edit`
5. Set zone resources: `Include:Specific zone: yourdomain.com`
6. Copy the token (we'll need this)

## Step 1: Install cert-manager

cert-manager is a Kubernetes native certificate management controller. It automates the issuance and renewal of TLS certificates from various issuing authorities.

### Option A: Using kubectl

```bash
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.14.0/cert-manager.yaml
```

### Option B: Using Helm (Recommended)

```bash
# Add the Jetstack Helm repository
helm repo add jetstack https://charts.jetstack.io
helm repo update

# Install cert-manager with CRDs
helm install cert-manager jetstack/cert-manager \
  --namespace cert-manager \
  --create-namespace \
  --set installCRDs=true \
  --version v1.14.0
```

### Verify Installation

```bash
# Check cert-manager pods are running
kubectl get pods --namespace cert-manager

# Expected output should show three running pods:
# cert-manager-xxxxxxxx-xxxxx
# cert-manager-cainjector-xxxxxxxx-xxxxx
# cert-manager-webhook-xxxxxxxx-xxxxx
```

## Step 2: Create Cloudflare API Secret

cert-manager needs access to your Cloudflare API token to modify DNS records during validation.

```bash
kubectl create secret generic cloudflare-api-token \
  --from-literal=api-token=YOUR_CLOUDFLARE_API_TOKEN \
  -n cert-manager
```

Verify the secret:

```bash
kubectl get secret cloudflare-api-token -n cert-manager
```

## Step 3: Create ClusterIssuer for Let's Encrypt

A ClusterIssuer defines how cert-manager should request certificates. We'll create one for Let's Encrypt with Cloudflare DNS validation.

Create a file named `letsencrypt-issuer.yaml`:

```yaml
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: your-email@example.com  # IMPORTANT: Let's Encrypt uses this for certificate expiry notices
    privateKeySecretRef:
      name: letsencrypt-prod-key
    solvers:
    - dns01:
        cloudflare:
          email: your-cloudflare-email@example.com
          apiTokenSecretRef:
            name: cloudflare-api-token
            key: api-token
```

For staging/testing, you can also create:

```yaml
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-staging
spec:
  acme:
    server: https://acme-staging-v02.api.letsencrypt.org/directory
    email: your-email@example.com
    privateKeySecretRef:
      name: letsencrypt-staging-key
    solvers:
    - dns01:
        cloudflare:
          email: your-cloudflare-email@example.com
          apiTokenSecretRef:
            name: cloudflare-api-token
            key: api-token
```

Apply the configuration:

```bash
kubectl apply -f letsencrypt-issuer.yaml
```

Verify the issuer is ready:

```bash
kubectl get clusterissuer
kubectl describe clusterissuer letsencrypt-prod
```

## Step 4: Configure Ingress with Certificate Annotation

Now, update your Ingress resource to automatically request a certificate. cert-manager watches for ingresses with the appropriate annotation and automatically creates a Certificate object.

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: my-app-ingress
  namespace: default
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-prod
    # Optional: Force HTTPS redirects
    nginx.ingress.kubernetes.io/force-ssl-redirect: "true"
spec:
  ingressClassName: nginx  # or your ingress controller class
  tls:
  - hosts:
    - example.com
    - www.example.com
    - api.example.com
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
  - host: www.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: my-app-service
            port:
              number: 80
  - host: api.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: api-service
            port:
              number: 8080
```

Apply the ingress:

```bash
kubectl apply -f my-app-ingress.yaml
```

## Step 5: Verify Certificate Issuance

Once you've created the ingress with the cert-manager annotation, cert-manager automatically creates a Certificate resource and starts the validation process.

### Check Certificate Status

```bash
# List all certificates
kubectl get certificate

# Get detailed information about your certificate
kubectl describe certificate example-com-tls

# Watch certificate creation in real-time
kubectl get certificate -w
```

### Expected Output

You should see output like:

```bash
NAME               READY   SECRET             AGE
example-com-tls    True    example-com-tls    2m
```

The `READY` status should transition from `False` to `True` within a few minutes (typically 2-5 minutes).

### View the Certificate in the Secret

```bash
# The certificate is stored in a Kubernetes Secret
kubectl get secret example-com-tls -o yaml

# Decode and view the certificate
kubectl get secret example-com-tls -o jsonpath='{.data.tls\.crt}' | base64 --decode | openssl x509 -text -noout
```

## Step 6: Wildcard Certificates (Optional)

For wildcard certificates covering all subdomains, use:

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: wildcard-ingress
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-prod
spec:
  tls:
  - hosts:
    - example.com
    - "*.example.com"
    secretName: example-com-wildcard-tls
  rules:
  - host: example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: my-app
            port:
              number: 80
```

## Troubleshooting

### Certificate Stuck in Pending State

```bash
# Check certificate request details
kubectl describe certificate example-com-tls

# View cert-manager logs
kubectl logs -n cert-manager deployment/cert-manager

# Check recent cert-manager events
kubectl get events -n cert-manager --sort-by='.lastTimestamp'
```

### DNS Challenge Not Completing

```bash
# Verify Cloudflare API token is accessible
kubectl get secret cloudflare-api-token -n cert-manager -o yaml

# Check DNS record was created
dig _acme-challenge.example.com TXT

# View certificate request details
kubectl get certificaterequest
kubectl describe certificaterequest example-com-tls-1
```

### Common Issues

**Issue**: "DNS propagation timeout"

- **Solution**: Ensure Cloudflare API token has correct permissions and the domain zone is set correctly

**Issue**: "ACME account registration not found"

- **Solution**: Let's Encrypt changed accounts; delete the private key secret and retry:

  ```bash
  kubectl delete secret letsencrypt-prod-key -n cert-manager
  kubectl delete certificate example-com-tls
  kubectl apply -f my-app-ingress.yaml
  ```

**Issue**: "Incorrect validation"

- **Solution**: Check that email addresses match between cert-manager issuer and Cloudflare API token

## Monitoring & Maintenance

### Certificate Expiration Monitoring

Add Prometheus scraping to cert-manager for monitoring:

```bash
# Port-forward to cert-manager metrics
kubectl port-forward -n cert-manager svc/cert-manager 9402:9402

# Access metrics at http://localhost:9402/metrics
```

Look for metrics like:

- `certmanager_certificate_expiration_timestamp_seconds`
- `certmanager_certificate_renewal_errors_total`

### Alert on Expiring Certificates

If using Prometheus, create an alert:

```yaml
alert: CertificateExpiringSoon
expr: certmanager_certificate_expiration_timestamp_seconds - time() < 7 * 24 * 3600
for: 1h
```

## Production Checklist

Before deploying to production:

- ✅ Test with Let's Encrypt staging environment first
- ✅ Verify Cloudflare API token has correct permissions
- ✅ Use a production Let's Encrypt ClusterIssuer
- ✅ Set up certificate expiry alerts
- ✅ Document your certificate issuer configuration
- ✅ Test certificate renewal by forcing renewal
- ✅ Verify ingress controller properly handles TLS

## Advanced: Certificate Renewal

To manually renew a certificate before expiration:

```bash
# Delete the certificate secret
kubectl delete secret example-com-tls

# cert-manager will automatically issue a new one
kubectl delete certificaterequest example-com-tls-1
```

Or use cert-manager's annotation to force renewal:

```bash
kubectl annotate certificate example-com-tls cert-manager.io/issue-temporary-certificate="true" --overwrite
```

## Conclusion

Automating SSL certificate management with Cloudflare and cert-manager provides a production-ready, zero-touch solution for Kubernetes environments. The DNS-01 challenge method works seamlessly with private clusters, staging environments, and services not exposed to the internet.

Key benefits achieved:
- ✅ Automatic certificate issuance and renewal
- ✅ Zero downtime certificate updates
- ✅ Works with private/internal Kubernetes clusters
- ✅ Complete audit trail in Kubernetes
- ✅ Free certificates from Let's Encrypt
- ✅ Scalable across unlimited domains

## Additional Resources

- [cert-manager Documentation](https://cert-manager.io/docs/)
- [Cloudflare API Tokens](https://developers.cloudflare.com/api/tokens/create)
- [Let's Encrypt Challenge Types](https://letsencrypt.org/docs/challenge-types/)
- [DNS-01 Challenge Support](https://cert-manager.io/docs/configuration/acme/dns01/)

Happy automating! 🚀