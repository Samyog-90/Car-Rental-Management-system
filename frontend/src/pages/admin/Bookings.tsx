import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Edit, Trash2, Plus, Search, CheckCircle, XCircle, Clock } from 'lucide-react';

const Bookings: React.FC = () => {
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await axios.get('http://localhost:5000/api/bookings', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBookings(response.data);
        } catch (error) {
            console.error("Failed to fetch bookings", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id: string, status: string) => {
        try {
            const token = localStorage.getItem('adminToken');
            await axios.put(`http://localhost:5000/api/bookings/${id}/status`, { status }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchBookings(); // Refresh list
        } catch (error) {
            alert('Failed to update status');
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Approved': return 'bg-green-100 text-green-700';
            case 'Rejected': return 'bg-red-100 text-red-700';
            case 'Pending': return 'bg-yellow-100 text-yellow-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const filteredBookings = bookings.filter(b =>
        b.carName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.licenseNumber?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Booking Management</h1>
                <div className="relative">
                    <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search bookings..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none w-64"
                    />
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-gray-700">Car</th>
                                <th className="px-6 py-4 font-semibold text-gray-700">Customer Details</th>
                                <th className="px-6 py-4 font-semibold text-gray-700">Dates</th>
                                <th className="px-6 py-4 font-semibold text-gray-700">Status</th>
                                <th className="px-6 py-4 font-semibold text-gray-700">Total</th>
                                <th className="px-6 py-4 font-semibold text-gray-700 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr><td colSpan={6} className="p-8 text-center text-gray-500">Loading bookings...</td></tr>
                            ) : filteredBookings.length === 0 ? (
                                <tr><td colSpan={6} className="p-8 text-center text-gray-500">No bookings found.</td></tr>
                            ) : (
                                filteredBookings.map((booking) => (
                                    <tr key={booking._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-gray-900">{booking.carName}</p>
                                            <p className="text-xs text-gray-500">ID: {booking.carId}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-medium text-gray-900">Lic: {booking.licenseNumber}</p>
                                            {booking.licenseFront && <a href={`http://localhost:5000/${booking.licenseFront}`} target="_blank" className="text-xs text-blue-600 underline hover:text-blue-800 mr-2">License</a>}
                                            {booking.nidFront && <a href={`http://localhost:5000/${booking.nidFront}`} target="_blank" className="text-xs text-blue-600 underline hover:text-blue-800">NID</a>}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            <div>{booking.startDate}</div>
                                            <div className="text-gray-400">to</div>
                                            <div>{booking.endDate}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(booking.status)}`}>
                                                {booking.status === 'Approved' && <CheckCircle size={12} />}
                                                {booking.status === 'Rejected' && <XCircle size={12} />}
                                                {booking.status === 'Pending' && <Clock size={12} />}
                                                {booking.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-gray-900">
                                            {booking.totalPrice}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {booking.status === 'Pending' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleStatusUpdate(booking._id, 'Approved')}
                                                            className="p-1.5 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                                                            title="Approve"
                                                        >
                                                            <CheckCircle size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleStatusUpdate(booking._id, 'Rejected')}
                                                            className="p-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                                                            title="Reject"
                                                        >
                                                            <XCircle size={18} />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Bookings;
