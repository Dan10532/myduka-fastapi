import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { LayoutDashboard, TrendingUp, Package, ShoppingCart, BarChart3 } from 'lucide-react'
import { getDashboardData, getProducts, getPurchases, getSales } from '../services/api'
import Toast from '../components/Toast'

const StatCard = ({ icon: Icon, label, value, color, bg }) => (
  <div className="rounded-2xl p-5 flex items-center gap-4" style={{ background: '#1a1a24', border: '1px solid #2e2d3d' }}>
    <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center shrink-0`}>
      <Icon size={22} className={color} />
    </div>
    <div>
      <p className="text-xs uppercase tracking-wider font-medium mb-0.5" style={{ color: '#6b6980' }}>{label}</p>
      <p className="font-display text-2xl font-bold text-white">{value}</p>
    </div>
  </div>
)

const Dashboard = () => {
  const [chartData, setChartData] = useState({ labels: [], values: [] })
  const [stats, setStats] = useState({ products: 0, purchases: 0, sales: 0 })
  const [toast, setToast] = useState(null)
  const canvasRef = useRef(null)
  const chartRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!localStorage.getItem('token')) { navigate('/login'); return }
    fetchAll()
  }, [])

  useEffect(() => {
    if (chartData.labels.length > 0) renderChart()
  }, [chartData])

  const fetchAll = async () => {
    try {
      const [dashRes, pRes, purRes, sRes] = await Promise.all([
        getDashboardData(),
        getProducts(),
        getPurchases(),
        getSales(),
      ])
      setChartData({
        labels: dashRes.data[0]?.labels || [],
        values: dashRes.data[0]?.data || [],
      })
      setStats({
        products: pRes.data.length,
        purchases: purRes.data.length,
        sales: sRes.data.length,
      })
    } catch {
      setToast({ message: 'Failed to load dashboard data', type: 'error' })
    }
  }

  const renderChart = () => {
    if (!canvasRef.current || !window.Chart) return
    if (chartRef.current) chartRef.current.destroy()

    const ctx = canvasRef.current.getContext('2d')
    const gradient = ctx.createLinearGradient(0, 0, 0, 400)
    gradient.addColorStop(0, 'rgba(99, 102, 241, 0.6)')
    gradient.addColorStop(1, 'rgba(139, 92, 246, 0.05)')

    chartRef.current = new window.Chart(ctx, {
      type: 'bar',
      data: {
        labels: chartData.labels,
        datasets: [{
          label: 'Remaining Stock',
          data: chartData.values,
          backgroundColor: gradient,
          borderColor: '#6366f1',
          borderWidth: 2,
          borderRadius: 8,
          borderSkipped: false,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            labels: {
              color: '#a5a3b0',
              font: { family: 'DM Sans', size: 13 },
              boxWidth: 14,
              boxHeight: 14,
            },
          },
          tooltip: {
            backgroundColor: '#1a1a24',
            borderColor: '#2e2d3d',
            borderWidth: 1,
            titleColor: '#e8e6f0',
            bodyColor: '#a5a3b0',
            padding: 12,
            cornerRadius: 10,
          },
        },
        scales: {
          x: {
            ticks: { color: '#6b6980', font: { family: 'DM Sans', size: 12 } },
            grid: { color: 'rgba(255,255,255,0.04)' },
            border: { color: '#2e2d3d' },
          },
          y: {
            beginAtZero: true,
            ticks: { color: '#6b6980', font: { family: 'DM Sans', size: 12 } },
            grid: { color: 'rgba(255,255,255,0.04)' },
            border: { color: '#2e2d3d' },
          },
        },
      },
    })
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-violet-500/15 rounded-xl flex items-center justify-center">
          <LayoutDashboard size={20} className="text-violet-400" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-sm" style={{ color: '#6b6980' }}>Business overview at a glance</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard icon={Package} label="Total Products" value={stats.products} color="text-indigo-400" bg="bg-indigo-500/15" />
        <StatCard icon={ShoppingCart} label="Total Purchases" value={stats.purchases} color="text-emerald-400" bg="bg-emerald-500/15" />
        <StatCard icon={BarChart3} label="Total Sales" value={stats.sales} color="text-amber-400" bg="bg-amber-500/15" />
      </div>

      <div className="rounded-2xl p-6" style={{ background: '#1a1a24', border: '1px solid #2e2d3d' }}>
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp size={18} className="text-indigo-400" />
          <h2 className="font-display font-semibold text-white">Remaining Stock per Product</h2>
        </div>
        {chartData.labels.length > 0 ? (
          <canvas ref={canvasRef} height={100} />
        ) : (
          <div className="flex flex-col items-center justify-center py-20" style={{ color: '#4a4860' }}>
            <BarChart3 size={48} className="mb-3 opacity-30" />
            <p className="text-sm">No stock data available yet</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard