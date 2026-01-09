# Deployment & Setup Guide

This guide provides instructions for running the application in two modes:
1. **Local Development (without Docker)** - For rapid development and testing.
2. **Docker Compose (Recommended)** - For a consistent, production-like environment.

---

## 🚀 Option 1: Docker Compose (Recommended)

This is the easiest way to run the full application (Frontend + Backend + Database).

### Prerequisites
- Docker & Docker Compose installed

### Steps to Run
1. **Start the application:**
   ```bash
   docker compose up --build
   ```
   *This command builds the images and starts all services in the correct order.*

2. **Access the application:**
   - **Frontend:** [http://localhost](http://localhost)
   - **Backend API:** [http://localhost/api/health](http://localhost/api/health) (Proxied via Nginx)
   - **Database:** Running on port `5432`

3. **Stop the application:**
   ```bash
   # Stop containers
   docker compose down
   
   # Stop and remove volumes (clears database data)
   docker compose down -v
   ```

### Troubleshooting
- **Logs:** View logs for specific services:
  ```bash
  docker compose logs -f company-backend
  ```
- **Rebuild:** If you make changes to `package.json` or Dockerfiles:
  ```bash
  docker compose up -d --build
  ```

---

## 🛠 Option 2: Local Development (Manual Setup)

Use this method if you want to run services individually on your machine.

### Prerequisites
- Node.js (v18+)
- PostgreSQL installed and running locally

### 1. Database Setup
Ensure you have a PostgreSQL database running locally.
```sql
CREATE DATABASE company_db;
CREATE USER postgres WITH PASSWORD 'password123';
GRANT ALL PRIVILEGES ON DATABASE company_db TO postgres;
```

### 2. Backend Setup
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   # Runs on port 5000
   npm run dev
   ```

### 3. Frontend Setup
1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the React app:
   ```bash
   # Runs on port 3000
   npm start
   ```
