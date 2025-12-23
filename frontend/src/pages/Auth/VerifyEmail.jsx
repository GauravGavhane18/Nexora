import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

const VerifyEmail = () => {
  const { token } = useParams()
  const [status, setStatus] = useState('verifying')

  useEffect(() => {
    // Simulate verification
    setTimeout(() => {
      setStatus('success')
    }, 2000)
  }, [token])

  return (
    <>
      <Helmet><title>Verify Email - NEXORA</title></Helmet>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
        <div className="max-w-md w-full text-center">
          {status === 'verifying' && (
            <>
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Verifying Your Email...</h2>
              <p className="text-gray-600">Please wait while we verify your email address.</p>
            </>
          )}
          {status === 'success' && (
            <>
              <div className="text-6xl mb-4">✅</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Email Verified!</h2>
              <p className="text-gray-600 mb-8">Your email has been successfully verified. You can now access all features.</p>
              <Link to="/login" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">Sign In</Link>
            </>
          )}
          {status === 'error' && (
            <>
              <div className="text-6xl mb-4">❌</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Verification Failed</h2>
              <p className="text-gray-600 mb-8">The verification link is invalid or has expired.</p>
              <Link to="/register" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">Register Again</Link>
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default VerifyEmail