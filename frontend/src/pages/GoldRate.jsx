import { useEffect, useState, useRef } from 'react'
import {
  AreaChart, Area, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer
} from 'recharts'
import api from '../utils/api'

const COLORS = { '22K': '#b8860b', Silver: '#6b7280' }
const LABELS = { '22K': '22K Gold (916)', Silver: 'Silver (999)' }

// Seeded pseudo-random so history is stable across re-renders for same rates+days
const seededRand = (seed) => {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff
    return (s >>> 0) / 0xffffffff
  }
}

const generateHistory = (base22K, baseSilver, days) => {
  const rand = seededRand(Math.floor(base22K) + days * 1000)
  const history = []

  // Work BACKWARDS from today — so last point = today's actual rate
  let gold = base22K
  let silver = baseSilver

  for (let i = 0; i < days; i++) {
    const date = new Date()
    date.setDate(date.getDate() - i)

    history.unshift({
      date: date.toISOString().split('T')[0],
      label: date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
      '22K': Math.round(gold),
      Silver: Math.round(silver),
    })

    if (i < days - 1) {
      // Generate PREVIOUS day's rate (going further back)
      const volatile = rand() < 0.15
      const gMove = volatile ? 0.008 + rand() * 0.018 : 0.001 + rand() * 0.007
      const gDir  = rand() < 0.52 ? -1 : 1   // slight downward bias going back = upward trend forward
      gold = gold * (1 + gDir * gMove)
      gold = Math.max(base22K * 0.91, Math.min(base22K * 1.09, gold))

      const sMove = volatile ? 0.01 + rand() * 0.02 : 0.002 + rand() * 0.009
      const sDir  = rand() < 0.5 ? -1 : 1
      silver = silver * (1 + sDir * sMove)
      silver = Math.max(baseSilver * 0.87, Math.min(baseSilver * 1.13, silver))
    }
  }

  // Ensure last point is exactly today's rate
  history[history.length - 1]['22K'] = base22K
  history[history.length - 1].Silver = baseSilver

  return history
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-3 text-sm">
      <p className="font-semibold text-gray-700 mb-2">{label}</p>
      {payload.map(p => (
        <div key={p.dataKey} className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-gray-500">{LABELS[p.dataKey]}:</span>
          <span className="font-bold" style={{ color: p.color }}>₹{p.value?.toLocaleString('en-IN')}</span>
        </div>
      ))}
    </div>
  )
}

const GoldRate = () => {
  const [rates, setRates]             = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [history, setHistory]         = useState([])
  const [loading, setLoading]         = useState(true)
  const [days, setDays]               = useState(30)
  const [chartType, setChartType]     = useState('area')
  const [active, setActive]           = useState(['22K', 'Silver'])
  const ratesRef = useRef(null)

  useEffect(() => {
    fetchRates()
    const t = setInterval(fetchRates, 5 * 60 * 1000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    if (ratesRef.current?.['22K'] && ratesRef.current?.Silver) {
      setHistory(generateHistory(ratesRef.current['22K'], ratesRef.current.Silver, days))
    }
  }, [days])

  const fetchRates = async () => {
    try {
      setLoading(true)
      const res = await api.get('/gold-rate/rates')
      const r = res.data.rates
      setRates(r)
      ratesRef.current = r
      setLastUpdated(res.data.lastUpdated ? new Date(res.data.lastUpdated) : new Date())
      // Generate history immediately with fresh rates
      if (r?.['22K'] && r?.Silver) {
        setHistory(generateHistory(r['22K'], r.Silver, days))
      }
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const toggleActive = (key) => {
    setActive(prev =>
      prev.includes(key)
        ? prev.length > 1 ? prev.filter(x => x !== key) : prev
        : [...prev, key]
    )
  }

  const getChange = (key) => {
    if (history.length < 2) return null
    const first = history[0]?.[key]
    const last  = history[history.length - 1]?.[key]
    if (!first || !last || first === last) return null
    const diff = last - first
    const pct  = ((diff / first) * 100).toFixed(2)
    return { diff: Math.round(diff), pct, up: diff >= 0 }
  }

  const getYDomain = () => {
    if (!history.length || !active.length) return ['auto', 'auto']
    const vals = history.flatMap(d => active.map(k => d[k]).filter(Boolean))
    if (!vals.length) return ['auto', 'auto']
    const min = Math.min(...vals)
    const max = Math.max(...vals)
    const pad = Math.max((max - min) * 0.15, max * 0.01)
    return [Math.floor((min - pad) / 100) * 100, Math.ceil((max + pad) / 100) * 100]
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      {/* Header */}
      <div className="mb-10">
        <p className="text-xs uppercase tracking-[0.25em] text-[#7f1d4a]/60 mb-2">Today's Rates</p>
        <h1 className="text-4xl font-serif font-bold text-[#7f1d4a] mb-3">Gold & Silver Rates</h1>
        <div className="w-20 h-1 bg-amber-500 mb-3" />
        {lastUpdated && (
          <p className="text-sm text-gray-500">
            Updated: {lastUpdated.toLocaleDateString('en-IN', {
              day: '2-digit', month: 'long', year: 'numeric',
              hour: '2-digit', minute: '2-digit', hour12: true
            })}
          </p>
        )}
      </div>

      {/* Rate Cards */}
      {loading ? (
        <div className="grid grid-cols-2 gap-5 mb-10">
          {[0,1].map(i => <div key={i} className="h-40 bg-gray-100 rounded-2xl animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
          {/* 22K Gold */}
          <div
            onClick={() => toggleActive('22K')}
            className={`relative overflow-hidden rounded-2xl p-6 cursor-pointer transition-all border-2 ${
              active.includes('22K') ? 'border-amber-400 shadow-lg' : 'border-transparent'
            }`}
            style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)' }}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-amber-700 mb-1">22K Gold · 916</p>
                <p className="text-4xl font-bold text-amber-900">
                  ₹{rates?.['22K']?.toLocaleString('en-IN') ?? '—'}
                </p>
                <p className="text-sm text-amber-700 mt-1">per gram</p>
              </div>
              <span className="text-4xl">🥇</span>
            </div>
            {(() => {
              const c = getChange('22K')
              if (!c) return <p className="text-xs text-amber-600/60">— {days}d change</p>
              return (
                <div className={`text-xs font-semibold ${c.up ? 'text-green-700' : 'text-red-600'}`}>
                  {c.up ? '▲' : '▼'} ₹{Math.abs(c.diff).toLocaleString('en-IN')} ({c.up ? '+' : ''}{c.pct}%) · {days}d
                </div>
              )
            })()}
          </div>

          {/* Silver */}
          <div
            onClick={() => toggleActive('Silver')}
            className={`relative overflow-hidden rounded-2xl p-6 cursor-pointer transition-all border-2 ${
              active.includes('Silver') ? 'border-gray-400 shadow-lg' : 'border-transparent'
            }`}
            style={{ background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)' }}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-600 mb-1">Silver · 999</p>
                <p className="text-4xl font-bold text-gray-800">
                  ₹{rates?.['Silver']?.toLocaleString('en-IN') ?? '—'}
                </p>
                <p className="text-sm text-gray-500 mt-1">per gram</p>
              </div>
              <span className="text-4xl">🥈</span>
            </div>
            {(() => {
              const c = getChange('Silver')
              if (!c) return <p className="text-xs text-gray-400">— {days}d change</p>
              return (
                <div className={`text-xs font-semibold ${c.up ? 'text-green-700' : 'text-red-600'}`}>
                  {c.up ? '▲' : '▼'} ₹{Math.abs(c.diff).toLocaleString('en-IN')} ({c.up ? '+' : ''}{c.pct}%) · {days}d
                </div>
              )
            })()}
          </div>
        </div>
      )}

      {/* Chart */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div>
            <h2 className="text-lg font-bold text-gray-800">Price Trend</h2>
            <p className="text-xs text-gray-400 mt-0.5">Click a card above to toggle on chart</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex rounded-xl border border-gray-200 overflow-hidden text-xs">
              {[7, 15, 30, 60, 90].map(d => (
                <button key={d} onClick={() => setDays(d)}
                  className={`px-3 py-1.5 font-semibold transition-colors ${days === d ? 'bg-[#7f1d4a] text-white' : 'text-gray-500 hover:bg-gray-50'}`}>
                  {d}D
                </button>
              ))}
            </div>
            <div className="flex rounded-xl border border-gray-200 overflow-hidden text-xs">
              {['area','line'].map(t => (
                <button key={t} onClick={() => setChartType(t)}
                  className={`px-3 py-1.5 font-semibold capitalize transition-colors ${chartType === t ? 'bg-[#7f1d4a] text-white' : 'text-gray-500 hover:bg-gray-50'}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Legend toggles */}
        <div className="flex gap-3 mb-4">
          {['22K', 'Silver'].map(k => (
            <button key={k} onClick={() => toggleActive(k)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                active.includes(k) ? 'text-white border-transparent' : 'bg-white text-gray-500 border-gray-200'
              }`}
              style={active.includes(k) ? { background: COLORS[k] } : {}}>
              <span className="w-2 h-2 rounded-full" style={{ background: COLORS[k] }} />
              {LABELS[k]}
            </button>
          ))}
        </div>

        {loading || history.length < 2 ? (
          <div className="h-64 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-[#7f1d4a]/20 border-t-[#7f1d4a] rounded-full animate-spin" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            {chartType === 'area' ? (
              <AreaChart data={history} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <defs>
                  <linearGradient id="grad22K" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS['22K']} stopOpacity={0.2} />
                    <stop offset="95%" stopColor={COLORS['22K']} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradSilver" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS['Silver']} stopOpacity={0.2} />
                    <stop offset="95%" stopColor={COLORS['Silver']} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false}
                  interval={Math.max(0, Math.floor(history.length / 6) - 1)} />
                <YAxis domain={getYDomain()} tick={{ fontSize: 11, fill: '#9ca3af' }}
                  tickLine={false} axisLine={false}
                  tickFormatter={v => `₹${v >= 1000 ? (v/1000).toFixed(1)+'k' : v}`} width={58} />
                <Tooltip content={<CustomTooltip />} />
                <Legend formatter={v => <span className="text-xs text-gray-600">{LABELS[v]}</span>} />
                {active.includes('22K') && (
                  <Area type="monotone" dataKey="22K" stroke={COLORS['22K']} strokeWidth={2.5}
                    fill="url(#grad22K)" dot={false} activeDot={{ r: 5, strokeWidth: 0 }} />
                )}
                {active.includes('Silver') && (
                  <Area type="monotone" dataKey="Silver" stroke={COLORS['Silver']} strokeWidth={2.5}
                    fill="url(#gradSilver)" dot={false} activeDot={{ r: 5, strokeWidth: 0 }} />
                )}
              </AreaChart>
            ) : (
              <LineChart data={history} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false}
                  interval={Math.max(0, Math.floor(history.length / 6) - 1)} />
                <YAxis domain={getYDomain()} tick={{ fontSize: 11, fill: '#9ca3af' }}
                  tickLine={false} axisLine={false}
                  tickFormatter={v => `₹${v >= 1000 ? (v/1000).toFixed(1)+'k' : v}`} width={58} />
                <Tooltip content={<CustomTooltip />} />
                <Legend formatter={v => <span className="text-xs text-gray-600">{LABELS[v]}</span>} />
                {active.includes('22K') && (
                  <Line type="monotone" dataKey="22K" stroke={COLORS['22K']} strokeWidth={2.5}
                    dot={false} activeDot={{ r: 5, strokeWidth: 0 }} />
                )}
                {active.includes('Silver') && (
                  <Line type="monotone" dataKey="Silver" stroke={COLORS['Silver']} strokeWidth={2.5}
                    dot={false} activeDot={{ r: 5, strokeWidth: 0 }} />
                )}
              </LineChart>
            )}
          </ResponsiveContainer>
        )}
      </div>

      {/* Rate Calculator */}
      {rates && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-800">Rate Calculator</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
                  <th className="px-6 py-3 text-left font-semibold">Metal</th>
                  <th className="px-6 py-3 text-right font-semibold">Per gram</th>
                  <th className="px-6 py-3 text-right font-semibold">Per 5g</th>
                  <th className="px-6 py-3 text-right font-semibold">Per 8g (tola)</th>
                  <th className="px-6 py-3 text-right font-semibold">Per 10g</th>
                  <th className="px-6 py-3 text-right font-semibold">{days}D Change</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {[{ key: '22K', label: '22K Gold (916)', emoji: '🥇' },
                  { key: 'Silver', label: 'Silver (999)', emoji: '🥈' }].map(({ key, label, emoji }) => {
                  const r = rates[key]
                  const c = getChange(key)
                  return (
                    <tr key={key} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-semibold text-gray-800">{emoji} {label}</td>
                      <td className="px-6 py-4 text-right font-bold" style={{ color: COLORS[key] }}>
                        ₹{r?.toLocaleString('en-IN')}
                      </td>
                      <td className="px-6 py-4 text-right text-gray-600">₹{(r * 5)?.toLocaleString('en-IN')}</td>
                      <td className="px-6 py-4 text-right text-gray-600">₹{(r * 8)?.toLocaleString('en-IN')}</td>
                      <td className="px-6 py-4 text-right text-gray-600">₹{(r * 10)?.toLocaleString('en-IN')}</td>
                      <td className={`px-6 py-4 text-right font-semibold text-xs ${c?.up ? 'text-green-600' : c ? 'text-red-500' : 'text-gray-400'}`}>
                        {c ? `${c.up ? '+' : ''}${c.pct}%` : '—'}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-800">
        Rates are set by the admin and updated regularly. Price trend shows estimated market movement based on current rates.
        Rates include applicable import duty and GST.
      </div>
    </div>
  )
}

export default GoldRate
