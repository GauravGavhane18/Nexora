import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

const Unauthorized = () => {
  return (
    <>
      <Helmet>
        <title>Unauthorized - NEXORA</title>
      </Helmet>
      
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-8">
            You don't have permission to access this page.
          </p>
          <Link to="/" className="btn btn-primary">
            Go Home
          </Link>
        </div>
      </div>
    </>
  )
}

export default Unauthorized