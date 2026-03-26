import { useEffect, useState } from 'react'
import api from '../../utils/api'
import toast from 'react-hot-toast'

const FIELDS = [
  {
    key: '22K',
    label: '22K Gold',
    sub: '916 Hallmark',
    color: 'from-amber-500 to-amber-600',
    icon: '🥇'
  },
  {
    key: 'Silver',
    label: 'Silver',
    sub: '999 Fine Silver',
    color: 'from-gray-400 to-gray-500',
    icon: '🥈'
  }
]

const GoldRates = () => {
  const [rates, setRates]           = useState({ '22K': '', Silver: '' })
  const [current, setCurrent]       = useState({ '22K': null, Silver: null })
  const [lastUpdated, setLastUpdated] = useState(null)
  const [source, setSource]         = useState(null)
  const [loading, setLoading]       = useState(true)
  const [saving, setSaving]         = useState(false)
  const [fetching, setFetching]     = useState(false)

  useEffect(() => { fetchRates() }, [])

  const fetchRates = async () => {
    setLoading(true)
    try {
      const res = await api.get('/gold-rate/rates')
      const r = res.data.rates
      setCurrent({ '22K': r['22K'], Silver: r['Silver'] })
      setRates({ '22K': r['22K'] || '', Silver: r['Silver'] || '' })
      setLastUpdated(res.data.lastUpdated ? new Date(res.data.lastUpdated) : null)
      setSource(res.data.source)
    } catch {
      toast.error('Failed to load rates')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!rates['22K'] || !rates['Silver']) {
      toast.error('Please enter both rates')
      return
    }
    setSaving(true)
    try {
      await api.post('/gold-rate/update', {
        rates: { '22K': Number(rates['22K']), Silver: Number(rates['Silver']) },
        source: 'manual'
      })
      toast.success('Rates saved — admin override active')
      fetchRates()
    } catch {
      toast.error('Failed to save rates')
    } finally { setSaving(false) }
  }

  const handleFetchLive = async () => {
    setFetching(true)
    const id = toast.loading('Fetching live rates from API…')
    try {
      await api.post('/gold-rate/fetch-api')
      toast.success('Live rates fetched and saved', { id })
      fetchRates()
    } catch {
      toast.error('Failed to fetch live rates', { id })
    } finally { setFetching(false) }
  }

  const handleClearOverride = async () => {
    if (!window.confirm('Clear admin override? API rates will be used instead.')) return
    setSaving(true)
    try {
      await api.post('/gold-rate/fetch-api')
      toast.success('Override cleared — now using live API rates')
      fetchRates()
    } catch {
      toast.error('Failed to clear override')
    } finally { setSaving(false) }
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gold & Silver Rates</h1>
          <p className="text-sm text-gray-500 mt-1">
            Admin values override API rates for product pricing.
          </p>
        </div>
        {lastUpdated && (
          <div className="text-right">
            <p className="text-xs text-gray-400">Last updated</p>
            <p className="text-sm font-medium text-gray-700">
              {lastUpdated.toLocaleDateString('en-IN', {
                day: '2-digit', month: 'short', year: 'numeric',
                hour: '2-digit', minute: '2-digit', hour12: true
              })}
            </p>
          </div>
        )}
      </div>

      {/* Source badge */}
      {source && (
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${
          source === 'admin' ? 'bg-[#7f1d4a]/10 text-[#7f1d4a]'
          : source === 'live' ? 'bg-green-100 text-green-700'
          : 'bg-blue-100 text-blue-700'
        }`}>
          <span className="w-1.5 h-1.5 rounded-full bg-current" />
          {source === 'admin' ? 'Admin Override Active'
           : source === 'live' ? 'Live API Rates'
           : 'Database Rates'}
        </div>
      )}

      {/* Current rate display cards */}
      {loading ? (
        <div className="grid grid-cols-2 gap-5">
          {[0,1].map(i => <div key={i} className="h-32 bg-gray-100 rounded-2xl animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {FIELDS.map(f => (
            <div key={f.key} className={`bg-gradient-to-br ${f.color} rounded-2xl p-6 text-white`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">{f.icon}</span>
                <span className="text-xs bg-white/20 px-2 py-1 rounded-full">{f.sub}</span>
              </div>
              <p className="text-3xl font-bold">
                ₹{current[f.key]?.toLocaleString('en-IN') ?? '—'}
              </p>
              <p className="text-white/70 text-sm mt-1">{f.label} · per gram</p>
            </div>
          ))}
        </div>
      )}

      {/* Edit form */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-base font-semibold text-gray-800 mb-5">Update Rates (Admin Override)</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
          {FIELDS.map(f => (
            <div key={f.key}>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                {f.label} Rate (₹ per gram)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">₹</span>
                <input
                  type="number"
                  value={rates[f.key]}
                  onChange={e => setRates(p => ({ ...p, [f.key]: e.target.value }))}
                  placeholder={`e.g. ${f.key === '22K' ? '13950' : '96'}`}
                  min="0"
                  step="1"
                  className="w-full border border-gray-200 rounded-xl pl-8 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#7f1d4a]/30 focus:border-[#7f1d4a]"
                />
              </div>
              {current[f.key] && (
                <p className="text-xs text-gray-400 mt-1">
                  Current: ₹{current[f.key]?.toLocaleString('en-IN')}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-[#7f1d4a] hover:bg-[#6b1840] disabled:opacity-60 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm"
          >
            {saving && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
            Update Rates
          </button>
          <button
            onClick={handleFetchLive}
            disabled={fetching}
            className="flex items-center gap-2 border border-gray-200 hover:bg-gray-50 disabled:opacity-60 text-gray-700 font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm"
          >
            {fetching && <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />}
            Fetch Live from API
          </button>
          {source === 'admin' && (
            <button
              onClick={handleClearOverride}
              className="text-sm text-red-500 hover:text-red-700 font-medium px-3 py-2.5 transition-colors"
            >
              Clear Override
            </button>
          )}
        </div>
      </div>

    </div>
  )
}

export default GoldRates
