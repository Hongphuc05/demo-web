import { useState } from 'react'

/**
 * Component hiển thị lịch sử phân tích
 * Lưu tối đa 10 items, hiển thị item mới nhất ở trên
 */
function History({ history }) {
  const [expandedId, setExpandedId] = useState(null)

  // Toggle mở/đóng chi tiết
  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id)
  }

  // Render sentiment badge
  const getSentimentBadge = (sentiment) => {
    return (
      <span className="inline-block px-2 py-1 rounded-md text-xs bg-slate-100 text-slate-700 border border-slate-300">
        {sentiment}
      </span>
    )
  }

  // Render topic badge
  const getTopicBadge = (topic) => {
    return (
      <span className="inline-block px-2 py-1 rounded-md text-xs bg-slate-100 text-slate-700 border border-slate-300">
        {topic}
      </span>
    )
  }

  // Truncate text
  const truncateText = (text, maxLength = 60) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  return (
    <div className="card sticky top-4">
      <h2 className="text-xl font-semibold text-slate-900 mb-4">
        History
      </h2>

      {/* Empty State */}
      {history.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-400 text-sm">No analysis history yet</p>
          <p className="text-xs text-slate-400 mt-1">
            Results will appear here
          </p>
        </div>
      )}

      {/* History List */}
      {history.length > 0 && (
        <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
          {history.map((item) => (
            <div
              key={item.id}
              className="bg-slate-50 rounded-lg border border-slate-200 hover:border-slate-400 transition-all duration-200 cursor-pointer overflow-hidden hover:shadow-sm"
              onClick={() => toggleExpand(item.id)}
            >
              {/* Header */}
              <div className="p-3">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-sm text-slate-700 flex-1">
                    {expandedId === item.id ? item.text : truncateText(item.text)}
                  </p>
                  <span className="text-slate-400 text-xs ml-2">
                    {expandedId === item.id ? '▼' : '▶'}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 items-center">
                  {getSentimentBadge(item.sentiment)}
                  {getTopicBadge(item.topic)}
                </div>

                {/* Timestamp */}
                {expandedId === item.id && (
                  <div className="mt-3 pt-3 border-t border-slate-200">
                    <p className="text-xs text-slate-500">
                      {item.timestamp}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Counter */}
      {history.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-200">
          <p className="text-xs text-slate-500 text-center">
            {history.length} of 10 results
          </p>
        </div>
      )}
    </div>
  )
}

export default History
