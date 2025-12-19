import { useState } from 'react'
import Analyzer from './components/Analyzer'
import History from './components/History'
import './App.css'

function App() {
  const [history, setHistory] = useState([])

  // Thêm kết quả phân tích vào lịch sử
  const addToHistory = (result) => {
    setHistory((prev) => {
      // Thêm item mới vào đầu mảng và giữ tối đa 10 items
      const newHistory = [result, ...prev].slice(0, 10)
      return newHistory
    })
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-semibold text-slate-900 mb-2 tracking-tight">
            NLP Text Analyzer
          </h1>
          <p className="text-slate-600 text-base">
            Sentiment Analysis & Topic Classification
          </p>
        </header>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Analyzer Section - 2 columns on large screens */}
          <div className="lg:col-span-2">
            <Analyzer onAnalysisComplete={addToHistory} />
          </div>

          {/* History Section - 1 column on large screens */}
          <div className="lg:col-span-1">
            <History history={history} />
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center mt-12 text-slate-500">
          <p className="text-sm">
            © 2025 NLP Analyzer
          </p>
        </footer>
      </div>
    </div>
  )
}

export default App
