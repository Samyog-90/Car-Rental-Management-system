import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User, Lock, Save, LogOut, Phone, Mail, UserCircle, Car, Calendar, MapPin, Clock, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';


const UserProfile: React.FC = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    // Password State
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Profile Edit State
    const [editFullName, setEditFullName] = useState('');
    const [editEmail, setEditEmail] = useState('');
    const [editContactNumber, setEditContactNumber] = useState('');

    // Bookings State
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
                // Prioritize standard user token if both exist for some reason
                const endpoint = token ? '/api/users/profile' : '/api/admin/profile';
                const usedToken = token || adminToken;

                if (!usedToken) {
                    navigate('/');
                    return;
                }
                
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
            setError("New passwords rely don't match");
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

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto space-y-8">
                    {/* Header */}
                    <div className="flex justify-between items-center bg-white p-8 rounded-2xl shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                                <User className="w-8 h-8" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">{user?.fullName || user?.name}</h1>
                                <p className="text-gray-500 flex items-center gap-1 font-medium"><Mail size={14}/> {user?.email}</p>
                                {user?.contactNumber && (
                                    <p className="text-gray-500 flex items-center gap-1 font-medium mt-1"><Phone size={14}/> {user.contactNumber}</p>
                                )}
                            </div>
                        </div>
                        <div className="flex gap-2">
                            {localStorage.getItem('adminToken') && (
                                <button
                                    onClick={() => navigate('/admin')}
                                    className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium border border-blue-200 hover:border-blue-300"
                                >
                                    Admin Panel
                                </button>
                            )}
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium border border-red-200 hover:border-red-300"
                            >
                                <LogOut className="w-4 h-4" />
                                Sign Out
                            </button>
                        </div>
                    </div>

                    {/* Booking History Section */}
                    {localStorage.getItem('token') && (
                        <div className="bg-white rounded-3xl shadow-lg shadow-gray-200/50 p-10 border border-gray-100">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                                        <div className="p-2 bg-purple-50 rounded-lg">
                                            <Clock className="w-6 h-6 text-purple-600" />
                                        </div>
                                        Booking History
                                    </h2>
                                    <p className="text-gray-500 text-sm mt-1">Review your past and current rental transactions.</p>
                                </div>
                            </div>

                            {fetchingBookings ? (
                                <div className="py-10 text-center text-gray-400 font-medium">Fetching history...</div>
                            ) : bookings.length === 0 ? (
                                <div className="py-12 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100">
                                    <Car className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                                    <p className="text-gray-400 font-bold">No rental history found.</p>
                                    <button 
                                        onClick={() => navigate('/fleet')}
                                        className="mt-4 text-blue-600 font-black hover:underline underline-offset-4"
                                    >
                                        Start your first journey
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {bookings.map((booking) => (
                                        <div key={booking._id} className="group relative bg-gray-50 hover:bg-white border-l-4 border-transparent hover:border-gray-900 p-6 rounded-r-3xl transition-all hover:shadow-2xl hover:shadow-gray-200/50 overflow-hidden">
                                            <div className="absolute top-0 right-0 p-4">
                                                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest font-mono">Doc #{booking._id?.slice(-6).toUpperCase()}</p>
                                            </div>
                                            
                                            <div className="flex flex-col lg:flex-row justify-between gap-8">
                                                <div className="flex items-start gap-6">
                                                    <div className="w-20 h-20 bg-white rounded-2xl border border-gray-100 flex items-center justify-center p-3 shrink-0 group-hover:rotate-6 transition-transform shadow-sm">
                                                        <Car className="w-10 h-10 text-gray-400" />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <h3 className="text-xl font-black text-gray-900">{booking.carName}</h3>
                                                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                                                                booking.status === 'Approved' ? 'bg-green-100 text-green-700' :
                                                                booking.status === 'Pending' ? 'bg-orange-100 text-orange-700' :
                                                                booking.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                                                                'bg-gray-100 text-gray-700'
                                                            }`}>
                                                                {booking.status}
                                                            </span>
                                                        </div>
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm text-gray-500">
                                                            <span className="flex items-center gap-2 font-medium">
                                                                <Calendar size={14} className="text-blue-500" /> 
                                                                {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                                                            </span>
                                                            <span className="flex items-center gap-2 font-medium">
                                                                <MapPin size={14} className="text-purple-500" /> 
                                                                {booking.location}
                                                            </span>
                                                            <span className="flex items-center gap-2 font-medium">
                                                                <Clock size={14} className="text-gray-400" /> 
                                                                Booked: {new Date(booking.createdAt).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-end gap-6 pt-4 lg:pt-0 border-t lg:border-t-0 border-gray-100">
                                                    <div className="text-right">
                                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Fee Paid</p>
                                                        <p className="text-2xl font-black text-gray-900 leading-none">Rs. {booking.totalPrice}</p>
                                                    </div>
                                                    <button 
                                                        onClick={() => navigate(`/invoice/${booking._id}`)}
                                                        className="flex items-center gap-2 px-6 py-3 bg-white text-gray-900 text-sm font-black rounded-xl border-2 border-gray-900 hover:bg-gray-900 hover:text-white transition-all shadow-sm active:scale-95"
                                                    >
                                                        <FileText size={16} />
                                                        View Invoice
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Personal Information */}
                    {localStorage.getItem('token') && (
                        <div className="bg-white rounded-3xl shadow-lg shadow-gray-200/50 p-10 border border-gray-100">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                                        <div className="p-2 bg-blue-50 rounded-lg">
                                            <UserCircle className="w-6 h-6 text-blue-600" />
                                        </div>
                                        Account Details
                                    </h2>
                                    <p className="text-gray-500 text-sm mt-1">Manage your public information and contact details.</p>
                                </div>
                            </div>

                            {message && (
                                <div className="bg-green-50 text-green-700 p-4 rounded-2xl mb-8 text-sm font-bold border border-green-100 flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                    {message}
                                </div>
                            )}

                            {error && (
                                <div className="bg-red-50 text-red-700 p-4 rounded-2xl mb-8 text-sm font-bold border border-red-100 flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
                                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleUpdateProfile} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Identity</label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                type="text"
                                                value={editFullName}
                                                onChange={(e) => setEditFullName(e.target.value)}
                                                placeholder="Enter full name"
                                                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium text-gray-900"
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
                                                placeholder="+977 98XXXXXXXX"
                                                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium text-gray-900"
                                                required
                                            />
                                        </div>
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
                                            placeholder="you@example.com"
                                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium text-gray-900"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-4 bg-gray-900 text-white font-black rounded-2xl hover:bg-gray-800 transition-all shadow-xl shadow-gray-200 active:scale-[0.98]"
                                    >
                                        <Save className="w-5 h-5" />
                                        Update Details
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Settings Grid */}
                    <div className="bg-white rounded-2xl shadow-sm p-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <Lock className="w-5 h-5 text-gray-500" />
                            Security Settings
                        </h2>

                        {message && (
                            <div className="bg-green-50 text-green-700 p-4 rounded-xl mb-6 text-sm font-medium border border-green-200">
                                {message}
                            </div>
                        )}

                        {error && (
                            <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-6 text-sm font-medium border border-red-200">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleChangePassword} className="space-y-6 max-w-lg">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Current Password</label>
                                <input
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm New Password</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-all"
                            >
                                <Save className="w-4 h-4" />
                                Update Password
                            </button>
                        </form>
                    </div>


                </div>
            </div>

            <Footer />
        </div>
    );
};

export default UserProfile;
