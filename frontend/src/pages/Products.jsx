import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import api from '../utils/api'
import { ProductCardSkeleton } from '../components/Skeletons'
import PageHeader from '../components/ui/PageHeader'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import EmptyState from '../components/ui/EmptyState'

const Products = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    category: '',
    metal: '',
    purity: '',
    occasion: '',
    style: '',
    minWeight: '',
    maxWeight: '',
    search: '',
    sort: 'newest'
  })
  const [pagination, setPagination] = useState({ page: 1, pages: 1 })
  const [searchParams, setSearchParams] = useSearchParams()

  useEffect(() => {
    // Initialize filters from URL params
    const category = searchParams.get('category') || ''
    setFilters(prev => ({ ...prev, category }))
  }, [searchParams])

  useEffect(() => {
    fetchProducts()
  }, [filters, pagination.page])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const params = {
        page: pagination.page,
        ...filters
      }
      const res = await api.get('/products', { params })
      setProducts(res.data.products)
      setPagination(res.data.pagination)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  const categories = ['Rings', 'Necklaces', 'Earrings', 'Bracelets', 'Bangles', 'Pendants', 'Chains', 'Sets']
  const metals = ['Gold', 'Silver', 'Platinum', 'Diamond']
  const purities = ['22K', '18K', '14K', '24K', '925', '999']
  const occasions = ['Bridal', 'Daily Wear', 'Festive', 'Office', 'Party', 'Casual']
  const styles = ['Traditional', 'Minimal', 'Contemporary', 'Heritage', 'Statement']

  const clearFilters = () => {
    setFilters({
      category: '',
      metal: '',
      purity: '',
      occasion: '',
      style: '',
      minWeight: '',
      maxWeight: '',
      search: '',
      sort: 'newest',
    })
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  const activeFilters = [
    filters.category && { key: 'category', label: filters.category },
    filters.metal && { key: 'metal', label: filters.metal },
    filters.purity && { key: 'purity', label: filters.purity },
    filters.occasion && { key: 'occasion', label: filters.occasion },
    filters.style && { key: 'style', label: filters.style },
    filters.minWeight && { key: 'minWeight', label: `Min ${filters.minWeight}g` },
    filters.maxWeight && { key: 'maxWeight', label: `Max ${filters.maxWeight}g` },
    filters.search && { key: 'search', label: `“${filters.search}”` },
  ].filter(Boolean)

  return (
    <div className="container-page py-10">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="w-full md:w-72 flex-shrink-0">
          <Card className="sticky top-20">
            <div className="card-pad space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Filters</h2>
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Clear
                </Button>
              </div>
            
            {/* Search */}
            <Input
              label="Search"
              type="text"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              placeholder="Search products..."
            />

            {/* Category */}
            <div>
              <label className="label">Category</label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="input-field"
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Metal */}
            <div>
              <label className="label">Metal</label>
              <select
                value={filters.metal}
                onChange={(e) => handleFilterChange('metal', e.target.value)}
                className="input-field"
              >
                <option value="">All Metals</option>
                {metals.map(metal => (
                  <option key={metal} value={metal}>{metal}</option>
                ))}
              </select>
            </div>

            {/* Purity */}
            <div>
              <label className="label">Purity</label>
              <select
                value={filters.purity}
                onChange={(e) => handleFilterChange('purity', e.target.value)}
                className="input-field"
              >
                <option value="">All Purity</option>
                {purities.map(purity => (
                  <option key={purity} value={purity}>{purity}</option>
                ))}
              </select>
            </div>

            {/* Occasion */}
            <div>
              <label className="label">Occasion</label>
              <select
                value={filters.occasion}
                onChange={(e) => handleFilterChange('occasion', e.target.value)}
                className="input-field"
              >
                <option value="">Any</option>
                {occasions.map(item => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>

            {/* Style */}
            <div>
              <label className="label">Style</label>
              <select
                value={filters.style}
                onChange={(e) => handleFilterChange('style', e.target.value)}
                className="input-field"
              >
                <option value="">Any</option>
                {styles.map(item => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>

            {/* Weight range */}
            <div>
              <label className="label">Weight (grams)</label>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  placeholder="Min"
                  value={filters.minWeight}
                  onChange={(e) => handleFilterChange('minWeight', e.target.value)}
                  className="input-field"
                />
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  placeholder="Max"
                  value={filters.maxWeight}
                  onChange={(e) => handleFilterChange('maxWeight', e.target.value)}
                  className="input-field"
                />
              </div>
            </div>
            </div>
          </Card>
        </aside>

        {/* Products Grid */}
        <main className="flex-1">
          <PageHeader
            eyebrow="Premium Collection"
            title="Our Products"
            subtitle="Discover premium jewelry curated by category, metal, and style."
            right={
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">
                  Total: <span className="font-semibold text-gray-900">{pagination.total || products.length}</span>
                </span>
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600">Sort:</label>
                  <select
                    value={filters.sort}
                    onChange={(e) => handleFilterChange('sort', e.target.value)}
                    className="input-field w-48"
                  >
                    <option value="newest">Newest</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="bestseller">Bestseller</option>
                  </select>
                </div>
              </div>
            }
          />

          {activeFilters.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <span className="text-sm text-gray-600 mr-1">Active filters:</span>
              {activeFilters.map((f) => (
                <button
                  key={f.key}
                  onClick={() => handleFilterChange(f.key, '')}
                  className="badge-muted hover:bg-gray-200 transition-colors"
                  aria-label={`Remove filter ${f.label}`}
                >
                  {f.label} <span className="ml-1">×</span>
                </button>
              ))}
              <Button variant="ghost" size="sm" onClick={clearFilters} className="ml-1">
                Clear all
              </Button>
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <EmptyState
              title="No products found"
              description="Try changing filters or searching with a different keyword."
              primaryAction={{ as: 'button', label: 'Clear filters', props: { onClick: clearFilters } }}
            />
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <Link
                    key={product._id}
                    to={`/products/${product._id}`}
                    className="block"
                  >
                    <Card hover className="group relative">
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
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
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
                    </Card>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="flex justify-center items-center space-x-2 mt-8">
                  <Button
                    variant="secondary"
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                    disabled={pagination.page === 1}
                  >
                    Previous
                  </Button>
                  <span className="px-4">
                    Page {pagination.page} of {pagination.pages}
                  </span>
                  <Button
                    variant="secondary"
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                    disabled={pagination.page === pagination.pages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  )
}

export default Products

