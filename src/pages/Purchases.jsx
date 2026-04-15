import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, ShoppingCart, Pencil, Trash2 } from 'lucide-react'
import { getPurchases, createPurchase, updatePurchase, deletePurchase } from '../services/api'
import Modal from '../components/Modal'
import Input from '../components/Input'
import Button from '../components/Button'
import Toast from '../components/Toast'

const emptyForm = { product_id: '', stock_quantity: '' }

const Purchases = () => {
  const [purchases, setPurchases] = useState([])
  const [showAdd, setShowAdd] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [editForm, setEditForm] = useState({ id: '', ...emptyForm })
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)
  const tableRef = useRef(null)
  const dtRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
  const token = localStorage.getItem('token')
  if (token) {
    getPurchases()
  }
}, [])

  const fetchPurchases = async () => {
    try {
      const res = await getPurchases()
      setPurchases(res.data)
      setTimeout(() => {
        if (window.$ && tableRef.current) {
          if (dtRef.current) dtRef.current.destroy()
          dtRef.current = window.$(tableRef.current).DataTable({ responsive: true })
        }
      }, 100)
    } catch { setToast({ message: 'Failed to load purchases', type: 'error' }) }
  }

  const handleAdd = async (e) => {
    e.preventDefault(); setLoading(true)
    try {
      await createPurchase({ product_id: Number(form.product_id), stock_quantity: Number(form.stock_quantity), created_at: new Date().toISOString() })
      setToast({ message: 'Purchase recorded!', type: 'success' })
      setForm(emptyForm); setShowAdd(false); fetchPurchases()
    } catch { setToast({ message: 'Failed to add purchase', type: 'error' }) }
    finally { setLoading(false) }
  }

  const handleEdit = async (e) => {
    e.preventDefault(); setLoading(true)
    try {
      await updatePurchase(editForm.id, { product_id: Number(editForm.product_id), stock_quantity: Number(editForm.stock_quantity) })
      setToast({ message: 'Purchase updated!', type: 'success' })
      setShowEdit(false); fetchPurchases()
    } catch { setToast({ message: 'Failed to update purchase', type: 'error' }) }
    finally { setLoading(false) }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this purchase?')) return
    try {
      await deletePurchase(id)
      setToast({ message: 'Purchase deleted', type: 'success' }); fetchPurchases()
    } catch { setToast({ message: 'Failed to delete', type: 'error' }) }
  }

  const openEdit = (p) => { setEditForm({ id: p.id, product_id: p.product_id, stock_quantity: p.stock_quantity }); setShowEdit(true) }
  const fmt = (d) => new Date(d).toLocaleString()

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500/15 rounded-xl flex items-center justify-center">
            <ShoppingCart size={20} className="text-emerald-400" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-white">Purchases</h1>
            <p className="text-sm" style={{ color: '#6b6980' }}>Track your stock purchases</p>
          </div>
        </div>
        <Button onClick={() => setShowAdd(true)} className="flex items-center gap-2">
          <Plus size={16} /> Add Purchase
        </Button>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ background: '#1a1a24', border: '1px solid #2e2d3d' }}>
        <div className="p-6 overflow-x-auto">
          <table ref={tableRef} className="w-full text-sm" id="purchasesTable" style={{ color: '#c8c6d8' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #2e2d3d' }}>
                {['ID', 'Product ID', 'Stock Qty', 'Recorded At', 'Actions'].map(h => (
                  <th key={h} className="text-left py-3 px-4 font-semibold text-xs uppercase tracking-wider" style={{ color: '#6b6980' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {purchases.map((p) => (
                <tr key={p.id} className="transition-colors hover:bg-white/[0.03]" style={{ borderBottom: '1px solid #1e1d2a' }}>
                  <td className="py-3.5 px-4 font-mono text-xs text-gray-500">#{p.id}</td>
                  <td className="py-3.5 px-4 text-indigo-400 font-medium">#{p.product_id}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-500/15 text-emerald-400">{p.stock_quantity} units</span>
                  </td>
                  <td className="py-3.5 px-4 text-xs" style={{ color: '#6b6980' }}>{fmt(p.created_at)}</td>
                  <td className="py-3.5 px-4">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(p)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-500/15 text-amber-400 hover:bg-amber-500/25 transition-all cursor-pointer">
                        <Pencil size={12} /> Edit
                      </button>
                      <button onClick={() => handleDelete(p.id)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/15 text-red-400 hover:bg-red-500/25 transition-all cursor-pointer">
                        <Trash2 size={12} /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {purchases.length === 0 && (
                <tr><td colSpan={5} className="py-12 text-center" style={{ color: '#4a4860' }}>No purchases yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Record Purchase" accentColor="indigo">
        <form onSubmit={handleAdd}>
          <Input label="Product ID" type="number" value={form.product_id} onChange={e => setForm({ ...form, product_id: e.target.value })} placeholder="Enter product ID" required />
          <Input label="Stock Quantity" type="number" value={form.stock_quantity} onChange={e => setForm({ ...form, stock_quantity: e.target.value })} placeholder="Units purchased" required />
          <Button size="full" type="submit" disabled={loading} className="mt-2">{loading ? 'Saving…' : 'Save Purchase'}</Button>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={showEdit} onClose={() => setShowEdit(false)} title="Edit Purchase" accentColor="amber">
        <form onSubmit={handleEdit}>
          <Input label="Product ID" type="number" value={editForm.product_id} onChange={e => setEditForm({ ...editForm, product_id: e.target.value })} required />
          <Input label="Stock Quantity" type="number" value={editForm.stock_quantity} onChange={e => setEditForm({ ...editForm, stock_quantity: e.target.value })} required />
          <Button variant="warning" size="full" type="submit" disabled={loading} className="mt-2">{loading ? 'Updating…' : 'Update Purchase'}</Button>
        </form>
      </Modal>
    </div>
  )
}

export default Purchases