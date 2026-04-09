import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle, FileText, ChevronLeft, Printer } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const InvoiceDetail: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [booking, setBooking] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBooking = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/bookings`, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token') || localStorage.getItem('adminToken')}` }
                });
                const found = response.data.find((b: any) => b._id === id);
                if (found) {
                    setBooking(found);
                }
            } catch (err) {
                console.error("Failed to fetch booking details", err);
            } finally {
                setLoading(false);
            }
        };
        fetchBooking();
    }, [id]);

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading Invoice...</div>;
    if (!booking) return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="flex flex-col items-center justify-center p-20">
                <FileText className="w-16 h-16 text-gray-300 mb-4" />
                <h2 className="text-xl font-bold text-gray-900">Invoice Not Found</h2>
                <button onClick={() => navigate('/home')} className="mt-4 text-blue-600 font-bold hover:underline">Return Home</button>
            </div>
            <Footer />
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <div className="flex-1 max-w-2xl mx-auto w-full py-12 px-4">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 transition-colors font-medium">
                    <ChevronLeft className="w-4 h-4" />
                    Back
                </button>

                <div className="bg-white rounded-3xl shadow-xl overflow-hidden print:shadow-none print:border">
                    <div className="bg-gray-900 p-8 text-white flex justify-between items-end">
                        <div className="space-y-2">
                            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                                <span className="text-white font-bold">D</span>
                            </div>
                            <h1 className="text-2xl font-bold tracking-tight">Booking Invoice</h1>
                            <p className="text-gray-400 text-sm font-mono">Invoice ID: #{booking._id?.toString().slice(-8).toUpperCase()}</p>
                        </div>
                        <div className="text-right space-y-1">
                            <p className="text-sm font-bold text-blue-400 capitalize">{booking.status}</p>
                            <p className="text-xs text-gray-400">{new Date(booking.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>

                    <div className="p-8 space-y-8">
                        <div className="grid grid-cols-2 gap-8 text-sm">
                            <div className="space-y-1">
                                <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Customer Information</p>
                                <p className="text-gray-900 font-bold">{booking.fullName || "Valued Customer"}</p>
                                <p className="text-gray-600">Lic: {booking.licenseNumber}</p>
                            </div>
                            <div className="space-y-1 text-right">
                                <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Rental Details</p>
                                <p className="text-gray-900 font-bold">{booking.carName}</p>
                                <p className="text-gray-600 capitalize">{booking.rentalType} Mode</p>
                            </div>
                        </div>

                        <div className="border-y border-gray-100 py-6 space-y-4">
                            <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl">
                                <div>
                                    <p className="text-xs font-bold text-gray-500 uppercase">Pick-up & Drop-off</p>
                                    <p className="text-sm text-gray-900 font-medium">{booking.startDate} — {booking.endDate}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-bold text-gray-500 uppercase">Location</p>
                                    <p className="text-sm text-gray-900 font-medium">{booking.location}</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Rental Subtotal</span>
                                <span className="font-bold text-gray-900">{booking.totalPrice}</span>
                            </div>
                            <div className="flex justify-between text-2xl font-black text-gray-900 pt-6 border-t border-gray-100">
                                <span className="text-lg">Total Amount Paid</span>
                                <span className="text-blue-600">{booking.totalPrice}</span>
                            </div>
                        </div>

                        <div className="pt-8 flex flex-col items-center gap-4">
                            <div className="flex items-center gap-2 text-green-600 font-bold uppercase text-[10px] tracking-[0.2em] bg-green-50 px-4 py-2 rounded-full">
                                <CheckCircle className="w-4 h-4" />
                                Payment Confirmed via eSewa
                            </div>
                            <div className="flex gap-4 w-full print:hidden">
                                <button
                                    onClick={() => window.print()}
                                    className="flex-1 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                                >
                                    <Printer className="w-4 h-4" />
                                    Print Invoice
                                </button>
                                <button
                                    onClick={() => navigate('/home')}
                                    className="flex-1 py-3 border-2 border-gray-900 text-gray-900 font-bold rounded-xl hover:bg-gray-50 transition-all"
                                >
                                    Done
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default InvoiceDetail;
