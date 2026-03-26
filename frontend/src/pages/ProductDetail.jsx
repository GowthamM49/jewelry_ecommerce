import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import api from '../utils/api'
import toast from 'react-hot-toast'
import { QRCodeSVG } from 'qrcode.react'
import { ProductDetailSkeleton } from '../components/Skeletons'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  useEffect(() => {
    fetchProduct()
  }, [id])

  const fetchProduct = async () => {
    setLoading(true)
    try {
      const res = await api.get(`/products/${id}`)
      setProduct(res.data.product)
    } catch (error) {
      console.error('Error fetching product:', error)
      toast.error('Product not found')
      navigate('/products')
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity)
      toast.success('Added to cart!')
    }
  }

  if (loading) {
    return <ProductDetailSkeleton />
  }

  if (!product) {
    return null
  }

  return (
    <div className="container-page py-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Images */}
        <div>
          <div
            className="aspect-square bg-gray-100 rounded-2xl overflow-hidden mb-4 shadow-soft hover:shadow-lift transition-shadow duration-300 cursor-zoom-in"
            onClick={() => setLightboxOpen(true)}
          >
            <img
              src={product.images?.[selectedImage]?.url || 'https://placehold.co/600x600/f5f0eb/b8860b?text=Jewelry'}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              onError={(e) => { e.target.src = 'https://placehold.co/600x600/f5f0eb/b8860b?text=Jewelry' }}
            />
          </div>
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? 'border-gold-500' : 'border-gray-200'
                  } focus-visible:ring-4 focus-visible:ring-gold-200`}
                  aria-label={`Select image ${index + 1}`}
                >
                  <img
                    src={img.url}
                    alt={img.alt || product.name}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <div className="flex items-center gap-3 flex-wrap mb-3">
            {product.badges?.map((badge, idx) => (
              <span key={idx} className="badge-gold">{badge}</span>
            ))}
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-4 text-[#7f1d4a]">{product.name}</h1>
          <p className="text-gray-600 mb-6">{product.description}</p>

          {/* Product Details */}
          <Card className="mb-6">
            <div className="card-pad">
              <h2 className="font-semibold text-lg mb-4">Product Details</h2>
              <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Product ID:</span>
                <span className="font-semibold">{product.productId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Category:</span>
                <span className="font-semibold">{product.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Metal:</span>
                <span className="font-semibold">{product.metal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Purity:</span>
                <span className="font-semibold">{product.purity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Weight:</span>
                <span className="font-semibold">{product.weight} {product.weightUnit || 'grams'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Stock:</span>
                <span className="font-semibold">{product.stock > 0 ? `${product.stock} available` : 'Out of stock'}</span>
              </div>
              {product.occasion && product.occasion !== 'NA' && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Occasion:</span>
                  <span className="font-semibold">{product.occasion}</span>
                </div>
              )}
              {product.style && product.style !== 'NA' && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Style:</span>
                  <span className="font-semibold">{product.style}</span>
                </div>
              )}
              {product.collectionName && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Collection:</span>
                  <span className="font-semibold">{product.collectionName}</span>
                </div>
              )}
              </div>
            </div>
          </Card>

          {/* Price Breakdown */}
          {product.priceDetails && (
            <div className="bg-gold-50 rounded-2xl p-6 mb-6 border border-gold-100">
              <h2 className="font-semibold text-lg mb-4 text-[#7f1d4a]">Price Breakdown</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Base Price:</span>
                  <span>₹{product.priceDetails.basePrice?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Making Charges ({product.makingChargesType === 'percentage' ? `${product.makingCharges}%` : `₹${product.makingCharges}`}):</span>
                  <span>₹{product.priceDetails.makingCharges?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST ({product.priceDetails.gstRate}%):</span>
                  <span>₹{product.priceDetails.gst?.toLocaleString()}</span>
                </div>
                <div className="border-t pt-2 mt-2 flex justify-between font-bold text-xl">
                  <span>Total:</span>
                  <span className="text-gold-700">₹{product.price?.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}

          {/* Care / Warranty */}
          {(product.warranty || product.careInstructions) && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6 space-y-3">
              {product.warranty && (
                <div>
                  <h3 className="font-semibold mb-1">Warranty / Guarantee</h3>
                  <p className="text-sm text-gray-700">{product.warranty}</p>
                </div>
              )}
              {product.careInstructions && (
                <div>
                  <h3 className="font-semibold mb-1">Care Instructions</h3>
                  <p className="text-sm text-gray-700">{product.careInstructions}</p>
                </div>
              )}
            </div>
          )}

          {/* Quantity & Add to Cart */}
          {product.stock > 0 ? (
            <div className="mb-6">
              <div className="flex items-center space-x-4 mb-4">
                <label className="font-semibold">Quantity:</label>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 border border-gray-300 rounded-xl hover:bg-gray-50 focus-visible:ring-4 focus-visible:ring-gold-200"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="w-10 h-10 border border-gray-300 rounded-xl hover:bg-gray-50 focus-visible:ring-4 focus-visible:ring-gold-200"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>
              <Button onClick={handleAddToCart} className="w-full mb-4" size="lg">
                Add to Cart
              </Button>
            </div>
          ) : (
            <Button disabled className="w-full mb-4" size="lg">
              Out of Stock
            </Button>
          )}

          {/* QR Code */}
          <Card className="text-center">
            <div className="card-pad">
              <p className="text-sm font-medium text-gray-700 mb-3">Scan to view product</p>
              <div className="flex justify-center mb-3">
                <div className="p-4 bg-white rounded-2xl shadow-inner">
                  <QRCodeSVG value={`${window.location.origin}/products/${id}`} size={120} />
                </div>
              </div>
              <p className="text-xs text-gray-500 font-medium">Product ID: {product.productId}</p>
            </div>
          </Card>
        </div>
      </div>

      {lightboxOpen && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={() => setLightboxOpen(false)}>
          <div className="max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={product.images?.[selectedImage]?.url || 'https://via.placeholder.com/900'}
              alt={product.name}
              className="w-full h-full object-contain rounded-2xl shadow-2xl"
            />
            <Button className="mt-4 w-full" onClick={() => setLightboxOpen(false)}>
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductDetail

