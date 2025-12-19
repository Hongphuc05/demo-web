# Quick Start Guide - NLP Text Analyzer

## 🚀 Chạy ứng dụng trong 3 bước

### 1️⃣ Setup Backend (Python/AI)

```bash
# Tạo virtual environment
cd backend
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Cài packages
pip install -r requirements.txt

# Chạy server
python app.py
```

Backend sẽ chạy tại: **http://localhost:8000**

---

### 2️⃣ Setup Frontend (React)

Mở terminal mới:

```bash
# Cài dependencies
npm install

# Chạy dev server
npm run dev
```

Frontend sẽ chạy tại: **http://localhost:5173**

---

### 3️⃣ Test ứng dụng

Mở browser: **http://localhost:5173**

Nhập văn bản tiếng Việt, ví dụ:
- "Thầy giảng dạy rất nhiệt tình"
- "Phòng máy nóng quá"
- "Môn này khó quá"

---

## 📝 Lưu ý quan trọng

- ✅ Cần chạy **2 servers** cùng lúc (backend + frontend)
- ✅ Models trong folder `weight/` phải có sẵn
- ✅ Python >= 3.8, Node.js >= 18.0
- ⏰ Lần đầu load models mất ~10-30 giây
- 💻 CPU: Analysis ~5-10s/request
- 🚀 GPU: Analysis ~1-2s/request

---

## 🔍 Kiểm tra backend hoạt động

```bash
curl http://localhost:8000
```

Hoặc mở: http://localhost:8000/docs (FastAPI Swagger UI)

---

## 🐛 Lỗi thường gặp

**Backend không chạy:**
- Kiểm tra: `python --version` >= 3.8
- Kiểm tra: Virtual env đã activate chưa
- Kiểm tra: Port 8000 đang bị chiếm?

**Frontend lỗi "Cannot connect to backend":**
- Đảm bảo backend đang chạy ở port 8000
- Hard refresh browser: Ctrl + Shift + R

**Models load chậm:**
- Bình thường! Lần đầu load PyTorch models mất thời gian
- Xem console backend để tracking progress

---

## 📚 Documentation

Xem file [README.md](README.md) để biết chi tiết đầy đủ.
