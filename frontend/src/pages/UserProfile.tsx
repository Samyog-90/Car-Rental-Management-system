import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User, Lock, Save, LogOut, Phone, Mail, UserCircle, Car, Calendar, MapPin, Clock, FileText, LayoutDashboard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const UserProfile: React.FC = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [editFullName, setEditFullName] = useState('');
    const [editEmail, setEditEmail] = useState('');
    const [editContactNumber, setEditContactNumber] = useState('');

    const [bookings, setBookings] = useState<any[]>([]);
    const [fetchingBookings, setFetchingBookings] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('token');
            const adminToken = localStorage.getItem('adminToken');
            
            if (!token && !adminToken) {
                navigate('/');
                return;
            }

            try {
                const endpoint = token ? '/api/users/profile' : '/api/admin/profile';
                const usedToken = token || adminToken;
                
                const response = await axios.get(`http://localhost:5000${endpoint}`, {
                    headers: { Authorization: `Bearer ${usedToken}` }
                });
                setUser(response.data);
                if (token) {
                    setEditFullName(response.data.fullName || '');
                    setEditEmail(response.data.email || '');
                    setEditContactNumber(response.data.contactNumber || '');
                }
            } catch (err) {
                console.error(err);
                navigate('/');
            } finally {
                setLoading(false);
            }
        };

        const fetchBookings = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;
            setFetchingBookings(true);
            try {
                const response = await axios.get('http://localhost:5000/api/bookings/my', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setBookings(response.data);
            } catch (err) {
                console.error("Failed to fetch bookings:", err);
            } finally {
                setFetchingBookings(false);
            }
        };

        fetchProfile();
        if (localStorage.getItem('token')) {
            fetchBookings();
        }
    }, [navigate]);

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (newPassword !== confirmPassword) {
            setError("New passwords don't match");
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const adminToken = localStorage.getItem('adminToken');
            const usedToken = token || adminToken;
            const endpoint = token ? '/api/users/change-password' : '/api/admin/change-password';

            await axios.put(`http://localhost:5000${endpoint}`, {
                currentPassword,
                newPassword
            }, {
                headers: { Authorization: `Bearer ${usedToken}` }
            });

            setMessage('Password updated successfully');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to update password');
        }
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');

        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            await axios.put(`http://localhost:5000/api/users/profile`, {
                fullName: editFullName,
                email: editEmail,
                contactNumber: editContactNumber
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setMessage('Profile updated successfully');
            setUser({ ...user, fullName: editFullName, email: editEmail, contactNumber: editContactNumber });
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to update profile');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        navigate('/');
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="py-8 lg:py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto space-y-6 lg:space-y-10">
                    {/* Header Card */}
                    <div className="bg-white p-6 lg:p-10 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 opacity-50"></div>
                        
                        <div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                            <div className="flex items-center gap-5">
                                <div className="w-20 h-20 bg-linear-to-br from-blue-600 to-blue-700 rounded-3xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                                    <User className="w-10 h-10" />
                                </div>
                                <div>
                                    <h1 className="text-2xl lg:text-3xl font-black text-gray-900 leading-tight">
                                        {user?.fullName || user?.name}
                                    </h1>
                                    <div className="flex flex-col gap-1 mt-1">
                                        <p className="text-gray-500 flex items-center gap-2 text-sm font-bold uppercase tracking-wider">
                                            <Mail size={14} className="text-blue-500" /> {user?.email}
                                        </p>
                                        {user?.contactNumber && (
                                            <p className="text-gray-500 flex items-center gap-2 text-sm font-bold uppercase tracking-wider">
                                                <Phone size={14} className="text-blue-500" /> {user.contactNumber}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-3 w-full sm:w-auto">
                                {localStorage.getItem('adminToken') && (
                                    <button
                                        onClick={() => navigate('/admin')}
                                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-white text-blue-600 hover:bg-blue-50 rounded-2xl transition-all font-black border-2 border-blue-100 hover:border-blue-200 shadow-sm active:scale-95"
                                    >
                                        <LayoutDashboard className="w-4 h-4" />
                                        ADMIN
                                    </button>
                                )}
                                <button
                                    onClick={handleLogout}
                                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-red-50 text-red-600 hover:bg-red-100 rounded-2xl transition-all font-black border-2 border-red-100 shadow-sm active:scale-95"
                                >
                                    <LogOut className="w-4 h-4" />
                                    EXIT
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Booking History Section */}
                    {localStorage.getItem('token') && (
                        <div className="bg-white rounded-[32px] shadow-sm p-6 lg:p-10 border border-gray-100">
                            <div className="mb-8">
                                <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                                    <div className="p-2.5 bg-purple-50 rounded-2xl">
                                        <Clock className="w-6 h-6 text-purple-600" />
                                    </div>
                                    Booking History
                                </h2>
                                <p className="text-gray-500 text-sm mt-1 font-medium">Review your premium mobility transactions.</p>
                            </div>

                            {fetchingBookings ? (
                                <div className="py-20 text-center text-gray-400 font-black animate-pulse uppercase tracking-widest">SYNCING DATA...</div>
                            ) : bookings.length === 0 ? (
                                <div className="py-16 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                                    <Car className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                                    <p className="text-gray-400 font-black uppercase tracking-widest">No active history</p>
                                    <button 
                                        onClick={() => navigate('/fleet')}
                                        className="mt-6 px-10 py-4 bg-gray-900 text-white font-black rounded-2xl hover:bg-blue-600 hover:shadow-xl hover:shadow-blue-200 transition-all active:scale-95"
                                    >
                                        EXPLORE FLEET
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {bookings.map((booking) => (
                                        <div key={booking._id} className="group relative bg-white hover:bg-gray-50 border border-gray-100 p-6 lg:p-8 rounded-[32px] transition-all hover:shadow-2xl hover:shadow-gray-200/50 overflow-hidden">
                                            <div className="absolute top-4 right-6 hidden sm:block">
                                                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest font-mono">SYS-ID: {booking._id?.slice(-8).toUpperCase()}</p>
                                            </div>
                                            
                                            <div className="flex flex-col lg:flex-row justify-between gap-8">
                                                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
                                                    <div className="w-24 h-24 bg-gray-50 rounded-3xl border border-gray-200 flex items-center justify-center p-4 shrink-0 group-hover:rotate-6 transition-transform shadow-sm relative overflow-hidden">
                                                        <Car className="w-12 h-12 text-gray-400 relative z-10" />
                                                        <div className="absolute inset-0 bg-linear-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                                    </div>
                                                    <div className="text-center sm:text-left">
                                                        <div className="flex flex-col sm:flex-row items-center gap-3 mb-4">
                                                            <h3 className="text-xl lg:text-2xl font-black text-gray-900">{booking.carName}</h3>
                                                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${
                                                                booking.status === 'Approved' ? 'bg-green-500 text-white' :
                                                                booking.status === 'Pending' ? 'bg-orange-500 text-white' :
                                                                booking.status === 'Rejected' ? 'bg-red-500 text-white' :
                                                                'bg-gray-500 text-white'
                                                            }`}>
                                                                {booking.status}
                                                            </span>
                                                        </div>
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-sm text-gray-600">
                                                            <span className="flex items-center gap-3 font-bold uppercase tracking-wide">
                                                                <Calendar size={16} className="text-blue-500" /> 
                                                                {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                                                            </span>
                                                            <span className="flex items-center gap-3 font-bold uppercase tracking-wide">
                                                                <MapPin size={16} className="text-purple-500" /> 
                                                                {booking.location}
                                                            </span>
                                                            <span className="flex items-center gap-3 font-bold uppercase tracking-wide">
                                                                <Clock size={16} className="text-gray-400" /> 
                                                                {new Date(booking.createdAt).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex flex-col sm:flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-6 pt-6 lg:pt-0 border-t lg:border-t-0 border-gray-100">
                                                    <div className="text-center sm:text-left lg:text-right">
                                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 leading-none">Total Investment</p>
                                                        <p className="text-3xl font-black text-gray-900 leading-none">Rs. {booking.totalPrice}</p>
                                                    </div>
                                                    <button 
                                                        onClick={() => navigate(`/invoice/${booking._id}`)}
                                                        className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-gray-900 text-white text-sm font-black rounded-2xl hover:bg-blue-600 transition-all shadow-lg active:scale-95 group/btn"
                                                    >
                                                        <FileText size={18} className="group-hover/btn:scale-110 transition-transform" />
                                                        VIEW INVOICE
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Personal Information & Password Settings Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
                        {/* Account Details */}
                        {localStorage.getItem('token') && (
                            <div className="bg-white rounded-[32px] shadow-sm p-8 lg:p-10 border border-gray-100 h-full">
                                <div className="mb-10">
                                    <h2 className="text-xl lg:text-2xl font-black text-gray-900 flex items-center gap-3">
                                        <div className="p-2.5 bg-blue-50 rounded-2xl">
                                            <UserCircle className="w-6 h-6 text-blue-600" />
                                        </div>
                                        Account Details
                                    </h2>
                                    <p className="text-gray-500 text-xs mt-1 font-bold uppercase tracking-widest">System Identity Management</p>
                                </div>

                                <form onSubmit={handleUpdateProfile} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Identity</label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                type="text"
                                                value={editFullName}
                                                onChange={(e) => setEditFullName(e.target.value)}
                                                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold text-gray-900"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Contact Number</label>
                                        <div className="relative">
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                type="text"
                                                value={editContactNumber}
                                                onChange={(e) => setEditContactNumber(e.target.value)}
                                                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold text-gray-900"
                                                required
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                type="email"
                                                value={editEmail}
                                                onChange={(e) => setEditEmail(e.target.value)}
                                                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold text-gray-900"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full flex items-center justify-center gap-3 px-10 py-5 bg-gray-900 text-white font-black rounded-2xl hover:bg-blue-600 transition-all shadow-xl shadow-gray-200 active:scale-[0.98] uppercase tracking-widest text-sm"
                                    >
                                        <Save className="w-5 h-5" />
                                        Save Changes
                                    </button>
                                </form>
                            </div>
                        )}

                        {/* Security Settings */}
                        <div className="bg-white rounded-[32px] shadow-sm p-8 lg:p-10 border border-gray-100 h-full">
                            <div className="mb-10">
                                <h2 className="text-xl lg:text-2xl font-black text-gray-900 flex items-center gap-3">
                                    <div className="p-2.5 bg-red-50 rounded-2xl">
                                        <Lock className="w-6 h-6 text-red-600" />
                                    </div>
                                    Security
                                </h2>
                                <p className="text-gray-500 text-xs mt-1 font-bold uppercase tracking-widest">Credential Infrastructure</p>
                            </div>

                            <form onSubmit={handleChangePassword} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Current Password</label>
                                    <input
                                        type="password"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        className="w-full px-5 py-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-red-500 outline-none transition-all font-bold text-gray-900"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">New Secure Password</label>
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full px-5 py-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-red-500 outline-none transition-all font-bold text-gray-900"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Confirm Identity Key</label>
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full px-5 py-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-red-500 outline-none transition-all font-bold text-gray-900"
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full flex items-center justify-center gap-3 px-10 py-5 bg-gray-900 text-white font-black rounded-2xl hover:bg-red-600 transition-all shadow-xl shadow-gray-200 active:scale-[0.98] uppercase tracking-widest text-sm"
                                >
                                    <Lock className="w-5 h-5" />
                                    Update Security
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
            
            {/* Global Notifications Overlay */}
            {(message || error) && (
                <div className="fixed bottom-8 right-8 z-50 animate-in slide-in-from-right-full duration-500">
                    <div className={`px-8 py-4 rounded-2xl shadow-2xl font-black text-sm uppercase tracking-widest flex items-center gap-4 ${
                        message ? 'bg-gray-900 text-green-400 border-b-4 border-green-500' : 'bg-gray-900 text-red-400 border-b-4 border-red-500'
                    }`}>
                        <div className={`w-3 h-3 rounded-full animate-pulse ${message ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        {message || error}
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserProfile;
