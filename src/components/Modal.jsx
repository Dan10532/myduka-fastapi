import React from 'react'
import { X } from 'lucide-react'

const Modal = ({ isOpen, onClose, title, accentColor = 'indigo', children }) => {
  if (!isOpen) return null

  const accents = {
    indigo: 'from-indigo-600 to-violet-600',
    amber: 'from-amber-500 to-orange-500',
    red: 'from-red-600 to-rose-600',
    emerald: 'from-emerald-600 to-teal-600',
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box w-full max-w-md mx-4">
        <div className="rounded-2xl overflow-hidden" style={{ background: '#1a1a24', border: '1px solid #2e2d3d' }}>
          {/* Header */}
          <div className={`bg-gradient-to-r ${accents[accentColor]} px-6 py-4 flex items-center justify-between`}>
            <h2 className="font-display text-white font-semibold text-lg">{title}</h2>
            <button onClick={onClose} className="text-white/70 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10">
              <X size={18} />
            </button>
          </div>
          {/* Body */}
          <div className="px-6 py-5">{children}</div>
        </div>
      </div>
    </div>
  )
}

export default Modal