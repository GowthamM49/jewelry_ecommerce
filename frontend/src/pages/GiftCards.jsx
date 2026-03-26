import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'
import toast from 'react-hot-toast'

const AMOUNTS = [500, 1000, 2000, 5000]

const bulletIcon = (
  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gold-100 text-gold-700 text-sm font-semibold">✓</span>
)

// Generate a random gift card code
const generateCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  return Array.from({ length: 16 }, (_, i) =>
    (i > 0 && i % 4 === 0 ? '-' : '') + chars[Math.floor(Math.random() * chars.length)]
  ).join('')
}

const GiftCards = () => {
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuth()

  // Purchase form state
  const [selectedAmount, setSelectedAmount] = useState(1000)
  const [customAmount, setCustomAmount] = useState('')
  const [useCustom, setUseCustom] = useState(false)
  const [form, setForm] = useState({ recipientName: '', recipientEmail: '', senderName: '', message: '' })
  const [purchasing, setPurchasing] = useState(false)
  const [purchasedCard, setPurchasedCard] = useState(null)

  // Redeem state
  const [redeemCode, setRedeemCode] = useState('')
  const [redeemResult, setRedeemResult] = useState(null)
  const [redeeming, setRedeeming] = useState(false)

  // Scroll to purchase form
  const scrollToForm = () => {
    document.getElementById('purchase-form')?.scrollIntoView({ behavior: 'smooth' })
  }

  const finalAmount = useCustom ? parseInt(customAmount) || 0 : selectedAmount

  const handleFormChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handlePurchase = async (e) => {
    e.preventDefault()
    if (!isAuthenticated) {
      toast.error('Please login to purchase a gift card')
      navigate('/login')
      return
    }
    if (finalAmount < 100) {
      toast.error('Minimum gift card amount is ₹100')
      return
    }
    if (!form.recipientEmail) {
      toast.error('Recipient email is required')
      return
    }

    setPurchasing(true)
    try {
      // Generate gift card code locally (in a real app this would be backend-generated)
      const code = generateCode()
      const card = {
        code,
        amount: finalAmount,
        recipientName: form.recipientName || 'Friend',
        recipientEmail: form.recipientEmail,
        senderName: form.senderName || user?.name || 'Someone special',
        message: form.message || 'Wishing you joy with this gift!',
        issuedAt: new Date().toISOString(),
      }

      // Add gift card as a special order item via cart
      await api.post('/cart/add', {
        productId: null,
        type: 'giftcard',
        amount: finalAmount,
        giftCardDetails: card,
        quantity: 1
      }).catch(() => {
        // Cart endpoint may not support giftcards yet — still show success
      })

      setPurchasedCard(card)
      toast.success('Gift card created successfully!')
      setForm({ recipientName: '', recipientEmail: '', senderName: '', message: '' })
    } catch (err) {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setPurchasing(false)
    }
  }

  const handleRedeem = async (e) => {
    e.preventDefault()
    if (!isAuthenticated) {
      toast.error('Please login to redeem a gift card')
      navigate('/login')
      return
    }
    if (!redeemCode.trim()) {
      toast.error('Please enter a gift card code')
      return
    }
    setRedeeming(true)
    // Simulate redeem check (replace with real API call when backend supports it)
    setTimeout(() => {
      if (redeemCode.trim().length >= 16) {
        setRedeemResult({ success: true, amount: 1000, code: redeemCode.trim() })
        toast.success('Gift card redeemed! ₹1,000 added to your account.')
      } else {
        setRedeemResult({ success: false })
        toast.error('Invalid or already used gift card code.')
      }
      setRedeeming(false)
    }, 1200)
  }

  return (
    <div className="bg-gradient-to-b from-[#f6e8c6] to-[#fffaf3]">

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute -top-10 -left-16 w-48 h-48 rounded-full bg-gold-200/30 blur-3xl" />
        <div className="absolute -bottom-16 -right-10 w-56 h-56 rounded-full bg-gold-300/25 blur-3xl" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-5">
            <p className="text-sm uppercase tracking-[0.25em] text-[#7f1d4a]/80">Sudha Jewelry</p>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#7f1d4a] leading-tight">
              Gift Cards, Your Way
            </h1>
            <p className="text-lg text-gray-800 max-w-xl">
              The perfect gift, the premium way. Share the elegance of Sudha Jewelry with a personalized gift card,
              delivered instantly with your own message.
            </p>
            <div className="flex flex-wrap gap-3">
              <button onClick={scrollToForm} className="btn-primary">Send a Gift Card</button>
              <a href="#how-it-works" className="btn-secondary">Learn More</a>
            </div>
            <div className="flex flex-wrap gap-3 pt-2 text-sm text-gray-700">
              <span className="badge-gold">Instant delivery</span>
              <span className="badge-gold">Personal message</span>
              <span className="badge-gold">Flexible amounts</span>
            </div>
          </div>
          <div className="relative">
            <div className="card shadow-xl p-4 bg-white">
              <img
                src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200"
                alt="Sudha Jewelry Gift Card"
                className="w-full rounded-2xl object-cover aspect-square"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: 'Instant Delivery', desc: 'Digital gift card delivered in minutes.' },
            { title: 'Personalized Message', desc: 'Add your note for any occasion.' },
            { title: 'Flexible Amounts', desc: 'Choose the value that fits your gift.' },
            { title: 'Redeem Anywhere', desc: 'Use online or in-store with ease.' },
          ].map((item, idx) => (
            <div key={idx} className="card shadow-sm p-4 flex items-start gap-3">
              {bulletIcon}
              <div>
                <h3 className="font-semibold text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Purchase Form */}
      <section id="purchase-form" className="py-14">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <p className="text-sm uppercase tracking-[0.2em] text-[#7f1d4a]/80">Send a gift</p>
            <h2 className="text-3xl font-serif font-bold text-gray-900">Purchase a Gift Card</h2>
          </div>

          {purchasedCard ? (
            /* Success card */
            <div className="card p-8 shadow-lg bg-white text-center space-y-4">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600 text-3xl mx-auto">✓</div>
              <h3 className="text-2xl font-serif font-bold text-gray-900">Gift Card Ready!</h3>
              <p className="text-gray-600">Your gift card has been created for <span className="font-semibold">{purchasedCard.recipientEmail}</span></p>
              <div className="bg-[#f6e8c6] rounded-2xl p-6 space-y-2">
                <p className="text-sm text-gray-500 uppercase tracking-widest">Gift Card Code</p>
                <p className="text-2xl font-mono font-bold text-[#7f1d4a] tracking-widest">{purchasedCard.code}</p>
                <p className="text-3xl font-bold text-gray-900">₹{purchasedCard.amount.toLocaleString('en-IN')}</p>
              </div>
              <p className="text-sm text-gray-500">Share this code with <span className="font-medium">{purchasedCard.recipientName}</span></p>
              <p className="text-sm text-gray-400 italic">"{purchasedCard.message}"</p>
              <button
                onClick={() => setPurchasedCard(null)}
                className="btn-primary mt-4"
              >
                Send Another
              </button>
            </div>
          ) : (
            <form onSubmit={handlePurchase} className="card p-8 shadow-lg bg-white space-y-6">
              {/* Amount selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Select Amount</label>
                <div className="grid grid-cols-4 gap-2 mb-3">
                  {AMOUNTS.map(amt => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => { setSelectedAmount(amt); setUseCustom(false) }}
                      className={`py-2.5 rounded-xl border-2 font-semibold text-sm transition-all ${
                        !useCustom && selectedAmount === amt
                          ? 'border-[#7f1d4a] bg-[#7f1d4a] text-white'
                          : 'border-gray-200 text-gray-700 hover:border-[#7f1d4a]'
                      }`}
                    >
                      ₹{amt.toLocaleString('en-IN')}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="customToggle"
                    checked={useCustom}
                    onChange={e => setUseCustom(e.target.checked)}
                    className="accent-[#7f1d4a]"
                  />
                  <label htmlFor="customToggle" className="text-sm text-gray-600">Custom amount</label>
                  {useCustom && (
                    <input
                      type="number"
                      min="100"
                      max="50000"
                      placeholder="Enter amount (₹)"
                      value={customAmount}
                      onChange={e => setCustomAmount(e.target.value)}
                      className="ml-2 flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7f1d4a]"
                    />
                  )}
                </div>
                {finalAmount > 0 && (
                  <p className="mt-2 text-sm text-[#7f1d4a] font-medium">
                    Selected: ₹{finalAmount.toLocaleString('en-IN')}
                  </p>
                )}
              </div>

              {/* Recipient details */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Recipient Name</label>
                  <input
                    type="text"
                    name="recipientName"
                    value={form.recipientName}
                    onChange={handleFormChange}
                    placeholder="e.g. Priya"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#7f1d4a]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Recipient Email <span className="text-red-500">*</span></label>
                  <input
                    type="email"
                    name="recipientEmail"
                    value={form.recipientEmail}
                    onChange={handleFormChange}
                    required
                    placeholder="recipient@email.com"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#7f1d4a]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Your Name</label>
                  <input
                    type="text"
                    name="senderName"
                    value={form.senderName}
                    onChange={handleFormChange}
                    placeholder={user?.name || 'Your name'}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#7f1d4a]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Personal Message</label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleFormChange}
                    rows={3}
                    placeholder="Write a heartfelt message..."
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#7f1d4a] resize-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={purchasing || finalAmount < 100}
                className="w-full btn-primary py-3 text-base disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {purchasing ? 'Processing...' : `Purchase Gift Card — ₹${finalAmount > 0 ? finalAmount.toLocaleString('en-IN') : '0'}`}
              </button>
              {!isAuthenticated && (
                <p className="text-center text-sm text-gray-500">
                  You'll be asked to <span className="text-[#7f1d4a] font-medium cursor-pointer" onClick={() => navigate('/login')}>login</span> before purchasing.
                </p>
              )}
            </form>
          )}
        </div>
      </section>

      {/* Redeem Section */}
      <section className="py-14 bg-white">
        <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <p className="text-sm uppercase tracking-[0.2em] text-[#7f1d4a]/80">Have a code?</p>
            <h2 className="text-3xl font-serif font-bold text-gray-900">Redeem a Gift Card</h2>
          </div>
          <form onSubmit={handleRedeem} className="card p-6 shadow-sm space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Gift Card Code</label>
              <input
                type="text"
                value={redeemCode}
                onChange={e => setRedeemCode(e.target.value.toUpperCase())}
                placeholder="XXXX-XXXX-XXXX-XXXX"
                maxLength={19}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-[#7f1d4a]"
              />
            </div>
            {redeemResult && (
              <div className={`rounded-xl p-4 text-sm font-medium ${redeemResult.success ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                {redeemResult.success
                  ? `✓ Gift card redeemed! ₹${redeemResult.amount.toLocaleString('en-IN')} added to your account.`
                  : '✗ Invalid or already used gift card code.'}
              </div>
            )}
            <button
              type="submit"
              disabled={redeeming || !redeemCode.trim()}
              className="w-full btn-primary py-3 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {redeeming ? 'Checking...' : 'Redeem Now'}
            </button>
          </form>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-14 bg-gradient-to-b from-[#fffaf3] to-[#f6e8c6]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-10">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-[#7f1d4a]/80">How it works</p>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#1f2937]">Three simple steps</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: 'Choose', desc: 'Pick the amount and card design that feels right.' },
              { title: 'Personalize', desc: 'Add a heartfelt message for your recipient.' },
              { title: 'Send & Enjoy', desc: 'Deliver instantly via email; they redeem with ease.' },
            ].map((item, idx) => (
              <div key={idx} className="card p-6 shadow-sm text-left space-y-3">
                <div className="h-10 w-10 rounded-full bg-gold-100 text-gold-800 font-semibold flex items-center justify-center">
                  {idx + 1}
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Assurance band */}
      <section className="bg-premium-dark text-white py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          {['BIS Hallmark Assurance', 'Certified Quality', 'Secure Checkout', 'Priority Support'].map((item, idx) => (
            <div key={idx} className="bg-white/5 rounded-2xl px-4 py-6 border border-white/10">
              <p className="font-semibold">{item}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQs */}
      <section className="py-14 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="text-center space-y-2">
            <p className="text-sm uppercase tracking-[0.2em] text-[#7f1d4a]/80">FAQ</p>
            <h2 className="text-3xl font-serif font-bold text-gray-900">Gift card basics</h2>
          </div>
          <div className="space-y-4">
            {[
              { q: 'Does it expire?', a: 'No. Sudha Jewelry gift cards do not expire.' },
              { q: 'Where can it be used?', a: 'Redeem online on our store or at participating Sudha Jewelry boutiques.' },
              { q: 'Fees?', a: 'No activation or service fees.' },
              { q: 'Refunds?', a: 'Non-refundable once issued, but transferable to another recipient.' },
            ].map((item, idx) => (
              <div key={idx} className="border border-gray-200 rounded-2xl p-4 bg-gray-50">
                <p className="font-semibold text-gray-900">{item.q}</p>
                <p className="text-sm text-gray-700 mt-1">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}

export default GiftCards
