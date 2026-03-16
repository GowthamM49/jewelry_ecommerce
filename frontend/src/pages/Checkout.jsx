import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'
import toast from 'react-hot-toast'
import PageHeader from '../components/ui/PageHeader'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

const Checkout = () => {
  const navigate = useNavigate()
  const { cartItems, getCartTotal, clearCart } = useCart()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [shippingAddress, setShippingAddress] = useState({
    name: user?.name || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zipCode: user?.address?.zipCode || '',
    phone: user?.phone || ''
  })

  const subtotal = getCartTotal()
  const gst = subtotal * 0.03
  const total = subtotal + gst

  const handleInputChange = (e) => {
    setShippingAddress(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const orderData = {
        items: cartItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity
        })),
        shippingAddress,
        notes: ''
      }

      const res = await api.post('/orders', orderData)
      const orderNumber = res.data?.order?.orderNumber
      clearCart()
      navigate(`/order-success/${res.data.order._id}`, { state: { orderNumber } })
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to place order'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  if (cartItems.length === 0) {
    navigate('/cart')
    return null
  }

  return (
    <div className="container-page py-12">
      <PageHeader eyebrow="Complete Your Purchase" title="Checkout" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Shipping Form */}
        <div className="lg:col-span-2">
          <Card>
            <form onSubmit={handleSubmit} className="card-pad space-y-6">
              <h2 className="text-2xl font-serif font-bold text-[#7f1d4a] mb-2">Shipping Address</h2>
              <p className="text-sm text-gray-600">Enter where you’d like your order delivered.</p>
            
              <Input
                label="Full Name *"
                type="text"
                name="name"
                value={shippingAddress.name}
                onChange={handleInputChange}
                required
              />

              <Input
                label="Phone Number *"
                type="tel"
                name="phone"
                value={shippingAddress.phone}
                onChange={handleInputChange}
                required
              />

              <Input
                label="Street Address *"
                type="text"
                name="street"
                value={shippingAddress.street}
                onChange={handleInputChange}
                required
              />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="City *"
                type="text"
                name="city"
                value={shippingAddress.city}
                onChange={handleInputChange}
                required
              />
              <Input
                label="State *"
                type="text"
                name="state"
                value={shippingAddress.state}
                onChange={handleInputChange}
                required
              />
            </div>

              <Input
                label="ZIP Code *"
                type="text"
                name="zipCode"
                value={shippingAddress.zipCode}
                onChange={handleInputChange}
                required
              />

              <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> This is a demo checkout. No real payment will be processed.
                </p>
              </div>
            </form>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="p-6 sticky top-20">
            <h2 className="text-2xl font-serif font-bold text-[#7f1d4a] mb-6">Order Summary</h2>
            
            <div className="space-y-2 mb-4">
              {cartItems.map((item) => (
                <div key={item.productId} className="flex justify-between text-sm">
                  <span>{item.name} x{item.quantity}</span>
                  <span>₹{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>GST (3%):</span>
                <span>₹{gst.toFixed(2)}</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-bold text-xl">
                <span>Total:</span>
                <span className="text-gold-600">₹{total.toFixed(2)}</span>
              </div>
            </div>

            <Button onClick={handleSubmit} loading={loading} className="w-full mt-6" size="lg">
              Place Order
            </Button>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Checkout

