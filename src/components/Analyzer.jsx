import { useState } from 'react'
import { analyzeText } from '../services/api'

/**
 * Component chính để nhập text và hiển thị kết quả phân tích
 * Giao diện tương tự Google Translate
 */
function Analyzer({ onAnalysisComplete }) {
  const [inputText, setInputText] = useState('')
  const [sentiment, setSentiment] = useState('')
  const [topic, setTopic] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // Xử lý khi người dùng nhấn nút "Phân tích"
  const handleAnalyze = async () => {
    // Validate input
    if (!inputText.trim()) {
      setError('Please enter text to analyze')
      return
    }

    setError('')
    setIsLoading(true)
    setSentiment('')
    setTopic('')

    try {
      // Gọi mock API (sau này sẽ thay bằng API thật)
      const result = await analyzeText(inputText)
      
      // Cập nhật kết quả
      setSentiment(result.sentiment)
      setTopic(result.topic)

      // Thêm vào lịch sử
      onAnalysisComplete({
        id: Date.now(),
        text: inputText,
        sentiment: result.sentiment,
        topic: result.topic,
        timestamp: new Date().toLocaleString('vi-VN')
      })
    } catch (err) {
      setError('Analysis failed. Please try again.')
      console.error('Analysis error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // Xử lý nhấn Enter trong textarea (Shift+Enter để xuống dòng)
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleAnalyze()
    }
  }

  // Xóa nội dung
  const handleClear = () => {
    setInputText('')
    setSentiment('')
    setTopic('')
    setError('')
  }

  // Render sentiment với style tối giản
  const getSentimentDisplay = () => {
    if (!sentiment) return <span className="text-slate-400">Waiting for analysis...</span>
    
    return (
      <div className="inline-block px-5 py-2.5 rounded-lg bg-slate-100 border border-slate-300 text-slate-900 font-medium text-base">
        {sentiment}
      </div>
    )
  }

  // Render topic với style tối giản
  const getTopicDisplay = () => {
    if (!topic) return <span className="text-slate-400">Waiting for analysis...</span>

    return (
      <div className="inline-block px-5 py-2.5 rounded-lg bg-slate-100 border border-slate-300 text-slate-900 font-medium text-base">
        {topic}
      </div>
    )
  }

  return (
    <div className="card">
      <h2 className="text-xl font-semibold text-slate-900 mb-6">
        Text Input
      </h2>

      {/* Input Section */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Enter your text
        </label>
        <textarea
          className="textarea-custom"
          rows="6"
          placeholder="Type or paste your text here..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
        />
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-slate-500">
            {inputText.length} characters
          </span>
          {inputText && (
            <button
              onClick={handleClear}
              className="text-xs text-slate-500 hover:text-slate-700"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          <p>{error}</p>
        </div>
      )}

      {/* Action Button */}
      <div className="mb-6">
        <button
          onClick={handleAnalyze}
          disabled={isLoading || !inputText.trim()}
          className="btn-primary w-full"
        >
          {isLoading ? 'Analyzing...' : 'Analyze'}
        </button>
      </div>

      {/* Results Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sentiment Result */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Sentiment
          </label>
          <div className="result-box flex items-center justify-center">
            {getSentimentDisplay()}
          </div>
        </div>

        {/* Topic Result */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Topic
          </label>
          <div className="result-box flex items-center justify-center">
            {getTopicDisplay()}
          </div>
        </div>
      </div>

      {/* Info Box */}
      {(sentiment || topic) && (
        <div className="mt-6 p-3 bg-slate-50 border border-slate-200 rounded-lg">
          <p className="text-xs text-slate-600">
            Note: Dự án này chỉ mang tính minh họa. Kết quả phân tích có thể không chính xác hoàn toàn.
          </p>
        </div>
      )}
    </div>
  )
}

export default Analyzer
