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
    }, [location]);

    if (verifying) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
                    <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-6" />
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Verifying Payment...</h1>
                    <p className="text-gray-600">Please wait while we confirm your transaction with eSewa.</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 text-red-600">
                        <XCircle className="w-10 h-10" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Verification Failed</h1>
                    <p className="text-gray-600 mb-8">{error}</p>
                    <button
                        onClick={() => navigate('/home')}
                        className="w-full py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors"
                    >
                        Return to Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 sm:p-8">
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-2xl w-full text-center space-y-8">
                <div className="space-y-4">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600 shadow-sm">
                        <CheckCircle className="w-10 h-10" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">Payment Successful!</h1>
                    <p className="text-gray-600 max-w-md mx-auto">
                        Your booking has been confirmed and trip details are ready.
                    </p>
                </div>

                {/* Invoice Section */}
                {booking && (
                    <div className="w-full bg-white border-2 border-gray-100 rounded-2xl shadow-sm overflow-hidden text-left animate-in slide-in-from-bottom-4 duration-500">
                        <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
                            <h3 className="font-bold text-gray-800 uppercase tracking-widest text-xs">Booking Invoice</h3>
                            <span className="text-xs text-gray-500 font-mono">#{booking._id?.toString().slice(-8).toUpperCase()}</span>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex justify-between border-b pb-2">
                                <span className="text-gray-500 text-sm">Vehicle:</span>
                                <span className="font-bold text-gray-900">{booking.carName}</span>
                            </div>
                            <div className="flex justify-between border-b pb-2">
                                <span className="text-gray-500 text-sm">Pick-up:</span>
                                <span className="font-medium text-gray-900">{booking.location}</span>
                            </div>
                            <div className="flex justify-between border-b pb-2">
                                <span className="text-gray-500 text-sm">Trip Duration:</span>
                                <span className="font-medium text-gray-900 capitalize">{booking.startDate} to {booking.endDate}</span>
                            </div>
                            <div className="flex justify-between border-b pb-2">
                                <span className="text-gray-500 text-sm">Rental Mode:</span>
                                <span className="font-medium text-gray-900 capitalize">{booking.rentalType} Mode</span>
                            </div>
                            <div className="flex justify-between text-xl font-black text-blue-600 pt-4">
                                <span className="text-gray-700 font-bold">Total Amount Paid</span>
                                <span>Rs. {booking.totalPrice}</span>
                            </div>
                            <div className="pt-4 flex items-center gap-2 text-[10px] text-green-600 font-black uppercase tracking-widest">
                                <CheckCircle className="w-4 h-4" />
                                Secured via eSewa
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <button
                        onClick={() => window.print()}
                        className="flex-1 py-3 border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                    >
                        Print Invoice
                    </button>
                    <button
                        onClick={() => navigate('/home')}
                        className="flex-2 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-all shadow-lg transform hover:-translate-y-1"
                    >
                        Return to Home
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccess;
