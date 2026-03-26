import { Link, useLocation } from 'react-router-dom'

const navItems = [
  {
    path: '/admin/dashboard', label: 'Dashboard',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    )
  },
  {
    path: '/admin/products', label: 'Products',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    )
  },
  {
    path: '/admin/orders', label: 'Orders',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    )
  },
  {
    path: '/admin/gold-rates', label: 'Gold Rates',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  {
    path: '/admin/reports', label: 'Reports',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    )
  }
]

const AdminLayout = ({ children }) => {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">

        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 min-h-screen bg-[#9d2a5f] sticky top-0 self-start">
          {/* Brand */}
          <div className="px-6 py-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold text-lg">
                S
              </div>
              <div>
                <p className="text-white font-bold text-sm leading-tight">Sudha Jewelry</p>
                <p className="text-white/40 text-xs">Admin Panel</p>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-3 py-4 space-y-1">
            {navItems.map((item) => {
              const active = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    active
                      ? 'bg-[#7f1d4a] text-white shadow-lg'
                      : 'text-white/60 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {/* Back to store */}
          <div className="px-3 py-4 border-t border-white/10">
            <Link
              to="/"
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-white/50 hover:text-white hover:bg-white/10 transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Store
            </Link>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 min-w-0">
          {/* Top bar */}
          <div className="bg-[#7f1d4a] border-b border-[#6b1840] px-8 py-4 flex items-center justify-between sticky top-0 z-30">
            <div className="flex items-center gap-2 text-sm text-white/70">
              <span>Admin</span>
              <span>/</span>
              <span className="text-white font-medium capitalize">
                {location.pathname.split('/').pop().replace('-', ' ')}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs bg-white/20 text-white px-2 py-1 rounded-full font-medium">● Live</span>
            </div>
          </div>

          <div className="p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
