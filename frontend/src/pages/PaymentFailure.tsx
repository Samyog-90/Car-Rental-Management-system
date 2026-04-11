import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';

const PaymentFailure: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-50 flex items-center justify-center p-4">
            <div className="bg-white p-10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
                <div className="relative mx-auto w-20 h-20">
                    <div className="absolute inset-0 bg-red-100 rounded-full animate-pulse opacity-50"></div>
                    <div className="relative w-20 h-20 bg-red-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-red-200">
                        <AlertCircle className="w-12 h-12" />
                    </div>
                </div>
                
                <div className="space-y-2">
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Payment Cancelled</h1>
                    <p className="text-gray-500 font-medium">
                        We couldn't finalize your transaction. No funds were charged.
                    </p>
                </div>

                <div className="space-y-3">
                    <button
                        onClick={() => navigate('/fleet')}
                        className="w-full py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-red-600 transition-all duration-300 shadow-lg transform hover:-translate-y-1 active:scale-95"
                    >
                        Try Again
                    </button>
                    <button
                        onClick={() => navigate('/home')}
                        className="w-full py-4 bg-white border-2 border-gray-100 text-gray-600 font-bold rounded-2xl hover:bg-gray-50 transition-all duration-300 active:scale-95"
                    >
                        Go to Home Page
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentFailure;
