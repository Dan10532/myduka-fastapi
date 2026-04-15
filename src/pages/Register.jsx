import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Store, UserPlus } from 'lucide-react'
import { registerUser } from '../services/api'
import Input from '../components/Input'
import Button from '../components/Button'
import Toast from '../components/Toast'

const Register = () => {
  const [form, setForm] = useState({ fullname: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {

      console.log("Submitting registration with data:", form) 
      await registerUser(form)
      setToast({ message: 'Registration successful! Please login.', type: 'success' })
      setTimeout(() => navigate('/login'), 1200)
    } catch (error) {
      setToast({ message: error.response?.data?.detail || 'Registration failed', type: 'error' })
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
          <div className="bg-gradient-to-br from-emerald-600 to-teal-700 px-8 py-8 text-center">
            <div className="w-14 h-14 bg-white/15 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Store size={28} className="text-white" />
            </div>
            <h1 className="font-display text-2xl font-bold text-white">Create Account</h1>
            <p className="text-emerald-200 text-sm mt-1">Join MyDuka POS today</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-8 py-7">
            <Input
              label="Full Name"
              value={form.fullname}
              onChange={e => setForm({ ...form, fullname: e.target.value })}
              placeholder="John Doe"
              required
            />
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
              placeholder="Create a strong password"
              required
            />
            <Button variant="emerald" size="full" type="submit" disabled={loading} className="mt-2 flex items-center justify-center gap-2">
              {loading ? 'Creating account…' : <><UserPlus size={16} /> Create Account</>}
            </Button>
            <p className="text-center text-sm mt-5" style={{ color: '#6b6980' }}>
              Already have an account?{' '}
              <Link to="/login" className="text-emerald-400 hover:text-emerald-300 font-medium">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Register