import { useEffect, useState } from 'react'
import api from '../../utils/api'
import toast from 'react-hot-toast'
import PageHeader from '../../components/ui/PageHeader'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'

const GoldRates = () => {
  const [rates, setRates] = useState({
    '22K': '',
    '18K': '',
    '14K': '',
    '24K': ''
  })
  const [currentRates, setCurrentRates] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCurrentRates()
  }, [])

  const fetchCurrentRates = async () => {
    try {
      const res = await api.get('/gold-rate')
      setCurrentRates(res.data.rates)
      setRates(res.data.rates)
    } catch (error) {
      console.error('Error fetching gold rates:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (purity, value) => {
    setRates(prev => ({
      ...prev,
      [purity]: value
    }))
  }

  const handleUpdate = async () => {
    try {
      await api.post('/gold-rate/update', { rates })
      toast.success('Gold rates updated successfully')
      fetchCurrentRates()
    } catch (error) {
      toast.error('Failed to update gold rates')
    }
  }

  const handleFetchFromAPI = async () => {
    try {
      const toastId = toast.loading('Fetching live rates...')

      const [goldRes, currencyRes] = await Promise.all([
        fetch('https://api.gold-api.com/price/XAU'),
        fetch('https://open.er-api.com/v6/latest/USD')
      ])

      if (!goldRes.ok || !currencyRes.ok) throw new Error('Failed to fetch external APIs')

      const goldData = await goldRes.json()
      const currencyData = await currencyRes.json()

      const priceUSD = goldData.price
      const exchangeRate = currencyData.rates.INR
      const startPricePerGram24K = (priceUSD * exchangeRate) / 31.1035

      const newRates = {
        '24K': Math.round(startPricePerGram24K),
        '22K': Math.round(startPricePerGram24K * 0.916),
        '18K': Math.round(startPricePerGram24K * 0.750),
        '14K': Math.round(startPricePerGram24K * 0.583)
      }

      setRates(newRates)
      toast.success('Gold rates fetched successfully', { id: toastId })

      // Optional: Auto-save or let user click Update
      // await api.post('/gold-rate/update', { rates: newRates })
      // fetchCurrentRates()
    } catch (error) {
      console.error(error)
      toast.error('Failed to fetch gold rates from API')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500"></div>
      </div>
    )
  }

  return (
    <div>
      <PageHeader eyebrow="Admin" title="Gold Rates" subtitle="Update rates used to compute product pricing." />

      <Card className="p-6 mb-6 border border-gray-100">
        <h2 className="text-xl font-semibold mb-4">Current Rates (per gram)</h2>
        <div className="space-y-4">
          {['22K', '18K', '14K', '24K'].map((purity) => (
            <div key={purity} className="flex items-center justify-between">
              <label className="text-lg font-medium w-24">{purity}</label>
              <div className="flex items-center space-x-4 flex-1">
                <span className="text-gray-600">₹</span>
                <input
                  type="number"
                  value={rates[purity] || ''}
                  onChange={(e) => handleInputChange(purity, e.target.value)}
                  className="input-field flex-1"
                  placeholder="Enter rate"
                  step="0.01"
                  min="0"
                />
                {currentRates && (
                  <span className="text-sm text-gray-500 w-32">
                    Current: ₹{currentRates[purity]?.toLocaleString() || 'N/A'}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="flex space-x-4 mt-6">
          <Button onClick={handleUpdate}>Update Rates</Button>
          <Button onClick={handleFetchFromAPI} variant="secondary">Fetch from API</Button>
        </div>
      </Card>

      <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4">
        <p className="text-sm text-yellow-800">
          <strong>Note:</strong> Gold rates are used to calculate product prices.
          Update rates regularly to ensure accurate pricing. The "Fetch from API"
          button uses a mock API in this demo.
        </p>
      </div>
    </div>
  )
}

export default GoldRates

