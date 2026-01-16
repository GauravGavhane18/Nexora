import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const Bundles = () => {
  const [bundles, setBundles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('newest');

  useEffect(() => {
    fetchBundles();
  }, [filter, sort]);

  const fetchBundles = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/v1/bundles?status=active&sort=${sort}`);
      setBundles(data.data);
    } catch (error) {
      toast.error('Failed to load bundles');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Product Bundles</h1>
          <p className="mt-2 text-gray-600">Save more with our curated product bundles</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="newest">Newest</option>
            <option value="popular">Most Popular</option>
            <option value="discount">Best Discount</option>
          </select>
        </div>

        {/* Bundles Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : bundles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No bundles available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bundles.map((bundle) => (
              <BundleCard key={bundle._id} bundle={bundle} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const BundleCard = ({ bundle }) => {
  const savingsAmount = bundle.pricing.originalPrice - bundle.pricing.bundlePrice;
  const discountPercent = Math.round((savingsAmount / bundle.pricing.originalPrice) * 100);

  return (
    <Link to={`/bundle/${bundle._id}`} className="group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
        {/* Image */}
        <div className="relative h-48 bg-gray-200">
          {bundle.images && bundle.images[0] && (
            <img
              src={bundle.images[0].url}
              alt={bundle.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
          )}
          <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
            Save {discountPercent}%
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {bundle.name}
          </h3>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {bundle.description}
          </p>

          {/* Products Count */}
          <div className="flex items-center text-sm text-gray-500 mb-3">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            {bundle.products.length} Products
          </div>

          {/* Pricing */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-gray-400 line-through text-sm">
                ${bundle.pricing.originalPrice.toFixed(2)}
              </span>
              <span className="text-2xl font-bold text-blue-600 ml-2">
                ${bundle.pricing.bundlePrice.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Savings */}
          <div className="mt-2 text-sm text-green-600 font-medium">
            You save ${savingsAmount.toFixed(2)}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Bundles;
