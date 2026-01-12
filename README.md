# 🚀 3-Tier App: GitOps with Argo CD & HashiCorp Vault

This project demonstrates a production-grade deployment of a 3-tier application (Frontend, Backend, PostgreSQL) using **Argo CD** for GitOps and **HashiCorp Vault** for secure secret management.

---

## 🏗 Architecture Overview

- **Frontend**: React application served via Nginx.
- **Backend**: Node.js API that interacts with PostgreSQL.
- **Database**: PostgreSQL StatefulSet.
- **GitOps**: Argo CD automates deployment by watching this repository.
- **Secrets**: HashiCorp Vault manages sensitive data (DB passwords) via sidecar injection (no hardcoded K8s Secrets).

---

## 🛠 Prerequisites

1.  **Kubernetes Cluster**: (e.g., Minikube, Kind, GKE).
    - `minikube start`
2.  **Argo CD**: Installed in the `argocd` namespace.
3.  **Helm**: Required for Installing Vault.
4.  **Vault CLI**: Installed on your local machine.
5.  **Ingress Controller**: Enabled (`minikube addons enable ingress`).

---

## 📂 Project Structure

- `k8s/3-tier-app/`: Core Kubernetes manifests (Services, Deployments, ConfigMaps).
- `argocd/`: Argo CD Application manifest.
- `k8s/vault-local/`: Documentation for local Vault setup.

---

## � Phase 1: Setting up HashiCorp Vault (Local)

Instead of using `secrets.yaml`, we fetch credentials dynamically from Vault.

### 1. Install Vault via Helm
```bash
helm repo add hashicorp https://helm.releases.hashicorp.com
helm repo update
helm install vault hashicorp/vault --set "server.dev.enabled=true"
```

### 2. Configure Vault Auth & Secrets
Shell into the Vault pod to configure the Kubernetes authentication and store secrets:

```bash
kubectl exec -it vault-0 -- /bin/sh
```

**Inside the Vault pod:**
```sh
# 1. Enable K8s Auth
vault auth enable kubernetes

# 2. Configure K8s Auth
vault write auth/kubernetes/config \
    kubernetes_host="https://kubernetes.default.svc"

# 3. Create a Read Policy for the app
vault policy write myapp-policy - <<EOF
path "secret/data/myapp/db" {
  capabilities = ["read"]
}
EOF

# 4. Create a Role linking the ServiceAccount to the Policy
vault write auth/kubernetes/role/myapp-role \
    bound_service_account_names=backend-sa \
    bound_service_account_namespaces=company-app \
    policies=myapp-policy \
    ttl=24h

# 5. Put your database secrets
vault kv put secret/myapp/db POSTGRES_PASSWORD="password" DB_PASSWORD="password"

exit
```

---

## 🚀 Phase 2: Deployment via Argo CD

### 1. Apply the Argo CD Application
Argo CD will monitor the `k8s/3-tier-app/` folder and deploy everything into the `company-app` namespace.

```bash
kubectl apply -f argocd/application.yaml
```

### 2. How Vault Integration Works
The `backend.yaml` uses **Vault Agent Annotations**. When the pod starts:
1.  A `vault-agent` sidecar is automatically injected.
2.  It authenticates via the `backend-sa` ServiceAccount.
3.  It fetches secrets from `secret/data/myapp/db` and writes them to `/vault/secrets/database`.
4.  The Backend application "sources" this file at startup to load environment variables.

---

## 🌐 Accessing the App

1.  **Update your hosts file**:
    Get your `minikube ip` and add this to `/etc/hosts`:
    ```text
    192.168.49.2  company.local
    ```
2.  **Visit**: [http://company.local](http://company.local)

---

## 🔄 GitOps Workflow

1.  **Modify** code or manifests locally.
2.  **Commit & Push** to GitHub.
3.  **Argo CD** detects the change and synchronizes the cluster automatically.
4.  **Secrets** are never pushed to Git; they are managed safely within Vault.

---
*Maintained by the DevOps Team*
