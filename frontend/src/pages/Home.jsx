import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../utils/api'
import { ProductCardSkeleton } from '../components/Skeletons'

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFeaturedProducts()
  }, [])

  const fetchFeaturedProducts = async () => {
    try {
      const res = await api.get('/products?limit=8')
      setFeaturedProducts(res.data.products)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  // Gold subcategories with images
  const goldCategories = [
    { 
      name: 'Rings', 
      image: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=600&h=600&fit=crop', 
      link: '/products?metal=Gold&category=Rings' 
    },
    { 
      name: 'Earrings', 
      image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&h=600&fit=crop', 
      link: '/products?metal=Gold&category=Earrings' 
    },
    { 
      name: 'Pendants', 
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=600&fit=crop', 
      link: '/products?metal=Gold&category=Pendants' 
    },
    { 
      name: 'Chains', 
      image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=600&h=600&fit=crop', 
      link: '/products?metal=Gold&category=Chains' 
    },
    { 
      name: 'Bangles', 
      image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&h=600&fit=crop', 
      link: '/products?metal=Gold&category=Bangles' 
    },
    { 
      name: 'Bracelets', 
      image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&h=600&fit=crop', 
      link: '/products?metal=Gold&category=Bracelets' 
    },
    { 
      name: 'Necklaces', 
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&h=600&fit=crop', 
      link: '/products?metal=Gold&category=Necklaces' 
    },
    { 
      name: 'Sets', 
      image: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=600&h=600&fit=crop', 
      link: '/products?metal=Gold&category=Sets' 
    }
  ]

  const trustBadges = [
    { icon: '✓', title: 'Certified Gold', desc: 'BIS Hallmark Certified' },
    { icon: '✓', title: 'Secure Payment', desc: '100% Safe Transactions' },
    { icon: '✓', title: 'Free Shipping', desc: 'On Orders Above ₹10,000' },
    { icon: '✓', title: 'Easy Returns', desc: '7-Day Return Policy' }
  ]

  return (
    <div>
      {/* Hero Banner */}
      <section className="relative bg-gradient-to-br from-[#7f1d4a] via-[#9d2a5f] to-[#7f1d4a] text-white py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gift-pattern opacity-10"></div>
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-gold-300/20 blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full bg-gold-200/20 blur-3xl"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <p className="text-sm uppercase tracking-[0.25em] text-gold-200 mb-4">Sudha Jewelry</p>
            <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 leading-tight">
              Timeless Elegance,<br />Crafted to Perfection
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-gold-100 leading-relaxed">
              Discover our exquisite collection of premium gold and diamond jewelry.<br />
              Where tradition meets modern elegance.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/products" className="btn-primary bg-gold-500 hover:bg-gold-600 text-white px-8 py-4 text-lg">
                Explore Collection
              </Link>
              <Link to="/gift-cards" className="btn-secondary bg-white/10 hover:bg-white/20 text-white border-white/30 px-8 py-4 text-lg">
                Gift Cards
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {trustBadges.map((badge, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold-100 text-gold-600 text-2xl mb-4 group-hover:bg-gold-500 group-hover:text-white transition-all duration-300">
                  {badge.icon}
                </div>
                <h3 className="font-semibold text-lg mb-2 text-[#7f1d4a]">{badge.title}</h3>
                <p className="text-gray-600 text-sm">{badge.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gold Categories */}
      <section className="py-20 bg-gradient-to-b from-premium-light to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-[0.25em] text-[#7f1d4a]/60 mb-3">Gold Collection</p>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#7f1d4a] mb-4">Shop Gold by Category</h2>
            <div className="w-24 h-1 bg-gold-500 mx-auto"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {goldCategories.map((category, index) => (
              <Link key={index} to={category.link} className="card group overflow-hidden">
                <div className="aspect-square overflow-hidden relative">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-sm font-medium">View Collection →</p>
                  </div>
                </div>
                <div className="p-6 text-center bg-white">
                  <h3 className="font-semibold text-lg text-[#7f1d4a] group-hover:text-gold-600 transition-colors">
                    {category.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-[0.25em] text-[#7f1d4a]/60 mb-3">Premium Selection</p>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#7f1d4a] mb-4">Featured Collection</h2>
            <div className="w-24 h-1 bg-gold-500 mx-auto"></div>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <Link
                  key={product._id}
                  to={`/products/${product._id}`}
                  className="card group relative"
                >
                  {product.badges?.length > 0 && (
                    <div className="absolute top-3 left-3 flex flex-wrap gap-2 z-10">
                      {product.badges.slice(0, 2).map((badge, idx) => (
                        <span key={idx} className="badge-gold">
                          {badge}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="aspect-square overflow-hidden bg-gray-100">
                    <img
                      src={product.images?.[0]?.url || 'https://via.placeholder.com/400'}
                      alt={product.name}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-2 line-clamp-2">{product.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {product.metal} {product.purity} • {product.weight}g
                    </p>
                    <p className="text-xl font-bold text-gold-600">
                      ₹{product.price?.toLocaleString() || '0'}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
          <div className="text-center mt-12">
            <Link to="/products" className="btn-primary px-8 py-4 text-lg">
              View All Products
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home

