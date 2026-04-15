import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0f0f13' }}>
      <Navbar />
      <main className="flex-1 pt-16">
        <Outlet />
      </main>
      <footer
        className="py-4 text-center text-xs"
        style={{ background: '#0a0a0e', borderTop: '1px solid #1a1a24', color: '#4a4860' }}
      >
        © 2025 MyDuka POS — Smart Business Management
      </footer>
    </div>
  )
}

export default Layout