import { Link, useLocation, useParams } from 'react-router-dom'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

const OrderSuccess = () => {
  const { id } = useParams()
  const location = useLocation()
  const orderNumber = location.state?.orderNumber

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <Card className="w-full max-w-lg border border-gray-100 text-center">
        <div className="card-pad">
        <div className="mx-auto w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mb-4">
          <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-3xl font-serif font-bold text-[#7f1d4a] mb-2">
          Order Placed Successfully
        </h1>

        <p className="text-gray-600 mb-6">
          Thank you for your purchase. Your order has been created{orderNumber ? ` (Order #${orderNumber})` : ''}.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button as={Link} to="/products" className="w-full sm:w-auto">
            Continue Shopping
          </Button>
          <Button as={Link} to="/orders" variant="secondary" className="w-full sm:w-auto">
            View My Orders
          </Button>
          {id && (
            <Button as={Link} to={`/orders/${id}`} variant="secondary" className="w-full sm:w-auto">
              View This Order
            </Button>
          )}
        </div>
        </div>
      </Card>
    </div>
  )
}

export default OrderSuccess

