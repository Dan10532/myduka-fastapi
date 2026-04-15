import React from 'react'

const Input = ({ label, type = 'text', value, onChange, required, placeholder, as: Tag = 'input', children, ...props }) => {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium mb-1.5" style={{ color: '#a5a3b0' }}>{label}</label>
      )}
      {Tag === 'select' ? (
        <select
          value={value}
          onChange={onChange}
          required={required}
          className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-indigo-500/40"
          style={{ background: '#0f0f13', border: '1px solid #2e2d3d', color: '#e8e6f0' }}
          {...props}
        >
          {children}
        </select>
      ) : (
        <input
          type={type}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-indigo-500/40"
          style={{ background: '#0f0f13', border: '1px solid #2e2d3d', color: '#e8e6f0' }}
          {...props}
        />
      )}
    </div>
  )
}

export default Input