import { useEffect, useState } from 'react'
import api from '../../utils/api'
import toast from 'react-hot-toast'
import PageHeader from '../../components/ui/PageHeader'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'

const Products = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Rings',
    metal: 'Gold',
    purity: '22K',
    weight: '',
    makingCharges: '',
    makingChargesType: 'percentage',
    stock: '',
    images: []
  })

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products?limit=100')
      setProducts(res.data.products)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageAdd = () => {
    const url = prompt('Enter image URL:')
    if (url) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, { url, alt: prev.name }]
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingProduct) {
        await api.put(`/products/${editingProduct._id}`, formData)
        toast.success('Product updated successfully')
      } else {
        await api.post('/products', formData)
        toast.success('Product created successfully')
      }
      setShowModal(false)
      resetForm()
      fetchProducts()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save product')
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: 'Rings',
      metal: 'Gold',
      purity: '22K',
      weight: '',
      makingCharges: '',
      makingChargesType: 'percentage',
      stock: '',
      images: []
    })
    setEditingProduct(null)
  }

  const handleEdit = (product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      description: product.description,
      category: product.category,
      metal: product.metal,
      purity: product.purity,
      weight: product.weight,
      makingCharges: product.makingCharges,
      makingChargesType: product.makingChargesType,
      stock: product.stock,
      images: product.images || []
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return
    
    try {
      await api.delete(`/products/${id}`)
      toast.success('Product deleted successfully')
      fetchProducts()
    } catch (error) {
      toast.error('Failed to delete product')
    }
  }

  return (
    <div>
      <PageHeader
        eyebrow="Admin"
        title="Manage Products"
        subtitle="Create, update, and deactivate products shown in the storefront."
        right={
          <Button
            onClick={() => {
              resetForm()
              setShowModal(true)
            }}
          >
            Add Product
          </Button>
        }
      />

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500 mx-auto"></div>
        </div>
      ) : (
        <Card className="overflow-hidden border border-gray-100">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Metal</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Weight</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={product.images?.[0]?.url || 'https://via.placeholder.com/50'}
                        alt={product.name}
                        className="h-10 w-10 rounded-xl object-cover mr-3"
                      />
                      <div>
                        <div className="text-sm font-medium">{product.name}</div>
                        <div className="text-xs text-gray-500">{product.productId}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{product.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{product.metal} {product.purity}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{product.weight}g</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{product.stock}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <Button variant="secondary" size="sm" onClick={() => handleEdit(product)} className="mr-3">
                      Edit
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleDelete(product._id)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-lift">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">
                {editingProduct ? 'Edit Product' : 'Add Product'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input label="Name *" type="text" name="name" value={formData.name} onChange={handleInputChange} required />
                <div>
                  <label className="block text-sm font-medium mb-2">Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    className="input-field-square"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Category *</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                    >
                      <option value="Rings">Rings</option>
                      <option value="Necklaces">Necklaces</option>
                      <option value="Earrings">Earrings</option>
                      <option value="Bracelets">Bracelets</option>
                      <option value="Bangles">Bangles</option>
                      <option value="Pendants">Pendants</option>
                      <option value="Chains">Chains</option>
                      <option value="Sets">Sets</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Metal *</label>
                    <select
                      name="metal"
                      value={formData.metal}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                    >
                      <option value="Gold">Gold</option>
                      <option value="Silver">Silver</option>
                      <option value="Platinum">Platinum</option>
                      <option value="Diamond">Diamond</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Purity *</label>
                    <select
                      name="purity"
                      value={formData.purity}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                    >
                      <option value="22K">22K</option>
                      <option value="18K">18K</option>
                      <option value="14K">14K</option>
                      <option value="24K">24K</option>
                      <option value="925">925</option>
                      <option value="999">999</option>
                      <option value="NA">NA</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Weight (grams) *</label>
                    <input
                      type="number"
                      name="weight"
                      value={formData.weight}
                      onChange={handleInputChange}
                      required
                      min="0"
                      step="0.01"
                      className="input-field"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Making Charges *</label>
                    <input
                      type="number"
                      name="makingCharges"
                      value={formData.makingCharges}
                      onChange={handleInputChange}
                      required
                      min="0"
                      step="0.01"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Charges Type *</label>
                    <select
                      name="makingChargesType"
                      value={formData.makingChargesType}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                    >
                      <option value="percentage">Percentage</option>
                      <option value="fixed">Fixed Amount</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Stock *</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Images</label>
                  <Button type="button" onClick={handleImageAdd} variant="secondary" size="sm" className="mb-2">
                    Add Image URL
                  </Button>
                  <div className="space-y-2">
                    {formData.images.map((img, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <img src={img.url} alt={img.alt} className="h-16 w-16 object-cover rounded-xl border border-gray-100" />
                        <button
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({
                              ...prev,
                              images: prev.images.filter((_, i) => i !== index)
                            }))
                          }}
                          className="text-red-600 hover:text-red-700 text-sm font-semibold"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end space-x-4">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setShowModal(false)
                      resetForm()
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingProduct ? 'Update' : 'Create'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Products

