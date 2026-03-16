import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

const Login = () => {
  const navigate = useNavigate()
  const { login, isAuthenticated } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)

  // Redirect if already logged in
  if (isAuthenticated) {
    navigate('/')
    return null
  }

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const result = await login(formData.email, formData.password)
    if (result.success) {
      navigate('/')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-premium-light via-white to-premium-light py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-gold-500 to-gold-600 text-white font-bold text-2xl mb-4">
            S
          </div>
          <h2 className="text-4xl font-serif font-bold text-[#7f1d4a] mb-2">
            Welcome Back
          </h2>
          <p className="text-gray-600">Sign in to your account</p>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link to="/register" className="font-medium text-gold-600 hover:text-gold-500">
              create a new account
            </Link>
          </p>
        </div>
        <Card className="border border-gray-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="card-pad space-y-4">
              <Input
                label="Email address"
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
              />
              <Input
                label="Password"
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
              />

              <Button type="submit" loading={loading} className="w-full" size="lg">
                Sign in
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}

export default Login

