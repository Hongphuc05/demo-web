# 🤖 NLP Text Analyzer

> ⚠️ **QUAN TRỌNG**: Trước khi chạy dự án, bạn cần tải AI models riêng (không có trên Git). Xem chi tiết tại **[MODELS.md](MODELS.md)**

## 📖 Giới thiệu

**NLP Text Analyzer** là một ứng dụng web fullstack để phân tích văn bản sử dụng AI/NLP với PyTorch. Giao diện hiện đại, tối giản, cho phép người dùng:

- 🎭 Phân tích **Sentiment** (Cảm xúc): Tiêu cực / Trung tính / Tích cực
- 🏷️ Phân loại **Topic** (Chủ đề): Giảng viên, Chương trình đào tạo, Cơ sở vật chất, Khác
- 📜 Lưu trữ lịch sử 10 phân tích gần nhất
- 🚀 Sử dụng mô hình AI thật được train sẵn

Dự án bao gồm **frontend React + backend FastAPI** với PyTorch models.

## 📚 Hướng dẫn

- 🚀 **[QUICKSTART.md](QUICKSTART.md)** - Chạy nhanh với Python + npm
- 🐳 **[DEPLOYMENT-GUIDE.md](DEPLOYMENT-GUIDE.md)** - Đóng Docker và triển khai ở máy khác (CHI TIẾT)
- 📖 **[DOCKER.md](DOCKER.md)** - Tài liệu Docker đầy đủ
- 📦 **[MODELS.md](MODELS.md)** - ⚠️ **BẮT BUỘC**: Hướng dẫn tải AI models (không có trên Git)

---

## ✨ Chức năng

### 1. Phân tích văn bản
- Nhập văn bản (tiếng Anh hoặc tiếng Việt)
- Nhấn nút "Phân tích" hoặc Enter để xử lý
- Hiển thị kết quả Sentiment và Topic với màu sắc và icon trực quan

### 2. Lịch sử phân tích
- Tự động lưu 10 kết quả gần nhất
- Hiển thị item mới nhất ở trên cùng
- Click vào item để xem chi tiết đầy đủ
- Hiển thị timestamp cho mỗi phân tích

### 3. UX/UI hiện đại
- Giao diện responsive (mobile-friendly)
- Màu sắc gradient hiện đại
- Animations mượt mà
- Loading state khi đang xử lý
- Validation và error handling

---

## 🛠️ Công nghệ sử dụng

### Frontend
| Công nghệ | Phiên bản | Mục đích |
|-----------|-----------|----------|
| **React** | ^18.3.1 | UI Library |
| **Vite** | ^6.0.3 | Build Tool |
| **Tailwind CSS** | ^3.4.17 | Styling Framework |
| **Inter Font** | - | Modern Typography |

### Backend (AI/ML)
| Công nghệ | Phiên bản | Mục đích |
|-----------|-----------|----------|
| **FastAPI** | 0.109.0 | Web Framework |
| **PyTorch** | 2.1.2 | Deep Learning |
| **Transformers** | 4.37.0 | Hugging Face Models |
| **Underthesea** | 6.7.0 | Vietnamese NLP |

---

## 🚀 Cài đặt và Chạy

### Yêu cầu hệ thống
- **Node.js**: >= 18.0.0
- **Python**: >= 3.8
- **CUDA** (optional): Để chạy GPU acceleration

---

## 📦 Setup Backend (AI Models)

### Bước 1: Tạo Python virtual environment

```bash
cd backend
python -m venv venv
```

### Bước 2: Activate virtual environment

**Windows:**
```bash
venv\Scripts\activate
```

**Linux/Mac:**
```bash
source venv/bin/activate
```

### Bước 3: Cài đặt Python dependencies

```bash
pip install -r requirements.txt
```

⏳ **Lưu ý:** Quá trình cài đặt có thể mất 5-10 phút vì PyTorch và Transformers khá nặng.

### Bước 4: Chạy backend server

```bash
python app.py
```

Backend sẽ chạy tại: **http://localhost:8000**

Kiểm tra backend hoạt động:
- Mở browser: http://localhost:8000
- Hoặc xem API docs: http://localhost:8000/docs

---

## 💻 Setup Frontend

### Bước 1: Cài đặt dependencies

```bash
npm install
```

### Bước 2: Chạy development server

```bash
npm run dev
```

Frontend sẽ chạy tại: **http://localhost:5173** (hoặc 3000/3001)

---

## 🎯 Chạy Fullstack App

Bạn cần **2 terminals**:

**Terminal 1 - Backend:**
```bash
cd backend
venv\Scripts\activate    # Windows
python app.py
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

Sau đó mở browser: **http://localhost:5173**

---

## 📊 Test API với cURL (Optional)

```bash
curl -X POST http://localhost:8000/analyze \
  -H "Content-Type: application/json" \
  -d "{\"text\":\"Môn này thầy dạy rất hay\"}"
```

---

## 📁 Cấu trúc dự án

```
demo-web/
├── backend/                     # Python FastAPI Backend
│   ├── app.py                   # FastAPI server & API endpoints
│   ├── model.py                 # Model loading & prediction logic
│   ├── requirements.txt         # Python dependencies
│   └── venv/                    # Python virtual environment
├── weight/                      # AI Models (PyTorch checkpoints)
│   ├── results_sentiment_neutral_focus/
│   │   └── checkpoint-360/      # Sentiment model
│   └── results_topics/
│       └── checkpoint-360/      # Topic model
├── src/                         # React Frontend
│   ├── components/
│   │   ├── Analyzer.jsx         # Main analysis component
│   │   └── History.jsx          # History component
│   ├── services/
│   │   └── api.js               # API service (connects to backend)
│   ├── App.jsx                  # Main App component
│   ├── main.jsx                 # Entry point
│   └── index.css                # Global styles (Tailwind + Inter font)
├── index.html                   # HTML template
├── package.json                 # Node dependencies
├── vite.config.js               # Vite configuration
├── tailwind.config.js           # Tailwind configuration
└── README.md                    # Documentation
```

---

## 🧪 Testing

### Test Backend

```bash
# Test với Python
cd backend
python model.py
```

### Test API Endpoint

Mở browser: http://localhost:8000/docs để test interactive API

---

## 🔧 Troubleshooting

### Backend không khởi động được

1. Kiểm tra Python version: `python --version` (cần >= 3.8)
2. Kiểm tra virtual environment đã activate chưa
3. Kiểm tra models có trong folder `weight/` chưa
4. Kiểm tra port 8000 có bị chiếm không

### Frontend không kết nối được backend

1. Kiểm tra backend đang chạy: http://localhost:8000
2. Check CORS settings trong `backend/app.py`
3. Kiểm tra browser console có lỗi gì không
4. Đảm bảo cả frontend và backend đều đang chạy

### Model quá chậm

- Nếu có GPU: Đảm bảo PyTorch được cài với CUDA support
- Nếu chỉ có CPU: Model vẫn chạy được nhưng chậm hơn (5-10s)

---

## 🚀 Deployment (Production)

### Backend

Deploy lên cloud platforms:
- **Railway**: https://railway.app
- **Render**: https://render.com  
- **AWS Lambda** (với serverless)
- **Docker container** trên bất kỳ cloud nào

### Frontend

Deploy lên:
- **Vercel**: `npm run build` → Upload dist/
- **Netlify**: Kết nối GitHub repo
- **GitHub Pages**: Static hosting

⚠️ **Lưu ý**: Nhớ update `API_BASE_URL` trong `src/services/api.js` khi deploy

---

## 🎨 Customization

### Thay đổi màu sắc chủ đạo

Chỉnh sửa file [tailwind.config.js](tailwind.config.js):

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        500: '#your-color',
        // ...
      }
    }
  }
}
```

### Thay đổi port

Chỉnh sửa file [vite.config.js](vite.config.js):

```javascript
server: {
  port: 5000,  // Thay đổi port tại đây
  open: true
}
```

---

## 📝 Mock API Logic

Mock API hiện tại có logic đơn giản để demo:

- **Sentiment**: Dựa trên từ khóa (good, bad, great, terrible, tốt, xấu, ...)
- **Topic**: Dựa trên từ khóa (health, money, school, tech, ...)
- **Delay**: 1-2 giây để giả lập API call thật

Xem chi tiết trong [src/services/api.js](src/services/api.js)

---

## 🐛 Troubleshooting

### Lỗi: "Module not found"
```bash
rm -rf node_modules package-lock.json
npm install
```

### Lỗi: Port đã được sử dụng
Thay đổi port trong `vite.config.js` hoặc kill process đang chạy:

```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Lỗi: Tailwind CSS không hoạt động
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

---

## 🎯 Roadmap

- [x] ✅ Giao diện phân tích cơ bản
- [x] ✅ Lịch sử phân tích
- [x] ✅ Mock API
- [x] ✅ Responsive design
- [ ] 🔄 Tích hợp backend FastAPI
- [ ] 🔄 Export lịch sử ra CSV/JSON
- [ ] 🔄 Dark mode
- [ ] 🔄 Multi-language support
- [ ] 🔄 Advanced analytics dashboard

---

## 📞 Liên hệ & Hỗ trợ

Nếu gặp vấn đề hoặc có câu hỏi:
1. Check file README này trước
2. Xem code comments trong từng file
3. Kiểm tra console browser (F12) để xem lỗi

---

## 📄 License

MIT License - Free to use for educational and commercial purposes.

---

## 🙏 Credits

- **React**: Facebook/Meta
- **Vite**: Evan You
- **Tailwind CSS**: Adam Wathan
- **Icons**: Unicode Emoji

---

**Happy Coding! 🚀**

Made with ❤️ for NLP/AI Systems
