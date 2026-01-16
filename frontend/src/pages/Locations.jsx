import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const Locations = () => {
    const [selectedCity, setSelectedCity] = useState('Pune')
    const [searchQuery, setSearchQuery] = useState('')

    // Mock data for store locations
    const locations = [
        {
            id: 1,
            city: 'Pune',
            name: 'NEXORA HQ - Tech Plaza',
            address: 'Shop No. 12, Tech Plaza, Shivaji Nagar, Pune, Maharashtra 411001',
            phone: '+91 7218603915',
            hours: 'Mon-Sat: 10AM - 7PM',
            email: 'pune@nexora.com',
            mapQuery: 'Tech Plaza, Pune, Maharashtra'
        },
        {
            id: 2,
            city: 'Mumbai',
            name: 'NEXORA Express - Andheri',
            address: 'Unit 45, Infinity Mall, Link Road, Andheri West, Mumbai, Maharashtra 400053',
            phone: '+91 9876543210',
            hours: 'Mon-Sun: 11AM - 9PM',
            email: 'mumbai@nexora.com',
            mapQuery: 'Infinity Mall, Andheri West, Mumbai'
        },
        {
            id: 3,
            city: 'Bangalore',
            name: 'NEXORA Hub - Indiranagar',
            address: '100 Feet Road, Indiranagar, Bengaluru, Karnataka 560038',
            phone: '+91 8012345678',
            hours: 'Mon-Sat: 10AM - 8PM',
            email: 'bangalore@nexora.com',
            mapQuery: '100 Feet Road, Indiranagar, Bengaluru'
        },
        {
            id: 4,
            city: 'Delhi',
            name: 'NEXORA North - Connaught Place',
            address: 'B-Block, Inner Circle, Connaught Place, New Delhi, Delhi 110001',
            phone: '+91 1123456789',
            hours: 'Mon-Sun: 10AM - 9PM',
            email: 'delhi@nexora.com',
            mapQuery: 'Connaught Place, New Delhi'
        }
    ]

    const filteredLocations = locations.filter(loc =>
        loc.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        loc.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const activeLocation = locations.find(l => l.city === selectedCity) || locations[0]

    return (
        <>
            <Helmet>
                <title>Our Locations - NEXORA</title>
                <meta name="description" content="Find a NEXORA store near you. Visit our specialized centers in Pune, Mumbai, Bangalore, and Delhi." />
            </Helmet>

            <div className="min-h-screen bg-gray-50 flex flex-col">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white py-12">
                    <div className="max-w-7xl mx-auto px-4">
                        <h1 className="text-4xl font-bold mb-4">Find A Store</h1>
                        <p className="text-xl text-blue-100">Visit our experience centers across major cities</p>
                    </div>
                </div>

                <div className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col lg:flex-row min-h-[600px] border border-gray-100">

                        {/* Sidebar List */}
                        <div className="lg:w-1/3 bg-white border-r border-gray-100 flex flex-col">
                            {/* Search */}
                            <div className="p-6 border-b border-gray-100 bg-gray-50">
                                <input
                                    type="text"
                                    placeholder="Search city or store..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                />
                            </div>

                            {/* List */}
                            <div className="flex-1 overflow-y-auto custom-scrollbar">
                                {filteredLocations.map((loc) => (
                                    <div
                                        key={loc.id}
                                        onClick={() => setSelectedCity(loc.city)}
                                        className={`p-6 border-b border-gray-50 cursor-pointer transition-all hover:bg-gray-50
                      ${selectedCity === loc.city ? 'bg-blue-50 border-l-4 border-l-blue-600' : 'border-l-4 border-l-transparent'}
                    `}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className={`font-bold text-lg ${selectedCity === loc.city ? 'text-blue-700' : 'text-gray-800'}`}>
                                                {loc.city}
                                            </h3>
                                            {selectedCity === loc.city && (
                                                <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">Selected</span>
                                            )}
                                        </div>
                                        <p className="font-medium text-gray-700 mb-1">{loc.name}</p>
                                        <p className="text-sm text-gray-500 mb-2 line-clamp-2">{loc.address}</p>
                                        <div className="text-sm text-gray-500 space-y-1">
                                            <p className="flex items-center gap-2"><span className="text-blue-500">📞</span> {loc.phone}</p>
                                            <p className="flex items-center gap-2"><span className="text-green-500">🕐</span> {loc.hours}</p>
                                        </div>
                                    </div>
                                ))}

                                {filteredLocations.length === 0 && (
                                    <div className="p-8 text-center text-gray-500">
                                        <p>No locations found matching "{searchQuery}"</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Map Area */}
                        <div className="lg:w-2/3 bg-gray-100 relative">
                            {activeLocation && (
                                <div className="absolute inset-0 w-full h-full">
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        frameBorder="0"
                                        marginHeight="0"
                                        marginWidth="0"
                                        title={`Map of ${activeLocation.name}`}
                                        scrolling="no"
                                        src={`https://maps.google.com/maps?q=${encodeURIComponent(activeLocation.mapQuery)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                                        className="w-full h-full"
                                        style={{ filter: 'grayscale(0%) contrast(1.1)' }}
                                    ></iframe>

                                    {/* Floating Info Card (Optional Polish) */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        key={activeLocation.id} // Re-animate on change
                                        className="absolute bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-80 bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-lg border border-white/50"
                                    >
                                        <h3 className="font-bold text-gray-900 mb-1">{activeLocation.name}</h3>
                                        <p className="text-sm text-gray-600 mb-3">{activeLocation.address}</p>
                                        <div className="flex gap-2">
                                            <a
                                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activeLocation.mapQuery)}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="flex-1 bg-blue-600 text-white text-center py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                                            >
                                                Get Directions
                                            </a>
                                            <a
                                                href={`tel:${activeLocation.phone}`}
                                                className="flex-1 bg-gray-100 text-gray-800 text-center py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition"
                                            >
                                                Call Now
                                            </a>
                                        </div>
                                    </motion.div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Additional "Cities" Functionality Section */}
                    <div className="mt-16 grid md:grid-cols-3 gap-8 text-center">
                        <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                                🚚
                            </div>
                            <h3 className="font-bold text-lg mb-2">Same Day Delivery</h3>
                            <p className="text-gray-600">Available in all listed metro cities for orders placed before 2 PM.</p>
                        </div>
                        <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
                            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                                🏪
                            </div>
                            <h3 className="font-bold text-lg mb-2">In-Store Pickup</h3>
                            <p className="text-gray-600">Reserve any product online and pick it up from your nearest store.</p>
                        </div>
                        <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                                🔧
                            </div>
                            <h3 className="font-bold text-lg mb-2">Service Centers</h3>
                            <p className="text-gray-600">Authorized service support available at all our experience centers.</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Locations
