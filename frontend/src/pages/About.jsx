import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'

const About = () => {
  const team = [
    { name: 'Gaurav Gavhane', role: 'Founder & CEO', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop' },
    { name: 'Priya Sharma', role: 'Chief Technology Officer', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop' },
    { name: 'Rahul Patel', role: 'Head of Operations', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop' },
    { name: 'Anjali Desai', role: 'Marketing Director', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop' },
  ]

  const stats = [
    { value: '50K+', label: 'Happy Customers' },
    { value: '10K+', label: 'Products' },
    { value: '99%', label: 'Satisfaction Rate' },
    { value: '24/7', label: 'Support' },
  ]

  return (
    <>
      <Helmet>
        <title>About Us - NEXORA</title>
        <meta name="description" content="Learn about NEXORA and our mission" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Hero */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold mb-6">About NEXORA</h1>
            <p className="text-xl max-w-3xl mx-auto">We're on a mission to revolutionize e-commerce with premium products and exceptional customer experience.</p>
          </div>
        </div>

        {/* Stats */}
        <div className="max-w-7xl mx-auto px-4 -mt-10">
          <div className="bg-white rounded-xl shadow-lg p-8 grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-4xl font-bold text-blue-600">{stat.value}</p>
                <p className="text-gray-600 mt-2">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Story */}
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <p className="text-gray-600 mb-4">Founded in 2023 by Gaurav Gavhane in Pune, Maharashtra, NEXORA started with a vision to make quality products accessible to every Indian household.</p>
              <p className="text-gray-600 mb-4">Today, we serve over 50,000 customers across India, offering a curated selection of electronics, fashion, groceries, and lifestyle products with fast delivery and excellent customer service.</p>
              <p className="text-gray-600">Our commitment to quality, affordability, and customer satisfaction drives everything we do. We believe in "Make in India" and support local businesses.</p>
            </div>
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-8">
              <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500&h=400&fit=crop" alt="Team" className="rounded-xl shadow-lg" />
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="bg-white py-20">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Values</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🎯</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Quality First</h3>
                <p className="text-gray-600">We only offer products that meet our high standards of quality and durability.</p>
              </div>
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">💚</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Customer Focus</h3>
                <p className="text-gray-600">Your satisfaction is our priority. We're here to help 24/7.</p>
              </div>
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🚀</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Innovation</h3>
                <p className="text-gray-600">We constantly evolve to bring you the latest and greatest products.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Team */}
        <div className="max-w-7xl mx-auto px-4 py-20">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Meet Our Team</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {team.map((member, i) => (
              <div key={i} className="text-center">
                <img src={member.image} alt={member.name} className="w-32 h-32 rounded-full mx-auto mb-4 object-cover" />
                <h3 className="font-semibold text-gray-900">{member.name}</h3>
                <p className="text-gray-600 text-sm">{member.role}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-blue-600 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Shopping?</h2>
            <p className="text-xl mb-8">Join thousands of happy customers today.</p>
            <Link to="/products" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block">
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default About