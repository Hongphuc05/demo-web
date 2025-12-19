"""
Model loading and prediction utilities for NLP models
Handles sentiment analysis and topic classification
"""

import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import numpy as np
import os
from pathlib import Path

try:
    from underthesea import word_tokenize
except ImportError:
    print("⚠️ underthesea not found, will be installed via requirements.txt")
    word_tokenize = None

# ==============================================================================
# GLOBAL VARIABLES
# ==============================================================================
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Model paths
# In Docker: models are at /app/weight/
# In local dev: models are at ../weight/
import os
if os.path.exists("/app/weight"):
    # Running in Docker container
    SENTIMENT_PATH = Path("/app/weight/results_sentiment_neutral_focus/results_sentiment_neutral_focus/checkpoint-360")
    TOPIC_PATH = Path("/app/weight/results_topics/checkpoint-360")
else:
    # Running locally
    BASE_DIR = Path(__file__).parent.parent
    SENTIMENT_PATH = BASE_DIR / "weight" / "results_sentiment_neutral_focus" / "results_sentiment_neutral_focus" / "checkpoint-360"
    TOPIC_PATH = BASE_DIR / "weight" / "results_topics" / "checkpoint-360"

# Global model variables
tokenizer_sent = None
model_sent = None
tokenizer_topic = None
model_topic = None

# Text normalization dictionary
REPLACE_DICT = {
    ":)": "colonsmile", ":(": "colonsad", "@@": "colonsurprise", "<3": "colonlove",
    ":d": "colonsmilesmile", ":3": "coloncontemn", ":v": "colonbigsmile", ":_": "coloncc",
    ":p": "colonsmallsmile", ">>": "coloncolon", ":\">": "colonlovelove", "^^": "colonhihi",
    ":": "doubledot", ":'(": "colonsadcolon", ":'(": "colonsadcolon", ":@": "colondoublesurprise",
    "v.v": "vdotv", "...": "dotdotdot", "/": "fraction", "c#": "cshrap"
}

# ==============================================================================
# TEXT NORMALIZATION
# ==============================================================================
def normalize_text(text):
    """
    Normalize text by replacing special characters and emoticons
    
    Args:
        text: Input text string
        
    Returns:
        Normalized text string
    """
    text = str(text).lower()
    for k, v in REPLACE_DICT.items():
        text = text.replace(k, f" {v} ")
    return " ".join(text.split())

# ==============================================================================
# MODEL INITIALIZATION
# ==============================================================================
def initialize_models():
    """
    Load both sentiment and topic models on startup
    This function should be called once when the server starts
    """
    global tokenizer_sent, model_sent, tokenizer_topic, model_topic, device
    
    print(f"📍 Using device: {device}")
    
    # Check if model paths exist
    if not SENTIMENT_PATH.exists():
        raise FileNotFoundError(f"Sentiment model not found at: {SENTIMENT_PATH}")
    if not TOPIC_PATH.exists():
        raise FileNotFoundError(f"Topic model not found at: {TOPIC_PATH}")
    
    # Load Sentiment Model
    print(f"⏳ Loading Sentiment model from: {SENTIMENT_PATH}")
    try:
        tokenizer_sent = AutoTokenizer.from_pretrained(
            str(SENTIMENT_PATH),
            local_files_only=True
        )
        model_sent = AutoModelForSequenceClassification.from_pretrained(
            str(SENTIMENT_PATH),
            local_files_only=True
        )
        model_sent.to(device).eval()
        print("✅ Sentiment model loaded successfully!")
    except Exception as e:
        raise RuntimeError(f"Failed to load sentiment model: {e}")
    
    # Load Topic Model
    print(f"⏳ Loading Topic model from: {TOPIC_PATH}")
    try:
        tokenizer_topic = AutoTokenizer.from_pretrained(
            str(TOPIC_PATH),
            local_files_only=True
        )
        model_topic = AutoModelForSequenceClassification.from_pretrained(
            str(TOPIC_PATH),
            local_files_only=True
        )
        model_topic.to(device).eval()
        print("✅ Topic model loaded successfully!")
    except Exception as e:
        raise RuntimeError(f"Failed to load topic model: {e}")
    
    # Verify underthesea is available
    if word_tokenize is None:
        raise ImportError("underthesea library is required but not installed")

# ==============================================================================
# SENTIMENT PREDICTION
# ==============================================================================
def predict_sentiment(text):
    """
    Predict sentiment of input text
    
    Args:
        text: Input text string
        
    Returns:
        Dictionary with sentiment prediction, confidence, and scores
    """
    if model_sent is None or tokenizer_sent is None:
        raise RuntimeError("Sentiment model not initialized. Call initialize_models() first.")
    
    # Normalize text
    clean_text = normalize_text(text)
    
    # Tokenize
    inputs = tokenizer_sent(
        clean_text,
        return_tensors="pt",
        truncation=True,
        max_length=64
    ).to(device)
    
    # Predict
    with torch.no_grad():
        outputs = model_sent(**inputs)
        probs = torch.nn.functional.softmax(outputs.logits, dim=-1)
        pred_idx = torch.argmax(probs, dim=-1).item()
    
    # Label mapping
    label_map = {0: "Tiêu cực", 1: "Trung tính", 2: "Tích cực"}
    
    return {
        "text": text,
        "sentiment": label_map[pred_idx],
        "confidence": round(probs[0][pred_idx].item(), 4),
        "scores": probs[0].cpu().numpy()
    }

# ==============================================================================
# TOPIC PREDICTION
# ==============================================================================
def predict_topic(text):
    """
    Predict topic of input text
    
    Args:
        text: Input text string
        
    Returns:
        Dictionary with topic prediction, confidence, and scores
    """
    if model_topic is None or tokenizer_topic is None:
        raise RuntimeError("Topic model not initialized. Call initialize_models() first.")
    
    # Step 1: Normalize emoticons and special characters
    clean_text = normalize_text(text)
    
    # Step 2: Vietnamese word segmentation (CRITICAL for topic model)
    segmented_text = word_tokenize(clean_text, format="text")
    
    # Step 3: Tokenize
    inputs = tokenizer_topic(
        segmented_text,
        return_tensors="pt",
        truncation=True,
        max_length=64
    ).to(device)
    
    # Predict
    with torch.no_grad():
        outputs = model_topic(**inputs)
        probs = torch.nn.functional.softmax(outputs.logits, dim=-1)
        pred_idx = torch.argmax(probs, dim=-1).item()
    
    # Label mapping
    label_map = {
        0: "Giảng viên",
        1: "Chương trình đào tạo",
        2: "Cơ sở vật chất",
        3: "Khác"
    }
    
    return {
        "text": text,
        "topic": label_map[pred_idx],
        "confidence": round(probs[0][pred_idx].item(), 4),
        "scores": probs[0].cpu().numpy()
    }

# ==============================================================================
# TESTING (Optional - for development)
# ==============================================================================
if __name__ == "__main__":
    # Test the models
    print("Testing models...")
    initialize_models()
    
    test_text = "Môn này thầy dạy chán quá"
    print(f"\nTest text: {test_text}")
    print("\nSentiment:", predict_sentiment(test_text))
    print("\nTopic:", predict_topic(test_text))
