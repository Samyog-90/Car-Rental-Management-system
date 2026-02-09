import React from 'react';
import { Search, Calendar, ShieldCheck, CreditCard, ArrowRight } from 'lucide-react';

const HowItWorks: React.FC = () => {
    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-20">
                <div className="text-center mb-16 lg:mb-24">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">How It Works</h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        Rent your dream car in 4 simple steps. We've streamlined the process to get you on the road faster and safer.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden lg:block absolute top-12 left-0 w-full h-1 bg-gray-100 -z-10 transform -translate-y-1/2"></div>

                    {/* Step 1 */}
                    <div className="relative bg-white p-6 rounded-2xl border border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-300 group">
                        <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:bg-blue-600 transition-colors duration-300">
                            <Search className="w-10 h-10 text-blue-600 group-hover:text-white transition-colors" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">1. Browse & Select</h3>
                        <p className="text-gray-600 text-center leading-relaxed">
                            Explore our premium fleet of vehicles. Filter by type, price, or features to find the perfect match for your journey.
                        </p>
                    </div>

                    {/* Step 2 */}
                    <div className="relative bg-white p-6 rounded-2xl border border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-300 group">
                        <div className="w-20 h-20 bg-purple-50 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:bg-purple-600 transition-colors duration-300">
                            <Calendar className="w-10 h-10 text-purple-600 group-hover:text-white transition-colors" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">2. Book Trip</h3>
                        <p className="text-gray-600 text-center leading-relaxed">
                            Choose your dates and pick-up location. Our system ensures realtime availability and transparent pricing.
                        </p>
                    </div>

                    {/* Step 3 */}
                    <div className="relative bg-white p-6 rounded-2xl border border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-300 group">
                        <div className="w-20 h-20 bg-green-50 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:bg-green-600 transition-colors duration-300">
                            <ShieldCheck className="w-10 h-10 text-green-600 group-hover:text-white transition-colors" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">3. Verify & Secure</h3>
                        <p className="text-gray-600 text-center leading-relaxed">
                            Upload your license and ID for instant verification. Our secure system keeps your data safe and private.
                        </p>
                    </div>

                    {/* Step 4 */}
                    <div className="relative bg-white p-6 rounded-2xl border border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-300 group">
                        <div className="w-20 h-20 bg-pink-50 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:bg-pink-600 transition-colors duration-300">
                            <CreditCard className="w-10 h-10 text-pink-600 group-hover:text-white transition-colors" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">4. Pay & Drive</h3>
                        <p className="text-gray-600 text-center leading-relaxed">
                            Complete your payment securely. Receive instant confirmation and get ready to hit the road in style.
                        </p>
                    </div>
                </div>

                <div className="mt-20 text-center">
                    <a href="/fleet" className="inline-flex items-center gap-3 px-8 py-4 bg-gray-900 text-white font-bold rounded-full hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                        Start Book Now <ArrowRight className="w-5 h-5" />
                    </a>
                </div>
            </div>
        </div>
    );
};

export default HowItWorks;
