import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, Bell, Menu, X } from 'lucide-react';
import axios from 'axios';

const Navbar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const isLoggedIn = !!localStorage.getItem('token');
    const isAdminLoggedIn = !!localStorage.getItem('adminToken');
    
    const [notifications, setNotifications] = useState<any[]>([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

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
        setIsMenuOpen(false);
    };

    const getLinkClass = (path: string) => {
        const baseClass = "transition-all duration-200 font-medium px-4 py-2 rounded-lg";
        return location.pathname === path
            ? `${baseClass} text-blue-600 bg-blue-50 font-bold`
            : `${baseClass} text-gray-600 hover:text-blue-600 hover:bg-gray-50`;
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="flex items-center justify-between h-20">
                    {/* Logo & Desktop Nav */}
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => handleNavigation('/home')}>
                            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center transform group-hover:rotate-6 transition-transform shadow-lg shadow-blue-200">
                                <span className="text-white text-xl font-bold">D</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xl font-bold text-gray-900 leading-tight">DriveFlow</span>
                                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold leading-none hidden sm:block">Premium Mobility</p>
                            </div>
                        </div>

                        {/* Desktop Links */}
                        <div className="hidden lg:flex items-center gap-2">
                            <button onClick={() => handleNavigation('/home')} className={getLinkClass('/home')}>Home</button>
                            <button onClick={() => handleNavigation('/fleet')} className={getLinkClass('/fleet')}>Fleet</button>
                            <button onClick={() => handleNavigation('/how-it-works')} className={getLinkClass('/how-it-works')}>Process</button>
                            <button onClick={() => handleNavigation('/about')} className={getLinkClass('/about')}>About</button>
                            <button onClick={() => handleNavigation('/contact')} className={getLinkClass('/contact')}>Contact</button>
                        </div>
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex items-center gap-2 sm:gap-4">
                        {isLoggedIn && (
                            <div className="relative">
                                <button 
                                    onClick={() => setShowNotifications(!showNotifications)}
                                    className="p-2.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all relative"
                                >
                                    <Bell className="w-6 h-6" />
                                    {unreadCount > 0 && (
                                        <span className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full ring-4 ring-white">
                                            {unreadCount}
                                        </span>
                                    )}
                                </button>

                                {showNotifications && (
                                    <div className="absolute right-0 mt-4 w-[calc(100vw-2rem)] sm:w-96 bg-white border border-gray-100 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                                        <div className="p-4 border-b bg-gray-50/50 flex justify-between items-center">
                                            <h3 className="font-bold text-gray-900">Notifications</h3>
                                            <span className="text-xs bg-blue-100 text-blue-700 font-bold px-2.5 py-1 rounded-full">{unreadCount} New</span>
                                        </div>
                                        <div className="max-h-[70vh] overflow-y-auto">
                                            {notifications.length === 0 ? (
                                                <div className="p-12 text-center">
                                                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                                        <Bell className="w-8 h-8 text-gray-300" />
                                                    </div>
                                                    <p className="text-sm text-gray-500 font-medium">Clear as a summer sky!</p>
                                                    <p className="text-xs text-gray-400 mt-1">No notifications right now.</p>
                                                </div>
                                            ) : (
                                                notifications.map((notif) => (
                                                    <div 
                                                        key={notif._id} 
                                                        onClick={() => {
                                                            markAsRead(notif._id);
                                                            if (notif.bookingId) navigate(`/invoice/${notif.bookingId}`);
                                                        }}
                                                        className={`p-4 border-b last:border-0 cursor-pointer transition-colors ${notif.read ? 'bg-white hover:bg-gray-50' : 'bg-blue-50/30 hover:bg-blue-50'}`}
                                                    >
                                                        <div className="flex gap-4">
                                                            <div className={`mt-1.5 h-2 w-2 rounded-full shrink-0 ${notif.read ? 'bg-gray-200' : 'bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.4)] animate-pulse'}`}></div>
                                                            <div className="flex-1">
                                                                <p className={`text-sm leading-relaxed ${notif.read ? 'text-gray-600' : 'text-gray-900 font-semibold'}`}>{notif.message}</p>
                                                                <p className="text-xs text-gray-400 mt-1 font-medium">{new Date(notif.createdAt).toLocaleDateString()} · {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
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
                                <div className="hidden md:flex flex-col items-end">
                                    <p className="text-sm font-bold text-gray-900 truncate max-w-[150px]">
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
                                    <span className="text-[10px] text-blue-600 font-bold uppercase tracking-widest px-1.5 py-0.5 bg-blue-50 rounded">
                                        {isLoggedIn ? 'Client' : 'Admin'}
                                    </span>
                                </div>
                                <button
                                    onClick={() => handleNavigation('/profile')}
                                    className="p-1 border-2 border-transparent hover:border-blue-100 rounded-full transition-all"
                                >
                                    <div className="w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center shadow-lg group-hover:bg-blue-600 transition-colors">
                                        <User className="w-5 h-5" />
                                    </div>
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => handleNavigation('/')}
                                className="px-5 py-2.5 bg-gray-900 text-white rounded-xl font-bold hover:bg-blue-600 transition-all shadow-lg shadow-gray-200 hover:shadow-blue-200 text-sm"
                            >
                                Sign In
                            </button>
                        )}

                        {/* Mobile Menu Toggle */}
                        <button 
                            className="lg:hidden p-2.5 text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Content */}
                {isMenuOpen && (
                    <div className="lg:hidden border-t border-gray-100 py-4 pb-6 space-y-1 animate-in slide-in-from-top-4 duration-300">
                        <button onClick={() => handleNavigation('/home')} className={`w-full text-left ${getLinkClass('/home')}`}>Home</button>
                        <button onClick={() => handleNavigation('/fleet')} className={`w-full text-left ${getLinkClass('/fleet')}`}>Our Fleet</button>
                        <button onClick={() => handleNavigation('/how-it-works')} className={`w-full text-left ${getLinkClass('/how-it-works')}`}>How It Works</button>
                        <button onClick={() => handleNavigation('/about')} className={`w-full text-left ${getLinkClass('/about')}`}>About Us</button>
                        <button onClick={() => handleNavigation('/contact')} className={`w-full text-left ${getLinkClass('/contact')}`}>Contact Us</button>
                        
                        {!isLoggedIn && !isAdminLoggedIn && (
                            <div className="pt-4 border-t border-gray-100 mt-4 px-4">
                                <button 
                                    onClick={() => handleNavigation('/')}
                                    className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-100"
                                >
                                    Create Account
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
