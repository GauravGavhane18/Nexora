import { Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { loadUser } from './redux/slices/authSlice'
import { initializeTheme } from './redux/slices/themeSlice'
import { initializeSocket } from './services/socketService'

// Layout Components
import Layout from './components/Layout/Layout'
import AdminLayout from './components/Layout/AdminLayout'
import SellerLayout from './components/Layout/SellerLayout'

// Public Pages
import Home from './pages/Home'
import ProductListing from './pages/ProductListing'
import ProductDetail from './pages/ProductDetail'
import Categories from './pages/Categories'
import CategoryPage from './pages/CategoryPage'
import SubCategoryPage from './pages/SubCategoryPage'
import Deals from './pages/Deals'
import NewArrivals from './pages/NewArrivals'
import About from './pages/About'
import Contact from './pages/Contact'
import Payments from './pages/Payments'
import Help from './pages/Help'
import TrackOrder from './pages/TrackOrder'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Wishlist from './pages/Wishlist'
import Locations from './pages/Locations'

// Auth Pages
import Login from './pages/Auth/Login'
import BuyerLogin from './pages/Auth/BuyerLogin'
import SellerLogin from './pages/Auth/SellerLogin'
import AdminLogin from './pages/Auth/AdminLogin'
import RoleSelection from './pages/Auth/RoleSelection'
import Register from './pages/Auth/Register'
import ForgotPassword from './pages/Auth/ForgotPassword'
import ResetPassword from './pages/Auth/ResetPassword'
import VerifyEmail from './pages/Auth/VerifyEmail'

// Subscription Pages
import SubscriptionPlans from './pages/Subscription/Plans'
import SubscriptionSuccess from './pages/Subscription/Success'
import SubscriptionCancel from './pages/Subscription/Cancel'

// Protected User Pages
import UserDashboard from './pages/User/Dashboard'
import UserOrders from './pages/User/Orders'
import UserProfile from './pages/User/Profile'
import UserSubscription from './pages/User/Subscription'

// Seller Pages
import SellerDashboard from './pages/Seller/Dashboard'
import SellerProducts from './pages/Seller/Products'
import SellerOrders from './pages/Seller/Orders'
import SellerAnalytics from './pages/Seller/Analytics'
import SellerProfile from './pages/Seller/Profile'

// Admin Pages
import AdminDashboard from './pages/Admin/Dashboard'
import AdminUsers from './pages/Admin/Users'
import AdminProducts from './pages/Admin/Products'
import AdminOrders from './pages/Admin/Orders'
import AdminCategories from './pages/Admin/Categories'
import AdminSubscriptions from './pages/Admin/Subscriptions'
import AdminAnalytics from './pages/Admin/Analytics'
import AdminSettings from './pages/Admin/Settings'

// Utility Pages
import NotFound from './pages/NotFound'
import Unauthorized from './pages/Unauthorized'

// Route Protection
import ProtectedRoute from './components/Auth/ProtectedRoute'
import PublicRoute from './components/Auth/PublicRoute'

function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    // Initialize theme
    dispatch(initializeTheme())

    // Initialize auth
    const token = localStorage.getItem('accessToken')
    if (token) {
      dispatch(loadUser())
      initializeSocket(token)
    }
  }, [dispatch])

  return (
    <Routes>
      {/* Auth Pages - Public */}
      <Route path="/auth">
        <Route path="role-selection" element={<RoleSelection />} />
        <Route path="buyer/login" element={<PublicRoute><BuyerLogin /></PublicRoute>} />
        <Route path="seller/login" element={<PublicRoute><SellerLogin /></PublicRoute>} />
        <Route path="admin/login" element={<PublicRoute><AdminLogin /></PublicRoute>} />
        <Route path="login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="register" element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
        <Route path="reset-password/:token" element={<PublicRoute><ResetPassword /></PublicRoute>} />
        <Route path="verify-email/:token" element={<VerifyEmail />} />
      </Route>

      {/* Legacy auth routes */}
      <Route path="login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="admin/login" element={<PublicRoute><AdminLogin /></PublicRoute>} />
      <Route path="register" element={<PublicRoute><Register /></PublicRoute>} />
      <Route path="forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
      <Route path="reset-password/:token" element={<PublicRoute><ResetPassword /></PublicRoute>} />
      <Route path="verify-email/:token" element={<VerifyEmail />} />

      {/* Main Routes - Public and Protected Mixed */}
      <Route path="/" element={<Layout />}>
        {/* Public Routes - No Authentication Required */}
        <Route index element={<Home />} />
        <Route path="products" element={<ProductListing />} />
        <Route path="products/:slug" element={<ProductDetail />} />
        <Route path="categories" element={<Categories />} />
        <Route path="category/:slug" element={<CategoryPage />} />
        <Route path="category/:categorySlug/:subCategorySlug" element={<SubCategoryPage />} />
        <Route path="deals" element={<Deals />} />
        <Route path="new-arrivals" element={<NewArrivals />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="payments" element={<Payments />} />
        <Route path="help" element={<Help />} />
        <Route path="track-order" element={<TrackOrder />} />
        <Route path="locations" element={<Locations />} />

        {/* Protected Routes - Require Authentication */}
        <Route path="cart" element={<Cart />} />
        <Route path="wishlist" element={<Wishlist />} />
        <Route path="subscription-plans" element={<ProtectedRoute><SubscriptionPlans /></ProtectedRoute>} />
        <Route path="checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path="dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
        <Route path="orders" element={<ProtectedRoute><UserOrders /></ProtectedRoute>} />
        <Route path="profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
        <Route path="subscription" element={<ProtectedRoute><UserSubscription /></ProtectedRoute>} />
        <Route path="subscription/success" element={<ProtectedRoute><SubscriptionSuccess /></ProtectedRoute>} />
        <Route path="subscription/cancel" element={<ProtectedRoute><SubscriptionCancel /></ProtectedRoute>} />
      </Route>

      {/* Seller Routes */}
      <Route path="/seller" element={<ProtectedRoute allowedRoles={['seller']}><SellerLayout /></ProtectedRoute>}>
        <Route index element={<SellerDashboard />} />
        <Route path="products" element={<SellerProducts />} />
        <Route path="orders" element={<SellerOrders />} />
        <Route path="analytics" element={<SellerAnalytics />} />
        <Route path="profile" element={<SellerProfile />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout /></ProtectedRoute>}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="subscriptions" element={<AdminSubscriptions />} />
        <Route path="analytics" element={<AdminAnalytics />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App