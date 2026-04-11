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
        <div className="min-h-screen bg-gray-50 flex flex-col print:bg-white shadow-none">
            <div className="print:hidden">
                <Navbar />
            </div>
            <div className="flex-1 max-w-2xl mx-auto w-full py-12 px-4 print:py-4 print:px-0 print:max-w-none">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 transition-colors font-medium print:hidden">
                    <ChevronLeft className="w-4 h-4" />
                    Back
                </button>

                <div className="bg-white rounded-3xl shadow-xl overflow-hidden print:shadow-none print:border-none print:m-0 print:p-0">
                    <div className="bg-gray-900 print:bg-white print:border-b-4 print:border-black print:text-black p-8 text-white flex justify-between items-end">
                        <div className="space-y-2">
                            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4 print:bg-black">
                                <span className="text-white font-black text-xl">D</span>
                            </div>
                            <h1 className="text-3xl font-black tracking-tight print:text-5xl uppercase">Invoice</h1>
                            <p className="text-gray-400 print:text-gray-600 text-sm font-mono mt-2">ID: #{booking._id?.toString().slice(-8).toUpperCase()}</p>
                        </div>
                        <div className="text-right space-y-1">
                            <p className="text-sm font-black text-blue-400 print:text-gray-800 uppercase tracking-widest">{booking.status}</p>
                            <p className="text-xs text-gray-400 print:text-gray-500 font-medium">{new Date(booking.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>

                    <div className="p-8 space-y-8 print:p-4 print:mt-4">
                        <div className="grid grid-cols-2 gap-8 text-sm">
                            <div className="space-y-2">
                                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs print:text-gray-500">Billed To</p>
                                <p className="text-gray-900 font-black text-lg">{booking.fullName || "Valued Customer"}</p>
                                <p className="text-gray-600 font-medium">Lic/ID: {booking.licenseNumber || "Verified"}</p>
                            </div>
                            <div className="space-y-2 text-right">
                                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs print:text-gray-500">Vehicle Info</p>
                                <p className="text-gray-900 font-black text-lg">{booking.carName}</p>
                                <p className="text-gray-600 font-medium uppercase text-xs tracking-wider">{booking.rentalType || 'Standard'} RENTAL</p>
                            </div>
                        </div>

                        <div className="border border-gray-200 print:border-2 print:border-black rounded-2xl overflow-hidden">
                            <div className="grid grid-cols-2 bg-gray-50 print:bg-gray-100 p-6 border-b border-gray-200 print:border-black">
                                <div>
                                    <p className="text-xs font-bold text-gray-500 print:text-gray-700 uppercase tracking-wider mb-1">Rental Period</p>
                                    <p className="text-sm text-gray-900 font-black">{booking.startDate} to {booking.endDate}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-bold text-gray-500 print:text-gray-700 uppercase tracking-wider mb-1">Pickup Location</p>
                                    <p className="text-sm text-gray-900 font-black">{booking.location || 'Office Location'}</p>
                                </div>
                            </div>
                            
                            <div className="p-6 space-y-4 bg-white print:bg-white">
                                <div className="flex justify-between text-sm font-medium">
                                    <span className="text-gray-500 print:text-black">Base Rental Rate</span>
                                    <span className="text-gray-900 font-bold">{booking.totalPrice}</span>
                                </div>
                                <div className="flex justify-between text-sm font-medium">
                                    <span className="text-gray-500 print:text-black">Service Fees & Taxes (Included)</span>
                                    <span className="text-gray-900 font-bold">Rs. 0</span>
                                </div>
                                <div className="flex justify-between items-end pt-6 border-t border-gray-100 print:border-black">
                                    <span className="text-gray-800 uppercase tracking-tight text-sm font-bold">Total Paid Amount</span>
                                    <span className="text-blue-600 print:text-black font-black text-3xl">{booking.totalPrice}</span>
                                </div>
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
            <div className="print:hidden">
                <Footer />
            </div>
        </div>
    );
};

export default InvoiceDetail;
