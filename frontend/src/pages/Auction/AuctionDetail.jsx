
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGavel, FaClock, FaHistory, FaUserCircle, FaTrophy, FaArrowLeft } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import api from '../../services/api';
import { getSocket, joinAuctionRoom } from '../../services/socketService';
import Loading from '../../components/UI/Loading';

const AuctionDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);

    const [auction, setAuction] = useState(null);
    const [loading, setLoading] = useState(true);
    const [bidAmount, setBidAmount] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [timeLeft, setTimeLeft] = useState('');
    const [bidHistory, setBidHistory] = useState([]);

    // Ref for scrolling to bottom of bid history
    const bidsEndRef = useRef(null);

    useEffect(() => {
        fetchAuction();
    }, [id]);

    useEffect(() => {
        const socket = getSocket();

        if (socket && auction) {
            joinAuctionRoom(id);

            const handleNewBid = (data) => {
                if (data.auctionId === id) {
                    toast.success(`New bid placed: $${data.amount} by ${data.bidder}`);

                    setAuction(prev => ({
                        ...prev,
                        currentBid: data.amount,
                        bids: [{
                            bidder: { firstName: data.bidder }, // Minimal data for real-time update
                            amount: data.amount,
                            timestamp: new Date().toISOString()
                        }, ...prev.bids]
                    }));

                    // Add to local history for animation
                    setBidHistory(prev => [{
                        bidder: data.bidder,
                        amount: data.amount,
                        timestamp: new Date().toISOString()
                    }, ...prev]);
                }
            };

            socket.on('new_bid', handleNewBid);

            return () => {
                socket.off('new_bid', handleNewBid);
            };
        }
    }, [id, auction]);

    // Timer Countdown
    useEffect(() => {
        if (!auction) return;

        const timer = setInterval(() => {
            const now = new Date().getTime();
            let end = new Date(auction.endTime).getTime(); // Use let to modify

            // Demo Logic: If auction ended, simulate it being live
            if (end <= now) {
                // Generate a deterministic random duration based on auction ID
                const idSum = id ? id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) : 0;
                const simulatedDuration = ((idSum % 10) + 1) * 3600000;
                end = now + simulatedDuration;
            }

            const distance = end - now;

            if (distance < 0) {
                clearInterval(timer);
                setTimeLeft("AUCTION ENDED");
            } else {
                const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);
                setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [auction, id]);

    const fetchAuction = async () => {
        try {
            const { data } = await api.get(`/auctions/${id}`);
            setAuction(data.data);
            // setBidHistory(data.data.bids || []); 
        } catch (error) {
            toast.error('Failed to load auction details');
            navigate('/auctions');
        } finally {
            setLoading(false);
        }
    };

    const handlePlaceBid = async (e) => {
        e.preventDefault();

        if (!user) {
            toast.error('Please login to place a bid');
            navigate('/login');
            return;
        }

        const currentPrice = auction.currentBid > 0 ? auction.currentBid : auction.startingBid;
        if (parseFloat(bidAmount) <= currentPrice) {
            toast.error(`Bid must be higher than current price: $${currentPrice}`);
            return;
        }

        setSubmitting(true);
        try {
            await api.post(`/auctions/${id}/bid`, { amount: parseFloat(bidAmount) });
            setBidAmount('');
            // Socket will handle the update
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to place bid');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <Loading />;
    if (!auction) return null;

    return (
        <div className="min-h-screen bg-slate-900 text-white pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">

                <button
                    onClick={() => navigate('/auctions')}
                    className="flex items-center text-slate-400 hover:text-white mb-6 transition-colors"
                >
                    <FaArrowLeft className="mr-2" /> Back to Auctions
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                    {/* Left Column: Product Image & Details */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <div className="bg-slate-800 rounded-3xl overflow-hidden shadow-2xl border border-slate-700 mb-8 relative group">
                            <img
                                src={auction.product?.images?.[0]?.url || 'https://placehold.co/600x600/1e293b/cbd5e1?text=Product'}
                                alt={auction.product?.name || 'Unknown Product'}
                                className="w-full h-96 object-contain bg-slate-900 group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute top-4 left-4 bg-red-600/90 backdrop-blur text-white px-4 py-1 rounded-full text-sm font-bold animate-pulse">
                                LIVE
                            </div>
                        </div>

                        <div className="bg-slate-800/50 p-8 rounded-3xl border border-slate-700 backdrop-blur-sm">
                            <h2 className="text-3xl font-bold mb-4">{auction.product?.name || 'Product Details Unavailable'}</h2>
                            <div className="prose prose-invert text-slate-300 max-w-none">
                                {/* Normally render HTML description here */}
                                <p>A premium item available for exclusive bidding.</p>
                            </div>
                            <div className="mt-6 flex items-center space-x-4">
                                <div className="flex items-center text-slate-400">
                                    <FaUserCircle className="mr-2 text-xl" />
                                    <span>Seller: <span className="text-white font-semibold">{auction.seller.firstName} {auction.seller.lastName}</span></span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Column: Bidding Interface */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex flex-col space-y-6"
                    >
                        {/* Countdown & Status */}
                        <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-3xl p-8 border border-indigo-500/30 shadow-lg shadow-indigo-900/20">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <p className="text-indigo-300 text-sm font-semibold tracking-wider uppercase mb-1">Time Remaining</p>
                                    <h3 className="text-4xl font-mono font-bold text-white flex items-center">
                                        <FaClock className="mr-3 text-indigo-400" />
                                        {timeLeft}
                                    </h3>
                                </div>
                                <div>
                                    <p className="text-emerald-400 text-sm font-semibold flex items-center justify-end">
                                        <FaTrophy className="mr-1" /> Highest Bidder
                                    </p>
                                    {auction.bids && auction.bids.length > 0 ? (
                                        <p className="text-white font-bold text-right">{auction.bids[0].bidder?.firstName || 'Unknown'}</p>
                                    ) : (
                                        <p className="text-slate-500 text-right">No bids yet</p>
                                    )}
                                </div>
                            </div>

                            <div className="py-6 border-t border-slate-700/50 border-b mb-6">
                                <p className="text-slate-400 text-sm mb-1">Current Highest Bid</p>
                                <div className="flex items-baseline">
                                    <span className="text-2xl text-slate-500 mr-2">$</span>
                                    <span className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                                        {auction.currentBid > 0 ? auction.currentBid : auction.startingBid}
                                    </span>
                                </div>
                            </div>

                            <form onSubmit={handlePlaceBid} className="space-y-4">
                                <div>
                                    <label className="block text-slate-300 text-sm font-medium mb-2">Your Bid Amount</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span className="text-slate-500">$</span>
                                        </div>
                                        <input
                                            type="number"
                                            step="0.01"
                                            min={auction.currentBid > 0 ? auction.currentBid + 1 : auction.startingBid}
                                            value={bidAmount}
                                            onChange={(e) => setBidAmount(e.target.value)}
                                            className="block w-full pl-8 pr-12 py-4 bg-slate-950 border border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-slate-600 text-lg font-semibold transition-all shadow-inner"
                                            placeholder={(auction.currentBid + 1) || (auction.startingBid + 1)}
                                            required
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitting || timeLeft === "AUCTION ENDED"}
                                    className={`w-full py-4 rounded-xl font-bold text-lg shadow-xl shadow-indigo-900/30 flex justify-center items-center transition-all transform active:scale-95 ${submitting ? 'bg-indigo-800 cursor-not-allowed' :
                                        timeLeft === "AUCTION ENDED" ? 'bg-slate-700 cursor-not-allowed' :
                                            'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white'
                                        }`}
                                >
                                    {submitting ? 'Placing Bid...' : timeLeft === "AUCTION ENDED" ? 'Auction Ended' : (
                                        <>Place Bid <FaGavel className="ml-2" /></>
                                    )}
                                </button>
                            </form>
                        </div>

                        {/* Bid History */}
                        <div className="bg-slate-800/50 rounded-3xl p-6 border border-slate-700 flex-grow backdrop-blur-sm max-h-[400px] overflow-hidden flex flex-col">
                            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                                <FaHistory className="mr-2 text-slate-400" /> Live Bid History
                            </h3>

                            <div className="overflow-y-auto pr-2 space-y-2 flex-grow custom-scrollbar">
                                <AnimatePresence>
                                    {auction.bids && auction.bids.map((bid, index) => (
                                        <motion.div
                                            key={index} // Ideally use bid ID, but timestamps work reasonably for display
                                            initial={{ opacity: 0, y: -20, x: -20 }}
                                            animate={{ opacity: 1, y: 0, x: 0 }}
                                            className={`p-3 rounded-xl flex justify-between items-center ${index === 0 ? 'bg-indigo-900/40 border border-indigo-500/30' : 'bg-slate-900/40 border border-slate-800'}`}
                                        >
                                            <div className="flex items-center">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${index === 0 ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-400'}`}>
                                                    {bid.bidder?.firstName?.charAt(0) || '?'}
                                                </div>
                                                <div>
                                                    <p className={`font-semibold ${index === 0 ? 'text-white' : 'text-slate-300'}`}>
                                                        {bid.bidder?.firstName || 'Anonymous'}
                                                    </p>
                                                    <p className="text-xs text-slate-500">
                                                        {new Date(bid.timestamp).toLocaleTimeString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <span className={`font-mono font-bold ${index === 0 ? 'text-emerald-400' : 'text-slate-400'}`}>
                                                ${bid.amount}
                                            </span>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                                {(!auction.bids || auction.bids.length === 0) && (
                                    <p className="text-slate-500 text-center py-4">No bids yet. Be the first!</p>
                                )}
                                <div ref={bidsEndRef} />
                            </div>
                        </div>

                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default AuctionDetail;
