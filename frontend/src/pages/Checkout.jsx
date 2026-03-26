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

// ─── Payment Modal ────────────────────────────────────────────────────────────
const PAYMENT_METHODS = [
  { id: 'card',   label: 'Credit / Debit Card', icon: '💳' },
  { id: 'upi',    label: 'UPI',                 icon: '📱' },
  { id: 'wallet', label: 'Wallet',              icon: '👛' },
  { id: 'netbanking', label: 'Net Banking',     icon: '🏦' },
]

const SAMPLE_BANKS = ['State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Kotak Bank']

function PaymentModal({ total, onSuccess, onClose }) {
  const [method, setMethod]       = useState('card')
  const [step, setStep]           = useState('form')   // form | processing | success | failed
  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry]       = useState('')
  const [cvv, setCvv]             = useState('')
  const [cardName, setCardName]   = useState('')
  const [upiId, setUpiId]         = useState('')
  const [wallet, setWallet]       = useState('PhonePe')
  const [bank, setBank]           = useState(SAMPLE_BANKS[0])

  const fmt = (n) => n.toLocaleString('en-IN', { maximumFractionDigits: 0 })

  const formatCard = (v) => v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
  const formatExpiry = (v) => {
    const d = v.replace(/\D/g, '').slice(0, 4)
    return d.length >= 3 ? `${d.slice(0,2)}/${d.slice(2)}` : d
  }

  const validate = () => {
    if (method === 'card') {
      if (cardNumber.replace(/\s/g, '').length < 16) return 'Enter a valid 16-digit card number'
      if (expiry.length < 5) return 'Enter a valid expiry (MM/YY)'
      if (cvv.length < 3)    return 'Enter a valid CVV'
      if (!cardName.trim())  return 'Enter the name on card'
    }
    if (method === 'upi') {
      if (!upiId.includes('@')) return 'Enter a valid UPI ID (e.g. name@upi)'
    }
    return null
  }

  const handlePay = () => {
    const err = validate()
    if (err) { toast.error(err); return }
    setStep('processing')
    // Simulate network delay then always succeed (sample mode)
    setTimeout(() => {
      setStep('success')
      setTimeout(() => onSuccess(), 1200)
    }, 2500)
  }

  // ── Processing screen ──
  if (step === 'processing') return (
    <ModalShell onClose={null}>
      <div className="flex flex-col items-center py-10 gap-5">
        <div className="w-16 h-16 rounded-full border-4 border-[#7f1d4a] border-t-transparent animate-spin" />
        <p className="text-lg font-semibold text-gray-700">Processing Payment…</p>
        <p className="text-sm text-gray-400">Please do not close this window</p>
      </div>
    </ModalShell>
  )

  // ── Success screen ──
  if (step === 'success') return (
    <ModalShell onClose={null}>
      <div className="flex flex-col items-center py-10 gap-4">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-4xl">✅</div>
        <p className="text-xl font-bold text-green-700">Payment Successful!</p>
        <p className="text-sm text-gray-500">Placing your order…</p>
      </div>
    </ModalShell>
  )

  // ── Payment form ──
  return (
    <ModalShell onClose={onClose}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide">Sudha Jewelry</p>
          <p className="text-2xl font-bold text-[#7f1d4a]">₹{fmt(total)}</p>
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <span>🔒</span> Secure Checkout
        </div>
      </div>

      <div className="px-6 py-5 space-y-5">
        {/* Method tabs */}
        <div className="grid grid-cols-4 gap-2">
          {PAYMENT_METHODS.map(m => (
            <button
              key={m.id}
              onClick={() => setMethod(m.id)}
              className={`flex flex-col items-center gap-1 py-2 px-1 rounded-xl border text-xs font-medium transition-all
                ${method === m.id
                  ? 'border-[#7f1d4a] bg-[#7f1d4a]/5 text-[#7f1d4a]'
                  : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}
            >
              <span className="text-xl">{m.icon}</span>
              <span className="text-center leading-tight">{m.label}</span>
            </button>
          ))}
        </div>

        {/* Card form */}
        {method === 'card' && (
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Card Number</label>
              <input
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-[#7f1d4a]/30"
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={e => setCardNumber(formatCard(e.target.value))}
                maxLength={19}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Name on Card</label>
              <input
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#7f1d4a]/30"
                placeholder="RAHUL SHARMA"
                value={cardName}
                onChange={e => setCardName(e.target.value.toUpperCase())}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Expiry</label>
                <input
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#7f1d4a]/30"
                  placeholder="MM/YY"
                  value={expiry}
                  onChange={e => setExpiry(formatExpiry(e.target.value))}
                  maxLength={5}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">CVV</label>
                <input
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#7f1d4a]/30"
                  placeholder="•••"
                  type="password"
                  value={cvv}
                  onChange={e => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  maxLength={4}
                />
              </div>
            </div>
            <p className="text-xs text-gray-400">Sample: 4111 1111 1111 1111 · 12/26 · 123</p>
          </div>
        )}

        {/* UPI form */}
        {method === 'upi' && (
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">UPI ID</label>
              <input
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#7f1d4a]/30"
                placeholder="yourname@upi"
                value={upiId}
                onChange={e => setUpiId(e.target.value)}
              />
            </div>
            <div className="flex gap-3 flex-wrap">
              {['GPay', 'PhonePe', 'Paytm', 'BHIM'].map(app => (
                <button
                  key={app}
                  onClick={() => setUpiId(`sample@${app.toLowerCase()}`)}
                  className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-600 hover:border-[#7f1d4a] hover:text-[#7f1d4a] transition-colors"
                >
                  {app}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-400">Sample: test@upi</p>
          </div>
        )}

        {/* Wallet form */}
        {method === 'wallet' && (
          <div className="space-y-3">
            <label className="text-xs font-medium text-gray-600 mb-1 block">Select Wallet</label>
            <div className="grid grid-cols-3 gap-2">
              {['PhonePe', 'Paytm', 'Amazon Pay', 'Mobikwik', 'Freecharge', 'Airtel'].map(w => (
                <button
                  key={w}
                  onClick={() => setWallet(w)}
                  className={`py-2 px-2 rounded-xl border text-xs font-medium transition-all
                    ${wallet === w ? 'border-[#7f1d4a] bg-[#7f1d4a]/5 text-[#7f1d4a]' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                >
                  {w}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Net Banking form */}
        {method === 'netbanking' && (
          <div className="space-y-3">
            <label className="text-xs font-medium text-gray-600 mb-1 block">Select Bank</label>
            <select
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#7f1d4a]/30"
              value={bank}
              onChange={e => setBank(e.target.value)}
            >
              {SAMPLE_BANKS.map(b => <option key={b}>{b}</option>)}
            </select>
          </div>
        )}

        {/* Pay button */}
        <button
          onClick={handlePay}
          className="w-full bg-[#7f1d4a] hover:bg-[#6b1840] text-white font-semibold py-3.5 rounded-2xl transition-colors text-base"
        >
          Pay ₹{fmt(total)}
        </button>

        <p className="text-center text-xs text-gray-400">
          🔒 256-bit SSL · Sample payment — no real money charged
        </p>
      </div>
    </ModalShell>
  )
}

function ModalShell({ children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md relative overflow-hidden">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl leading-none z-10"
            aria-label="Close"
          >
            ✕
          </button>
        )}
        {children}
      </div>
    </div>
  )
}

// ─── Checkout Page ────────────────────────────────────────────────────────────
const Checkout = () => {
  const navigate = useNavigate()
  const { cartItems, getCartTotal, clearCart } = useCart()
  const { user } = useAuth()
  const [showPayment, setShowPayment] = useState(false)
  const [placingOrder, setPlacingOrder] = useState(false)
  const [orderDone, setOrderDone] = useState(false)
  const [shippingAddress, setShippingAddress] = useState({
    name:    user?.name || '',
    street:  user?.address?.street || '',
    city:    user?.address?.city || '',
    state:   user?.address?.state || '',
    zipCode: user?.address?.zipCode || '',
    phone:   user?.phone || ''
  })

  const subtotal = getCartTotal()
  const gst      = subtotal * 0.03
  const total    = subtotal + gst

  const handleInputChange = (e) =>
    setShippingAddress(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const validateAddress = () => {
    const { name, street, city, state, zipCode, phone } = shippingAddress
    if (!name || !street || !city || !state || !zipCode || !phone) {
      toast.error('Please fill in all shipping fields')
      return false
    }
    return true
  }

  const openPayment = (e) => {
    e.preventDefault()
    if (validateAddress()) setShowPayment(true)
  }

  // Called after sample payment "succeeds"
  const handlePaymentSuccess = async () => {
    setShowPayment(false)
    setPlacingOrder(true)
    setOrderDone(true) // prevent empty-cart redirect
    try {
      const res = await api.post('/orders', {
        items: cartItems.map(item => ({
          productId: item._id || item.productId,
          quantity: item.quantity
        })),
        shippingAddress,
        notes: '',
        paymentMethod: 'sample',
        paymentStatus: 'paid'
      })
      toast.success('Order placed successfully!')
      navigate(`/order-success/${res.data.order._id}`, {
        state: { orderNumber: res.data.order.orderNumber }
      })
      clearCart()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order')
    } finally {
      setPlacingOrder(false)
    }
  }

  if (cartItems.length === 0 && !orderDone) {
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
            <form onSubmit={openPayment} className="card-pad space-y-6">
              <div>
                <h2 className="text-2xl font-serif font-bold text-[#7f1d4a] mb-1">Shipping Address</h2>
                <p className="text-sm text-gray-500">Enter where you'd like your order delivered.</p>
              </div>

              <Input label="Full Name *" type="text" name="name"
                value={shippingAddress.name} onChange={handleInputChange} required />
              <Input label="Phone Number *" type="tel" name="phone"
                value={shippingAddress.phone} onChange={handleInputChange} required />
              <Input label="Street Address *" type="text" name="street"
                value={shippingAddress.street} onChange={handleInputChange} required />

              <div className="grid grid-cols-2 gap-4">
                <Input label="City *" type="text" name="city"
                  value={shippingAddress.city} onChange={handleInputChange} required />
                <Input label="State *" type="text" name="state"
                  value={shippingAddress.state} onChange={handleInputChange} required />
              </div>

              <Input label="ZIP Code *" type="text" name="zipCode"
                value={shippingAddress.zipCode} onChange={handleInputChange} required />

              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3 items-start">
                <span className="text-xl mt-0.5">💳</span>
                <div>
                  <p className="text-sm font-semibold text-amber-800">Sample Payment Mode</p>
                  <p className="text-xs text-amber-700 mt-0.5">
                    Supports Card, UPI, Wallet &amp; Net Banking. No real money is charged — this is a demo.
                  </p>
                </div>
              </div>
            </form>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="p-6 sticky top-20">
            <h2 className="text-2xl font-serif font-bold text-[#7f1d4a] mb-6">Order Summary</h2>

            <div className="space-y-2 mb-4 max-h-48 overflow-y-auto pr-1">
              {cartItems.map(item => (
                <div key={item._id || item.productId} className="flex justify-between text-sm">
                  <span className="text-gray-700 truncate mr-2">{item.name} ×{item.quantity}</span>
                  <span className="font-medium whitespace-nowrap">
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>GST (3%)</span>
                <span>₹{gst.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
              <div className="border-t pt-3 flex justify-between font-bold text-xl">
                <span>Total</span>
                <span className="text-gold-600">
                  ₹{total.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            <Button
              onClick={openPayment}
              loading={placingOrder}
              className="w-full mt-6"
              size="lg"
            >
              {placingOrder
                ? 'Placing Order…'
                : `Proceed to Pay ₹${total.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`}
            </Button>

            <p className="text-xs text-center text-gray-400 mt-3">
              🔒 Sample payment · No real charges
            </p>
          </Card>
        </div>
      </div>

      {/* Payment Modal */}
      {showPayment && (
        <PaymentModal
          total={total}
          onSuccess={handlePaymentSuccess}
          onClose={() => setShowPayment(false)}
        />
      )}
    </div>
  )
}

export default Checkout
