import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import toast from 'react-hot-toast'
import PageHeader from '../components/ui/PageHeader'
import EmptyState from '../components/ui/EmptyState'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart()

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId)
      toast.success('Item removed from cart')
    } else {
      updateQuantity(productId, newQuantity)
    }
  }

  if (cartItems.length === 0) {
    return (
      <div className="container-page py-16">
        <EmptyState
          title="Your cart is empty"
          description="Start adding items to your cart to checkout."
          icon={
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          }
          primaryAction={{ as: Link, label: 'Continue Shopping', props: { to: '/products' } }}
        />
      </div>
    )
  }

  const subtotal = getCartTotal()
  const gst = subtotal * 0.03
  const total = subtotal + gst

  return (
    <div className="container-page py-12">
      <PageHeader eyebrow="Your Selection" title="Shopping Cart" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <Card key={item.productId} hover className="p-6 flex flex-col sm:flex-row gap-6">
              <div className="w-full sm:w-32 h-32 bg-gray-100 rounded-2xl overflow-hidden flex-shrink-0">
                <img
                  src={item.image || 'https://via.placeholder.com/200'}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
                <p className="text-sm text-gray-600 mb-2">
                  {item.metal} {item.purity} • {item.weight}g
                </p>
                <p className="text-xl font-bold text-gold-600 mb-4">
                  ₹{(item.price * item.quantity).toLocaleString()}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                      className="w-9 h-9 border border-gray-300 rounded-xl hover:bg-gray-50 focus-visible:ring-4 focus-visible:ring-gold-200"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="w-12 text-center font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                      className="w-9 h-9 border border-gray-300 rounded-xl hover:bg-gray-50 focus-visible:ring-4 focus-visible:ring-gold-200"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => {
                      removeFromCart(item.productId)
                      toast.success('Item removed from cart')
                    }}
                    className="text-red-600 hover:text-red-700 text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </Card>
          ))}

          <div className="pt-2">
            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                clearCart()
                toast.success('Cart cleared')
              }}
            >
              Clear Cart
            </Button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="p-6 sticky top-20">
            <h2 className="text-2xl font-serif font-bold text-[#7f1d4a] mb-6">Order Summary</h2>
            <div className="space-y-3 mb-4">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>GST (3%):</span>
                <span>₹{gst.toFixed(2)}</span>
              </div>
              <div className="border-t pt-3 flex justify-between font-bold text-xl">
                <span>Total:</span>
                <span className="text-gold-600">₹{total.toFixed(2)}</span>
              </div>
            </div>
            <Button as={Link} to="/checkout" className="w-full">
              Proceed to Checkout
            </Button>
            <Button as={Link} to="/products" variant="secondary" className="w-full mt-4">
              Continue Shopping
            </Button>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Cart

