import { useEffect, useState } from 'react'
import api from '../../utils/api'
import toast from 'react-hot-toast'

const CATEGORIES = ['Rings','Necklaces','Earrings','Bracelets','Bangles','Pendants','Chains','Sets','Anklets']
const METALS     = ['Gold','Silver','Platinum','Diamond']
const PURITIES   = ['22K','18K','14K','24K','925','999','NA']

const METAL_COLORS = {
  Gold: 'bg-amber-100 text-amber-700',
  Silver: 'bg-gray-100 text-gray-600',
  Platinum: 'bg-blue-100 text-blue-700',
  Diamond: 'bg-purple-100 text-purple-700',
}

const Field = ({ label, children }) => (
  <div>
    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">{label}</label>
    {children}
  </div>
)

const inputCls = "w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#7f1d4a]/30 focus:border-[#7f1d4a] bg-white"

const EMPTY_FORM = {
  name: '', description: '', category: 'Rings', metal: 'Gold',
  purity: '22K', weight: '', makingCharges: '', makingChargesType: 'percentage',
  stock: '', images: []
}

const Products = () => {
  const [products, setProducts]       = useState([])
  const [loading, setLoading]         = useState(true)
  const [showModal, setShowModal]     = useState(false)
  const [editingProduct, setEditing]  = useState(null)
  const [saving, setSaving]           = useState(false)
  const [search, setSearch]           = useState('')
  const [catFilter, setCatFilter]     = useState('')
  const [formData, setFormData]       = useState(EMPTY_FORM)

  useEffect(() => { fetchProducts() }, [])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const res = await api.get('/products?limit=200')
      setProducts(res.data.products || [])
    } catch { toast.error('Failed to load products') }
    finally { setLoading(false) }
  }

  const set = (e) => setFormData(p => ({ ...p, [e.target.name]: e.target.value }))

  const openAdd = () => { setEditing(null); setFormData(EMPTY_FORM); setShowModal(true) }
  const openEdit = (product) => {
    setEditing(product)
    setFormData({
      name: product.name, description: product.description,
      category: product.category, metal: product.metal,
      purity: product.purity, weight: product.weight,
      makingCharges: product.makingCharges,
      makingChargesType: product.makingChargesType,
      stock: product.stock, images: product.images || []
    })
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editingProduct) {
        await api.put(`/products/${editingProduct._id}`, formData)
        toast.success('Product updated')
      } else {
        await api.post('/products', formData)
        toast.success('Product created')
      }
      setShowModal(false)
      fetchProducts()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save product')
    } finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return
    try {
      await api.delete(`/products/${id}`)
      toast.success('Product deleted')
      // Remove from local state immediately for instant UI feedback
      setProducts(prev => prev.filter(p => p._id !== id))
    } catch (err) {
      console.error('Delete error:', err)
      toast.error(err.response?.data?.message || 'Failed to delete — check you are logged in as admin')
    }
  }

  const addImageUrl = () => {
    const url = prompt('Enter image URL:')
    if (url) setFormData(p => ({ ...p, images: [...p.images, { url, alt: p.name }] }))
  }

  // Handle local file upload — convert to base64 data URL
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    files.forEach(file => {
      if (!file.type.startsWith('image/')) return
      const reader = new FileReader()
      reader.onload = (ev) => {
        setFormData(p => ({
          ...p,
          images: [...p.images, { url: ev.target.result, alt: p.name || file.name }]
        }))
      }
      reader.readAsDataURL(file)
    })
    // Reset input so same file can be re-selected
    e.target.value = ''
  }

  const filtered = products.filter(p => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.productId?.toLowerCase().includes(search.toLowerCase())
    const matchCat = !catFilter || p.category === catFilter
    return matchSearch && matchCat
  })

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-sm text-gray-500 mt-1">{products.length} products in store</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-[#7f1d4a] hover:bg-[#6b1840] text-white font-semibold px-4 py-2.5 rounded-xl transition-colors text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text" placeholder="Search products…" value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#7f1d4a]/30"
          />
        </div>
        <select
          value={catFilter} onChange={e => setCatFilter(e.target.value)}
          className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#7f1d4a]/30 bg-white"
        >
          <option value="">All Categories</option>
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-[#7f1d4a]/20 border-t-[#7f1d4a] rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center text-gray-400 text-sm">No products found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Product</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Category</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Metal</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Weight</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Price</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Stock</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(product => (
                  <tr key={product._id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.images?.[0]?.url || 'https://placehold.co/48x48/f5f0eb/b8860b?text=J'}
                          alt={product.name}
                          className="w-11 h-11 rounded-xl object-cover flex-shrink-0 border border-gray-100"
                          onError={e => { e.target.src = 'https://placehold.co/48x48/f5f0eb/b8860b?text=J' }}
                        />
                        <div>
                          <p className="font-semibold text-gray-800 text-sm leading-tight">{product.name}</p>
                          <p className="text-xs text-gray-400 font-mono mt-0.5">{product.productId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs bg-[#7f1d4a]/10 text-[#7f1d4a] font-semibold px-2.5 py-1 rounded-full">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${METAL_COLORS[product.metal] || 'bg-gray-100 text-gray-600'}`}>
                        {product.metal} {product.purity !== 'NA' ? product.purity : ''}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-600 text-sm">{product.weight}g</td>
                    <td className="px-5 py-3.5 font-bold text-gray-800">
                      {product.price ? `₹${product.price.toLocaleString('en-IN')}` : '—'}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        product.stock === 0 ? 'bg-red-100 text-red-600'
                        : product.stock <= 5 ? 'bg-amber-100 text-amber-700'
                        : 'bg-green-100 text-green-700'
                      }`}>
                        {product.stock === 0 ? 'Out of stock' : `${product.stock} left`}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEdit(product)}
                          className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
              <h2 className="text-lg font-bold text-gray-900">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <Field label="Product Name *">
                <input type="text" name="name" value={formData.name} onChange={set} required className={inputCls} placeholder="e.g. Classic 22K Gold Ring" />
              </Field>

              <Field label="Description *">
                <textarea name="description" value={formData.description} onChange={set} required rows={3}
                  className={inputCls + ' resize-none'} placeholder="Describe the product…" />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Category *">
                  <select name="category" value={formData.category} onChange={set} required className={inputCls}>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </Field>
                <Field label="Metal *">
                  <select name="metal" value={formData.metal} onChange={set} required className={inputCls}>
                    {METALS.map(m => <option key={m}>{m}</option>)}
                  </select>
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Purity *">
                  <select name="purity" value={formData.purity} onChange={set} required className={inputCls}>
                    {PURITIES.map(p => <option key={p}>{p}</option>)}
                  </select>
                </Field>
                <Field label="Weight (grams) *">
                  <input type="number" name="weight" value={formData.weight} onChange={set} required min="0" step="0.01" className={inputCls} placeholder="e.g. 5.5" />
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Making Charges *">
                  <input type="number" name="makingCharges" value={formData.makingCharges} onChange={set} required min="0" step="0.01" className={inputCls} placeholder="e.g. 12" />
                </Field>
                <Field label="Charges Type *">
                  <select name="makingChargesType" value={formData.makingChargesType} onChange={set} required className={inputCls}>
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed (₹)</option>
                  </select>
                </Field>
              </div>

              <Field label="Stock *">
                <input type="number" name="stock" value={formData.stock} onChange={set} required min="0" className={inputCls} placeholder="e.g. 10" />
              </Field>

              {/* Images */}
              <Field label="Images">
                {/* Upload buttons */}
                <div className="flex gap-2 mb-3 flex-wrap">
                  {/* File upload */}
                  <label className="flex items-center gap-2 text-sm text-white font-semibold bg-[#7f1d4a] hover:bg-[#6b1840] px-3 py-2 rounded-xl transition-colors cursor-pointer">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Upload from Device
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                  {/* URL option */}
                  <button type="button" onClick={addImageUrl}
                    className="flex items-center gap-2 text-sm text-[#7f1d4a] font-semibold border border-[#7f1d4a]/30 hover:bg-[#7f1d4a]/5 px-3 py-2 rounded-xl transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    Add Image URL
                  </button>
                </div>

                {/* Image previews */}
                {formData.images.length > 0 ? (
                  <div className="flex flex-wrap gap-3">
                    {formData.images.map((img, i) => (
                      <div key={i} className="relative group">
                        <img
                          src={img.url}
                          alt={img.alt}
                          className="w-20 h-20 object-cover rounded-xl border border-gray-200 shadow-sm"
                          onError={e => { e.target.src = 'https://placehold.co/80x80/f5f0eb/b8860b?text=IMG' }}
                        />
                        <button
                          type="button"
                          onClick={() => setFormData(p => ({ ...p, images: p.images.filter((_, idx) => idx !== i) }))}
                          className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow"
                        >×</button>
                        {i === 0 && (
                          <span className="absolute bottom-1 left-1 text-[9px] bg-black/60 text-white px-1 rounded">Main</span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center text-gray-400 text-sm">
                    No images added yet. Upload from device or add a URL.
                  </div>
                )}
              </Field>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
                <button type="button" onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 text-sm font-semibold text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  className="px-5 py-2.5 text-sm font-semibold bg-[#7f1d4a] hover:bg-[#6b1840] disabled:opacity-60 text-white rounded-xl transition-colors flex items-center gap-2">
                  {saving && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                  {editingProduct ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Products
