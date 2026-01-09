# EC2 Instance Details

## Instance Information

### Frontend Instance
- Public IP: 34.224.215.22
- Private IP: 172.31.16.254
- Services: Nginx, React Application

### Backend Instance
- Public IP: 3.85.243.58
- Private IP: 172.31.17.180
- Services: Node.js API Server

### Database Instance
- Public IP: 54.158.16.42
- Private IP: 172.31.21.77
- Services: PostgreSQL Database

## Deployment Steps

1. SSH into each instance using their public IPs:
```bash
# Frontend Instance
ssh -i your-key.pem ec2-user@34.224.215.22

# Backend Instance
ssh -i your-key.pem ec2-user@3.85.243.58

# Database Instance
ssh -i your-key.pem ec2-user@54.158.16.42
```

2. On each instance, follow these steps:

### Database Instance (54.158.16.42):
```bash
cd my_app/deployment
docker-compose -f docker-compose.database.yml up -d
```

### Backend Instance (3.85.243.58):
```bash
cd my_app/deployment
docker-compose -f docker-compose.backend.yml up -d
```

### Frontend Instance (34.224.215.22):
```bash
cd my_app/deployment
docker-compose -f docker-compose.frontend.yml up -d
```

## Verification

1. Database Connectivity:
```bash
# From Backend Instance
nc -zv 172.31.21.77 5432
```

2. Backend API:
```bash
# From Frontend Instance
curl http://172.31.17.180:5000/api/health
```

3. Frontend Access:
- Open in browser: http://34.224.215.22

## Security Group Configuration

### Database Security Group (db-sg)
```
Inbound Rules:
- Type: PostgreSQL
- Protocol: TCP
- Port: 5432
- Source: 172.31.17.180/32 (Backend Private IP)
```

### Backend Security Group (backend-sg)
```
Inbound Rules:
- Type: Custom TCP
- Protocol: TCP
- Port: 5000
- Source: 172.31.16.254/32 (Frontend Private IP)
```

### Frontend Security Group (frontend-sg)
```
Inbound Rules:
- Type: HTTP
- Protocol: TCP
- Port: 80
- Source: 0.0.0.0/0 (Anywhere)
```

## Troubleshooting

If you encounter connection issues:

1. Verify Security Group Rules:
   - Check that Backend (172.31.17.180) can access Database (172.31.21.77:5432)
   - Check that Frontend (172.31.16.254) can access Backend (172.31.17.180:5000)
   - Check that HTTP (80) is open on Frontend for public access

2. Test Connectivity:
```bash
# From Backend to Database
ping 172.31.21.77
nc -zv 172.31.21.77 5432

# From Frontend to Backend
ping 172.31.17.180
nc -zv 172.31.17.180 5000
```

3. Check Container Logs:
```bash
# On each respective instance
docker-compose -f docker-compose.<service>.yml logs
```

## Quick Access Commands

### Database Instance (172.31.21.77):
```bash
# Check database logs
docker logs $(docker ps -q)

# Access psql
docker exec -it $(docker ps -q) psql -U postgres company_db
```

### Backend Instance (172.31.17.180):
```bash
# Check API logs
docker logs $(docker ps -q)

# Check API health
curl localhost:5000/api/health
```

### Frontend Instance (172.31.16.254):
```bash
# Check nginx logs
docker logs $(docker ps -q)

# Check nginx configuration
docker exec $(docker ps -q) nginx -t
```