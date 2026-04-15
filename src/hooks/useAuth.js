import { useState, useEffect } from 'react'

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'))

  useEffect(() => {
    const check = () => setIsLoggedIn(!!localStorage.getItem('token'))
    window.addEventListener('storage', check)
    return () => window.removeEventListener('storage', check)
  }, [])

  const logout = () => {
    localStorage.removeItem('token')
    setIsLoggedIn(false)
  }

  const login = (token) => {
    localStorage.setItem('token', token)
    setIsLoggedIn(true)
  }

  return { isLoggedIn, logout, login }
}