# ✅ CHECKLIST TRIỂN KHAI DOCKER

## 📦 TRÊN MÁY HIỆN TẠI (Build & Export)

### Chuẩn bị:
- [ ] Đã cài Docker Desktop
- [ ] Docker Desktop đang chạy
- [ ] Đã vào thư mục dự án: `cd D:\NLP\demo-web`

### Build:
```bash
docker-compose build
```
- [ ] Build thành công (không có lỗi)
- [ ] Mất 15-30 phút

### Test:
```bash
docker-compose up -d
```
- [ ] Mở http://localhost
- [ ] Test phân tích văn bản
- [ ] Kết quả hiển thị đúng
```bash
docker-compose down
```

### Export:
```bash
docker save -o nlp-backend.tar demo-web-backend:latest
docker save -o nlp-frontend.tar demo-web-frontend:latest
```
- [ ] File `nlp-backend.tar` (~3-4GB)
- [ ] File `nlp-frontend.tar` (~50MB)

### Chuẩn bị chuyển:
- [ ] Copy `nlp-backend.tar`
- [ ] Copy `nlp-frontend.tar`
- [ ] Copy `docker-compose.yml`
- [ ] Copy `docker-import.bat` (optional)

**→ Tổng cộng 3-4 files, ~4GB**

---

## 🖥️ TRÊN MÁY MỚI (Import & Deploy)

### Chuẩn bị:
- [ ] Đã cài Docker Desktop
- [ ] Docker Desktop đang chạy
- [ ] Copy 3 files vào thư mục mới

### Import:
```bash
cd C:\NLP-App
docker load -i nlp-backend.tar
docker load -i nlp-frontend.tar
```
- [ ] Import backend thành công
- [ ] Import frontend thành công

### Kiểm tra:
```bash
docker images
```
- [ ] Thấy `demo-web-backend`
- [ ] Thấy `demo-web-frontend`

### Deploy:
```bash
docker-compose up -d
```
- [ ] Containers đang chạy
- [ ] Không có lỗi

### Test:
- [ ] Mở http://localhost
- [ ] Nhập văn bản test
- [ ] Click "Analyze"
- [ ] Xem kết quả

---

## 🎯 COMMANDS NHANH

### Máy hiện tại (Build):
```bash
# 1 lệnh để build + export
docker-export.bat
```

### Máy mới (Deploy):
```bash
# 1 lệnh để import + run
docker-import.bat
```

---

## 🆘 NẾU CÓ LỖI

1. **Docker không chạy**: Mở Docker Desktop
2. **Port bị chiếm**: Sửa port trong docker-compose.yml
3. **Không đủ RAM**: Tăng RAM trong Docker settings (8GB+)
4. **Import fail**: Kiểm tra file .tar có bị corrupt không

Xem chi tiết: **DEPLOYMENT-GUIDE.md**

---

## 📝 GHI CHÚ

- ⏰ Build lần đầu: 15-30 phút
- 💾 File backend: ~3-4GB
- 🚀 Import + run: 5-10 phút
- 💻 RAM tối thiểu: 8GB
- 📦 Disk space: 10GB+

**Đọc DEPLOYMENT-GUIDE.md để biết chi tiết từng bước!**
