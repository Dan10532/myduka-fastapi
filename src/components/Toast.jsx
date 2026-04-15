import React, { useEffect } from 'react'
import { CheckCircle, XCircle, X } from 'lucide-react'

const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 3500)
    return () => clearTimeout(t)
  }, [onClose])

  return (
    <div
      className="fixed top-6 right-6 z-[100] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl"
      style={{
        background: type === 'success' ? '#14532d' : '#450a0a',
        border: `1px solid ${type === 'success' ? '#16a34a' : '#dc2626'}`,
        animation: 'slideUp 0.3s ease',
        minWidth: '260px',
      }}
    >
      {type === 'success' ? (
        <CheckCircle size={18} className="text-emerald-400 shrink-0" />
      ) : (
        <XCircle size={18} className="text-red-400 shrink-0" />
      )}
      <span className="text-sm flex-1" style={{ color: '#e8e6f0' }}>{message}</span>
      <button onClick={onClose} className="text-gray-400 hover:text-white ml-2 cursor-pointer">
        <X size={14} />
      </button>
    </div>
  )
}

export default Toast