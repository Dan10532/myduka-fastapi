import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, BarChart3, Pencil, Trash2 } from 'lucide-react'
import { getSales, createSale, updateSale, deleteSale, getProducts } from '../services/api'
import Modal from '../components/Modal'
import Input from '../components/Input'
import Button from '../components/Button'
import Toast from '../components/Toast'

const emptySale = { product_id: '', quantity: '' }

const Sales = () => {
  const [sales, setSales] = useState([])
  const [products, setProducts] = useState([])
  const [showAdd, setShowAdd] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [form, setForm] = useState(emptySale)
  const [editForm, setEditForm] = useState({ id: '', ...emptySale })
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)
  const tableRef = useRef(null)
  const dtRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!localStorage.getItem('token')) { navigate('/login'); return }
    fetchAll()
  }, [])

  const fetchAll = async () => {
    try {
      const [sRes, pRes] = await Promise.all([getSales(), getProducts()])
      setSales(sRes.data); setProducts(pRes.data)
      setTimeout(() => {
        if (window.$ && tableRef.current) {
          if (dtRef.current) dtRef.current.destroy()
          dtRef.current = window.$(tableRef.current).DataTable({ responsive: true })
        }
      }, 100)
    } catch { setToast({ message: 'Failed to load data', type: 'error' }) }
  }

  const getProductName = (id) => products.find(p => p.id === id)?.name || `#${id}`

  const handleAdd = async (e) => {
    e.preventDefault(); setLoading(true)
    try {
      await createSale({ product_id: Number(form.product_id), quantity: Number(form.quantity) })
      setToast({ message: 'Sale recorded!', type: 'success' })
      setForm(emptySale); setShowAdd(false); fetchAll()
    } catch { setToast({ message: 'Failed to record sale', type: 'error' }) }
    finally { setLoading(false) }
  }

  const handleEdit = async (e) => {
    e.preventDefault(); setLoading(true)
    try {
      await updateSale(editForm.id, { product_id: Number(editForm.product_id), quantity: Number(editForm.quantity) })
      setToast({ message: 'Sale updated!', type: 'success' })
      setShowEdit(false); fetchAll()
    } catch { setToast({ message: 'Failed to update sale', type: 'error' }) }
    finally { setLoading(false) }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this sale?')) return
    try {
      await deleteSale(id)
      setToast({ message: 'Sale deleted', type: 'success' }); fetchAll()
    } catch { setToast({ message: 'Failed to delete', type: 'error' }) }
  }

  const openEdit = (s) => { setEditForm({ id: s.id, product_id: s.product_id, quantity: s.quantity }); setShowEdit(true) }
  const fmt = (d) => new Date(d).toLocaleString()

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-500/15 rounded-xl flex items-center justify-center">
            <BarChart3 size={20} className="text-amber-400" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-white">Sales</h1>
            <p className="text-sm" style={{ color: '#6b6980' }}>Record and manage daily sales</p>
          </div>
        </div>
        <Button onClick={() => setShowAdd(true)} className="flex items-center gap-2">
          <Plus size={16} /> New Sale
        </Button>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ background: '#1a1a24', border: '1px solid #2e2d3d' }}>
        <div className="p-6 overflow-x-auto">
          <table ref={tableRef} className="w-full text-sm" id="salesTable" style={{ color: '#c8c6d8' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #2e2d3d' }}>
                {['ID', 'Product', 'Quantity', 'Date', 'Actions'].map(h => (
                  <th key={h} className="text-left py-3 px-4 font-semibold text-xs uppercase tracking-wider" style={{ color: '#6b6980' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sales.map((s) => (
                <tr key={s.id} className="transition-colors hover:bg-white/[0.03]" style={{ borderBottom: '1px solid #1e1d2a' }}>
                  <td className="py-3.5 px-4 font-mono text-xs text-gray-500">#{s.id}</td>
                  <td className="py-3.5 px-4 font-medium text-white">{getProductName(s.product_id)}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-500/15 text-amber-400">{s.quantity} units</span>
                  </td>
                  <td className="py-3.5 px-4 text-xs" style={{ color: '#6b6980' }}>{fmt(s.created_at)}</td>
                  <td className="py-3.5 px-4">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(s)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-500/15 text-amber-400 hover:bg-amber-500/25 transition-all cursor-pointer">
                        <Pencil size={12} /> Edit
                      </button>
                      <button onClick={() => handleDelete(s.id)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/15 text-red-400 hover:bg-red-500/25 transition-all cursor-pointer">
                        <Trash2 size={12} /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {sales.length === 0 && (
                <tr><td colSpan={5} className="py-12 text-center" style={{ color: '#4a4860' }}>No sales recorded yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Record Sale" accentColor="indigo">
        <form onSubmit={handleAdd}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1.5" style={{ color: '#a5a3b0' }}>Select Product</label>
            <select
              value={form.product_id}
              onChange={e => setForm({ ...form, product_id: e.target.value })}
              required
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/40"
              style={{ background: '#0f0f13', border: '1px solid #2e2d3d', color: '#e8e6f0' }}
            >
              <option value="">— Choose a product —</option>
              {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <Input label="Quantity" type="number" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} placeholder="Units sold" required />
          <Button size="full" type="submit" disabled={loading} className="mt-2">{loading ? 'Saving…' : 'Save Sale'}</Button>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={showEdit} onClose={() => setShowEdit(false)} title="Edit Sale" accentColor="amber">
        <form onSubmit={handleEdit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1.5" style={{ color: '#a5a3b0' }}>Select Product</label>
            <select
              value={editForm.product_id}
              onChange={e => setEditForm({ ...editForm, product_id: e.target.value })}
              required
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/40"
              style={{ background: '#0f0f13', border: '1px solid #2e2d3d', color: '#e8e6f0' }}
            >
              <option value="">— Choose a product —</option>
              {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <Input label="Quantity" type="number" value={editForm.quantity} onChange={e => setEditForm({ ...editForm, quantity: e.target.value })} required />
          <Button variant="warning" size="full" type="submit" disabled={loading} className="mt-2">{loading ? 'Updating…' : 'Update Sale'}</Button>
        </form>
      </Modal>
    </div>
  )
}

export default Sales