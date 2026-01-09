# EC2 Deployment Guide

This guide explains how to deploy the application across three EC2 instances using Docker.

## Prerequisites

1. Launch 3 EC2 instances:
   - Frontend Instance (t2.micro)
   - Backend Instance (t2.micro)
   - Database Instance (t2.small)

2. Security Group Configuration:

### Database Instance Security Group (db-sg)
```
Inbound Rules:
- Type: Custom TCP
- Port: 5432
- Source: Backend Security Group (backend-sg)
```

### Backend Instance Security Group (backend-sg)
```
Inbound Rules:
- Type: Custom TCP
- Port: 5000
- Source: Frontend Security Group (frontend-sg)
```

### Frontend Instance Security Group (frontend-sg)
```
Inbound Rules:
- Type: HTTP
- Port: 80
- Source: 0.0.0.0/0 (Anywhere)
```

## Deployment Steps

### 1. On All EC2 Instances:

SSH into each instance and run:
```bash
# Install Docker and Docker Compose
sudo yum update -y
sudo yum install -y docker git
sudo service docker start
sudo usermod -a -G docker ec2-user
sudo curl -L "https://github.com/docker/compose/releases/download/v2.21.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Clone the repository
git clone <your-repo-url>
cd my_app
```

### 2. Database Instance Setup:

```bash
cd deployment
# Update private IP in docker-compose.database.yml if needed
sudo docker-compose -f docker-compose.database.yml up -d
```

### 3. Backend Instance Setup:

1. Edit docker-compose.backend.yml:
```bash
cd deployment
# Replace <DATABASE_EC2_PRIVATE_IP> with actual Database instance private IP
sudo vim docker-compose.backend.yml
```

2. Start the backend service:
```bash
sudo docker-compose -f docker-compose.backend.yml up -d
```

### 4. Frontend Instance Setup:

1. Edit docker-compose.frontend.yml:
```bash
cd deployment
# Replace <BACKEND_EC2_PRIVATE_IP> with actual Backend instance private IP
sudo vim docker-compose.frontend.yml
```

2. Start the frontend service:
```bash
sudo docker-compose -f docker-compose.frontend.yml up -d
```

## Verification Steps

1. Database Verification:
```bash
# On Database Instance
docker logs $(docker ps -q)
```

2. Backend Verification:
```bash
# On Backend Instance
docker logs $(docker ps -q)
curl localhost:5000/api/health
```

3. Frontend Verification:
- Open your browser and visit: http://<FRONTEND_EC2_PUBLIC_IP>

## Maintenance Commands

### View Logs:
```bash
docker-compose -f docker-compose.<service>.yml logs
```

### Restart Services:
```bash
docker-compose -f docker-compose.<service>.yml restart
```

### Update Application:
```bash
git pull
docker-compose -f docker-compose.<service>.yml down
docker-compose -f docker-compose.<service>.yml build
docker-compose -f docker-compose.<service>.yml up -d
```

## Backup and Restore

### Database Backup:
```bash
# On Database Instance
docker exec $(docker ps -q) pg_dump -U postgres company_db > backup.sql
```

### Database Restore:
```bash
# On Database Instance
cat backup.sql | docker exec -i $(docker ps -q) psql -U postgres -d company_db
```

## Troubleshooting

1. Connection Issues:
   - Verify security group rules
   - Check instance private IPs in docker-compose files
   - Ensure services are running: `docker ps`
   - Check logs: `docker logs <container_id>`

2. Database Connection:
   - Verify DB_HOST environment variable in backend service
   - Check database logs for connection attempts
   - Try connecting manually: `psql -h <db-private-ip> -U postgres -d company_db`

3. Frontend Issues:
   - Check nginx logs: `docker logs <frontend-container-id>`
   - Verify backend URL in frontend configuration
   - Check browser console for API errors

## Scaling Considerations

1. Database:
   - Consider regular backups
   - Monitor disk space usage
   - Consider using AWS RDS for managed database

2. Backend:
   - Monitor CPU and memory usage
   - Consider auto-scaling if needed
   - Implement health checks

3. Frontend:
   - Consider using CDN for static assets
   - Implement caching strategies
   - Monitor nginx performance