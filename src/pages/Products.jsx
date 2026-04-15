import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Package } from 'lucide-react'
import { getProducts, createProduct } from '../services/api'
import Modal from '../components/Modal'
import Input from '../components/Input'
import Button from '../components/Button'
import Toast from '../components/Toast'

const Products = () => {
  const [products, setProducts] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ name: '', buying_price: '', selling_price: '' })
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)
  const tableRef = useRef(null)
  const dtRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!localStorage.getItem('token')) { navigate('/login'); return }
    fetchProducts()
  }, [])

  useEffect(() => {
    if (products.length > 0 && window.$) {
      if (dtRef.current) dtRef.current.destroy()
      dtRef.current = window.$(tableRef.current).DataTable({ responsive: true })
    }
  }, [products])

  const fetchProducts = async () => {
    try {
      const res = await getProducts()
      setProducts(res.data)
    } catch { setToast({ message: 'Failed to load products', type: 'error' }) }
  }

  const handleAdd = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await createProduct({
        name: form.name,
        buying_price: Number(form.buying_price),
        selling_price: Number(form.selling_price),
      })
      setToast({ message: 'Product added successfully!', type: 'success' })
      setForm({ name: '', buying_price: '', selling_price: '' })
      setShowModal(false)
      fetchProducts()
    } catch { setToast({ message: 'Failed to add product', type: 'error' }) }
    finally { setLoading(false) }
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-500/15 rounded-xl flex items-center justify-center">
            <Package size={20} className="text-indigo-400" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-white">Products</h1>
            <p className="text-sm" style={{ color: '#6b6980' }}>Manage your store catalogue</p>
          </div>
        </div>
        <Button onClick={() => setShowModal(true)} className="flex items-center gap-2">
          <Plus size={16} /> Add Product
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ background: '#1a1a24', border: '1px solid #2e2d3d' }}>
        <div className="p-6">
          <table ref={tableRef} className="w-full text-sm" id="productsTable" style={{ color: '#c8c6d8' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #2e2d3d' }}>
                {['ID', 'Product Name', 'Buying Price (KSh)', 'Selling Price (KSh)'].map(h => (
                  <th key={h} className="text-left py-3 px-4 font-semibold text-xs uppercase tracking-wider" style={{ color: '#6b6980' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr
                  key={p.id}
                  className="transition-colors hover:bg-white/[0.03]"
                  style={{ borderBottom: '1px solid #1e1d2a' }}
                >
                  <td className="py-3.5 px-4 font-mono text-xs text-gray-500">#{p.id}</td>
                  <td className="py-3.5 px-4 font-medium text-white">{p.name}</td>
                  <td className="py-3.5 px-4">
                    <span className="text-emerald-400">{Number(p.buying_price).toLocaleString()}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-indigo-400">{Number(p.selling_price).toLocaleString()}</span>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-12 text-center" style={{ color: '#4a4860' }}>
                    No products yet. Add your first product!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add New Product" accentColor="indigo">
        <form onSubmit={handleAdd}>
          <Input label="Product Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Maize Flour 2kg" required />
          <Input label="Buying Price (KSh)" type="number" value={form.buying_price} onChange={e => setForm({ ...form, buying_price: e.target.value })} placeholder="0.00" required />
          <Input label="Selling Price (KSh)" type="number" value={form.selling_price} onChange={e => setForm({ ...form, selling_price: e.target.value })} placeholder="0.00" required />
          <Button size="full" type="submit" disabled={loading} className="mt-2">
            {loading ? 'Adding…' : 'Add Product'}
          </Button>
        </form>
      </Modal>
    </div>
  )
}

export default Products