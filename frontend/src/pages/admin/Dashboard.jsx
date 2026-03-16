import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../utils/api'
import PageHeader from '../../components/ui/PageHeader'
import Card from '../../components/ui/Card'

const Dashboard = () => {
  const [stats, setStats] = useState(null)
  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const res = await api.get('/admin/stats')
      setStats(res.data.stats)
      setRecentOrders(res.data.recentOrders)
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500"></div>
      </div>
    )
  }

  return (
    <div>
      <PageHeader eyebrow="Admin" title="Dashboard" subtitle="Snapshot of store performance and recent activity." />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card hover className="p-6">
          <h3 className="text-gray-600 text-sm font-medium mb-2">Total Products</h3>
          <p className="text-3xl font-bold text-gold-700">{stats?.totalProducts || 0}</p>
        </Card>
        <Card hover className="p-6">
          <h3 className="text-gray-600 text-sm font-medium mb-2">Total Orders</h3>
          <p className="text-3xl font-bold text-gold-700">{stats?.totalOrders || 0}</p>
        </Card>
        <Card hover className="p-6">
          <h3 className="text-gray-600 text-sm font-medium mb-2">Total Revenue</h3>
          <p className="text-3xl font-bold text-gold-700">₹{stats?.totalRevenue?.toLocaleString() || '0'}</p>
        </Card>
        <Card hover className="p-6">
          <h3 className="text-gray-600 text-sm font-medium mb-2">Pending Orders</h3>
          <p className="text-3xl font-bold text-gold-700">{stats?.pendingOrders || 0}</p>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link to="/admin/products" className="card card-hover p-6 border border-gray-100">
          <h3 className="text-lg font-semibold mb-2">Manage Products</h3>
          <p className="text-gray-600 text-sm">Add, edit, or remove products</p>
        </Link>
        <Link to="/admin/orders" className="card card-hover p-6 border border-gray-100">
          <h3 className="text-lg font-semibold mb-2">View Orders</h3>
          <p className="text-gray-600 text-sm">Manage and track all orders</p>
        </Link>
        <Link to="/admin/gold-rates" className="card card-hover p-6 border border-gray-100">
          <h3 className="text-lg font-semibold mb-2">Update Gold Rates</h3>
          <p className="text-gray-600 text-sm">Set current gold prices</p>
        </Link>
        <Link to="/admin/reports" className="card card-hover p-6 border border-gray-100">
          <h3 className="text-lg font-semibold mb-2">Generate Reports</h3>
          <p className="text-gray-600 text-sm">Sales, inventory, and user reports</p>
        </Link>
      </div>

      {/* Recent Orders */}
      <Card className="p-6 border border-gray-100">
        <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
        {recentOrders.length === 0 ? (
          <p className="text-gray-600">No recent orders</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order #</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentOrders.map((order) => (
                  <tr key={order._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {order.orderNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {order.user?.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      ₹{order.total?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}

export default Dashboard

