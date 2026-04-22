import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import axios from 'axios';

const PaymentSuccess: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [verifying, setVerifying] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const hasVerified = useRef(false);

    const [booking, setBooking] = useState<any>(null);

    useEffect(() => {
        const verifyPayment = async () => {
            if (hasVerified.current) return;
            hasVerified.current = true;

            const queryParams = new URLSearchParams(location.search);
            const data = queryParams.get('data');

            if (!data) {
                setError("No payment data received from eSewa.");
                setVerifying(false);
                return;
            }

            try {
                const response = await axios.post('http://localhost:5000/api/payment/verify-esewa', { data });
                if (response.data.success) {
                    setBooking(response.data.booking);
                    setVerifying(false);
                } else {
                    setError(response.data.message || "Payment verification failed.");
                    setVerifying(false);
                }
            } catch (err: any) {
                setError(err.response?.data?.message || "An error occurred during verification.");
                setVerifying(false);
            }
        };

        verifyPayment();
    }, [location, navigate]);

    if (verifying) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
                <div className="bg-white p-10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] max-w-md w-full text-center space-y-6 animate-pulse">
                    <div className="relative mx-auto w-16 h-16">
                        <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-25"></div>
                        <div className="relative w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                            <Loader2 className="w-8 h-8 animate-spin" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-2xl font-black text-gray-900">VERIFYING...</h1>
                        <p className="text-gray-500 font-medium">Securing your rental records. Please wait.</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
                <div className="bg-white p-10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
                    <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto text-red-500 shadow-inner">
                        <XCircle className="w-12 h-12" />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-2xl font-bold text-gray-900">Verification Failed</h1>
                        <p className="text-gray-500">{error}</p>
                    </div>
                    <button
                        onClick={() => navigate('/home')}
                        className="w-full py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-red-600 transition-all duration-300 shadow-lg transform hover:-translate-y-1 active:scale-95"
                    >
                        Return to Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col items-center justify-center p-4 sm:p-8">
            <div className="bg-white p-10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] max-w-2xl w-full text-center space-y-10 border border-white/20 backdrop-blur-sm animate-in fade-in zoom-in duration-700">
                <div className="space-y-6">
                    <div className="relative mx-auto w-24 h-24">
                        <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-25"></div>
                        <div className="relative w-24 h-24 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-green-200">
                            <CheckCircle className="w-14 h-14" />
                        </div>
                    </div>
                    
                    <div className="space-y-4">
                        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">PAYMENT SUCCESSFUL</h1>
                        <p className="text-lg text-gray-500 font-medium">
                            Your adventure begins now. Your booking is officially secured.
                        </p>
                    </div>
                </div>

                {/* Invoice Section */}
                {booking && (
                    <div className="w-full bg-gray-50/50 rounded-2xl border border-gray-100 p-8 text-left space-y-6 group hover:bg-white transition-all duration-500 hover:shadow-xl hover:shadow-gray-200/50">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Booking Summary</h3>
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-[10px] font-bold">PAID</span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                            <div className="space-y-1">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Vehicle</p>
                                <p className="text-lg font-bold text-gray-900">{booking.carName}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Doc ID</p>
                                <p className="text-sm font-mono font-medium text-gray-600">#{booking._id?.toString().slice(-12).toUpperCase()}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Duration</p>
                                <p className="text-sm font-bold text-gray-800">{booking.startDate} to {booking.endDate}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Pickup Zone</p>
                                <p className="text-sm font-bold text-gray-800">{booking.location}</p>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-dashed border-gray-200 flex justify-between items-end">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-[10px] text-green-600 font-black uppercase tracking-widest bg-green-50 px-3 py-1 rounded-full w-fit">
                                    <CheckCircle className="w-3 h-3" />
                                    Secured via eSewa
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xs font-bold text-gray-400 uppercase mb-1">Total Paid</p>
                                <p className="text-3xl font-black text-blue-600 tracking-tight">Rs. {booking.totalPrice}</p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                    <button
                        onClick={() => window.print()}
                        className="flex-1 py-4 border-2 border-gray-100 text-gray-600 font-bold rounded-2xl hover:bg-gray-50 hover:border-gray-200 transition-all duration-300 flex items-center justify-center gap-2 active:scale-95"
                    >
                        Save Receipt
                    </button>
                    <button
                        onClick={() => navigate('/home')}
                        className="flex-[1.5] py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-blue-600 transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.15)] hover:shadow-blue-200 transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2"
                    >
                        Go back to Home Page
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccess;
