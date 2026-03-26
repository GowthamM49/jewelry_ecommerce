import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import api from '../utils/api'
import toast from 'react-hot-toast'

const STATUS_STYLES = {
  pending:    'bg-amber-100 text-amber-700',
  confirmed:  'bg-blue-100 text-blue-700',
  processing: 'bg-purple-100 text-purple-700',
  shipped:    'bg-indigo-100 text-indigo-700',
  delivered:  'bg-green-100 text-green-700',
  cancelled:  'bg-red-100 text-red-700',
}

const OrderDetail = () => {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.get(`/orders/${id}`)
        setOrder(res.data.order)
      } catch {
        toast.error('Failed to load order')
      } finally {
        setLoading(false)
      }
    }
    fetchOrder()
  }, [id])

  const downloadInvoice = async () => {
    try {
      const res = await api.get(`/orders/${id}/invoice`, { responseType: 'blob' })
      const url = window.URL.createObjectURL(new Blob([res.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `invoice-${order.orderNumber}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch {
      toast.error('Failed to download invoice')
    }
  }

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-[#7f1d4a]/20 border-t-[#7f1d4a] rounded-full animate-spin" />
    </div>
  )

  if (!order) return (
    <div className="min-h-[60vh] flex items-center justify-center text-gray-500">
      Order not found.
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      {/* Back */}
      <Link to="/orders" className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#7f1d4a] mb-6 transition-colors">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to My Orders
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
          <p className="text-sm text-gray-500 mt-1 font-mono">#{order.orderNumber}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1.5 rounded-full text-sm font-semibold capitalize ${STATUS_STYLES[order.status] || 'bg-gray-100 text-gray-600'}`}>
            {order.status}
          </span>
          <button
            onClick={downloadInvoice}
            className="flex items-center gap-2 text-sm font-semibold text-[#7f1d4a] border border-[#7f1d4a]/30 hover:bg-[#7f1d4a]/5 px-4 py-2 rounded-xl transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Invoice
          </button>
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-5">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800">Items Ordered</h2>
        </div>
        <div className="divide-y divide-gray-50">
          {order.items.map((item, i) => (
            <div key={i} className="px-6 py-4 flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
                <img
                  src={item.product?.images?.[0]?.url || 'https://placehold.co/56x56/f5f0eb/b8860b?text=J'}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  onError={e => { e.target.src = 'https://placehold.co/56x56/f5f0eb/b8860b?text=J' }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 text-sm truncate">{item.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {item.metal} {item.purity} · {item.weight}g · Qty: {item.quantity}
                </p>
              </div>
              <p className="font-bold text-gray-800 text-sm whitespace-nowrap">
                ₹{item.totalPrice?.toLocaleString('en-IN')}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Summary + Shipping side by side */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">

        {/* Price Summary */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-semibold text-gray-800 mb-4">Price Summary</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>₹{order.subtotal?.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>GST (3%)</span>
              <span>₹{order.gst?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span className="text-green-600 font-medium">Free</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-bold text-base">
              <span>Total</span>
              <span className="text-[#7f1d4a]">₹{order.total?.toLocaleString('en-IN')}</span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t text-xs text-gray-400 space-y-1">
            <div className="flex justify-between">
              <span>Payment</span>
              <span className="capitalize font-medium text-gray-600">{order.paymentMethod || '—'}</span>
            </div>
            <div className="flex justify-between">
              <span>Payment Status</span>
              <span className={`font-semibold capitalize ${order.paymentStatus === 'paid' ? 'text-green-600' : 'text-amber-600'}`}>
                {order.paymentStatus}
              </span>
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-semibold text-gray-800 mb-4">Shipping Address</h2>
          {order.shippingAddress ? (
            <div className="text-sm text-gray-600 space-y-1">
              <p className="font-semibold text-gray-800">{order.shippingAddress.name}</p>
              <p>{order.shippingAddress.street}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
              <p>{order.shippingAddress.zipCode}</p>
              {order.shippingAddress.phone && (
                <p className="text-gray-500">📞 {order.shippingAddress.phone}</p>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-400">No address on file</p>
          )}
          <div className="mt-4 pt-4 border-t text-xs text-gray-400">
            <p>Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
              day: '2-digit', month: 'long', year: 'numeric',
              hour: '2-digit', minute: '2-digit', hour12: true
            })}</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 flex-wrap">
        <Link to="/products"
          className="px-5 py-2.5 text-sm font-semibold bg-[#7f1d4a] hover:bg-[#6b1840] text-white rounded-xl transition-colors">
          Continue Shopping
        </Link>
        <Link to="/orders"
          className="px-5 py-2.5 text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors">
          All Orders
        </Link>
      </div>
    </div>
  )
}

export default OrderDetail
