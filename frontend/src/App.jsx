import { Routes, Route } from 'react-router-dom'
import { useEffect, lazy, Suspense } from 'react'
import Loading from './components/UI/Loading'
import { useDispatch } from 'react-redux'
import { loadUser } from './redux/slices/authSlice'
import { initializeTheme } from './redux/slices/themeSlice'
import { initializeSocket } from './services/socketService'

// Layout Components
import Layout from './components/Layout/Layout'
import AdminLayout from './components/Layout/AdminLayout'
import SellerLayout from './components/Layout/SellerLayout'

// Public Pages
const Home = lazy(() => import('./pages/Home'))
const ProductListing = lazy(() => import('./pages/ProductListing'))
const ProductDetail = lazy(() => import('./pages/ProductDetail'))
const Categories = lazy(() => import('./pages/Categories'))
const CategoryPage = lazy(() => import('./pages/CategoryPage'))
const SubCategoryPage = lazy(() => import('./pages/SubCategoryPage'))
const Deals = lazy(() => import('./pages/Deals'))
const NewArrivals = lazy(() => import('./pages/NewArrivals'))
const About = lazy(() => import('./pages/About'))
const Contact = lazy(() => import('./pages/Contact'))
const Payments = lazy(() => import('./pages/Payments'))
const Help = lazy(() => import('./pages/Help'))
const TrackOrder = lazy(() => import('./pages/TrackOrder'))
const Cart = lazy(() => import('./pages/Cart'))
const Checkout = lazy(() => import('./pages/Checkout'))
const Wishlist = lazy(() => import('./pages/Wishlist'))
const Locations = lazy(() => import('./pages/Locations'))
const Auctions = lazy(() => import('./pages/Auction/Auctions'))
const AuctionDetail = lazy(() => import('./pages/Auction/AuctionDetail'))

// Auth Pages
const Login = lazy(() => import('./pages/Auth/Login'))
const BuyerLogin = lazy(() => import('./pages/Auth/BuyerLogin'))
const SellerLogin = lazy(() => import('./pages/Auth/SellerLogin'))
const AdminLogin = lazy(() => import('./pages/Auth/AdminLogin'))
const RoleSelection = lazy(() => import('./pages/Auth/RoleSelection'))
const Register = lazy(() => import('./pages/Auth/Register'))
const ForgotPassword = lazy(() => import('./pages/Auth/ForgotPassword'))
const ResetPassword = lazy(() => import('./pages/Auth/ResetPassword'))
const VerifyEmail = lazy(() => import('./pages/Auth/VerifyEmail'))

// Subscription Pages
const SubscriptionPlans = lazy(() => import('./pages/Subscription/Plans'))
const SubscriptionSuccess = lazy(() => import('./pages/Subscription/Success'))
const SubscriptionCancel = lazy(() => import('./pages/Subscription/Cancel'))

// Protected User Pages
const UserDashboard = lazy(() => import('./pages/User/Dashboard'))
const UserOrders = lazy(() => import('./pages/User/Orders'))
const UserProfile = lazy(() => import('./pages/User/Profile'))
const UserSubscription = lazy(() => import('./pages/User/Subscription'))

// Seller Pages
const SellerDashboard = lazy(() => import('./pages/Seller/Dashboard'))
const SellerProducts = lazy(() => import('./pages/Seller/Products'))
const SellerOrders = lazy(() => import('./pages/Seller/Orders'))
const SellerAnalytics = lazy(() => import('./pages/Seller/Analytics'))
const SellerProfile = lazy(() => import('./pages/Seller/Profile'))

// Admin Pages
const AdminDashboard = lazy(() => import('./pages/Admin/Dashboard'))
const AdminUsers = lazy(() => import('./pages/Admin/Users'))
const AdminProducts = lazy(() => import('./pages/Admin/Products'))
const AdminOrders = lazy(() => import('./pages/Admin/Orders'))
const AdminCategories = lazy(() => import('./pages/Admin/Categories'))
const AdminSubscriptions = lazy(() => import('./pages/Admin/Subscriptions'))
const AdminAnalytics = lazy(() => import('./pages/Admin/Analytics'))
const AdminSettings = lazy(() => import('./pages/Admin/Settings'))

// Utility Pages
const NotFound = lazy(() => import('./pages/NotFound'))
const Unauthorized = lazy(() => import('./pages/Unauthorized'))

// Route Protection
import ProtectedRoute from './components/Auth/ProtectedRoute'
import PublicRoute from './components/Auth/PublicRoute'
import ScrollToTop from './components/Utils/ScrollToTop'

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
    <>
      <ScrollToTop />
      <Suspense fallback={<Loading />}>
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
            <Route path="auctions" element={<Auctions />} />
            <Route path="auctions/:id" element={<AuctionDetail />} />

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
      </Suspense>
    </>
  )
}

export default App