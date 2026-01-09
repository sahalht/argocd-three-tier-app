# Guide: Pushing Docker Images to Docker Hub

This guide explains how to push the images defined in your `docker-compose.yml` to Docker Hub.

## Prerequisites

1.  **Docker Hub Account**: You need an account at [hub.docker.com](https://hub.docker.com/).
2.  **Docker CLI**: Ensure you have docker installed and running.

## Step 1: Login to Docker Hub

Run the following command in your terminal and enter your username and password when prompted:

```bash
docker login
```

## Step 2: Build the Images

If you haven't built the images recently, make sure they are up to date:

```bash
docker-compose build
```

## Step 3: Tag and Push (Method A: Manual Tagging)

Since your `docker-compose.yml` uses local image names (e.g., `company_backend`), you need to retag them with your Docker Hub username to push them.

Replace `YOUR_DOCKERHUB_USERNAME` with your actual username.

### 1. Tag the images

```bash
# Tag the database image
docker tag company_db YOUR_DOCKERHUB_USERNAME/company_db:latest

# Tag the backend image
docker tag company_backend YOUR_DOCKERHUB_USERNAME/company_backend:latest

# Tag the frontend image
docker tag company_frontend YOUR_DOCKERHUB_USERNAME/company_frontend:latest
```

### 2. Push the images

```bash
# Push the database image
docker push YOUR_DOCKERHUB_USERNAME/company_db:latest

# Push the backend image
docker push YOUR_DOCKERHUB_USERNAME/company_backend:latest

# Push the frontend image
docker push YOUR_DOCKERHUB_USERNAME/company_frontend:latest
```