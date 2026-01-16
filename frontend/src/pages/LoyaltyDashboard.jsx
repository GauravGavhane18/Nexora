import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const LoyaltyDashboard = () => {
  const [loyaltyData, setLoyaltyData] = useState(null);
  const [rewards, setRewards] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchLoyaltyData();
    fetchRewards();
    fetchHistory();
  }, []);

  const fetchLoyaltyData = async () => {
    try {
      const { data } = await axios.get('/api/v1/loyalty/points');
      setLoyaltyData(data.data);
    } catch (error) {
      toast.error('Failed to load loyalty data');
    } finally {
      setLoading(false);
    }
  };

  const fetchRewards = async () => {
    try {
      const { data } = await axios.get('/api/v1/loyalty/rewards');
      setRewards(data.data);
    } catch (error) {
      console.error('Failed to load rewards');
    }
  };

  const fetchHistory = async () => {
    try {
      const { data } = await axios.get('/api/v1/loyalty/history');
      setHistory(data.data);
    } catch (error) {
      console.error('Failed to load history');
    }
  };

  const handleRedeemReward = async (rewardId) => {
    try {
      const { data } = await axios.post(`/api/v1/loyalty/redeem/${rewardId}`);
      toast.success(data.message);
      fetchLoyaltyData();
      fetchRewards();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to redeem reward');
    }
  };

  const getTierColor = (tier) => {
    const colors = {
      bronze: 'from-orange-400 to-orange-600',
      silver: 'from-gray-300 to-gray-500',
      gold: 'from-yellow-400 to-yellow-600',
      platinum: 'from-purple-400 to-purple-600'
    };
    return colors[tier] || colors.bronze;
  };

  const getTierProgress = (tier, lifetimePoints) => {
    const tiers = {
      bronze: { min: 0, max: 2000 },
      silver: { min: 2000, max: 5000 },
      gold: { min: 5000, max: 10000 },
      platinum: { min: 10000, max: 10000 }
    };
    
    const current = tiers[tier];
    if (tier === 'platinum') return 100;
    
    return ((lifetimePoints - current.min) / (current.max - current.min)) * 100;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Loyalty Program</h1>
          <p className="mt-2 text-gray-600">Earn points and unlock exclusive rewards</p>
        </div>

        {/* Tier Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`bg-gradient-to-r ${getTierColor(loyaltyData?.tier)} rounded-xl shadow-lg p-8 mb-8 text-white`}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold capitalize">{loyaltyData?.tier} Member</h2>
              <p className="text-white/80 mt-1">Keep earning to reach the next tier</p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold">{loyaltyData?.points}</div>
              <div className="text-white/80">Available Points</div>
            </div>
          </div>

          {/* Progress Bar */}
          {loyaltyData?.tier !== 'platinum' && (
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Progress to next tier</span>
                <span>{Math.round(getTierProgress(loyaltyData?.tier, loyaltyData?.lifetimePoints))}%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-3">
                <div
                  className="bg-white rounded-full h-3 transition-all"
                  style={{ width: `${getTierProgress(loyaltyData?.tier, loyaltyData?.lifetimePoints)}%` }}
                ></div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {['overview', 'rewards', 'history'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-4 text-sm font-medium capitalize ${
                    activeTab === tab
                      ? 'border-b-2 border-blue-500 text-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                  title="Total Points"
                  value={loyaltyData?.points}
                  icon="💎"
                />
                <StatCard
                  title="Lifetime Points"
                  value={loyaltyData?.lifetimePoints}
                  icon="🏆"
                />
                <StatCard
                  title="Current Tier"
                  value={loyaltyData?.tier}
                  icon="⭐"
                  capitalize
                />
              </div>
            )}

            {activeTab === 'rewards' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rewards.map((reward) => (
                  <RewardCard
                    key={reward._id}
                    reward={reward}
                    userPoints={loyaltyData?.points}
                    onRedeem={handleRedeemReward}
                  />
                ))}
              </div>
            )}

            {activeTab === 'history' && (
              <div className="space-y-4">
                {history.map((item, index) => (
                  <HistoryItem key={index} item={item} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, capitalize }) => (
  <div className="bg-gray-50 rounded-lg p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600">{title}</p>
        <p className={`text-2xl font-bold text-gray-900 mt-1 ${capitalize ? 'capitalize' : ''}`}>
          {value}
        </p>
      </div>
      <div className="text-4xl">{icon}</div>
    </div>
  </div>
);

const RewardCard = ({ reward, userPoints, onRedeem }) => {
  const canRedeem = userPoints >= reward.pointsCost;

  return (
    <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <h3 className="font-semibold text-lg mb-2">{reward.name}</h3>
      <p className="text-sm text-gray-600 mb-4">{reward.description}</p>
      
      <div className="flex items-center justify-between mb-4">
        <span className="text-2xl font-bold text-blue-600">{reward.pointsCost}</span>
        <span className="text-sm text-gray-500">points</span>
      </div>

      <button
        onClick={() => onRedeem(reward._id)}
        disabled={!canRedeem}
        className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
          canRedeem
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        }`}
      >
        {canRedeem ? 'Redeem' : 'Not Enough Points'}
      </button>
    </div>
  );
};

const HistoryItem = ({ item }) => (
  <div className="flex items-center justify-between py-4 border-b border-gray-200">
    <div>
      <p className="font-medium text-gray-900">{item.reason}</p>
      <p className="text-sm text-gray-500">
        {new Date(item.createdAt).toLocaleDateString()}
      </p>
    </div>
    <div className={`text-lg font-bold ${item.points > 0 ? 'text-green-600' : 'text-red-600'}`}>
      {item.points > 0 ? '+' : ''}{item.points}
    </div>
  </div>
);

export default LoyaltyDashboard;
