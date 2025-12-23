import { useState } from 'react'

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi! I'm NEXORA Assistant. How can I help you today?", sender: 'bot' }
  ])
  const [inputMessage, setInputMessage] = useState('')

  const faqs = [
    {
      question: "What are your shipping options?",
      answer: "We offer free standard shipping on orders over $50. Express shipping (1-2 days) is available for $9.99, and overnight shipping for $19.99."
    },
    {
      question: "What is your return policy?",
      answer: "We offer a 30-day money-back guarantee on all products. Items must be in original condition with tags attached. Return shipping is free for defective items."
    },
    {
      question: "How do I track my order?",
      answer: "Once your order ships, you'll receive a tracking number via email. You can also track your order by visiting the 'Track Order' link in the header or your account dashboard."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept Visa, Mastercard, PayPal, Stripe, Apple Pay, Google Pay, and cryptocurrency (Bitcoin, Ethereum, USDT). All payments are secure and encrypted."
    },
    {
      question: "Do you offer international shipping?",
      answer: "Yes! We ship to over 50 countries worldwide. International shipping rates vary by location and are calculated at checkout. Delivery typically takes 7-14 business days."
    },
    {
      question: "How do I cancel or modify my order?",
      answer: "Orders can be cancelled or modified within 1 hour of placement. After that, please contact our support team at support@nexora.com or use the live chat."
    },
    {
      question: "What is NEXORA subscription?",
      answer: "Our subscription service gives you access to exclusive products, early access to sales, free shipping on all orders, and special member pricing. Plans start at $9.99/month."
    },
    {
      question: "How do I contact customer support?",
      answer: "You can reach us via live chat (bottom right), email at support@nexora.com, or phone at 1-800-NEXORA. Our support team is available 24/7 to help you."
    },
    {
      question: "Are your products authentic?",
      answer: "Yes! All products sold on NEXORA are 100% authentic and sourced directly from manufacturers or authorized distributors. We guarantee authenticity on every purchase."
    }
  ]

  const quickReplies = [
    "Shipping info",
    "Return policy", 
    "Track order",
    "Payment methods",
    "Contact support"
  ]

  const handleSendMessage = (message = inputMessage) => {
    if (!message.trim()) return

    const userMessage = { id: Date.now(), text: message, sender: 'user' }
    setMessages(prev => [...prev, userMessage])
    setInputMessage('')

    // Find matching FAQ
    const matchingFaq = faqs.find(faq => 
      faq.question.toLowerCase().includes(message.toLowerCase()) ||
      message.toLowerCase().includes(faq.question.toLowerCase().split(' ')[0]) ||
      (message.toLowerCase().includes('ship') && faq.question.toLowerCase().includes('ship')) ||
      (message.toLowerCase().includes('return') && faq.question.toLowerCase().includes('return')) ||
      (message.toLowerCase().includes('track') && faq.question.toLowerCase().includes('track')) ||
      (message.toLowerCase().includes('payment') && faq.question.toLowerCase().includes('payment')) ||
      (message.toLowerCase().includes('support') && faq.question.toLowerCase().includes('support'))
    )

    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        text: matchingFaq ? matchingFaq.answer : "I'm sorry, I didn't understand that. Here are some topics I can help with: shipping, returns, tracking, payments, support, subscriptions, and product authenticity. You can also contact our human support team at support@nexora.com.",
        sender: 'bot'
      }
      setMessages(prev => [...prev, botResponse])
    }, 1000)
  }

  const handleQuickReply = (reply) => {
    handleSendMessage(reply)
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-all duration-300 animate-pulse"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-80 h-96 flex flex-col border border-gray-200 dark:border-gray-700">
          {/* Header */}
          <div className="bg-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center mr-2">
                <span className="text-blue-600 font-bold text-sm">N</span>
              </div>
              <div>
                <h3 className="font-semibold">NEXORA Assistant</h3>
                <p className="text-xs opacity-90">Online now</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Replies */}
          <div className="px-4 pb-2">
            <div className="flex flex-wrap gap-1">
              {quickReplies.map((reply, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickReply(reply)}
                  className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  {reply}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
              <button
                onClick={() => handleSendMessage()}
                className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Chatbot