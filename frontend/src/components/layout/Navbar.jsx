import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth()
  const { getCartItemsCount } = useCart()
  const { items: wishlistItems } = useWishlist()
  const navigate = useNavigate()
  const [showTopBar, setShowTopBar] = useState(true)
  const [activeDropdown, setActiveDropdown] = useState(null)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <>
      {/* Top Bar */}
      {showTopBar && (
        <div className="bg-[#7f1d4a] text-white text-sm py-2 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center">
            <span>For Store and Scheme Queries - +91 9562-916-916</span>
            <button
              onClick={() => setShowTopBar(false)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gold-300 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Main Navbar */}
      <nav className="bg-white shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center text-white font-bold text-xl">
                S
              </div>
              <div>
                <div className="text-xl font-serif font-bold text-[#7f1d4a]">
                  Sudha Jewelry
                </div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">
                  Celebrate the Beauty of Life
                </div>
              </div>
            </Link>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <form
                className="relative w-full"
                onSubmit={e => {
                  e.preventDefault()
                  const q = e.target.elements.search.value.trim()
                  if (q) navigate(`/products?search=${encodeURIComponent(q)}`)
                }}
              >
                <input
                  type="text"
                  name="search"
                  placeholder="Search"
                  className="w-full px-4 py-2 pl-10 pr-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                />
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </form>
            </div>

            {/* Right Side */}
            <div className="flex items-center space-x-4">
              {/* Login/Sign Up or Profile */}
              {isAuthenticated ? (
                <>
                  {isAdmin && (
                    <Link
                      to="/admin/dashboard"
                      className="hidden lg:flex items-center justify-center border-2 border-gold-500 text-gold-700 hover:bg-gold-50 px-4 py-2 rounded-full transition-colors"
                    >
                      <span className="text-sm font-semibold">Admin Panel</span>
                    </Link>
                  )}
                  <Link to="/profile" className="hidden lg:flex items-center justify-center bg-[#7f1d4a] hover:bg-[#9d2a5f] text-white px-4 py-2 rounded-full transition-colors">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="text-sm font-semibold">{user?.name || 'Profile'}</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="hidden lg:flex items-center space-x-1 text-gray-700 hover:text-[#7f1d4a] transition-colors"
                  >
                    <span className="text-sm">Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="hidden lg:flex items-center justify-center border-2 border-[#7f1d4a] text-[#7f1d4a] hover:bg-[#7f1d4a] hover:text-white px-4 py-2 rounded-full transition-colors">
                    <span className="text-sm font-semibold">Login</span>
                  </Link>
                  <Link to="/register" className="hidden lg:flex items-center justify-center border-2 border-[#7f1d4a] text-[#7f1d4a] hover:bg-[#7f1d4a] hover:text-white px-4 py-2 rounded-full transition-colors">
                    <span className="text-sm font-semibold">Sign Up</span>
                  </Link>
                </>
              )}

              {/* Wishlist */}
              <Link to="/wishlist" className="hidden lg:flex items-center space-x-1 text-gray-700 hover:text-[#7f1d4a] transition-colors relative">
                <svg className="w-4 h-4" fill={wishlistItems.length > 0 ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span className="text-sm">Wishlist</span>
                {wishlistItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-semibold">
                    {wishlistItems.length}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link to="/cart" className="relative flex items-center space-x-1 text-gray-700 hover:text-[#7f1d4a] transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="text-sm">Cart</span>
                {getCartItemsCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#7f1d4a] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                    {getCartItemsCount()}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>

        {/* Category Navigation Bar */}
        <div className="border-t border-gray-200 bg-white relative z-40 overflow-visible">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-14">
              <div className="flex items-center space-x-1 relative">
                {/* GOLD with Dropdown */}
                <div
                  className="relative"
                  onMouseEnter={() => setActiveDropdown('gold')}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    to="/gold"
                    className={`px-4 py-2 text-sm font-semibold transition-colors whitespace-nowrap block ${
                      activeDropdown === 'gold' ? 'text-[#7f1d4a]' : 'text-gray-700 hover:text-[#7f1d4a]'
                    }`}
                  >
                    GOLD
                  </Link>
                  {activeDropdown === 'gold' && (
                    <div
                      className="absolute top-full left-0 mt-0 w-48 bg-white shadow-2xl border-2 border-gray-300 rounded-lg py-3"
                      style={{ display: 'block', zIndex: 9999, position: 'absolute' }}
                      onMouseEnter={() => setActiveDropdown('gold')}
                      onMouseLeave={() => setActiveDropdown(null)}
                    >
                      {['Chains', 'Rings', 'Bangles', 'Earrings'].map(cat => (
                        <Link key={cat} to={`/gold?category=${cat}`}
                          className="block px-5 py-2.5 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-700 transition-colors"
                          onClick={() => setActiveDropdown(null)}>
                          {cat}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/* SILVER with Dropdown */}
                <div
                  className="relative"
                  onMouseEnter={() => setActiveDropdown('silver')}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    to="/silver"
                    className={`px-4 py-2 text-sm font-semibold transition-colors whitespace-nowrap block ${
                      activeDropdown === 'silver' ? 'text-[#7f1d4a]' : 'text-gray-700 hover:text-[#7f1d4a]'
                    }`}
                  >
                    SILVER
                  </Link>
                  {activeDropdown === 'silver' && (
                    <div
                      className="absolute top-full left-0 mt-0 w-48 bg-white shadow-2xl border-2 border-gray-300 rounded-lg py-3"
                      style={{ display: 'block', zIndex: 9999, position: 'absolute' }}
                      onMouseEnter={() => setActiveDropdown('silver')}
                      onMouseLeave={() => setActiveDropdown(null)}
                    >
                      {['Rings', 'Chains', 'Kada', 'Bracelets', 'Anklets'].map(cat => (
                        <Link key={cat} to={`/silver?category=${cat}`}
                          className="block px-5 py-2.5 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-800 transition-colors"
                          onClick={() => setActiveDropdown(null)}>
                          {cat}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/* JEWELLERY with Dropdown */}
                <div
                  className="relative"
                  onMouseEnter={() => setActiveDropdown('jewellery')}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    to="/products"
                    className={`px-4 py-2 text-sm font-semibold transition-colors whitespace-nowrap block ${
                      activeDropdown === 'jewellery' ? 'text-[#7f1d4a]' : 'text-gray-700 hover:text-[#7f1d4a]'
                    }`}
                  >
                    JEWELLERY
                  </Link>
                  {activeDropdown === 'jewellery' && (
                    <div 
                      className="absolute top-full left-0 mt-0 w-56 bg-white shadow-2xl border-2 border-gray-300 rounded-lg py-3"
                      style={{ 
                        display: 'block',
                        zIndex: 9999,
                        position: 'absolute'
                      }}
                      onMouseEnter={() => setActiveDropdown('jewellery')}
                      onMouseLeave={() => setActiveDropdown(null)}
                    >
                      {['Rings', 'Earrings', 'Pendants', 'Chains', 'Necklaces', 'Bangles', 'Bracelets', 'Sets'].map((cat) => (
                        <Link
                          key={cat}
                          to={`/products?category=${cat}`}
                          className="block px-5 py-2.5 text-sm text-gray-700 hover:bg-gold-50 hover:text-[#7f1d4a] transition-colors"
                          onClick={() => setActiveDropdown(null)}
                        >
                          {cat}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                <Link to="/collections" className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-[#7f1d4a] transition-colors whitespace-nowrap hidden">
                  COLLECTIONS
                </Link>
                <Link to="/gift-cards" className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-[#7f1d4a] transition-colors whitespace-nowrap hidden">
                  GIFT CARDS
                </Link>
                <Link to="/gold-rate" className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-[#7f1d4a] transition-colors whitespace-nowrap block">
                  GOLD RATE
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}

export default Navbar

