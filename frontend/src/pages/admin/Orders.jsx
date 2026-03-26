import { useEffect, useState } from 'react'
import api from '../../utils/api'
import toast from 'react-hot-toast'

const STATUS_STYLES = {
  pending:    'bg-amber-100 text-amber-700',
  confirmed:  'bg-blue-100 text-blue-700',
  processing: 'bg-purple-100 text-purple-700',
  shipped:    'bg-indigo-100 text-indigo-700',
  delivered:  'bg-green-100 text-green-700',
  cancelled:  'bg-red-100 text-red-700',
}

const PAYMENT_STYLES = {
  pending:  'bg-gray-100 text-gray-600',
  paid:     'bg-green-100 text-green-700',
  failed:   'bg-red-100 text-red-700',
  refunded: 'bg-orange-100 text-orange-700',
}

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')

  useEffect(() => { fetchOrders() }, [statusFilter])

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const params = statusFilter ? { status: statusFilter } : {}
      const res = await api.get('/admin/orders', { params })
      setOrders(res.data.orders)
    } catch {
      toast.error('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId, status, paymentStatus) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status, paymentStatus })
      toast.success('Order updated')
      fetchOrders()
    } catch {
      toast.error('Failed to update order')
    }
  }

  const downloadInvoice = async (order) => {
    try {
      const res = await api.get(`/orders/${order._id}/invoice`, { responseType: 'blob' })
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

  const statuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']
  const paymentStatuses = ['pending', 'paid', 'failed', 'refunded']

  // Summary counts
  const counts = statuses.reduce((acc, s) => {
    acc[s] = orders.filter(o => o.status === s).length
    return acc
  }, {})

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-sm text-gray-500 mt-1">{orders.length} order{orders.length !== 1 ? 's' : ''} total</p>
        </div>
        {/* Status filter */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Filter:</span>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7f1d4a]/30 bg-white"
          >
            <option value="">All Status</option>
            {statuses.map(s => (
              <option key={s} value={s} className="capitalize">{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Status summary chips */}
      <div className="flex flex-wrap gap-2">
        {statuses.filter(s => counts[s] > 0).map(s => (
          <button
            key={s}
            onClick={() => setStatusFilter(statusFilter === s ? '' : s)}
            className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
              statusFilter === s
                ? 'border-[#7f1d4a] bg-[#7f1d4a] text-white'
                : `${STATUS_STYLES[s]} border-transparent`
            }`}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)} ({counts[s]})
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-[#7f1d4a]/20 border-t-[#7f1d4a] rounded-full animate-spin" />
          </div>
        ) : orders.length === 0 ? (
          <div className="py-20 text-center text-gray-400 text-sm">No orders found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Order</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Customer</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Items</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Total</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Payment</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Invoice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50/60 transition-colors">
                    {/* Order number */}
                    <td className="px-5 py-4">
                      <span className="font-mono text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-lg">
                        #{order.orderNumber}
                      </span>
                    </td>

                    {/* Customer */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#7f1d4a]/10 flex items-center justify-center text-[#7f1d4a] text-xs font-bold flex-shrink-0">
                          {order.user?.name?.[0]?.toUpperCase() || '?'}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 text-xs leading-tight">{order.user?.name || 'N/A'}</p>
                          <p className="text-gray-400 text-xs">{order.user?.email || ''}</p>
                        </div>
                      </div>
                    </td>

                    {/* Items */}
                    <td className="px-5 py-4 text-gray-600 text-xs">
                      {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                    </td>

                    {/* Total */}
                    <td className="px-5 py-4 font-bold text-gray-800">
                      ₹{order.total?.toLocaleString('en-IN')}
                    </td>

                    {/* Order status dropdown */}
                    <td className="px-5 py-4">
                      <select
                        value={order.status}
                        onChange={e => updateOrderStatus(order._id, e.target.value, order.paymentStatus)}
                        className={`text-xs font-semibold rounded-full px-3 py-1.5 border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#7f1d4a]/30 ${STATUS_STYLES[order.status]}`}
                      >
                        {statuses.map(s => (
                          <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                        ))}
                      </select>
                    </td>

                    {/* Payment status dropdown */}
                    <td className="px-5 py-4">
                      <select
                        value={order.paymentStatus}
                        onChange={e => updateOrderStatus(order._id, order.status, e.target.value)}
                        className={`text-xs font-semibold rounded-full px-3 py-1.5 border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#7f1d4a]/30 ${PAYMENT_STYLES[order.paymentStatus] || 'bg-gray-100 text-gray-600'}`}
                      >
                        {paymentStatuses.map(s => (
                          <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                        ))}
                      </select>
                    </td>

                    {/* Date */}
                    <td className="px-5 py-4 text-gray-400 text-xs whitespace-nowrap">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: '2-digit', month: 'short', year: 'numeric'
                      })}
                    </td>

                    {/* Invoice */}
                    <td className="px-5 py-4">
                      <button
                        onClick={() => downloadInvoice(order)}
                        className="flex items-center gap-1.5 text-xs font-semibold text-[#7f1d4a] hover:text-[#6b1840] transition-colors"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default Orders
