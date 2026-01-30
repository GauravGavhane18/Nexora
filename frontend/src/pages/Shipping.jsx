import { Helmet } from 'react-helmet-async'
import { FaTruck, FaGlobe, FaClock, FaBox } from 'react-icons/fa'

const Shipping = () => {
    return (
        <div className="min-h-screen bg-gray-50 pt-20 pb-12">
            <Helmet>
                <title>Shipping Information - NEXORA</title>
            </Helmet>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold font-display text-gray-900 mb-4">Shipping Information</h1>
                    <p className="text-gray-600">Fast, reliable, and transparent delivery options.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-12">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-4">
                            <FaTruck size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Domestic Shipping</h3>
                        <p className="text-gray-600 text-sm mb-4">
                            We offer free standard shipping on all orders over $50 within the country.
                            Orders are typically processed within 24 hours.
                        </p>
                        <ul className="space-y-2 text-sm text-gray-500">
                            <li className="flex justify-between">
                                <span>Standard (3-5 days)</span>
                                <span className="font-semibold">Free</span>
                            </li>
                            <li className="flex justify-between">
                                <span>Express (1-2 days)</span>
                                <span className="font-semibold">$9.99</span>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 mb-4">
                            <FaGlobe size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">International Shipping</h3>
                        <p className="text-gray-600 text-sm mb-4">
                            NEXORA ships to over 50 countries via DHL and FedEx. Customs duties and taxes
                            are calculated at checkout for a seamless experience.
                        </p>
                        <ul className="space-y-2 text-sm text-gray-500">
                            <li className="flex justify-between">
                                <span>Standard (7-14 days)</span>
                                <span className="font-semibold">$19.99</span>
                            </li>
                            <li className="flex justify-between">
                                <span>Priority (3-5 days)</span>
                                <span className="font-semibold">$39.99</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Delivery Process</h2>
                        <div className="space-y-8">
                            <div className="flex gap-4">
                                <div className="flex-shrink-0">
                                    <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold">1</div>
                                </div>
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-900">Order Processing</h4>
                                    <p className="text-gray-600 text-sm mt-1">Orders placed before 2 PM EST are processed the same day. You will receive a confirmation email.</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="flex-shrink-0">
                                    <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold">2</div>
                                </div>
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-900">Dispatch</h4>
                                    <p className="text-gray-600 text-sm mt-1">Your item is picked, packed, and handed over to our courier partners. Tracking info is sent via email.</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="flex-shrink-0">
                                    <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold">3</div>
                                </div>
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-900">Delivery</h4>
                                    <p className="text-gray-600 text-sm mt-1">The package arrives at your doorstep. Signature may be required for high-value items.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Shipping
