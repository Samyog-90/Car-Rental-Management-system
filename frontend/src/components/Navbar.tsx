import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, Bell } from 'lucide-react';
import axios from 'axios';

const Navbar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const isLoggedIn = !!localStorage.getItem('token');
    const isAdminLoggedIn = !!localStorage.getItem('adminToken');
    
    const [notifications, setNotifications] = useState<any[]>([]);
    const [showNotifications, setShowNotifications] = useState(false);

    useEffect(() => {
        if (isLoggedIn) {
            fetchNotifications();
            const interval = setInterval(fetchNotifications, 30000); // Poll every 30s
            return () => clearInterval(interval);
        }
    }, [isLoggedIn]);

    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
            const res = await axios.get('http://localhost:5000/api/users/notifications', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setNotifications(res.data);
        } catch (error) {
            console.error("Failed to fetch notifications", error);
        }
    };

    const markAsRead = async (id: string) => {
        try {
            const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
            await axios.put(`http://localhost:5000/api/users/notifications/${id}/read`, {}, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setNotifications(notifications.map(n => n._id === id ? { ...n, read: true } : n));
        } catch (error) {
            console.error("Failed to mark notification as read", error);
        }
    };

    const handleNavigation = (path: string) => {
        navigate(path);
        setShowNotifications(false);
    };

    const getLinkClass = (path: string) => {
        return location.pathname === path
            ? "text-blue-600 font-bold transition-colors"
            : "text-gray-600 hover:text-blue-600 transition-colors font-medium";
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 lg:gap-8">
                        <div className="flex items-center gap-2 sm:gap-3 cursor-pointer" onClick={() => handleNavigation('/home')}>
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-full flex items-center justify-center">
                                <span className="text-white text-lg sm:text-xl font-bold">D</span>
                            </div>
                            <div>
                                <span className="text-lg sm:text-xl font-bold text-gray-900">DriveFlow</span>
                                <p className="text-xs text-gray-500 uppercase tracking-wide hidden sm:block">Premium Mobility</p>
                            </div>
                        </div>
                        <div className="hidden lg:flex gap-6">
                            <button onClick={() => handleNavigation('/home')} className={getLinkClass('/home')}>Home</button>
                            <button onClick={() => handleNavigation('/fleet')} className={getLinkClass('/fleet')}>Our Fleet</button>
                            <button onClick={() => handleNavigation('/how-it-works')} className={getLinkClass('/how-it-works')}>How It Works</button>
                            <button onClick={() => handleNavigation('/about')} className={getLinkClass('/about')}>About</button>
                            <button onClick={() => handleNavigation('/contact')} className={getLinkClass('/contact')}>Contact us</button>
                        </div>
                    </div>
                    <div className="flex gap-2 items-center relative">
                        {isLoggedIn && (
                            <div className="relative">
                                <button 
                                    onClick={() => setShowNotifications(!showNotifications)}
                                    className="p-2 text-gray-600 hover:text-blue-600 transition-colors relative"
                                >
                                    <Bell className="w-6 h-6" />
                                    {unreadCount > 0 && (
                                        <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ring-2 ring-white">
                                            {unreadCount}
                                        </span>
                                    )}
                                </button>

                                {showNotifications && (
                                    <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-100 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
                                        <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                                            <h3 className="font-bold text-gray-900">Notifications</h3>
                                            <span className="text-xs bg-blue-100 text-blue-700 font-bold px-2 py-1 rounded-full">{unreadCount} New</span>
                                        </div>
                                        <div className="max-h-96 overflow-y-auto">
                                            {notifications.length === 0 ? (
                                                <div className="p-8 text-center text-gray-400">
                                                    <Bell className="w-8 h-8 mx-auto mb-2 opacity-20" />
                                                    <p className="text-sm">No notifications yet</p>
                                                </div>
                                            ) : (
                                                notifications.map((notif) => (
                                                    <div 
                                                        key={notif._id} 
                                                        onClick={() => {
                                                            markAsRead(notif._id);
                                                            if (notif.bookingId) navigate(`/invoice/${notif.bookingId}`);
                                                        }}
                                                        className={`p-4 border-b last:border-0 cursor-pointer transition-colors ${notif.read ? 'bg-white' : 'bg-blue-50/50 hover:bg-blue-50'}`}
                                                    >
                                                        <div className="flex gap-3">
                                                            <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${notif.read ? 'bg-transparent' : 'bg-blue-600'}`}></div>
                                                            <div>
                                                                <p className={`text-sm ${notif.read ? 'text-gray-600' : 'text-gray-900 font-medium'}`}>{notif.message}</p>
                                                                <p className="text-[10px] text-gray-400 mt-1">{new Date(notif.createdAt).toLocaleString()}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                        
                        {(isLoggedIn || isAdminLoggedIn) ? (
                            <div className="flex items-center gap-3">
                                <div className="hidden sm:flex flex-col items-end">
                                    <p className="text-sm font-bold text-gray-900 leading-none mb-1">
                                        {(() => {
                                            if (isLoggedIn) {
                                                const userData = JSON.parse(localStorage.getItem('user') || '{}');
                                                return userData.fullName || 'User';
                                            } else {
                                                const adminData = JSON.parse(localStorage.getItem('adminUser') || '{}');
                                                return adminData.name || 'Admin';
                                            }
                                        })()}
                                    </p>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none">
                                        {isLoggedIn ? 'Client Profile' : 'System Admin'}
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleNavigation('/profile')}
                                    className="p-2 sm:p-2.5 bg-gray-900 text-white rounded-full hover:bg-blue-600 transition-all shadow-md group border-2 border-transparent hover:border-blue-100"
                                >
                                    <User className="w-5 h-5" />
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => handleNavigation('/')}
                                className="px-4 py-2 sm:px-6 bg-gray-900 text-white border-2 border-gray-900 rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition-colors text-sm sm:text-base"
                            >
                                Sign In
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
