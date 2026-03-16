import { createContext, useContext, useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import api from '../utils/api'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Set auth token in axios headers
  const setAuthToken = (token) => {
    if (token) {
      const authHeader = `Bearer ${token}`
      api.defaults.headers.common['Authorization'] = authHeader
      localStorage.setItem('token', token)
    } else {
      delete api.defaults.headers.common['Authorization']
      localStorage.removeItem('token')
    }
  }

  // Load user from token on mount
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      setAuthToken(token)
      loadUser()
    } else {
      setLoading(false)
    }
  }, [])

  const loadUser = async () => {
    try {
      const res = await api.get('/users/me')
      if (res.data.success && res.data.user) {
        setUser(res.data.user)
      } else {
        throw new Error('Invalid user data')
      }
    } catch (error) {
      console.error('Error loading user:', error)
      localStorage.removeItem('token')
      setAuthToken(null)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const register = async (formData) => {
    try {
      const res = await api.post('/users/register', formData)
      if (res.data.success && res.data.token) {
        setAuthToken(res.data.token)
        setUser(res.data.user)
        toast.success('Registration successful!')
        return { success: true }
      } else {
        throw new Error('Invalid response from server')
      }
    } catch (error) {
      console.error('Registration error:', error)
      let message = 'Registration failed'
      
      if (error.response) {
        // Server responded with error
        message = error.response.data?.message || `Server error: ${error.response.status}`
      } else if (error.request) {
        // Request made but no response (backend not reachable or network issue)
        message = 'Cannot connect to server. Please check your internet connection or backend URL.'
      } else {
        // Something else happened
        message = error.message || 'Registration failed'
      }
      
      toast.error(message)
      return { success: false, error: message }
    }
  }

  const login = async (email, password) => {
    try {
      const res = await api.post('/users/login', { email, password })
      if (res.data.success && res.data.token) {
        setAuthToken(res.data.token)
        setUser(res.data.user)
        toast.success('Login successful!')
        return { success: true }
      } else {
        throw new Error('Invalid response from server')
      }
    } catch (error) {
      console.error('Login error:', error)
      let message = 'Login failed'
      
      if (error.response) {
        // Server responded with error
        message = error.response.data?.message || `Server error: ${error.response.status}`
      } else if (error.request) {
        // Request made but no response (backend not reachable or network issue)
        message = 'Cannot connect to server. Please check your internet connection or backend URL.'
      } else {
        // Something else happened
        message = error.message || 'Login failed'
      }
      
      toast.error(message)
      return { success: false, error: message }
    }
  }

  const logout = () => {
    setUser(null)
    setAuthToken(null)
    toast.success('Logged out successfully')
  }

  const updateProfile = async (formData) => {
    try {
      const res = await api.put('/users/me', formData)
      setUser(res.data.user)
      toast.success('Profile updated successfully!')
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Update failed'
      toast.error(message)
      return { success: false, error: message }
    }
  }

  const value = {
    user,
    loading,
    register,
    login,
    logout,
    updateProfile,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin' || user?.role === 'staff'
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

