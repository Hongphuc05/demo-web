# 🐳 Docker Deployment Guide

## 📋 Yêu cầu

- **Docker Desktop**: >= 20.10
- **Docker Compose**: >= 2.0
- **RAM**: >= 8GB (recommended 16GB cho models)
- **Disk Space**: >= 10GB

---

## 🚀 Cách 1: Docker Compose (Khuyến nghị)

### Bước 1: Build và chạy

```bash
# Ở thư mục gốc dự án (demo-web/)
docker-compose up --build
```

**Lần đầu build sẽ mất 10-20 phút** do:
- Tải Python packages (PyTorch ~2GB)
- Build React app
- Copy AI models vào container

### Bước 2: Truy cập ứng dụng

- **Frontend**: http://localhost
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

### Bước 3: Dừng services

```bash
# Dừng (giữ lại containers)
docker-compose stop

# Dừng và xóa containers
docker-compose down

# Xóa hoàn toàn (bao gồm volumes)
docker-compose down -v
```

---

## 🛠️ Cách 2: Build riêng từng service

### Backend

```bash
cd backend
docker build -t nlp-backend .
docker run -p 8000:8000 nlp-backend
```

### Frontend

```bash
# Ở thư mục gốc
docker build -t nlp-frontend .
docker run -p 80:80 nlp-frontend
```

---

## 📦 Production Mode

### Chạy detached (background)

```bash
docker-compose up -d
```

### Xem logs

```bash
# Tất cả services
docker-compose logs -f

# Chỉ backend
docker-compose logs -f backend

# Chỉ frontend
docker-compose logs -f frontend
```

### Restart services

```bash
# Restart tất cả
docker-compose restart

# Restart chỉ backend
docker-compose restart backend
```

---

## 🔧 Troubleshooting

### Container backend crash ngay sau khi start

**Nguyên nhân**: Không đủ RAM để load models

**Giải pháp**:
1. Tăng RAM cho Docker Desktop (Settings → Resources → Memory)
2. Hoặc dùng CPU-only PyTorch (nhỏ hơn)

### Port đã bị chiếm

```bash
# Thay đổi ports trong docker-compose.yml
ports:
  - "8080:8000"  # Backend
  - "3000:80"    # Frontend
```

### Build chậm

```bash
# Build với cache
docker-compose build --parallel

# Build lại hoàn toàn
docker-compose build --no-cache
```

### Models không load được

Kiểm tra folder `weight/` có đầy đủ không:
```bash
ls -la weight/results_sentiment_neutral_focus/
ls -la weight/results_topics/
```

---

## 🌐 Deploy lên Production

### Option 1: Docker Hub

```bash
# Tag images
docker tag nlp-backend yourusername/nlp-backend:latest
docker tag nlp-frontend yourusername/nlp-frontend:latest

# Push
docker push yourusername/nlp-backend:latest
docker push yourusername/nlp-frontend:latest
```

### Option 2: Cloud Platforms

**AWS ECS / Google Cloud Run / Azure Container Instances**

1. Build images locally
2. Push to container registry (ECR, GCR, ACR)
3. Deploy từ registry

**DigitalOcean App Platform**
- Connect GitHub repo
- Auto deploy từ `docker-compose.yml`

**Railway / Render**
- Push code lên Git
- Platform tự build và deploy

---

## 📊 Monitoring

### Kiểm tra resource usage

```bash
docker stats
```

### Kiểm tra health

```bash
# Backend health
curl http://localhost:8000/

# Frontend
curl http://localhost/
```

---

## 🔐 Security (Production)

### 1. Update nginx.conf với HTTPS

```nginx
server {
    listen 443 ssl http2;
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    # ...
}
```

### 2. Environment variables

Tạo file `.env`:
```env
API_BASE_URL=https://api.yourdomain.com
BACKEND_PORT=8000
```

Sử dụng trong docker-compose.yml:
```yaml
environment:
  - API_BASE_URL=${API_BASE_URL}
```

### 3. Limit resources

```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 4G
        reservations:
          memory: 2G
```

---

## 📝 Commands Cheat Sheet

```bash
# Build và start
docker-compose up --build -d

# Stop
docker-compose stop

# Start lại
docker-compose start

# Xem logs
docker-compose logs -f

# Exec vào container
docker-compose exec backend bash
docker-compose exec frontend sh

# Xóa containers + volumes + networks
docker-compose down -v --remove-orphans

# Rebuild 1 service
docker-compose up -d --build backend
```

---

## 💡 Tips

1. **Optimize build time**: 
   - Cache layers tốt bằng cách copy requirements.txt trước
   - Dùng `.dockerignore` để loại bỏ files không cần

2. **Giảm image size**:
   - Dùng multi-stage builds (đã implement)
   - Dùng alpine images
   - Cleanup sau khi install

3. **Development vs Production**:
   - Dev: Mount volumes để hot reload
   - Prod: Copy code vào image

---

## 🚀 Quick Start (TL;DR)

```bash
# Clone/navigate to project
cd demo-web

# Build và chạy
docker-compose up --build -d

# Mở browser
open http://localhost

# Xem logs nếu có vấn đề
docker-compose logs -f

# Dừng khi xong
docker-compose down
```

Xong! 🎉
