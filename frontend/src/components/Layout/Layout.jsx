import { Outlet } from 'react-router-dom'
import ModernHeader from './ModernHeader'
import Footer from './Footer'
import Chatbot from '../UI/Chatbot'

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 transition-colors">
      <ModernHeader />
      <main className="flex-1 pt-32">
        <Outlet />
      </main>
      <Footer />
      <Chatbot />
    </div>
  )
}

export default Layout