import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { WishlistProvider } from './context/WishlistContext'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import GiftCards from './pages/GiftCards'
import Categories from './pages/Categories'
import Collections from './pages/Collections'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import Orders from './pages/Orders'
import OrderSuccess from './pages/OrderSuccess'
import OrderDetail from './pages/OrderDetail'
import AdminDashboard from './pages/admin/Dashboard'
import AdminProducts from './pages/admin/Products'
import AdminOrders from './pages/admin/Orders'
import AdminGoldRates from './pages/admin/GoldRates'
import AdminReports from './pages/admin/Reports'
import GoldRate from './pages/GoldRate'
import Wishlist from './pages/Wishlist'
import Gold from './pages/Gold'
import Silver from './pages/Silver'
import PrivateRoute from './components/PrivateRoute'
import AdminRoute from './components/AdminRoute'
import AdminLayout from './components/AdminLayout'

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<ProductDetail />} />
                <Route path="/gift-cards" element={<GiftCards />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/collections" element={<Collections />} />
                <Route path="/gold-rate" element={<GoldRate />} />
                <Route path="/gold" element={<Gold />} />
                <Route path="/silver" element={<Silver />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                <Route path="/checkout" element={
                  <PrivateRoute>
                    <Checkout />
                  </PrivateRoute>
                } />
                <Route path="/profile" element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                } />
                <Route path="/orders" element={
                  <PrivateRoute>
                    <Orders />
                  </PrivateRoute>
                } />

                <Route path="/order-success/:id" element={
                  <PrivateRoute>
                    <OrderSuccess />
                  </PrivateRoute>
                } />

                <Route path="/orders/:id" element={
                  <PrivateRoute>
                    <OrderDetail />
                  </PrivateRoute>
                } />

                <Route path="/wishlist" element={
                  <PrivateRoute>
                    <Wishlist />
                  </PrivateRoute>
                } />
                
                <Route path="/admin/dashboard" element={
                  <AdminRoute>
                    <AdminLayout>
                      <AdminDashboard />
                    </AdminLayout>
                  </AdminRoute>
                } />
                <Route path="/admin/products" element={
                  <AdminRoute>
                    <AdminLayout>
                      <AdminProducts />
                    </AdminLayout>
                  </AdminRoute>
                } />
                <Route path="/admin/orders" element={
                  <AdminRoute>
                    <AdminLayout>
                      <AdminOrders />
                    </AdminLayout>
                  </AdminRoute>
                } />
                <Route path="/admin/gold-rates" element={
                  <AdminRoute>
                    <AdminLayout>
                      <AdminGoldRates />
                    </AdminLayout>
                  </AdminRoute>
                } />
                <Route path="/admin/reports" element={
                  <AdminRoute>
                    <AdminLayout>
                      <AdminReports />
                    </AdminLayout>
                  </AdminRoute>
                } />
              </Routes>
            </main>
            <Footer />
            <Toaster position="top-right" />
          </div>
        </Router>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  )
}

export default App

