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

      <div className="min-h-screen bg-dark-950 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary-600/20 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-md w-full relative z-10">
          {/* Logo & Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl mb-6 shadow-2xl rotate-3 hover:rotate-0 transition-all duration-300">
              <FiShield className="w-10 h-10 text-primary-400" />
            </div>
            <h2 className="text-4xl font-bold font-display text-white mb-2 tracking-tight">Admin Portal</h2>
            <p className="text-gray-400 text-lg">Secure access for administrators</p>
          </div>

          {/* Login Form */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 font-display">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiMail className="h-5 w-5 text-gray-400 group-focus-within:text-primary-400 transition-colors" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="block w-full pl-11 pr-4 py-4 bg-dark-900/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white placeholder-gray-500 transition-all outline-none"
                    placeholder="admin@nexora.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 font-display">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiLock className="h-5 w-5 text-gray-400 group-focus-within:text-primary-400 transition-colors" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="block w-full pl-11 pr-4 py-4 bg-dark-900/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white placeholder-gray-500 transition-all outline-none"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white py-4 px-4 rounded-xl hover:from-primary-500 hover:to-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-dark-950 font-bold tracking-wide transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg shadow-primary-900/20"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Authenticating...
                  </div>
                ) : (
                  'Access Dashboard'
                )}
              </button>
            </form>

            <div className="mt-8 text-center border-t border-white/5 pt-6">
              <Link
                to="/"
                className="text-sm text-gray-400 hover:text-white font-medium transition-colors inline-flex items-center gap-2"
              >
                <span>←</span> Back to Store
              </Link>
            </div>
          </div>

          {/* Security Notice */}
          <div className="mt-8 flex items-center justify-center gap-2 text-xs text-gray-500 opacity-60">
            <FiShield className="w-3 h-3" />
            <span>256-bit SSL Encrypted Connection</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLogin;
