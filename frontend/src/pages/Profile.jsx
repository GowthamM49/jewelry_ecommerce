import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import PageHeader from '../components/ui/PageHeader'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

const Profile = () => {
  const { user, updateProfile } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: ''
    }
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: {
          street: user.address?.street || '',
          city: user.address?.city || '',
          state: user.address?.state || '',
          zipCode: user.address?.zipCode || ''
        }
      })
    }
  }, [user])

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1]
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const result = await updateProfile(formData)
    setLoading(false)
  }

  if (!user) {
    return null
  }

  return (
    <div className="container-page py-12">
      <PageHeader eyebrow="Account Settings" title="My Profile" />

      <Card className="border border-gray-100">
        <form onSubmit={handleSubmit} className="card-pad space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
            <Input
              label="Phone Number"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            disabled
            helper="Email cannot be changed"
            inputClassName="bg-gray-100"
          />

          <div className="divider pt-4">
            <h3 className="text-lg font-semibold mb-4">Address</h3>
            <div className="space-y-4">
              <Input
                label="Street Address"
                type="text"
                name="address.street"
                value={formData.address.street}
                onChange={handleChange}
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="City"
                  type="text"
                  name="address.city"
                  value={formData.address.city}
                  onChange={handleChange}
                />
                <Input
                  label="State"
                  type="text"
                  name="address.state"
                  value={formData.address.state}
                  onChange={handleChange}
                />
                <Input
                  label="ZIP Code"
                  type="text"
                  name="address.zipCode"
                  value={formData.address.zipCode}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <Button type="submit" loading={loading} size="lg">
            Update Profile
          </Button>
        </form>
      </Card>
    </div>
  )
}

export default Profile

