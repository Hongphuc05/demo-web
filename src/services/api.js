/**
 * API Service - Real Backend Integration
 * 
 * Connects to FastAPI backend for AI-powered text analysis
 * Backend: FastAPI with PyTorch models
 * Endpoint: POST /analyze
 * Body: { text: "..." }
 * Response: { sentiment: "...", topic: "...", confidence: ..., scores: {...} }
 */

// API Configuration
const API_CONFIG = {
  // Use /api prefix for Docker nginx proxy, fallback to localhost for local dev
  BASE_URL: window.location.hostname === 'localhost' && window.location.port !== '80' 
    ? 'http://localhost:8000'  // Local development
    : '/api',                   // Docker/Production (nginx proxy)
  ENDPOINTS: {
    ANALYZE: '/analyze',
    HEALTH: '/'
  }
}

/**
 * Real API: Analyze text using AI models
 * Connects to FastAPI backend
 * 
 * @param {string} text - Text to analyze
 * @returns {Promise<{sentiment: string, topic: string}>}
 */
export const analyzeText = async (text) => {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ANALYZE}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.detail || `API Error: ${response.status}`)
    }

    const data = await response.json()
    
    return {
      sentiment: data.sentiment,
      topic: data.topic,
      sentimentConfidence: data.sentiment_confidence,
      topicConfidence: data.topic_confidence,
      sentimentScores: data.sentiment_scores,
      topicScores: data.topic_scores
    }
  } catch (error) {
    console.error('API Error:', error)
    
    // Check if backend is unreachable
    if (error.message.includes('fetch') || error.message.includes('NetworkError')) {
      throw new Error('Cannot connect to backend. Please make sure the server is running on http://localhost:8000')
    }
    
    throw error
  }
}

/**
 * Check backend health
 * @returns {Promise<boolean>} True if backend is online
 */
export const checkBackendHealth = async () => {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.HEALTH}`)
    return response.ok
  } catch (error) {
    return false
  }
}

export default {
  analyzeText,
  checkBackendHealth,
  API_CONFIG
}
