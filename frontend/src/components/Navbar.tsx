import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User } from 'lucide-react';

const Navbar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const isLoggedIn = !!localStorage.getItem('token') || !!localStorage.getItem('adminToken');


    const handleNavigation = (path: string) => {
        navigate(path);
    };

    const getLinkClass = (path: string) => {
        return location.pathname === path
            ? "text-blue-600 font-bold transition-colors"
            : "text-gray-600 hover:text-blue-600 transition-colors font-medium";
    };

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
                            <button
                                onClick={() => handleNavigation('/home')}
                                className={getLinkClass('/home')}
                            >
                                Home
                            </button>
                            <button
                                onClick={() => handleNavigation('/fleet')}
                                className={getLinkClass('/fleet')}
                            >
                                Our Fleet
                            </button>
                            <button
                                onClick={() => handleNavigation('/how-it-works')}
                                className={getLinkClass('/how-it-works')}
                            >
                                How It Works
                            </button>
                            <button
                                onClick={() => handleNavigation('/about')}
                                className={getLinkClass('/about')}
                            >
                                About
                            </button>
                            <button
                                onClick={() => handleNavigation('/contact')}
                                className={getLinkClass('/contact')}
                            >
                                Contact us
                            </button>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        {isLoggedIn ? (
                            <button
                                onClick={() => handleNavigation('/profile')}
                                className="px-4 py-2 sm:px-6 bg-gray-900 text-white border-2 border-gray-900 rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition-colors flex items-center gap-2 text-sm sm:text-base"
                            >
                                <User className="w-4 h-4" />
                                <span className="hidden sm:inline">User Profile</span>
                            </button>
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
