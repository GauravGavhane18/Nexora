
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaPaperPlane, FaEnvelope } from 'react-icons/fa';
import toast from 'react-hot-toast';

const Newsletter = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email) return;

        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            setEmail('');
            toast.success('Successfully subscribed to our newsletter!');
        }, 1500);
    };

    return (
        <section className="relative py-16 bg-gradient-to-br from-slate-900 via-slate-800 to-black overflow-hidden">
            {/* Abstract Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-2xl" />
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="glass-modal rounded-3xl p-8 md:p-12 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-12 border border-white/10 shadow-2xl">

                    <div className="lg:w-1/2 text-center lg:text-left">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center space-x-2 bg-blue-500/10 text-blue-400 px-4 py-2 rounded-full mb-6 border border-blue-500/20"
                        >
                            <FaEnvelope className="text-sm" />
                            <span className="text-sm font-semibold tracking-wide uppercase">Weekly Updates</span>
                        </motion.div>

                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                            Join the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">NEXORA</span> Community
                        </h2>
                        <p className="text-lg text-slate-400 mb-0">
                            Get exclusive access to new product drops, tech reviews, and subscriber-only deals delivered straight to your inbox.
                        </p>
                    </div>

                    <div className="lg:w-1/2 w-full max-w-md">
                        <form onSubmit={handleSubmit} className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
                            <div className="relative flex items-center bg-slate-900 rounded-2xl p-2 border border-slate-700 shadow-xl">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email address..."
                                    className="flex-1 bg-transparent text-white placeholder-slate-500 px-4 py-3 focus:outline-none"
                                    required
                                />
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-emerald-500/20 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {loading ? (
                                        <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            Subscribe <FaPaperPlane className="text-sm" />
                                        </>
                                    )}
                                </button>
                            </div>
                            <p className="mt-4 text-center text-sm text-slate-500">
                                No spam, unsubscribe at any time. Read our <a href="#" className="text-blue-400 hover:underline">Privacy Policy</a>.
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Newsletter;
