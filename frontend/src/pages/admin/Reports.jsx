import { useState } from 'react'
import api from '../../utils/api'
import toast from 'react-hot-toast'
import PageHeader from '../../components/ui/PageHeader'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'

const Reports = () => {
  const [loading, setLoading] = useState(false)
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  })

  const handleDateChange = (e) => {
    const { name, value } = e.target
    setDateRange(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const generateSalesReport = async () => {
    if (!dateRange.startDate || !dateRange.endDate) {
      toast.error('Please select both start and end dates')
      return
    }

    setLoading(true)
    try {
      const response = await api.get('/admin/reports/sales', {
        params: dateRange,
        responseType: 'blob'
      })

      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `sales-report-${dateRange.startDate}-${dateRange.endDate}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)

      toast.success('Sales report generated successfully')
    } catch (error) {
      console.error('Error generating sales report:', error)
      toast.error('Failed to generate sales report')
    } finally {
      setLoading(false)
    }
  }

  const generateInventoryReport = async () => {
    setLoading(true)
    try {
      const response = await api.get('/admin/reports/inventory', {
        responseType: 'blob'
      })

      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `inventory-report-${new Date().toISOString().split('T')[0]}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)

      toast.success('Inventory report generated successfully')
    } catch (error) {
      console.error('Error generating inventory report:', error)
      toast.error('Failed to generate inventory report')
    } finally {
      setLoading(false)
    }
  }

  const generateUserReport = async () => {
    setLoading(true)
    try {
      const response = await api.get('/admin/reports/users', {
        responseType: 'blob'
      })

      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `user-report-${new Date().toISOString().split('T')[0]}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)

      toast.success('User report generated successfully')
    } catch (error) {
      console.error('Error generating user report:', error)
      toast.error('Failed to generate user report')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <PageHeader eyebrow="Admin" title="Reports" subtitle="Generate sales, inventory, and user reports in PDF format." />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Sales Report */}
        <Card hover className="p-6 border border-gray-100">
          <h3 className="text-xl font-semibold mb-4">Sales Report</h3>
          <p className="text-gray-600 text-sm mb-4">
            Generate a detailed sales report for a specific date range
          </p>

          <div className="space-y-3 mb-4">
            <Input
              label="Start Date"
              type="date"
              name="startDate"
              value={dateRange.startDate}
              onChange={handleDateChange}
            />
            <Input
              label="End Date"
              type="date"
              name="endDate"
              value={dateRange.endDate}
              onChange={handleDateChange}
            />
          </div>

          <Button onClick={generateSalesReport} loading={loading} className="w-full">
            Generate Sales Report
          </Button>
        </Card>

        {/* Inventory Report */}
        <Card hover className="p-6 border border-gray-100">
          <h3 className="text-xl font-semibold mb-4">Inventory Report</h3>
          <p className="text-gray-600 text-sm mb-4">
            Generate a complete inventory report with stock levels and values
          </p>

          <Button onClick={generateInventoryReport} loading={loading} className="w-full" variant="secondary">
            Generate Inventory Report
          </Button>
        </Card>

        {/* User Report */}
        <Card hover className="p-6 border border-gray-100">
          <h3 className="text-xl font-semibold mb-4">User Report</h3>
          <p className="text-gray-600 text-sm mb-4">
            Generate a report of all registered users and their details
          </p>

          <Button onClick={generateUserReport} loading={loading} className="w-full" variant="secondary">
            Generate User Report
          </Button>
        </Card>
      </div>

      {/* Report Information */}
      <Card className="mt-8 p-6 border border-gray-100">
        <h2 className="text-xl font-semibold mb-4">Report Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium mb-2">Sales Report Includes:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Order details and dates</li>
              <li>• Customer information</li>
              <li>• Total revenue and item counts</li>
              <li>• Order status summary</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-2">Inventory Report Includes:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Product names and categories</li>
              <li>• Current stock levels</li>
              <li>• Individual and total values</li>
              <li>• Low stock alerts</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-2">User Report Includes:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• User names and emails</li>
              <li>• Account creation dates</li>
              <li>• User roles and status</li>
              <li>• Activity summary</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-2">Report Features:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• PDF format for easy sharing</li>
              <li>• Automatic file cleanup</li>
              <li>• Date range filtering</li>
              <li>• Professional formatting</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default Reports