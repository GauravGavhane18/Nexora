import { useState } from 'react'

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I am your personal NEXORA shopping assistant. I can help you find products, track orders, or answer questions. What can I do for you today?", sender: 'bot' }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  const faqs = [
    {
      question: "shipping",
      answer: "We offer **Free Standard Shipping** on orders over $50! For express needs, we have Next-Day Delivery available at checkout."
    },
    {
      question: "return",
      answer: "Not in love with your purchase? No worries! You can return items within **30 days** for a full refund. We even cover the return shipping."
    },
    {
      question: "track",
      answer: "To track your order, visit the **Track Order** page in the menu or go to your account dashboard for real-time updates."
    },
    {
      question: "payment",
      answer: "We accept all major credit cards (Visa, Amex, Mastercard), PayPal, and even **Crypto** (Bitcoin, Ethereum)."
    },
    {
      question: "recommend",
      answer: "I can help with that! Are you looking for *electronics*, *fashion*, or maybe something for your *home*?"
    },
    {
      question: "fashion",
      answer: "Our Fashion collection is trending! Check out the 'New Arrivals' section for the latest styles from top brands like Nike, Zara, and Gucci."
    },
    {
      question: "electronics",
      answer: "For electronics, I highly recommend checking out our 'Best Sellers'. We have great deals on the iPhone 15 and Sony Headphones right now."
    }
  ]

  const quickReplies = [
    "Where is my order?",
    "Shipping Info",
    "Return Policy",
    "Recommend a gift",
    "Talk to human"
  ]

  const handleSendMessage = (message = inputMessage) => {
    if (!message.trim()) return

    const userMessage = { id: Date.now(), text: message, sender: 'user' }
    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsTyping(true)

    // Simulated AI processing
    setTimeout(() => {
      let responseText = "I see. Could you elaborate on that? I'm still learning! You can also try asking about shipping, returns, or product recommendations.";

      const lowerMsg = message.toLowerCase();

      // Simple keyword matching for demo purposes
      const match = faqs.find(f => lowerMsg.includes(f.question));
      if (match) {
        responseText = match.answer;
      } else if (lowerMsg.includes('human') || lowerMsg.includes('agent')) {
        responseText = "I've connected you to our priority queue. A human agent will be with you shortly (Wait time: ~2 mins).";
      } else if (lowerMsg.includes('gift')) {
        responseText = "Gifts are my specialty! Who are you buying for? (e.g. 'Partner', 'Kids', 'Friend')";
      }

      const botResponse = {
        id: Date.now() + 1,
        text: responseText,
        sender: 'bot'
      }
      setMessages(prev => [...prev, botResponse])
      setIsTyping(false)
    }, 1500)
  }

  const handleQuickReply = (reply) => {
    handleSendMessage(reply)
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Floating Button */}
      <div className={`transition-all duration-300 transform ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}>
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center justify-center w-16 h-16 bg-gradient-to-tr from-primary-600 to-indigo-600 rounded-full shadow-lg hover:shadow-primary-500/50 transition-all duration-300 hover:scale-110"
        >
          {/* Ping Animation */}
          <span className="absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-20 animate-ping group-hover:animate-none"></span>

          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </button>
      </div>

      {/* Chat Window */}
      <div
        className={`transition-all duration-300 transform origin-bottom-right ${isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-90 opacity-0 translate-y-10 pointer-events-none'} fixed bottom-6 right-6 w-[380px] h-[600px] max-h-[80vh] bg-white dark:bg-dark-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-dark-800 overflow-hidden flex flex-col`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-indigo-700 p-4 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center border border-white/20">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-white font-display text-lg">NEXORA AI</h3>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span className="text-xs text-blue-100 font-medium">Assistant Online</span>
              </div>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-dark-950/50">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.sender === 'user'
                  ? 'bg-primary-600 text-white rounded-br-none'
                  : 'bg-white dark:bg-dark-800 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-dark-700 rounded-bl-none'
                  }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white dark:bg-dark-800 p-4 rounded-2xl rounded-bl-none border border-gray-100 dark:border-dark-700 flex gap-1.5 items-center">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></span>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="p-3 bg-white dark:bg-dark-900 border-t border-gray-100 dark:border-dark-800">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {quickReplies.map((reply, i) => (
              <button
                key={i}
                onClick={() => handleQuickReply(reply)}
                className="whitespace-nowrap px-3 py-1.5 bg-gray-100 dark:bg-dark-800 text-gray-600 dark:text-gray-300 text-xs font-semibold rounded-full hover:bg-primary-50 dark:hover:bg-primary-900/30 hover:text-primary-600 dark:hover:text-primary-400 border border-transparent hover:border-primary-200 dark:hover:border-primary-700/50 transition-all"
              >
                {reply}
              </button>
            ))}
          </div>

          <div className="relative mt-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask anything..."
              className="w-full pl-4 pr-12 py-3 bg-gray-100 dark:bg-dark-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary-500 dark:text-white placeholder-gray-500"
            />
            <button
              onClick={() => handleSendMessage()}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Chatbot