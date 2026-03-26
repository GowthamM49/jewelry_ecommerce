import { Link } from 'react-router-dom'
import { useWishlist } from '../context/WishlistContext'
import { useCart } from '../context/CartContext'
import PageHeader from '../components/ui/PageHeader'
import EmptyState from '../components/ui/EmptyState'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import toast from 'react-hot-toast'

const Wishlist = () => {
  const { items, toggleWishlist } = useWishlist()
  const { addToCart } = useCart()

  const handleMoveToCart = (item) => {
    addToCart({
      _id: item._id,
      name: item.name,
      price: item.price,
      images: item.images,
      weight: item.weight,
      purity: item.purity,
      metal: item.metal
    })
    toggleWishlist(item)
    toast.success('Moved to cart')
  }

  if (items.length === 0) {
    return (
      <div className="container-page py-16">
        <EmptyState
          title="Your wishlist is empty"
          description="Save items you love and come back to them anytime."
          icon={
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          }
          primaryAction={{ as: Link, label: 'Browse Products', props: { to: '/products' } }}
        />
      </div>
    )
  }

  return (
    <div className="container-page py-12">
      <PageHeader eyebrow="Saved Items" title="My Wishlist" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((item) => (
          <Card key={item._id} hover className="group relative">
            {/* Remove from wishlist */}
            <button
              onClick={() => toggleWishlist(item)}
              className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white shadow flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors"
              aria-label="Remove from wishlist"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>

            <Link to={`/products/${item._id}`}>
              <div className="aspect-square overflow-hidden bg-gray-100">
                <img
                  src={item.images?.[0]?.url || 'https://placehold.co/600x600/f5f0eb/b8860b?text=Jewelry'}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={e => { e.target.src = 'https://placehold.co/600x600/f5f0eb/b8860b?text=Jewelry' }}
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold mb-1 line-clamp-2">{item.name}</h3>
                <p className="text-sm text-gray-500 mb-2">
                  {item.metal} {item.purity !== 'NA' ? item.purity : ''} • {item.weight}g
                </p>
                <p className="text-xl font-bold text-gold-600">
                  ₹{item.price?.toLocaleString('en-IN') || '—'}
                </p>
              </div>
            </Link>

            <div className="px-4 pb-4">
              <Button
                className="w-full"
                size="sm"
                onClick={() => handleMoveToCart(item)}
              >
                Move to Cart
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default Wishlist
