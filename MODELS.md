# 📦 Hướng dẫn cài đặt AI Models

## ⚠️ Quan trọng

Dự án này yêu cầu các mô hình AI đã được train sẵn để phân tích sentiment (cảm xúc) và phân loại topic (chủ đề). **Các file model KHÔNG có trên Git repository** do kích thước quá lớn (~500MB+).

Bạn **BẮT BUỘC** phải tải models trước khi chạy ứng dụng, nếu không Docker build sẽ bị lỗi!

---

## 📥 Cách tải Models

### Bước 1: Tải từ Google Drive

**Link tải:** [https://drive.google.com/drive/folders/1dW42cymaYD9Rv3OVPdJ1ENSeVzDCKkIx](https://drive.google.com/drive/folders/13sMTJbKFdR1DmZjiJ0oYMduWEux5pyJk?usp=sharing)

1. Truy cập link Google Drive ở trên
2. Tải thư mục `weight` về máy (hoặc tải file nén nếu có)
3. Nếu tải file nén, giải nén ra

### Bước 2: Đặt vào đúng vị trí

Đặt thư mục `weight` vào **thư mục gốc của dự án** (cùng cấp với `backend/`, `src/`, `docker-compose.yml`).

Cấu trúc cần có:

```
demo-web/
├── backend/
├── src/
├── docker-compose.yml
└── weight/                              ← Thư mục này cần có!
    ├── results_sentiment_neutral_focus/
    │   └── results_sentiment_neutral_focus/
    │       └── checkpoint-360/
    │           ├── config.json
    │           ├── model.safetensors
    │           ├── tokenizer_config.json
    │           ├── vocab.txt
    │           └── ... (các file khác)
    └── results_topics/
        └── checkpoint-360/
            ├── config.json
            ├── model.safetensors
            ├── tokenizer_config.json
            ├── vocab.txt
            └── ... (các file khác)
```

### Bước 3: Kiểm tra

Sau khi đặt xong, kiểm tra các file model có tồn tại không:

**Windows:**
```powershell
Test-Path weight\results_sentiment_neutral_focus\results_sentiment_neutral_focus\checkpoint-360\model.safetensors
Test-Path weight\results_topics\checkpoint-360\model.safetensors
```

**Linux/Mac:**
```bash
ls weight/results_sentiment_neutral_focus/results_sentiment_neutral_focus/checkpoint-360/model.safetensors
ls weight/results_topics/checkpoint-360/model.safetensors
```

Nếu 2 lệnh đều hiển thị đường dẫn hoặc trả về `True` → **Hoàn tất!** ✅

---

## 🐳 Lưu ý khi dùng Docker

**CHÚ Ý:** Thư mục `weight/` phải có **TRƯỚC KHI** chạy `docker build` hoặc `docker-compose up`.

Nếu không có, Docker sẽ báo lỗi:
```
COPY failed: file not found: weight
```

Đảm bảo đã tải và đặt đúng vị trí trước khi build!

---

## 📝 Thông tin Models

- **Sentiment Model**: PhoBERT fine-tuned cho phân tích cảm xúc tiếng Việt (Tích cực/Tiêu cực/Trung tính)
- **Topic Model**: PhoBERT fine-tuned cho phân loại chủ đề tiếng Việt
- **Model gốc**: PhoBERT (Vietnamese BERT)
- **Framework**: PyTorch + Transformers
- **Kích thước**: ~500MB+

---

## 🚀 Sau khi cài đặt xong

Chạy ứng dụng bằng Docker:

```bash
docker-compose up
```

Hoặc chạy local:

```bash
# Backend
cd backend
pip install -r requirements.txt
python app.py

# Frontend (terminal khác)
npm install
npm run dev
```

API sẽ chạy tại `http://localhost:8000`

Frontend sẽ chạy tại `http://localhost:3000`

---

## ❓ Cần trợ giúp?

Nếu gặp vấn đề:
- Kiểm tra lại cấu trúc thư mục `weight/`
- Đảm bảo đã tải đầy đủ tất cả files
- Xem log lỗi khi chạy Docker hoặc Python
- Liên hệ người duy trì dự án
