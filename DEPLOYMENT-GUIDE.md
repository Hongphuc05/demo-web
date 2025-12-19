# 🚀 HƯỚNG DẪN ĐÓNG DOCKER VÀ TRIỂN KHAI Ở MÁY KHÁC

## 📋 MỤC LỤC
1. [Cài đặt Docker](#bước-1-cài-đặt-docker)
2. [Build Docker Images](#bước-2-build-docker-images)
3. [Test trên máy hiện tại](#bước-3-test-trên-máy-hiện-tại)
4. [Export Images để chuyển sang máy khác](#bước-4-export-images)
5. [Chuyển sang máy mới và Import](#bước-5-chuyển-sang-máy-mới)
6. [Chạy ứng dụng trên máy mới](#bước-6-chạy-trên-máy-mới)

---

## 🔧 BƯỚC 1: Cài đặt Docker

### Trên máy HIỆN TẠI (máy build):

1. **Download Docker Desktop**
   - Windows: https://www.docker.com/products/docker-desktop/
   - Tải bản **Docker Desktop for Windows**
   - File size ~500MB

2. **Cài đặt Docker Desktop**
   ```
   - Double click file installer
   - Click Next > Next > Install
   - Restart máy khi được yêu cầu
   ```

3. **Kiểm tra Docker đã cài thành công**
   ```bash
   # Mở PowerShell hoặc CMD
   docker --version
   docker-compose --version
   ```
   
   Kết quả mong muốn:
   ```
   Docker version 24.x.x
   Docker Compose version v2.x.x
   ```

4. **Start Docker Desktop**
   - Mở Docker Desktop từ Start Menu
   - Đợi cho đến khi thấy "Docker Desktop is running"

---

## 🏗️ BƯỚC 2: Build Docker Images

### 2.1. Mở PowerShell/CMD tại thư mục dự án

```bash
cd D:\NLP\demo-web
```

### 2.2. Kiểm tra cấu trúc dự án

```bash
dir
```

Phải thấy các file:
- `docker-compose.yml`
- `Dockerfile`
- `backend/Dockerfile`
- `weight/` (folder chứa models)

### 2.3. Build images

**QUAN TRỌNG**: Lần đầu build sẽ mất **15-30 phút**

```bash
# Build cả 2 services (backend + frontend)
docker-compose build

# Hoặc build từng cái riêng
docker-compose build backend
docker-compose build frontend
```

**Trong quá trình build bạn sẽ thấy:**
```
[+] Building backend...
 => [1/8] FROM docker.io/library/python:3.10-slim
 => [2/8] WORKDIR /app
 => [3/8] COPY requirements.txt .
 => [4/8] RUN pip install -r requirements.txt  ← Bước này lâu nhất
 => [5/8] COPY app.py model.py .
 => [6/8] COPY ../weight /app/weight            ← Bước này cũng lâu (copy models)
...

[+] Building frontend...
 => [1/10] FROM docker.io/library/node:18-alpine
 => [2/10] WORKDIR /app
 => [3/10] COPY package*.json ./
 => [4/10] RUN npm ci                           ← Bước này khá lâu
 => [5/10] COPY . .
 => [6/10] RUN npm run build                    ← Build React app
...
```

### 2.4. Kiểm tra images đã build xong

```bash
docker images
```

Phải thấy:
```
REPOSITORY              TAG       SIZE
demo-web-backend        latest    ~3-4GB   (do PyTorch + models)
demo-web-frontend       latest    ~50MB    (Alpine + nginx)
```

---

## ✅ BƯỚC 3: Test trên máy hiện tại

### 3.1. Chạy ứng dụng

```bash
docker-compose up -d
```

### 3.2. Kiểm tra containers đang chạy

```bash
docker ps
```

Phải thấy 2 containers:
```
CONTAINER ID   IMAGE                  STATUS         PORTS
xxx            demo-web-backend       Up 2 minutes   0.0.0.0:8000->8000/tcp
yyy            demo-web-frontend      Up 2 minutes   0.0.0.0:80->80/tcp
```

### 3.3. Test ứng dụng

1. Mở browser: **http://localhost**
2. Nhập văn bản: "Thầy dạy rất hay"
3. Click "Analyze"
4. Phải thấy kết quả Sentiment và Topic

### 3.4. Kiểm tra logs (nếu có lỗi)

```bash
# Xem logs backend
docker-compose logs backend

# Xem logs frontend
docker-compose logs frontend
```

### 3.5. Dừng containers (sau khi test xong)

```bash
docker-compose down
```

---

## 💾 BƯỚC 4: Export Images để chuyển máy

Có 2 cách: **Export thành file** (không cần internet) hoặc **Push lên Docker Hub** (cần internet)

### CÁCH 1: Export thành file .tar (Khuyến nghị - Không cần internet)

#### 4.1. Export Backend image

```bash
docker save -o nlp-backend.tar demo-web-backend:latest
```

**Lưu ý**: File này sẽ **RẤT NẶNG** (~3-4GB) vì chứa:
- Python base image
- PyTorch library (~2GB)
- AI models (~500MB)
- Dependencies khác

#### 4.2. Export Frontend image

```bash
docker save -o nlp-frontend.tar demo-web-frontend:latest
```

File này nhẹ hơn (~50MB)

#### 4.3. Kiểm tra files đã export

```bash
dir *.tar
```

Phải thấy:
```
nlp-backend.tar    ~3-4GB
nlp-frontend.tar   ~50MB
```

#### 4.4. Copy docker-compose.yml

```bash
# Copy file này để dùng trên máy mới
copy docker-compose.yml docker-compose-deploy.yml
```

#### 4.5. Chuẩn bị USB/Drive để chuyển

Cần copy 3 files này sang máy mới:
- `nlp-backend.tar` (~3-4GB)
- `nlp-frontend.tar` (~50MB)
- `docker-compose.yml`

**Tổng cộng cần ~4GB dung lượng**

---

### CÁCH 2: Push lên Docker Hub (Cần internet)

#### 4.1. Tạo tài khoản Docker Hub (nếu chưa có)

1. Truy cập: https://hub.docker.com/
2. Sign Up (miễn phí)
3. Nhớ username và password

#### 4.2. Login Docker Hub từ terminal

```bash
docker login
```

Nhập username và password khi được hỏi

#### 4.3. Tag images với username của bạn

```bash
# Thay "yourusername" bằng username Docker Hub của bạn
docker tag demo-web-backend:latest yourusername/nlp-backend:latest
docker tag demo-web-frontend:latest yourusername/nlp-frontend:latest
```

#### 4.4. Push images lên Docker Hub

```bash
# Push backend (sẽ mất 10-30 phút vì rất nặng)
docker push yourusername/nlp-backend:latest

# Push frontend (nhanh hơn)
docker push yourusername/nlp-frontend:latest
```

#### 4.5. Verify trên Docker Hub

Truy cập: https://hub.docker.com/u/yourusername

Phải thấy 2 repositories:
- `nlp-backend`
- `nlp-frontend`

---

## 🖥️ BƯỚC 5: Chuyển sang máy MỚI và Import

### 5.1. Cài Docker Desktop trên máy mới

Làm lại **BƯỚC 1** trên máy mới

### 5.2. Copy files sang máy mới

#### Nếu dùng CÁCH 1 (Export file .tar):

1. **Copy qua USB/Drive/Network**
   - Copy 3 files: `nlp-backend.tar`, `nlp-frontend.tar`, `docker-compose.yml`
   - Paste vào thư mục trên máy mới, ví dụ: `C:\NLP-App\`

2. **Mở PowerShell tại thư mục đó**
   ```bash
   cd C:\NLP-App
   ```

3. **Import images**
   ```bash
   # Import backend (mất 2-5 phút)
   docker load -i nlp-backend.tar
   
   # Import frontend (nhanh)
   docker load -i nlp-frontend.tar
   ```

4. **Kiểm tra images đã import**
   ```bash
   docker images
   ```
   
   Phải thấy:
   ```
   REPOSITORY              TAG       SIZE
   demo-web-backend        latest    ~3-4GB
   demo-web-frontend       latest    ~50MB
   ```

#### Nếu dùng CÁCH 2 (Docker Hub):

1. **Login Docker Hub trên máy mới**
   ```bash
   docker login
   ```

2. **Tạo file docker-compose.yml mới**
   
   Tạo file `docker-compose.yml` với nội dung:
   ```yaml
   version: '3.8'
   
   services:
     backend:
       image: yourusername/nlp-backend:latest  # Thay yourusername
       container_name: nlp-backend
       ports:
         - "8000:8000"
       restart: unless-stopped
   
     frontend:
       image: yourusername/nlp-frontend:latest  # Thay yourusername
       container_name: nlp-frontend
       ports:
         - "80:80"
       depends_on:
         - backend
       restart: unless-stopped
   ```

3. **Pull images từ Docker Hub**
   ```bash
   docker-compose pull
   ```
   
   Lệnh này sẽ tự động tải images từ Docker Hub

---

## 🚀 BƯỚC 6: Chạy trên máy MỚI

### 6.1. Start ứng dụng

```bash
# Ở thư mục chứa docker-compose.yml
docker-compose up -d
```

Chờ 30-60 giây để backend load models

### 6.2. Kiểm tra containers

```bash
docker ps
```

Phải thấy 2 containers đang chạy (STATUS = Up)

### 6.3. Test ứng dụng

1. Mở browser: **http://localhost**
2. Test phân tích văn bản
3. Xem kết quả

### 6.4. Xem logs nếu có vấn đề

```bash
docker-compose logs -f
```

---

## 🎯 TÓM TẮT CÁC LỆNH QUAN TRỌNG

### Trên máy BUILD (máy hiện tại):

```bash
# 1. Build images
docker-compose build

# 2. Test
docker-compose up -d
# Mở http://localhost để test

# 3. Stop
docker-compose down

# 4. Export
docker save -o nlp-backend.tar demo-web-backend:latest
docker save -o nlp-frontend.tar demo-web-frontend:latest

# 5. Copy 3 files sang máy mới:
# - nlp-backend.tar
# - nlp-frontend.tar  
# - docker-compose.yml
```

### Trên máy DEPLOY (máy mới):

```bash
# 1. Import images
docker load -i nlp-backend.tar
docker load -i nlp-frontend.tar

# 2. Start
docker-compose up -d

# 3. Check
docker ps

# 4. Open browser
# http://localhost
```

---

## 🐛 XỬ LÝ LỖI THƯỜNG GẶP

### Lỗi 1: "Cannot connect to Docker daemon"

**Nguyên nhân**: Docker Desktop chưa chạy

**Giải pháp**:
1. Mở Docker Desktop
2. Đợi cho đến khi thấy "Docker Desktop is running"
3. Thử lại lệnh

### Lỗi 2: "Port 80 is already in use"

**Nguyên nhân**: Port 80 đang bị chiếm (có thể Skype, IIS, Apache)

**Giải pháp**:
1. Sửa file `docker-compose.yml`:
   ```yaml
   frontend:
     ports:
       - "3000:80"  # Đổi từ 80 thành 3000
   ```
2. Truy cập: http://localhost:3000

### Lỗi 3: Backend crash ngay sau khi start

**Nguyên nhân**: Không đủ RAM

**Giải pháp**:
1. Mở Docker Desktop
2. Settings → Resources → Memory
3. Tăng lên ít nhất 8GB
4. Apply & Restart
5. Chạy lại: `docker-compose up -d`

### Lỗi 4: "Cannot find image"

**Nguyên nhân**: Import chưa thành công

**Giải pháp**:
```bash
# Kiểm tra lại images
docker images

# Import lại nếu cần
docker load -i nlp-backend.tar
docker load -i nlp-frontend.tar
```

---

## 📝 CHECKLIST TRIỂN KHAI

### Trước khi chuyển máy:

- [ ] Docker đã cài trên máy hiện tại
- [ ] Build thành công: `docker-compose build`
- [ ] Test thành công: `docker-compose up -d` → http://localhost
- [ ] Export images: 2 file .tar
- [ ] Copy docker-compose.yml
- [ ] Tổng cộng 3 files cần chuyển

### Trên máy mới:

- [ ] Docker đã cài và đang chạy
- [ ] Copy xong 3 files
- [ ] Import thành công: `docker load -i ...`
- [ ] Kiểm tra: `docker images` thấy 2 images
- [ ] Start: `docker-compose up -d`
- [ ] Kiểm tra: `docker ps` thấy 2 containers
- [ ] Test: http://localhost hoạt động

---

## 💡 TIPS QUAN TRỌNG

1. **Build đúng thứ tự**
   - Backend trước (vì nặng nhất)
   - Frontend sau (nhẹ)

2. **Kiểm tra dung lượng đĩa**
   - Cần ít nhất 10GB trống để build
   - Cần 4-5GB để lưu file .tar

3. **Nén file .tar trước khi chuyển** (optional)
   ```bash
   # Nén backend.tar (giảm từ 4GB xuống ~2GB)
   7z a nlp-backend.7z nlp-backend.tar
   ```

4. **Backup docker-compose.yml**
   - Giữ 1 copy ở máy cũ
   - Copy sang máy mới

5. **Test kỹ trước khi chuyển**
   - Đảm bảo mọi thứ work trên máy hiện tại
   - Sau đó mới export và chuyển

---

## 🌐 DEPLOY LÊN CLOUD (Bonus)

Nếu muốn deploy lên internet thay vì máy local:

### Option 1: Railway.app (Dễ nhất)

1. Push code lên GitHub
2. Truy cập: https://railway.app
3. New Project → Deploy from GitHub
4. Chọn repo → Deploy
5. Railway tự build và deploy

### Option 2: DigitalOcean App Platform

1. Tạo Droplet (Ubuntu)
2. SSH vào server
3. Cài Docker: `curl -fsSL https://get.docker.com -o get-docker.sh && sh get-docker.sh`
4. Copy 3 files lên: `scp *.tar user@server:/app/`
5. Import và run như trên

### Option 3: AWS ECS / Google Cloud Run

1. Push images lên container registry
2. Tạo service từ images
3. Deploy và scale

---

## ❓ CÂU HỎI THƯỜNG GẶP

**Q: File .tar quá lớn, không copy được?**
A: Dùng Google Drive/Dropbox hoặc nén bằng 7zip

**Q: Máy mới không có internet, vẫn chạy được không?**
A: Được! Chỉ cần copy 3 files .tar + docker-compose.yml

**Q: Có thể chạy nhiều máy cùng lúc không?**
A: Được! Chỉ cần import và run trên từng máy

**Q: Update code thì phải làm gì?**
A: Build lại → Export lại → Import lại trên máy mới

**Q: Xóa images cũ như thế nào?**
A: `docker rmi demo-web-backend demo-web-frontend`

---

Xong! Làm theo từng bước là được. Nếu có lỗi gì thì xem phần "Xử lý lỗi" hoặc `docker-compose logs -f` để debug. 🚀
