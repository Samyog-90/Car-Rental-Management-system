import React, { useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Car, Users, CalendarCheck, LogOut } from 'lucide-react';

const AdminLayout: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Check for token
        const token = localStorage.getItem('adminToken');
        if (!token) {
            navigate('/admin/login');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
    };

    const menuItems = [
        { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/admin/cars', icon: Car, label: 'Car Management' },
        { path: '/admin/bookings', icon: CalendarCheck, label: 'Booking Management' },
        { path: '/admin/users', icon: Users, label: 'User Management' },
    ];

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-900 text-white flex flex-col">
                <div className="p-6 border-b border-gray-800">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold">A</span>
                        </div>
                        <span className="font-bold text-lg">Admin Panel</span>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                        ? 'bg-blue-600 text-white'
                                        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                    }`}
                            >
                                <item.icon size={20} />
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-gray-800">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 w-full text-red-400 hover:bg-gray-800 rounded-lg transition-colors"
                    >
                        <LogOut size={20} />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <div className="p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
