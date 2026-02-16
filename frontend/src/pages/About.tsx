import React from 'react';
import { Shield, Globe, Award, CheckCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const About: React.FC = () => {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            {/* Hero Section */}
            <div className="relative bg-gray-900 py-24 lg:py-32 overflow-hidden">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute inset-0 bg-linear-to-r from-blue-900 to-purple-900 opacity-90"></div>
                    {/* Pattern overlay could go here */}
                </div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
                        Redefining Premium Mobility
                    </h1>
                    <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
                        DriveFlow is more than a car rental service. We are a technology-driven mobility partner committed to seamless, secure, and luxurious travel experiences.
                    </p>
                </div>
            </div>

            {/* Stats Section */}
            <div className="py-12 bg-white -mt-16 relative z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 text-center">
                            <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
                            <div className="text-gray-600 font-medium">Premium Vehicles</div>
                        </div>
                        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 text-center">
                            <div className="text-4xl font-bold text-purple-600 mb-2">50k+</div>
                            <div className="text-gray-600 font-medium">Happy Customers</div>
                        </div>
                        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 text-center">
                            <div className="text-4xl font-bold text-green-600 mb-2">15+</div>
                            <div className="text-gray-600 font-medium">Cities Covered</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mission Section */}
            <div className="py-20 lg:py-28">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <div className="inline-block px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-semibold uppercase tracking-wide mb-6">
                                Our Mission
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                                Bringing the Future of Car Rental to You
                            </h2>
                            <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
                                <p>
                                    At DriveFlow, we believe that renting a car should be as enjoyable as driving one. We've stripped away the complexities of traditional rental processes and replaced them with a digital-first approach.
                                </p>
                                <p>
                                    Whether you need a self-drive for a weekend getaway or a chauffeur-driven luxury sedan for a corporate event, our platform uses intelligent matching to ensure you get exactly what you need.
                                </p>
                            </div>

                            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="flex items-start gap-3">
                                    <CheckCircle className="w-6 h-6 text-blue-600 mt-1" />
                                    <div>
                                        <h4 className="font-bold text-gray-900">Zero Paperwork</h4>
                                        <p className="text-sm text-gray-500">Digital verification instantly.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <CheckCircle className="w-6 h-6 text-blue-600 mt-1" />
                                    <div>
                                        <h4 className="font-bold text-gray-900">24/7 Support</h4>
                                        <p className="text-sm text-gray-500">We never sleep, so you can drive.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-0 bg-linear-to-br from-blue-600 to-purple-600 rounded-3xl transform rotate-3 scale-105 opacity-20"></div>
                            <img
                                src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=2070"
                                alt="Luxury Car Fleet"
                                className="relative rounded-3xl shadow-2xl w-full h-auto object-cover"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Values Section */}
            <div className="bg-gray-50 py-20 lg:py-28">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose DriveFlow?</h2>
                        <p className="text-xl text-gray-600">Built on pillars of trust, quality, and innovation.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                                <Shield className="w-8 h-8 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Safety First</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Every vehicle undergoes a rigorous 40-point safety inspection before every trip. Your safety is our non-negotiable priority.
                            </p>
                        </div>
                        <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                            <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                                <Award className="w-8 h-8 text-purple-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Premium Quality</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Our fleet consists only of the latest models. Experience the newest technology and comfort in every drive.
                            </p>
                        </div>
                        <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                            <div className="w-14 h-14 bg-pink-100 rounded-xl flex items-center justify-center mb-6">
                                <Globe className="w-8 h-8 text-pink-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Transparent Pricing</h3>
                            <p className="text-gray-600 leading-relaxed">
                                No hidden charges. What you see is what you pay. Fuel, insurance, and taxes are all clearly broken down.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default About;
