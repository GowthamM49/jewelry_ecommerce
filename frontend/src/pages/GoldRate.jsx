import { useEffect, useState } from 'react'
import api from '../utils/api'

const GoldRate = () => {
  const [rates, setRates] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchGoldRates()
  }, [])

  const fetchGoldRates = async () => {
    try {
      setLoading(true)
      // Fetch Gold Price (USD per ounce) and USD-INR Exchange Rate in parallel
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

      // Calculate rates for different purities
      const newRates = {
        '24K': Math.round(startPricePerGram24K),
        '22K': Math.round(startPricePerGram24K * 0.916),
        '18K': Math.round(startPricePerGram24K * 0.750),
        '14K': Math.round(startPricePerGram24K * 0.583)
      }

      setRates(newRates)
      setLastUpdated(new Date())

      // Optional: Attempt to save to backend silently or just display
      // api.post('/gold-rate/update', { rates: newRates }).catch(err => console.error("Background sync failed", err))

    } catch (error) {
      console.error('Error fetching live gold rates:', error)
      // Fallback to internal API or Default
      try {
        const res = await api.get('/gold-rate')
        if (res.data && res.data.rates) {
          setRates(res.data.rates)
          setLastUpdated(res.data.lastUpdated ? new Date(res.data.lastUpdated) : new Date())
        }
      } catch (innerError) {
        setRates({
          '22K': 0,
          '18K': 0,
          '14K': 0,
          '24K': 0
        })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <p className="text-sm uppercase tracking-[0.25em] text-[#7f1d4a]/60 mb-2">Live Rates</p>
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#7f1d4a] mb-4">Today's Gold Rate</h1>
        <div className="w-24 h-1 bg-gold-500"></div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500 mx-auto"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {rates && Object.entries(rates).map(([purity, rate]) => (
            <div key={purity} className="card p-6 text-center">
              <div className="text-3xl font-bold text-[#7f1d4a] mb-2">{purity}</div>
              <div className="text-2xl font-bold text-gold-600 mb-2">₹{rate?.toLocaleString()}</div>
              <div className="text-sm text-gray-600">per gram</div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 card p-6 bg-gold-50">
        <p className="text-sm text-gray-600 text-center">
          <strong>Updated on:</strong> {lastUpdated ? lastUpdated.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          }) : 'Loading...'}
        </p>
        <p className="text-xs text-gray-500 text-center mt-2">
          Gold rates are updated daily at 9:00 AM IST. Prices may vary based on market conditions.
        </p>
      </div>
    </div>
  )
}

export default GoldRate

