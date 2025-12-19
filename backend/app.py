"""
FastAPI Backend for NLP Text Analyzer
Serves sentiment and topic classification models
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any
import uvicorn

# Import model utilities
from model import predict_sentiment, predict_topic, initialize_models

# Initialize FastAPI app
app = FastAPI(
    title="NLP Text Analyzer API",
    description="API for sentiment analysis and topic classification",
    version="1.0.0"
)

# Configure CORS to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request model
class AnalyzeRequest(BaseModel):
    text: str

    class Config:
        json_schema_extra = {
            "example": {
                "text": "Môn học này rất thú vị và bổ ích"
            }
        }

# Response model
class AnalyzeResponse(BaseModel):
    text: str
    sentiment: str
    sentiment_confidence: float
    topic: str
    topic_confidence: float
    sentiment_scores: Dict[str, float]
    topic_scores: Dict[str, float]

# Startup event - load models once when server starts
@app.on_event("startup")
async def startup_event():
    """Load models on server startup"""
    print("🚀 Starting NLP Text Analyzer API...")
    print("⏳ Loading AI models...")
    try:
        initialize_models()
        print("✅ Models loaded successfully!")
    except Exception as e:
        print(f"❌ Error loading models: {e}")
        raise

# Health check endpoint
@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "online",
        "message": "NLP Text Analyzer API is running",
        "version": "1.0.0",
        "endpoints": {
            "analyze": "/analyze (POST)",
            "docs": "/docs"
        }
    }

# Main analyze endpoint
@app.post("/analyze", response_model=AnalyzeResponse)
async def analyze_text(request: AnalyzeRequest):
    """
    Analyze text for sentiment and topic
    
    Args:
        request: AnalyzeRequest with text field
        
    Returns:
        AnalyzeResponse with sentiment and topic predictions
    """
    try:
        # Validate input
        if not request.text or not request.text.strip():
            raise HTTPException(status_code=400, detail="Text cannot be empty")
        
        # Get predictions
        sentiment_result = predict_sentiment(request.text)
        topic_result = predict_topic(request.text)
        
        # Format sentiment scores (Vietnamese labels)
        sentiment_labels = ["Tiêu cực", "Trung tính", "Tích cực"]
        sentiment_scores = {
            label: float(score) 
            for label, score in zip(sentiment_labels, sentiment_result["scores"])
        }
        
        # Format topic scores (Vietnamese labels)
        topic_labels = ["Giảng viên", "Chương trình đào tạo", "Cơ sở vật chất", "Khác"]
        topic_scores = {
            label: float(score)
            for label, score in zip(topic_labels, topic_result["scores"])
        }
        
        return AnalyzeResponse(
            text=request.text,
            sentiment=sentiment_result["sentiment"],
            sentiment_confidence=sentiment_result["confidence"],
            topic=topic_result["topic"],
            topic_confidence=topic_result["confidence"],
            sentiment_scores=sentiment_scores,
            topic_scores=topic_scores
        )
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error during analysis: {e}")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

if __name__ == "__main__":
    # Run the server
    uvicorn.run(
        "app:app",
        host="0.0.0.0",
        port=8000,
        reload=True,  # Auto-reload on code changes (development only)
        log_level="info"
    )
