import { Helmet } from 'react-helmet-async'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(null)

    const faqs = [
        {
            question: "How do I track my order?",
            answer: "Once your order is shipped, you will receive a confirmation email with a tracking number. You can also track your order status in real-time from your 'My Orders' section in the dashboard."
        },
        {
            question: "What items are eligible for return?",
            answer: "Most items are eligible for return within 30 days of delivery if they are in original condition. Electronics and beauty products may have specific restrictions. Check the product page for details."
        },
        {
            question: "Do you ship internationally?",
            answer: "Yes, NEXORA ships to over 50 countries worldwide. Shipping costs and delivery times vary by location and will be calculated at checkout."
        },
        {
            question: "Can I change my delivery address after placing an order?",
            answer: "If your order hasn't been shipped yet, you can contact our support team to update the address. Once shipped, we cannot change the destination."
        },
        {
            question: "Is my payment information secure?",
            answer: "Absolutely. We use industry-standard encryption (SSL) and partner with trusted payment gateways like Stripe to ensure your data is 100% secure."
        }
    ]

    return (
        <div className="min-h-screen bg-gray-50 pt-20 pb-12">
            <Helmet>
                <title>FAQ - NEXORA</title>
            </Helmet>

            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold font-display text-gray-900 mb-4">Frequently Asked Questions</h1>
                    <p className="text-gray-600">Find answers to common questions about shopping on NEXORA.</p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100"
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none hover:bg-gray-50 transition-colors"
                            >
                                <span className="font-semibold text-gray-900">{faq.question}</span>
                                {openIndex === index ? <FaChevronUp className="text-primary-600" /> : <FaChevronDown className="text-gray-400" />}
                            </button>

                            {openIndex === index && (
                                <div className="px-6 pb-4 pt-0 text-gray-600 border-t border-gray-50 bg-gray-50/50">
                                    <p className="mt-2 text-sm leading-relaxed">{faq.answer}</p>
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default FAQ
