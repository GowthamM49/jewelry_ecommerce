import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
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
    metal: '',
    search: '',
    sort: 'newest'
  })
  const [pagination, setPagination] = useState({ page: 1, pages: 1 })

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

  const clearFilters = () => {
    setFilters({
      metal: '',
      search: '',
      sort: 'newest'
    })
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  const activeFilters = [
    filters.metal && { key: 'metal', label: filters.metal },
    filters.search && { key: 'search', label: `"${filters.search}"` }
  ].filter(Boolean)

  return (
    <div className="container-page py-10">
      <main>
          <PageHeader
            eyebrow="Premium Collection"
            title="Our Products"
            subtitle="All jewelry products in one place, including Gold and Silver."
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

          <Card className="mb-6">
            <div className="card-pad grid grid-cols-1 md:grid-cols-3 gap-3">
              <Input
                label="Search"
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="Search products..."
              />
              <div>
                <label className="label">Metal</label>
                <select
                  value={filters.metal}
                  onChange={(e) => handleFilterChange('metal', e.target.value)}
                  className="input-field"
                >
                  <option value="">All (Gold + Silver + More)</option>
                  <option value="Gold">Gold</option>
                  <option value="Silver">Silver</option>
                </select>
              </div>
              <div className="flex items-end">
                <Button variant="ghost" onClick={clearFilters} className="w-full md:w-auto">
                  Clear filters
                </Button>
              </div>
            </div>
          </Card>

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
                  {f.label} <span className="ml-1">x</span>
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
                        {product.metal} {product.purity} - {product.weight}g
                      </p>
                      <p className="text-xl font-bold text-gold-600">
                        Rs {product.price?.toLocaleString() || '0'}
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
  )
}

export default Products

