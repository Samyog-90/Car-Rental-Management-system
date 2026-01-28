import React from 'react';
import { Car, Users, CalendarCheck, DollarSign } from 'lucide-react';

const Dashboard: React.FC = () => {
    // Mock stats
    const stats = [
        { label: 'Total Cars', value: '12', icon: Car, color: 'bg-blue-500' },
        { label: 'Active Bookings', value: '5', icon: CalendarCheck, color: 'bg-green-500' },
        { label: 'Total Users', value: '45', icon: Users, color: 'bg-purple-500' },
        { label: 'Revenue', value: '$12,450', icon: DollarSign, color: 'bg-yellow-500' },
    ];

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center text-white`}>
                            <stat.icon size={24} />
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm font-medium uppercase">{stat.label}</p>
                            <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Activity Diagram Placeholder */}
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 min-h-[300px]">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Bookings</h3>
                    <p className="text-gray-500 text-center py-20">Chart or List Placeholder</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 min-h-[300px]">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Fleet Status</h3>
                    <p className="text-gray-500 text-center py-20">Map or Status Placeholder</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
