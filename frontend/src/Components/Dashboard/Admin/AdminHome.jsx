import React, { useEffect, useState } from 'react';
import useAxios from '../../../Hooks/useAxios';
import { Users, ShoppingBag, DollarSign, Store } from 'lucide-react';

const AdminHome = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalSellers: 0,
        totalProducts: 0,
        totalRevenue: 0
    });
    const [loading, setLoading] = useState(true);
    const axiosInstance = useAxios();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axiosInstance.get('/api/admin/stats');
                if (response.data.success) {
                    setStats(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching admin stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [axiosInstance]);

    const StatCard = ({ title, value, icon: Icon, colorClass }) => (
        <div className="bg-base-100 p-6 rounded-2xl shadow-sm border border-base-300 flex items-center gap-4">
            <div className={`p-4 rounded-full ${colorClass} bg-opacity-10`}>
                <Icon className={`w-8 h-8 ${colorClass.replace('bg-', 'text-')}`} />
            </div>
            <div>
                <p className="text-gray-500 text-sm font-medium">{title}</p>
                <h3 className="text-2xl font-bold text-base-content">
                    {loading ? "..." : value}
                </h3>
            </div>
        </div>
    );

    return (
        <div className="p-6 bg-base-200 min-h-screen">
            <h2 className="text-3xl font-bold mb-8 font-aladin text-primary">Admin Dashboard</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Total Users"
                    value={stats.totalUsers}
                    icon={Users}
                    colorClass="bg-blue-500"
                />
                <StatCard
                    title="Total Sellers"
                    value={stats.totalSellers}
                    icon={Store}
                    colorClass="bg-purple-500"
                />
                <StatCard
                    title="Total Products"
                    value={stats.totalProducts}
                    icon={ShoppingBag}
                    colorClass="bg-orange-500"
                />
                <StatCard
                    title="Total Revenue"
                    value={`$${stats.totalRevenue.toFixed(2)}`}
                    icon={DollarSign}
                    colorClass="bg-green-500"
                />
            </div>

            {/* Placeholder for charts or recent activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-base-100 p-6 rounded-2xl shadow-sm border border-base-300 h-64 flex items-center justify-center text-gray-400">
                    Chart Placeholder
                </div>
                <div className="bg-base-100 p-6 rounded-2xl shadow-sm border border-base-300 h-64 flex items-center justify-center text-gray-400">
                    Recent Activity Placeholder
                </div>
            </div>
        </div>
    );
};

export default AdminHome;