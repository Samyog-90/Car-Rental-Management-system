import React, { useEffect, useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Car, Users, CalendarCheck, LogOut, Menu, X, ArrowLeft, Mail } from 'lucide-react';

const AdminLayout: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            navigate('/admin/login');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    const menuItems = [
        { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/admin/cars', icon: Car, label: 'Car Management' },
        { path: '/admin/bookings', icon: CalendarCheck, label: 'Booking Management' },
        { path: '/admin/users', icon: Users, label: 'User Management' },
        { path: '/admin/messages', icon: Mail, label: 'User Messages' },
    ];

    const getAdminData = () => {
        try {
            const data = localStorage.getItem('adminUser');
            if (data && data !== 'undefined' && data !== 'null') {
                const parsed = JSON.parse(data);
                return parsed || {};
            }
            return {};
        } catch (e) {
            console.error("Failed to parse admin user", e);
            return {};
        }
    };

    const adminUser = getAdminData();

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            {/* Sidebar Overlay (Mobile) */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 bg-gray-900 text-white w-72 flex flex-col z-50 transition-transform duration-300 transform
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                lg:static lg:translate-x-0
            `}>
                <div className="p-8 border-b border-gray-800 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <span className="text-white font-black text-xl">A</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-lg leading-tight">Admin Hub</span>
                            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Control Center</span>
                        </div>
                    </div>
                    <button className="lg:hidden p-2 hover:bg-gray-800 rounded-lg" onClick={() => setIsSidebarOpen(false)}>
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setIsSidebarOpen(false)}
                                className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all group ${isActive
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                                        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                    }`}
                            >
                                <item.icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-blue-400'}`} />
                                <span className="font-semibold">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-6 border-t border-gray-800 space-y-3">
                    <button 
                        onClick={() => navigate('/home')}
                        className="flex items-center gap-4 px-4 py-3 w-full text-gray-400 hover:bg-gray-800 rounded-xl transition-all"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="font-semibold">Exit to Site</span>
                    </button>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-4 px-4 py-3 w-full text-red-400 hover:bg-red-950/30 hover:text-red-300 rounded-xl transition-all"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="font-semibold">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Header (Mobile & Top Desktop) */}
                <header className="h-16 lg:h-20 bg-white border-b border-gray-100 flex items-center justify-between px-6 lg:px-10 shrink-0">
                    <div className="flex items-center gap-4">
                        <button 
                            className="lg:hidden p-2.5 bg-gray-50 hover:bg-gray-100 rounded-xl text-gray-600 transition-all"
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <h1 className="text-xl font-bold text-gray-800 lg:text-2xl">
                            {menuItems.find(item => location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path)))?.label || 'Dashboard'}
                        </h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex flex-col items-end">
                            <p className="text-sm font-bold text-gray-900">
                                {adminUser.name || 'Admin'}
                            </p>
                            <span className="text-[10px] text-blue-600 font-bold uppercase tracking-widest bg-blue-50 px-1.5 py-0.5 rounded">Superuser</span>
                        </div>
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center border-2 border-white shadow-sm font-bold text-gray-600">
                            {adminUser.name?.charAt(0) || 'A'}
                        </div>
                    </div>
                </header>

                {/* Main Body */}
                <main className="flex-1 overflow-auto bg-gray-50/50">
                    <div className="p-6 lg:p-10 max-w-[1600px] mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
