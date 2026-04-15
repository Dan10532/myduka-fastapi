import React, { useState } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import {
  LayoutDashboard, Package, ShoppingCart, BarChart3,
  LogOut, Menu, X, Store, Home, LogIn, UserPlus
} from 'lucide-react'

const Navbar = () => {
  const { isLoggedIn, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
    setMobileOpen(false)
  }

  const navLinks = isLoggedIn
    ? [
        { to: '/', label: 'Home', icon: Home },
        { to: '/products', label: 'Products', icon: Package },
        { to: '/purchases', label: 'Purchases', icon: ShoppingCart },
        { to: '/sales', label: 'Sales', icon: BarChart3 },
        { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      ]
    : [
        { to: '/', label: 'Home', icon: Home },
        { to: '/login', label: 'Login', icon: LogIn },
        { to: '/register', label: 'Register', icon: UserPlus },
      ]

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-40 px-6 py-3 flex items-center justify-between"
      style={{
        background: 'rgba(15,15,19,0.85)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2.5 group">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-900/40">
          <Store size={16} className="text-white" />
        </div>
        <span className="font-display font-bold text-lg text-white tracking-tight">
          MyDuka <span className="text-indigo-400">POS</span>
        </span>
      </Link>

      {/* Desktop nav */}
      <div className="hidden md:flex items-center gap-1">
        {navLinks.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'text-indigo-400 bg-indigo-500/10'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`
            }
          >
            <Icon size={15} />
            {label}
          </NavLink>
        ))}

        {isLoggedIn && (
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200 ml-1 cursor-pointer"
          >
            <LogOut size={15} />
            Logout
          </button>
        )}
      </div>

      {/* Mobile toggle */}
      <button
        className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="absolute top-full left-0 right-0 md:hidden py-3 px-4 flex flex-col gap-1"
          style={{ background: '#0f0f13', borderBottom: '1px solid #1e1d2a' }}
        >
          {navLinks.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium ${
                  isActive ? 'text-indigo-400 bg-indigo-500/10' : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
          {isLoggedIn && (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 text-left cursor-pointer"
            >
              <LogOut size={16} />
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  )
}

export default Navbar