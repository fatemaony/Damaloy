import React, { useEffect, useState } from 'react';
import useAxios from '../../../Hooks/useAxios';
import useAuth from '../../../Hooks/useAuth';
import { Loader2, DollarSign, ShoppingBag, Package, TrendingUp, Calendar } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const SellerHome = () => {
    const { user } = useAuth();
    const axiosInstance = useAxios();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sellerId, setSellerId] = useState(null);

    useEffect(() => {
        const fetchSellerData = async () => {
            if (!user?.email) return;

            try {
                // First get seller ID
                const sellerRes = await axiosInstance.get(`/api/sellers/email/${user.email}`);
                if (sellerRes.data.success) {
                    const id = sellerRes.data.data.id;
                    setSellerId(id);

                    // Then fetch stats
                    const statsRes = await axiosInstance.get(`/api/sellers/stats/${id}`);
                    if (statsRes.data.success) {
                        setStats(statsRes.data.data);
                    }
                }
            } catch (error) {
                console.error("Error fetching seller stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSellerData();
    }, [user, axiosInstance]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
        );
    }

    if (!stats) {
        return <div className="p-6 text-center text-gray-500">No data available.</div>;
    }

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-primary">Dashboard Overview</h1>
                <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your store today.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Total Sales */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
                    <div className="p-4 bg-green-50 rounded-full text-primary">
                        <DollarSign className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Total Sales</p>
                        <h3 className="text-2xl font-bold text-gray-900">${stats.totalSales.toFixed(2)}</h3>
                    </div>
                </div>

                {/* Total Orders */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
                    <div className="p-4 bg-blue-50 rounded-full text-blue-600">
                        <ShoppingBag className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Total Orders</p>
                        <h3 className="text-2xl font-bold text-gray-900">{stats.totalOrders}</h3>
                    </div>
                </div>

                {/* Total Products */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
                    <div className="p-4 bg-purple-50 rounded-full text-purple-600">
                        <Package className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Total Products</p>
                        <h3 className="text-2xl font-bold text-gray-900">{stats.totalProducts}</h3>
                    </div>
                </div>
            </div>

            {/* Charts & Recent Orders */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Sales Chart */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-primary" />
                        Sales Overview (Last 7 Days)
                    </h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats.salesOverTime}>
                                <defs>
                                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#00924b" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#00924b" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis
                                    dataKey="date"
                                    tickFormatter={(date) => new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                    tick={{ fontSize: 12, fill: '#6b7280' }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <YAxis
                                    tick={{ fontSize: 12, fill: '#6b7280' }}
                                    axisLine={false}
                                    tickLine={false}
                                    tickFormatter={(value) => `$${value}`}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                    formatter={(value) => [`$${value}`, 'Sales']}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="sales"
                                    stroke="#00924b"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorSales)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Orders */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-primary" />
                        Recent Orders
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-gray-100 text-sm text-gray-500">
                                    <th className="pb-3 font-medium">Order ID</th>
                                    <th className="pb-3 font-medium">Customer</th>
                                    <th className="pb-3 font-medium">Amount</th>
                                    <th className="pb-3 font-medium">Status</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {stats.recentOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="py-4 text-center text-gray-500">No recent orders found.</td>
                                    </tr>
                                ) : (
                                    stats.recentOrders.map((order) => (
                                        <tr key={order.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                                            <td className="py-4 font-medium text-gray-900">#{order.id}</td>
                                            <td className="py-4 text-gray-600">{order.customer_name}</td>
                                            <td className="py-4 font-medium text-gray-900">${order.total_amount}</td>
                                            <td className="py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize
                          ${order.order_status === 'delivered' ? 'bg-green-100 text-green-700' :
                                                        order.order_status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                            order.order_status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                                                    }`}>
                                                    {order.order_status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SellerHome;