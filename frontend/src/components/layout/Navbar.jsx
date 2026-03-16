import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import api from '../../utils/api'

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth()
  const { getCartItemsCount } = useCart()
  const navigate = useNavigate()
  const [showTopBar, setShowTopBar] = useState(true)
  const [activeDropdown, setActiveDropdown] = useState(null)
  const [goldRates, setGoldRates] = useState(null)
  const [showGoldRatePopup, setShowGoldRatePopup] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  // Gold subcategories with images for dropdown
  const goldCategories = [
    { name: 'Rings', image: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=200&h=200&fit=crop' },
    { name: 'Earrings', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=200&h=200&fit=crop' },
    { name: 'Pendants', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=200&h=200&fit=crop' },
    { name: 'Chains', image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=200&h=200&fit=crop' },
    { name: 'Bangles', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=200&h=200&fit=crop' },
    { name: 'Bracelets', image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=200&h=200&fit=crop' },
    { name: 'Necklaces', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=200&h=200&fit=crop' },
    { name: 'Sets', image: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=200&h=200&fit=crop' }
  ]
  const silverCategories = ['Coins & Bars', 'Articles', 'Jewelry', 'Accessories']
  const jewelleryCategories = ['Earring', 'Pendant', 'Ring', 'Chain', 'Necklace', 'Mangalsutra', 'Bangle', 'Bracelet', 'Nosepin', 'Accessories']

  // Fetch gold rates
  useEffect(() => {
    const fetchGoldRates = async () => {
      try {
        const res = await api.get('/gold-rate')
        if (res.data && res.data.rates) {
          setGoldRates(res.data.rates)
        } else {
          // Set default rates if API doesn't return rates
          setGoldRates({
            '22K': 6500,
            '18K': 5317,
            '14K': 4134,
            '24K': 7091
          })
        }
      } catch (error) {
        console.error('Error fetching gold rates:', error)
        // Set default rates on error
        setGoldRates({
          '22K': 6500,
          '18K': 5317,
          '14K': 4134,
          '24K': 7091
        })
      }
    }
    fetchGoldRates()
    // Refresh rates every 5 minutes
    const interval = setInterval(fetchGoldRates, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

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
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full px-4 py-2 pl-10 pr-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                />
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
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
              <button className="hidden lg:flex items-center space-x-1 text-gray-700 hover:text-[#7f1d4a] transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span className="text-sm">Wishlist</span>
              </button>

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
                    to="/products?metal=Gold"
                    className={`px-4 py-2 text-sm font-semibold transition-colors whitespace-nowrap block ${
                      activeDropdown === 'gold' ? 'text-[#7f1d4a]' : 'text-gray-700 hover:text-[#7f1d4a]'
                    }`}
                  >
                    GOLD
                  </Link>
                  {activeDropdown === 'gold' && (
                    <div 
                      className="absolute top-full left-0 mt-0 w-80 bg-white shadow-2xl border-2 border-gray-300 rounded-lg py-4"
                      style={{ 
                        display: 'block',
                        zIndex: 9999,
                        position: 'absolute'
                      }}
                      onMouseEnter={() => setActiveDropdown('gold')}
                      onMouseLeave={() => setActiveDropdown(null)}
                    >
                      <div className="grid grid-cols-2 gap-2">
                        {goldCategories.map((cat) => (
                          <Link
                            key={cat.name}
                            to={`/products?metal=Gold&category=${cat.name}`}
                            className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gold-50 transition-colors group"
                            onClick={() => setActiveDropdown(null)}
                          >
                            <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                              <img
                                src={cat.image}
                                alt={cat.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                              />
                            </div>
                            <span className="text-sm font-medium text-gray-700 group-hover:text-[#7f1d4a] transition-colors">
                              {cat.name}
                            </span>
                          </Link>
                        ))}
                      </div>
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
                    to="/products?metal=Silver"
                    className={`px-4 py-2 text-sm font-semibold transition-colors whitespace-nowrap block ${
                      activeDropdown === 'silver' ? 'text-[#7f1d4a]' : 'text-gray-700 hover:text-[#7f1d4a]'
                    }`}
                  >
                    SILVER
                  </Link>
                  {activeDropdown === 'silver' && (
                    <div 
                      className="absolute top-full left-0 mt-0 w-56 bg-white shadow-2xl border-2 border-gray-300 rounded-lg py-3"
                      style={{ 
                        display: 'block',
                        zIndex: 9999,
                        position: 'absolute'
                      }}
                      onMouseEnter={() => setActiveDropdown('silver')}
                      onMouseLeave={() => setActiveDropdown(null)}
                    >
                      {silverCategories.map((cat) => (
                        <Link
                          key={cat}
                          to={`/products?metal=Silver&category=${cat}`}
                          className="block px-5 py-2.5 text-sm text-gray-700 hover:bg-gold-50 hover:text-[#7f1d4a] transition-colors"
                          onClick={() => setActiveDropdown(null)}
                        >
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
                      {jewelleryCategories.map((cat) => (
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

                <Link to="/collections" className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-[#7f1d4a] transition-colors whitespace-nowrap">
                  COLLECTIONS
                </Link>
                <Link to="/gift-cards" className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-[#7f1d4a] transition-colors whitespace-nowrap">
                  GIFT CARDS
                </Link>
                {/* GOLD RATE with Popup */}
                <div
                  className="relative"
                  onMouseEnter={() => setShowGoldRatePopup(true)}
                  onMouseLeave={() => setShowGoldRatePopup(false)}
                >
                  <Link 
                    to="/gold-rate" 
                    className={`px-4 py-2 text-sm font-semibold transition-colors whitespace-nowrap block ${
                      showGoldRatePopup ? 'text-[#7f1d4a]' : 'text-gray-700 hover:text-[#7f1d4a]'
                    }`}
                  >
                    GOLD RATE
                  </Link>
                  {showGoldRatePopup && (
                    <div 
                      className="absolute top-full right-0 mt-0 w-72 bg-white shadow-2xl border-2 border-gray-300 rounded-lg py-4 px-5"
                      style={{ 
                        display: 'block',
                        zIndex: 9999,
                        position: 'absolute'
                      }}
                      onMouseEnter={() => setShowGoldRatePopup(true)}
                      onMouseLeave={() => setShowGoldRatePopup(false)}
                    >
                      <h3 className="text-lg font-bold text-[#7f1d4a] mb-3 text-center">Today's Gold Rate</h3>
                      {goldRates ? (
                        <div className="space-y-2 mb-3">
                          <div className="flex justify-between items-center py-2 border-b border-gray-200">
                            <span className="text-sm font-semibold text-gray-700">22 KT(916)</span>
                            <span className="text-sm font-bold text-[#7f1d4a]">₹ {goldRates['22K']?.toLocaleString() || '0'}/g</span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-gray-200">
                            <span className="text-sm font-semibold text-gray-700">18 KT(750)</span>
                            <span className="text-sm font-bold text-[#7f1d4a]">₹ {goldRates['18K']?.toLocaleString() || '0'}/g</span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-gray-200">
                            <span className="text-sm font-semibold text-gray-700">14 KT(585)</span>
                            <span className="text-sm font-bold text-[#7f1d4a]">₹ {goldRates['14K']?.toLocaleString() || '0'}/g</span>
                          </div>
                          {goldRates['24K'] && (
                            <div className="flex justify-between items-center py-2">
                              <span className="text-sm font-semibold text-gray-700">24 KT(999)</span>
                              <span className="text-sm font-bold text-[#7f1d4a]">₹ {goldRates['24K']?.toLocaleString() || '0'}/g</span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-4 text-gray-500 text-sm">Loading rates...</div>
                      )}
                      <p className="text-xs text-gray-600 text-center mt-3 pt-3 border-t border-gray-200">
                        Updated on: {new Date().toLocaleDateString('en-IN', { 
                          day: '2-digit', 
                          month: '2-digit', 
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}

export default Navbar

