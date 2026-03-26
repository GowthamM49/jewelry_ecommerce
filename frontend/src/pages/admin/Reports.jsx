import { useState } from 'react'
import api from '../../utils/api'
import toast from 'react-hot-toast'

const downloadBlob = (data, filename) => {
  const url = window.URL.createObjectURL(new Blob([data]))
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.URL.revokeObjectURL(url)
}

const Reports = () => {
  const [loadingKey, setLoadingKey] = useState(null)
  const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' })

  const today = new Date().toISOString().split('T')[0]

  const handleDateChange = (e) =>
    setDateRange(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const generateSalesReport = async () => {
    if (!dateRange.startDate || !dateRange.endDate) {
      toast.error('Please select both start and end dates')
      return
    }
    setLoadingKey('sales')
    try {
      const res = await api.get('/admin/reports/sales', { params: dateRange, responseType: 'blob' })
      downloadBlob(res.data, `sales-report-${dateRange.startDate}-to-${dateRange.endDate}.pdf`)
      toast.success('Sales report downloaded')
    } catch {
      toast.error('Failed to generate sales report')
    } finally { setLoadingKey(null) }
  }

  const generateInventoryReport = async () => {
    setLoadingKey('inventory')
    try {
      const res = await api.get('/admin/reports/inventory', { responseType: 'blob' })
      downloadBlob(res.data, `inventory-report-${today}.pdf`)
      toast.success('Inventory report downloaded')
    } catch {
      toast.error('Failed to generate inventory report')
    } finally { setLoadingKey(null) }
  }

  const generateUserReport = async () => {
    setLoadingKey('users')
    try {
      const res = await api.get('/admin/reports/users', { responseType: 'blob' })
      downloadBlob(res.data, `user-report-${today}.pdf`)
      toast.success('User report downloaded')
    } catch {
      toast.error('Failed to generate user report')
    } finally { setLoadingKey(null) }
  }

  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
        <p className="text-sm text-gray-500 mt-1">Generate and download PDF reports for sales, inventory, and users.</p>
      </div>

      {/* Report Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Sales Report */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-br from-[#7f1d4a] to-[#9d2a5f] p-6">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white">Sales Report</h3>
            <p className="text-white/70 text-sm mt-1">Revenue, orders & customer data by date range</p>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Start Date</label>
              <input
                type="date" name="startDate" value={dateRange.startDate}
                onChange={handleDateChange} max={today}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#7f1d4a]/30 focus:border-[#7f1d4a]"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">End Date</label>
              <input
                type="date" name="endDate" value={dateRange.endDate}
                onChange={handleDateChange} max={today}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#7f1d4a]/30 focus:border-[#7f1d4a]"
              />
            </div>
            <button
              onClick={generateSalesReport}
              disabled={loadingKey === 'sales'}
              className="w-full bg-[#7f1d4a] hover:bg-[#6b1840] disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
            >
              {loadingKey === 'sales' ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Generating…</>
              ) : (
                <><DownloadIcon /> Download PDF</>
              )}
            </button>
          </div>
        </div>

        {/* Inventory Report */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-6">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white">Inventory Report</h3>
            <p className="text-white/70 text-sm mt-1">Stock levels, values & low stock alerts</p>
          </div>
          <div className="p-6">
            <ul className="space-y-2 mb-6">
              {['Product names & categories', 'Current stock levels', 'Individual & total values', 'Low stock alerts'].map(item => (
                <li key={item} className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <button
              onClick={generateInventoryReport}
              disabled={loadingKey === 'inventory'}
              className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
            >
              {loadingKey === 'inventory' ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Generating…</>
              ) : (
                <><DownloadIcon /> Download PDF</>
              )}
            </button>
          </div>
        </div>

        {/* User Report */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white">User Report</h3>
            <p className="text-white/70 text-sm mt-1">Registered users, roles & account details</p>
          </div>
          <div className="p-6">
            <ul className="space-y-2 mb-6">
              {['User names & emails', 'Account creation dates', 'User roles & status', 'Activity summary'].map(item => (
                <li key={item} className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <button
              onClick={generateUserReport}
              disabled={loadingKey === 'users'}
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
            >
              {loadingKey === 'users' ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Generating…</>
              ) : (
                <><DownloadIcon /> Download PDF</>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Info banner */}
      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 flex gap-4 items-start">
        <div className="w-9 h-9 rounded-xl bg-[#7f1d4a]/10 flex items-center justify-center flex-shrink-0">
          <svg className="w-5 h-5 text-[#7f1d4a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-1">About Reports</p>
          <p className="text-xs text-gray-500 leading-relaxed">
            All reports are generated as PDF files and downloaded directly to your device.
            Sales reports require a date range. Inventory and user reports reflect current data at the time of generation.
          </p>
        </div>
      </div>
    </div>
  )
}

const DownloadIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
)

export default Reports
