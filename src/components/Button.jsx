import React from 'react'

const variants = {
  primary: 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-900/30',
  warning: 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white shadow-lg shadow-amber-900/30',
  danger: 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-lg shadow-red-900/30',
  ghost: 'bg-transparent border hover:bg-white/5 text-gray-300',
  emerald: 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-900/30',
}

const sizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
  full: 'w-full px-4 py-2.5 text-sm',
}

const Button = ({ variant = 'primary', size = 'md', children, className = '', ...props }) => {
  return (
    <button
      className={`${variants[variant]} ${sizes[size]} rounded-xl font-medium transition-all duration-200 active:scale-95 cursor-pointer disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button