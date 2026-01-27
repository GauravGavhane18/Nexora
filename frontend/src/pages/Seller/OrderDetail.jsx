import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiArrowLeft, FiPackage, FiTruck, FiUser, FiMapPin, FiCalendar, FiDollarSign } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../../services/api';

const SellerOrderDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrder();
    }, [id]);

    const fetchOrder = async () => {
        try {
            const response = await api.get(`/seller/orders/${id}`);
            setOrder(response.data.data);
        } catch (error) {
            console.error('Fetch order error:', error);
            toast.error('Failed to load order details');
            navigate('/seller/orders');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (itemId, newStatus, currentTracking = '') => {
        try {
            const trackingInfo = newStatus === 'shipped' && !currentTracking
                ? prompt('Enter tracking number (optional):')
                : currentTracking;

            await api.put(`/seller/orders/${id}/items/${itemId}`, {
                status: newStatus,
                trackingInfo: trackingInfo || undefined
            });

            toast.success('Status updated successfully');
            fetchOrder(); // Refresh to show updates
        } catch (error) {
            console.error('Status update error:', error);
            toast.error('Failed to update status');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!order) return null;

    return (
        <>
            <Helmet>
                <title>Order #{order.orderNumber} - NEXORA Seller</title>
            </Helmet>

            <div className="p-6 max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <Link
                        to="/seller/orders"
                        className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
                    >
                        <FiArrowLeft className="mr-2" />
                        Back to Orders
                    </Link>
                    <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-500">Order Placed: {new Date(order.createdAt).toLocaleDateString()}</span>
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                            #{order.orderNumber}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Items Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                                <h2 className="text-lg font-bold text-gray-900 flex items-center">
                                    <FiPackage className="mr-2 text-blue-600" />
                                    Order Items
                                </h2>
                                <span className="text-sm text-gray-500">{order.items.length} items</span>
                            </div>
                            <div className="divide-y divide-gray-100">
                                {order.items.map((item) => (
                                    <div key={item._id} className="p-6">
                                        <div className="flex flex-col sm:flex-row gap-6">
                                            <div className="h-24 w-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                                {item.image ? (
                                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                                                )}

                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <h3 className="font-semibold text-gray-900">{item.name}</h3>
                                                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                                    </div>
                                                    <p className="font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                                                </div>

                                                {/* Status Control */}
                                                <div className="mt-4 flex flex-wrap items-center gap-4 bg-gray-50 p-4 rounded-lg">
                                                    <div className="flex-1 min-w-[200px]">
                                                        <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Status</label>
                                                        <select
                                                            value={item.status}
                                                            onChange={(e) => handleStatusUpdate(item._id, e.target.value, item.trackingInfo)}
                                                            className="w-full border-gray-200 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
                                                        >
                                                            <option value="pending">Pending</option>
                                                            <option value="processing">Processing</option>
                                                            <option value="shipped">Shipped</option>
                                                            <option value="delivered">Delivered</option>
                                                            <option value="cancelled">Cancelled</option>
                                                        </select>
                                                    </div>

                                                    {item.status === 'shipped' && (
                                                        <div className="flex-1 min-w-[200px]">
                                                            <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Tracking Info</label>
                                                            <div className="text-sm text-gray-900 font-medium">
                                                                {item.trackingInfo || 'No tracking provided'}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Payment Summary */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                                <FiDollarSign className="mr-2 text-green-600" />
                                Payment Summary
                            </h2>
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-medium text-gray-900">
                                        ${order.items.reduce((acc, item) => acc + (item.price * item.quantity), 0).toFixed(2)}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Shipping</span>
                                    <span className="font-medium text-gray-900">$0.00</span>
                                </div>
                                <div className="pt-3 border-t border-gray-100 flex justify-between">
                                    <span className="font-bold text-gray-900">Total Earnings</span>
                                    <span className="font-bold text-blue-600">
                                        ${order.items.reduce((acc, item) => acc + (item.price * item.quantity), 0).toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Customer Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                                <FiUser className="mr-2 text-purple-600" />
                                Customer
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm font-medium text-gray-900">
                                        {order.user?.firstName} {order.user?.lastName}
                                    </p>
                                    <p className="text-sm text-gray-500">{order.user?.email}</p>
                                </div>
                            </div>
                        </div>

                        {/* Shipping Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                                <FiTruck className="mr-2 text-orange-600" />
                                Shipping Details
                            </h2>
                            {order.shippingAddress ? (
                                <div className="space-y-1 text-sm text-gray-600">
                                    <p className="font-medium text-gray-900">{order.shippingAddress.address}</p>
                                    <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
                                    <p>{order.shippingAddress.country}</p>
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500 italic">No shipping address provided</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SellerOrderDetail;
