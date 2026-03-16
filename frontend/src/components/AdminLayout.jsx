import { Link, useLocation } from 'react-router-dom'
import Button from './ui/Button'

const AdminLayout = ({ children }) => {
  const location = useLocation()

  const navItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/admin/products', label: 'Products', icon: '💍' },
    { path: '/admin/orders', label: 'Orders', icon: '📦' },
    { path: '/admin/gold-rates', label: 'Gold Rates', icon: '💰' },
    { path: '/admin/reports', label: 'Reports', icon: '📋' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-page py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar */}
          <aside className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden sticky top-6">
              <div className="p-6 border-b border-gray-100">
                <h1 className="text-xl font-serif font-bold text-[#7f1d4a]">Admin Panel</h1>
                <p className="text-sm text-gray-600 mt-1">Manage products, orders, rates, and reports.</p>
              </div>
              <nav className="p-3">
                <div className="space-y-1">
                  {navItems.map((item) => {
                    const active = location.pathname === item.path
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                          active
                            ? 'bg-gold-50 text-[#7f1d4a] border border-gold-200'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                        aria-current={active ? 'page' : undefined}
                      >
                        <span aria-hidden="true">{item.icon}</span>
                        <span>{item.label}</span>
                      </Link>
                    )
                  })}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <Button as={Link} to="/" variant="secondary" className="w-full">
                    ← Back to Store
                  </Button>
                </div>
              </nav>
            </div>
          </aside>

          {/* Main content */}
          <main className="lg:col-span-9">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}

export default AdminLayout