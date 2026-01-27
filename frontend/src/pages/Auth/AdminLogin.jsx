import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { FiLock, FiMail, FiShield } from 'react-icons/fi';
import toast from 'react-hot-toast';
import axios from 'axios';
import { setTokens, updateUser, login } from '../../redux/slices/authSlice';
import { initializeSocket } from '../../services/socketService';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1';

const AdminLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const resultAction = await dispatch(login({ ...formData, expectedRole: 'admin' }));

      if (login.fulfilled.match(resultAction)) {
        toast.success('Welcome back, Admin!');
        navigate('/admin/dashboard');
      } else {
        // Error is handled by the thunk and displayed via toast effect in main App/Login or below catch?
        // Actually login thunk usually rejects with value.
        // We rely on the toast in useEffect? No, AdminLogin doesn't have the toast effect for error yet.
        // Let's add the toast effect or handle it here.
        if (resultAction.payload) {
          toast.error(resultAction.payload);
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Admin Login - NEXORA</title>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          {/* Logo & Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-4 shadow-lg">
              <FiShield className="w-10 h-10 text-blue-600" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Admin Portal</h2>
            <p className="text-blue-200">Secure access for administrators only</p>
          </div>

          {/* Login Form */}
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="admin@nexora.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  'Sign In to Admin Panel'
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link
                to="/"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                ← Back to Main Site
              </Link>
            </div>
          </div>

          {/* Security Notice */}
          <div className="mt-6 bg-blue-900 bg-opacity-50 backdrop-blur-sm rounded-lg p-4 text-center">
            <p className="text-sm text-blue-100">
              🔒 This is a secure admin area. All activities are logged.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLogin;
