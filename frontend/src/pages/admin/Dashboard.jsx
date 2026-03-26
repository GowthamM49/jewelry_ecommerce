import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../utils/api'

const STATUS_STYLES = {
  pending:    'bg-amber-100 text-amber-700',
  confirmed:  'bg-blue-100 text-blue-700',
  processing: 'bg-purple-100 text-purple-700',
  shipped:    'bg-indigo-100 text-indigo-700',
  delivered:  'bg-green-100 text-green-700',
  cancelled:  'bg-red-100 text-red-700',
}

const StatCard = ({ label, value, icon, color, sub }) => (
  <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between mb-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        {icon}
      </div>
    </div>
    <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
    <p className="text-sm text-gray-500">{label}</p>
    {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
  </div>
)

const QuickLink = ({ to, icon, label, desc, color }) => (
  <Link
    to={to}
    className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center gap-4 group"
  >
    <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${color} group-hover:scale-110 transition-transform`}>
      {icon}
    </div>
    <div>
      <p className="font-semibold text-gray-800 text-sm">{label}</p>
      <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
    </div>
    <svg className="w-4 h-4 text-gray-300 ml-auto group-hover:text-gray-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  </Link>
)

const Dashboard = () => {
  const [stats, setStats] = useState(null)
  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchStats() }, [])

  const fetchStats = async () => {
    try {
      const res = await api.get('/admin/stats')
      setStats(res.data.stats)
      setRecentOrders(res.data.recentOrders)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 h-36 animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-8">

      {/* Page title */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          label="Total Products"
          value={stats?.totalProducts ?? 0}
          color="bg-amber-50"
          icon={
            <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          }
        />
        <StatCard
          label="Total Orders"
          value={stats?.totalOrders ?? 0}
          color="bg-blue-50"
          icon={
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          }
        />
        <StatCard
          label="Total Revenue"
          value={`₹${(stats?.totalRevenue ?? 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`}
          color="bg-green-50"
          icon={
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatCard
          label="Pending Orders"
          value={stats?.pendingOrders ?? 0}
          color="bg-rose-50"
          sub={stats?.pendingOrders > 0 ? 'Needs attention' : 'All clear'}
          icon={
            <svg className="w-6 h-6 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-base font-semibold text-gray-700 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickLink to="/admin/products" label="Manage Products" desc="Add, edit, remove products"
            color="bg-amber-50"
            icon={<svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>}
          />
          <QuickLink to="/admin/orders" label="View Orders" desc="Track and manage orders"
            color="bg-blue-50"
            icon={<svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}
          />
          <QuickLink to="/admin/gold-rates" label="Gold Rates" desc="Update live gold prices"
            color="bg-yellow-50"
            icon={<svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          />
          <QuickLink to="/admin/reports" label="Reports" desc="Sales and inventory reports"
            color="bg-purple-50"
            icon={<svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
          />
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800">Recent Orders</h2>
          <Link to="/admin/orders" className="text-xs text-[#7f1d4a] font-medium hover:underline">
            View all →
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="px-6 py-12 text-center text-gray-400 text-sm">No orders yet</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
                  <th className="px-6 py-3 text-left font-medium">Order</th>
                  <th className="px-6 py-3 text-left font-medium">Customer</th>
                  <th className="px-6 py-3 text-left font-medium">Amount</th>
                  <th className="px-6 py-3 text-left font-medium">Status</th>
                  <th className="px-6 py-3 text-left font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-gray-600">
                      #{order.orderNumber}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-[#7f1d4a]/10 flex items-center justify-center text-[#7f1d4a] text-xs font-bold flex-shrink-0">
                          {order.user?.name?.[0]?.toUpperCase() || '?'}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 text-xs">{order.user?.name || 'N/A'}</p>
                          <p className="text-gray-400 text-xs">{order.user?.email || ''}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-800">
                      ₹{order.total?.toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${STATUS_STYLES[order.status] || 'bg-gray-100 text-gray-600'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-xs">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: '2-digit', month: 'short', year: 'numeric'
                      })}
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

export default Dashboard
