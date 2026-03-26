import { createContext, useContext, useState, useEffect } from 'react'
import api from '../utils/api'
import { useAuth } from './AuthContext'

const CartContext = createContext()

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([])
  const { isAuthenticated, loading: authLoading } = useAuth()

  // Load cart whenever auth state settles
  useEffect(() => {
    // Wait until auth has finished resolving
    if (authLoading) return

    const init = async () => {
      const savedCart = localStorage.getItem('cart')
      const localItems = savedCart ? (() => {
        try { return JSON.parse(savedCart) } catch { return [] }
      })() : []

      if (!isAuthenticated) {
        setCartItems(Array.isArray(localItems) ? localItems : [])
        return
      }

      try {
        // Merge any local guest cart into DB, then trust DB
        if (Array.isArray(localItems) && localItems.length > 0) {
          await api.put('/cart', {
            items: localItems.map(i => ({ productId: i.productId, quantity: i.quantity }))
          })
          localStorage.removeItem('cart')
        }

        const res = await api.get('/cart')
        const dbItems = res.data?.cart?.items || []
        setCartItems(
          dbItems.map(i => ({
            productId: i.product?._id,
            name: i.product?.name,
            price: i.product?.price || 0,
            image: i.product?.images?.[0]?.url || '',
            quantity: i.quantity,
            weight: i.product?.weight,
            purity: i.product?.purity,
            metal: i.product?.metal
          }))
        )
      } catch (e) {
        console.error('Error loading cart from server:', e)
        setCartItems(Array.isArray(localItems) ? localItems : [])
      }
    }

    init()
  }, [isAuthenticated, authLoading])

  // Save cart to localStorage whenever it changes (guest only)
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem('cart', JSON.stringify(cartItems))
    }
  }, [cartItems])

  const addToCart = (product, quantity = 1) => {
    if (isAuthenticated) {
      // optimistic UI update + sync
      setCartItems(prev => {
        const existing = prev.find(i => i.productId === product._id)
        if (existing) {
          return prev.map(i => i.productId === product._id ? { ...i, quantity: i.quantity + quantity } : i)
        }
        return [...prev, {
          productId: product._id,
          name: product.name,
          price: product.price,
          image: product.images?.[0]?.url || '',
          quantity,
          weight: product.weight,
          purity: product.purity,
          metal: product.metal
        }]
      })
      api.post('/cart/items', { productId: product._id, quantity }).catch(err => {
        console.error('Error syncing addToCart:', err)
      })
      return
    }

    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.productId === product._id)
      if (existingItem) {
        return prevItems.map(item =>
          item.productId === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }
      return [...prevItems, {
        productId: product._id,
        name: product.name,
        price: product.price,
        image: product.images?.[0]?.url || '',
        quantity,
        weight: product.weight,
        purity: product.purity,
        metal: product.metal
      }]
    })
  }

  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.productId !== productId))
    if (isAuthenticated) {
      api.delete(`/cart/items/${productId}`).catch(err => {
        console.error('Error syncing removeFromCart:', err)
      })
    }
  }

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.productId === productId ? { ...item, quantity } : item
      )
    )

    if (isAuthenticated) {
      api.put(`/cart/items/${productId}`, { quantity }).catch(err => {
        console.error('Error syncing updateQuantity:', err)
      })
    }
  }

  const clearCart = () => {
    setCartItems([])
    if (isAuthenticated) {
      api.delete('/cart').catch(err => {
        console.error('Error syncing clearCart:', err)
      })
    }
  }

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const getCartItemsCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0)
  }

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

