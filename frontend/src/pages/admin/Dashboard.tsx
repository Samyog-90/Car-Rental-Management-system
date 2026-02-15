import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Car, Users, CalendarCheck, DollarSign, TrendingUp, Activity } from 'lucide-react';

const Dashboard: React.FC = () => {
    const [stats, setStats] = useState({
        totalCars: 0,
        activeBookings: 0,
        totalUsers: 0,
        totalRevenue: 'Rs. 0'
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await axios.get('http://localhost:5000/api/admin/stats', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStats(response.data);
        } catch (error) {
            console.error("Failed to fetch dashboard stats", error);
        } finally {
            setLoading(false);
        }
    };

    const statCards = [
        { label: 'Total Fleet', value: stats.totalCars, icon: Car, color: 'bg-blue-600', subtext: 'Vehicles available' },
        { label: 'Active Bookings', value: stats.activeBookings, icon: CalendarCheck, color: 'bg-green-600', subtext: 'Currently ongoing' },
        { label: 'Registered Users', value: stats.totalUsers, icon: Users, color: 'bg-purple-600', subtext: 'Total customer base' },
        { label: 'Total Revenue', value: stats.totalRevenue, icon: DollarSign, color: 'bg-yellow-500', subtext: 'Lifetime earnings' },
    ];

    if (loading) return <div className="p-8 text-center text-gray-500">Loading dashboard...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-500 mt-1">Welcome back, Admin</p>
                </div>
                <div className="flex gap-2">
                    <span className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-semibold flex items-center gap-2">
                        <Activity size={16} /> System Online
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statCards.map((stat, index) => (
                    <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center text-white shadow-lg shadow-${stat.color}/30`}>
                                <stat.icon size={24} />
                            </div>
                            <span className="flex items-center text-green-500 text-xs font-bold bg-green-50 px-2 py-1 rounded-full">
                                <TrendingUp size={12} className="mr-1" /> +12%
                            </span>
                        </div>
                        <div>
                            <h3 className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                            <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
                            <p className="text-gray-400 text-xs mt-2">{stat.subtext}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Actions / Recent Activity Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Chart Area (Placeholder) */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-gray-900">Revenue Analytics</h3>
                        <select className="border border-gray-200 rounded-lg px-3 py-1 text-sm text-gray-600 outline-none">
                            <option>Last 7 Days</option>
                            <option>This Month</option>
                            <option>This Year</option>
                        </select>
                    </div>
                    <div className="h-64 bg-gray-50 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-200">
                        <p className="text-gray-400">Analytics Chart Placeholder</p>
                    </div>
                </div>

                {/* Right Side Panel */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Recent Activity</h3>
                    <div className="space-y-6">
                        {[1, 2, 3].map((_, i) => (
                            <div key={i} className="flex gap-4 items-start">
                                <div className="w-2 h-2 mt-2 bg-blue-500 rounded-full shrink-0"></div>
                                <div>
                                    <p className="text-sm text-gray-900 font-medium">New booking received</p>
                                    <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
