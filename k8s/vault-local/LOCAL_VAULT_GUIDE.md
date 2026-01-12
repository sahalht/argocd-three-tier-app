# Local Vault in Minikube Setup Guide

This guide describes how to run Vault locally inside your Minikube cluster for testing.

## 1. Install Vault via Helm
Run these commands to install Vault in "Dev Mode" (unsealed & ready to use immediately):

```bash
helm repo add hashicorp https://helm.releases.hashicorp.com
helm repo update
helm install vault hashicorp/vault --set "server.dev.enabled=true"
```

## 2. Configure Vault (Inside the Pod)
Since Vault is now local, we configure it by exec-ing into the vault pod:

```bash
# Wait for pod to be ready
kubectl get pods

# Start configuration
kubectl exec -it vault-0 -- /bin/sh
```

**Inside the pod shell, run:**
```sh
# 1. Enable K8s Auth
vault auth enable kubernetes

# 2. Configure K8s Auth to talk to the local API
vault write auth/kubernetes/config \
    kubernetes_host="https://kubernetes.default.svc"

# 3. Create the Policy
vault policy write myapp-policy - <<EOF
path "secret/data/myapp/db" {
  capabilities = ["read"]
}
EOF

# 4. Create the Role
vault write auth/kubernetes/role/myapp-role \
    bound_service_account_names=backend-sa \
    bound_service_account_namespaces=default \
    policies=myapp-policy \
    ttl=24h

# 5. Store the Secrets
vault kv put secret/myapp/db \
    POSTGRES_PASSWORD="password" \
    DB_PASSWORD="password"

exit
```

## 3. Deploy Application
Now deploy your application using the updated manifest:
```bash
kubectl apply -f k8s/vault-configs/backend-vault.yaml
```
