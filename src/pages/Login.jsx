import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Store, LogIn } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { loginUser } from '../services/api'
import Input from '../components/Input'
import Button from '../components/Button'
import Toast from '../components/Toast'

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await loginUser(form)
      login(res.data.access_token)
      setToast({ message: 'Login successful! Redirecting…', type: 'success' })
      setTimeout(() => navigate('/products'), 1000)
    } catch {
      setToast({ message: 'Invalid email or password', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-12">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <div className="w-full max-w-md">
        <div
          className="rounded-2xl overflow-hidden shadow-2xl"
          style={{ background: '#1a1a24', border: '1px solid #2e2d3d' }}
        >
          {/* Header */}
          <div className="bg-gradient-to-br from-indigo-600 to-violet-700 px-8 py-8 text-center">
            <div className="w-14 h-14 bg-white/15 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Store size={28} className="text-white" />
            </div>
            <h1 className="font-display text-2xl font-bold text-white">Welcome Back</h1>
            <p className="text-indigo-200 text-sm mt-1">Sign in to MyDuka POS</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-8 py-7">
            <Input
              label="Email Address"
              type="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
              required
            />
            <Input
              label="Password"
              type="password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
              required
            />
            <Button size="full" type="submit" disabled={loading} className="mt-2 flex items-center justify-center gap-2">
              {loading ? 'Signing in…' : <><LogIn size={16} /> Sign In</>}
            </Button>
            <p className="text-center text-sm mt-5" style={{ color: '#6b6980' }}>
              Don't have an account?{' '}
              <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-medium">
                Register
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login