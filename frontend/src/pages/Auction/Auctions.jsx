
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaGavel, FaClock, FaEye, FaSearch, FaFilter } from 'react-icons/fa';
import api from '../../services/api';
import Layout from '../../components/Layout/Layout';
import Loading from '../../components/UI/Loading';

const Auctions = () => {
    const [auctions, setAuctions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('active');
    const [sort, setSort] = useState('ending-soon');

    useEffect(() => {
        fetchAuctions();
    }, [filter, sort]);

    const fetchAuctions = async () => {
        try {
            setLoading(true);
            const { data } = await api.get(`/auctions?status=${filter}&sort=${sort}`);
            setAuctions(data.data);
        } catch (error) {
            console.error('Failed to fetch auctions', error);
        } finally {
            setLoading(false);
        }
    };

    const calculateTimeLeft = (endTime) => {
        const total = Date.parse(endTime) - Date.parse(new Date());
        const seconds = Math.floor((total / 1000) % 60);
        const minutes = Math.floor((total / 1000 / 60) % 60);
        const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
        const days = Math.floor(total / (1000 * 60 * 60 * 24));

        if (total <= 0) return "Ended";
        return `${days}d ${hours}h ${minutes}m`;
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white pt-20 pb-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">

                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 mb-4">
                        Live Auctions
                    </h1>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                        Experience the thrill of real-time bidding. Compete with others to secure exclusive items at unbeatable prices.
                    </p>
                </motion.div>

                {/* Filters and Controls */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 bg-slate-800/50 p-4 rounded-xl backdrop-blur-md border border-slate-700/50">
                    <div className="flex items-center space-x-4 mb-4 md:mb-0">
                        <button
                            onClick={() => setFilter('active')}
                            className={`px-4 py-2 rounded-lg transition-all ${filter === 'active' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
                        >
                            Active
                        </button>
                        <button
                            onClick={() => setFilter('upcoming')}
                            className={`px-4 py-2 rounded-lg transition-all ${filter === 'upcoming' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
                        >
                            Upcoming
                        </button>
                    </div>

                    <div className="flex items-center space-x-2 bg-slate-900/50 px-3 py-2 rounded-lg border border-slate-700">
                        <FaFilter className="text-slate-400" />
                        <select
                            value={sort}
                            onChange={(e) => setSort(e.target.value)}
                            className="bg-transparent text-slate-300 focus:outline-none"
                        >
                            <option value="ending-soon">Ending Soon</option>
                            <option value="newest">Newest</option>
                            <option value="popular">Most Popular</option>
                        </select>
                    </div>
                </div>

                {/* Grid */}
                {loading ? (
                    <Loading />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {auctions.map((auction) => (
                            <motion.div
                                key={auction._id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                whileHover={{ y: -5 }}
                                className="bg-slate-800 rounded-2xl overflow-hidden shadow-xl border border-slate-700 group"
                            >
                                {/* Image Section */}
                                <div className="relative h-64 overflow-hidden">
                                    <img
                                        src={auction.product.images[0]?.url || 'https://placehold.co/600x400/1e293b/cbd5e1?text=No+Image'}
                                        alt={auction.product.name}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-sm font-semibold text-emerald-400 border border-emerald-500/30 flex items-center">
                                        <FaClock className="mr-2" />
                                        {calculateTimeLeft(auction.endTime)}
                                    </div>
                                </div>

                                {/* Content Section */}
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">{auction.product.name}</h3>
                                    <div className="flex justify-between items-end mb-4">
                                        <div>
                                            <p className="text-slate-400 text-sm">Current Bid</p>
                                            <p className="text-2xl font-bold text-blue-400">
                                                ${auction.currentBid > 0 ? auction.currentBid : auction.startingBid}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-slate-400 text-sm flex items-center justify-end">
                                                <FaEye className="mr-1" /> {auction.viewsCount || 0} watching
                                            </p>
                                        </div>
                                    </div>

                                    <Link
                                        to={`/auctions/${auction._id}`}
                                        className="block w-full text-center bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 py-3 rounded-xl font-semibold shadow-lg shadow-blue-900/20 transition-all"
                                    >
                                        Join Auction <FaGavel className="inline ml-2 mb-1" />
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {!loading && auctions.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-slate-500 text-xl">No active auctions found at the moment.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Auctions;
