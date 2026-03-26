import { useEffect, useState, useCallback } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import api from '../utils/api'
import { useWishlist } from '../context/WishlistContext'
import { ProductCardSkeleton } from '../components/Skeletons'
import Card from '../components/ui/Card'
import EmptyState from '../components/ui/EmptyState'

const SILVER_CATEGORIES = ['Rings', 'Chains', 'Kada', 'Bracelets', 'Anklets']

// Map display names to DB category values
const CAT_MAP = {
  Rings: 'Rings',
  Chains: 'Chains',
  Kada: 'Bangles',
  Bracelets: 'Bracelets',
  Anklets: 'Anklets',
}

const ProductCard = ({ product, isWishlisted, toggleWishlist }) => (
  <div className="relative">
    <button
      onClick={() => toggleWishlist(product)}
      className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 shadow flex items-center justify-center hover:bg-red-50 transition-colors"
      aria-label="Toggle wishlist"
    >
      <svg className={`w-4 h-4 ${isWishlisted(product._id) ? 'text-red-500 fill-current' : 'text-gray-400'}`}
        fill={isWishlisted(product._id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    </button>
    <Link to={`/products/${product._id}`} className="block">
      <Card hover className="group relative">
        {product.badges?.length > 0 && (
          <div className="absolute top-3 left-3 flex gap-1 z-10">
            {product.badges.slice(0, 1).map((b, i) => (
              <span key={i} className="text-xs bg-gray-700 text-white px-2 py-0.5 rounded-full">{b}</span>
            ))}
          </div>
        )}
        <div className="aspect-square overflow-hidden bg-gray-100">
          <img
            src={product.images?.[0]?.url || 'https://placehold.co/600x600/f0f0f0/6b7280?text=Silver'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={e => { e.target.src = 'https://placehold.co/600x600/f0f0f0/6b7280?text=Silver' }}
          />
        </div>
        <div className="p-4">
          <h3 className="font-semibold mb-1 line-clamp-2 text-sm">{product.name}</h3>
          <p className="text-xs text-gray-500 mb-2">{product.purity} · {product.weight}g</p>
          <p className="text-lg font-bold text-gray-700">₹{product.price?.toLocaleString('en-IN')}</p>
        </div>
      </Card>
    </Link>
  </div>
)

const Silver = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeCategory = searchParams.get('category') || SILVER_CATEGORIES[0]
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const { isWishlisted, toggleWishlist } = useWishlist()

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const dbCategory = CAT_MAP[activeCategory] || activeCategory
      const res = await api.get('/products', {
        params: { metal: 'Silver', category: dbCategory, limit: 20 }
      })
      setProducts(res.data.products || [])
      setTotal(res.data.pagination?.total || 0)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }, [activeCategory])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  const setCategory = (cat) => setSearchParams({ category: cat })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* Hero */}
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.25em] text-gray-500/70 mb-2">Premium Collection</p>
        <h1 className="text-4xl font-serif font-bold text-gray-800 mb-3">Silver Jewellery</h1>
        <div className="w-20 h-1 bg-gray-400" />
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 flex-wrap mb-8">
        {SILVER_CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all border ${
              activeCategory === cat
                ? 'bg-gray-700 text-white border-gray-700 shadow-md'
                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Count row */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-500">
          <span className="font-semibold text-gray-800">{total}</span> products in {activeCategory}
        </p>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
        </div>
      ) : products.length === 0 ? (
        <EmptyState
          title={`No ${activeCategory} found`}
          description="Check back soon or browse other categories."
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {products.map(p => (
            <ProductCard key={p._id} product={p} isWishlisted={isWishlisted} toggleWishlist={toggleWishlist} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Silver
