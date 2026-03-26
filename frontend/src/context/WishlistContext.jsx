import { createContext, useContext, useState, useEffect } from 'react'
import api from '../utils/api'
import { useAuth } from './AuthContext'
import toast from 'react-hot-toast'

const WishlistContext = createContext()

export const useWishlist = () => {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider')
  return ctx
}

export const WishlistProvider = ({ children }) => {
  const [items, setItems] = useState([])
  const { isAuthenticated, loading: authLoading } = useAuth()

  useEffect(() => {
    if (authLoading) return
    if (!isAuthenticated) { setItems([]); return }
    api.get('/wishlist')
      .then(res => setItems(res.data.items || []))
      .catch(() => setItems([]))
  }, [isAuthenticated, authLoading])

  const isWishlisted = (productId) =>
    items.some(i => i._id === productId || i._id?.toString() === productId)

  const toggleWishlist = async (product) => {
    if (!isAuthenticated) {
      toast.error('Please login to use wishlist')
      return
    }
    // Optimistic update
    const already = isWishlisted(product._id)
    if (already) {
      setItems(prev => prev.filter(i => i._id !== product._id))
    } else {
      setItems(prev => [...prev, { ...product, addedAt: new Date() }])
    }

    try {
      const res = await api.post(`/wishlist/${product._id}`)
      if (res.data.action === 'added') {
        toast.success('Added to wishlist')
      } else {
        toast.success('Removed from wishlist')
      }
      // Sync with server
      const fresh = await api.get('/wishlist')
      setItems(fresh.data.items || [])
    } catch {
      // Revert on error
      setItems(prev => already
        ? [...prev, { ...product, addedAt: new Date() }]
        : prev.filter(i => i._id !== product._id)
      )
      toast.error('Failed to update wishlist')
    }
  }

  return (
    <WishlistContext.Provider value={{ items, isWishlisted, toggleWishlist }}>
      {children}
    </WishlistContext.Provider>
  )
}
