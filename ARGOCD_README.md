# 🚀 Deploying the 3-Tier App with Argo CD

This guide explains how to deploy the 3-tier application (Frontend, Backend, PostgreSQL) using Argo CD and GitOps principles.

## Prerequisites

1.  **Kubernetes Cluster**: Ensure you have a running cluster (e.g., Minikube, Kind, GKE, EKS).
    *   For Minikube: `minikube start`
2.  **Argo CD**: Installed in your cluster.
    *   [Install Guide](https://argo-cd.readthedocs.io/en/stable/getting_started/#1-install-argo-cd)
3.  **Kubectl**: Installed and configured to talk to your cluster.
4.  **Ingress Controller**: Enabled (if using Minikube: `minikube addons enable ingress`).

## 📂 Project Structure

*   `k8s/3-tier-app/`: Contains all Kubernetes manifests for the application.
*   `argocd/application.yaml`: The Argo CD Application manifest that manages the deployment.

## 🛠 Deployment Steps

### 1. Apply the Argo CD Application

Run the following command to create the Application resource in Argo CD. This will tell Argo CD to monitor this repository and deploy the manifests found in `k8s/3-tier-app/` into the `company-app` namespace.

```bash
kubectl apply -f argocd/application.yaml
```

*Note: This command expects the `argocd` namespace to exist, which is standard for Argo CD installations.*

### 2. Verify Deployment

Check the status of the application in Argo CD:

```bash
kubectl get application -n argocd
```

You should see the status as `Synced` and `Healthy`.

You can also check the resources in the `company-app` namespace:

```bash
kubectl get all -n company-app
```

### 3. Access the Application

The application is exposed via an Ingress resource at `company.local`.

1.  **Get your Cluster IP / Minikube IP**:
    ```bash
    minikube ip
    ```
    *(Example output: 192.168.49.2)*

2.  **Update your hosts file**:
    Add the mapping to your `/etc/hosts` file (Linux/Mac) or `C:\Windows\System32\drivers\etc\hosts` (Windows).

    ```text
    192.168.49.2  company.local
    ```
    *(Replace 192.168.49.2 with your actual IP)*

3.  **Open in Browser**:
    Visit [http://company.local](http://company.local)

## 🔄 Updating the Application

Since this is a GitOps setup, **do not apply changes manually** with `kubectl apply`.

1.  Modify the manifests in `k8s/3-tier-app/`.
2.  Commit and push your changes to the `main` branch.
3.  Argo CD will automatically detect the changes (within 3 minutes) and sync the cluster to match the new state.
    *   To sync immediately, use the Argo CD UI or CLI.

## 🐛 Troubleshooting

*   **App stuck in `Progressing`?**
    Check connection to the image repository or database initialization logs:
    ```bash
    kubectl logs -l app=postgres -n company-app
    kubectl logs -l app=backend -n company-app
    ```
*   **Database connection failed?**
    Ensure the `db-secret` is correctly populated and the `postgres` pod is Ready.

---
*Maintained by the DevOps Team*
