import { Helmet } from 'react-helmet-async'
import { FaUndo, FaExchangeAlt, FaMoneyBillWave, FaCheckCircle } from 'react-icons/fa'

const Returns = () => {
    return (
        <div className="min-h-screen bg-gray-50 pt-20 pb-12">
            <Helmet>
                <title>Returns & Refunds - NEXORA</title>
            </Helmet>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold font-display text-gray-900 mb-4">Returns & Refunds</h1>
                    <p className="text-gray-600">Simple, hassle-free returns within 30 days.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-white p-6 rounded-xl shadow-sm text-center border border-gray-100">
                        <FaUndo className="w-10 h-10 text-primary-600 mx-auto mb-4" />
                        <h3 className="font-bold text-gray-900 mb-2">30-Day Policy</h3>
                        <p className="text-sm text-gray-500">Return any unused item within 30 days of delivery for a full refund.</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm text-center border border-gray-100">
                        <FaExchangeAlt className="w-10 h-10 text-primary-600 mx-auto mb-4" />
                        <h3 className="font-bold text-gray-900 mb-2">Free Exchanges</h3>
                        <p className="text-sm text-gray-500">Need a different size? Exchanges are free and easy to process.</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm text-center border border-gray-100">
                        <FaMoneyBillWave className="w-10 h-10 text-primary-600 mx-auto mb-4" />
                        <h3 className="font-bold text-gray-900 mb-2">Fast Refunds</h3>
                        <p className="text-sm text-gray-500">Refunds are processed to your original payment method within 5-7 days.</p>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">How to Return</h2>
                    <div className="space-y-6">
                        <div className="flex items-start">
                            <FaCheckCircle className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                            <div>
                                <h4 className="font-semibold text-gray-900">1. Initiate Return</h4>
                                <p className="text-sm text-gray-600">Log in to your account, go to 'My Orders', and select 'Return Item'.</p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <FaCheckCircle className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                            <div>
                                <h4 className="font-semibold text-gray-900">2. Print Label</h4>
                                <p className="text-sm text-gray-600">We'll email you a prepaid shipping label. Print it and attach it to the package.</p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <FaCheckCircle className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                            <div>
                                <h4 className="font-semibold text-gray-900">3. Ship It</h4>
                                <p className="text-sm text-gray-600">Drop the package off at any authorized courier location.</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 pt-8 border-t border-gray-100">
                        <h3 className="font-bold text-gray-900 mb-4">Non-Returnable Items</h3>
                        <ul className="list-disc list-inside text-sm text-gray-600 space-y-2">
                            <li>Perishable goods (food, flowers)</li>
                            <li>Personalized or custom-made items</li>
                            <li>Personal care items (beauty products, earrings)</li>
                            <li>Gift cards</li>
                        </ul>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Returns
