import React, { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Star, Users, Fuel, Settings, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, CheckCircle } from 'lucide-react';

const FleetPage: React.FC = () => {
    const locationHook = useLocation();
    const state = locationHook.state as {
        hireDriver?: string;
        location?: string;
        destination?: string;
        capacity?: string;
        roadCondition?: string;
        recommendation?: string;
    } | null;

    const [vehicles] = useState([
        {
            id: 1,
            name: "Toyota Corolla",
            type: "Sedan",
            image: "https://ccarprice.com/products/Toyota_Corolla_L_2022_1.jpg",
            price: "Rs. 2000",
            priceType: "Daily Rate",
            automatic: true,
            seats: 5,
            petrol: "Petrol",
            rating: 4.8
        },
        {
            id: 2,
            name: "Honda Civic",
            type: "Sedan",
            image: "https://upload.wikimedia.org/wikipedia/commons/1/1a/Honda_Civic_e-HEV_Sport_%28XI%29_%E2%80%93_f_30062024.jpg",
            price: "Rs. 2500",
            priceType: "Daily Rate",
            automatic: true,
            seats: 5,
            petrol: "Petrol",
            rating: 4.9
        },
        {
            id: 3,
            name: "Hyundai Creta",
            type: "SUV",
            image: "https://ymimg1.b8cdn.com/resized/car_model/12271/logo/webp_mobile_listing_main_2023_Hyundai_Creta_Exterior_01.webp",
            price: "Rs. 3000",
            priceType: "Daily Rate",
            automatic: true,
            seats: 5,
            petrol: "Diesel",
            rating: 4.7
        },
        {
            id: 4,
            name: "Suzuki Swift",
            type: "Hatchback",
            image: "https://media.umbraco.io/suzuki-gb/o0yoypmz/10816_suzuki_swift_501_r1.jpg",
            price: "Rs. 1000",
            priceType: "Daily Rate",
            automatic: true,
            seats: 5,
            petrol: "Petrol",
            rating: 4.6
        },
        {
            id: 5,
            name: "Mahindra Thar",
            type: "SUV",
            image: "https://upload.wikimedia.org/wikipedia/commons/1/13/Mahindra_Thar_Photoshoot_At_Perupalem_Beach_%28West_Godavari_District%2CAP%2CIndia_%29_Djdavid.jpg",
            price: "Rs. 1,500",
            priceType: "Daily Rate",
            automatic: false,
            seats: 4,
            petrol: "Diesel",
            rating: 4.9
        },
        {
            id: 6,
            name: "Kia Seltos",
            type: "SUV",
            image: "https://upload.wikimedia.org/wikipedia/commons/6/6c/Kia_Seltos_SP2_PE_Snow_White_Pearl_%2817%29_%28cropped%29.jpg",
            price: "Rs. 1,200",
            priceType: "Daily Rate",
            automatic: true,
            seats: 5,
            petrol: "Petrol",
            rating: 4.8
        }
    ]);

    const displayVehicles = useMemo(() => {
        if (!state?.recommendation) return vehicles;
        return [...vehicles].sort((a, b) => {
            const aMatch = a.type === state.recommendation;
            const bMatch = b.type === state.recommendation;
            if (aMatch && !bMatch) return -1;
            if (!aMatch && bMatch) return 1;
            return 0;
        });
    }, [vehicles, state?.recommendation]);

    const handleBookNow = (carName: string) => {
        alert(`Booking ${carName}...`);
    };


    const navigate = useNavigate();

    const handleNavigation = (page: string) => {
        switch (page) {
            case 'home':
                navigate('/');
                break;
            case 'our-fleet':
                navigate('/fleet');
                break;
            case 'login':
                navigate('/login');
                break;
            default:
                console.log(`Navigation to ${page} not implemented yet`);
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50">

            {/* Navigation - Using previous design */}
            <nav className="bg-white shadow-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 lg:gap-8">
                            <div className="flex items-center gap-2 sm:gap-3">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-full flex items-center justify-center">
                                    <span className="text-white text-lg sm:text-xl font-bold">D</span>
                                </div>
                                <div>
                                    <span className="text-lg sm:text-xl font-bold text-gray-900">DriveFlow</span>
                                    <p className="text-xs text-gray-500 uppercase tracking-wide hidden sm:block">Premium Mobility</p>
                                </div>
                            </div>
                            <div className="hidden lg:flex gap-6">
                                <button
                                    onClick={() => handleNavigation('home')}
                                    className="text-gray-600 hover:text-blue-600 transition-colors"
                                >
                                    Home
                                </button>
                                <button
                                    onClick={() => handleNavigation('our-fleet')}
                                    className="text-blue-600 font-semibold hover:text-blue-700 transition-colors"
                                >
                                    Our fleet
                                </button>
                                <button
                                    onClick={() => handleNavigation('how-it-works')}
                                    className="text-gray-600 hover:text-blue-600 transition-colors"
                                >
                                    How It Works
                                </button>
                                <button
                                    onClick={() => handleNavigation('about')}
                                    className="text-gray-600 hover:text-blue-600 transition-colors"
                                >
                                    About
                                </button>
                                <button
                                    onClick={() => handleNavigation('contact')}
                                    className="text-gray-600 hover:text-blue-600 transition-colors"
                                >
                                    Contact us
                                </button>
                            </div>
                        </div>
                        <button
                            onClick={() => handleNavigation('login')}
                            className="px-4 py-2 sm:px-6 text-sm sm:text-base bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                        >
                            SIGN IN
                        </button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
                {/* Header Section */}
                <div className="mb-8 sm:mb-12">
                    <div className="inline-block px-4 sm:px-6 py-2 bg-purple-100 text-purple-700 rounded-full text-xs sm:text-sm font-semibold uppercase tracking-wide mb-3 sm:mb-4">
                        Corporate Catalog
                    </div>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-2 sm:mb-4">PREMIUM FLEET</h1>
                    <p className="text-gray-600 text-base sm:text-lg">Browse Our Standardized Collection Of Premium Vehicles.</p>
                </div>

                {/* Recommendation Banner */}
                {state?.recommendation && (
                    <div className="mb-8 p-4 sm:p-6 bg-linear-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-2xl flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm shrink-0">
                            <CheckCircle className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                            <h3 className="text-gray-900 font-bold text-lg mb-1">Personalized Recommendation</h3>
                            <p className="text-gray-600">
                                Based on your road condition <span className="font-semibold text-purple-700">"{state.roadCondition}"</span>, we recommend <span className="font-semibold text-purple-700">{state.recommendation}</span> vehicles for optimal performance and comfort.
                            </p>
                        </div>
                    </div>
                )}

                {/* Vehicle Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {displayVehicles.map((vehicle) => (
                        <div
                            key={vehicle.id}
                            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all transform hover:-translate-y-1"
                        >
                            {/* Vehicle Image */}
                            <div className="relative h-48 sm:h-56 bg-linear-to-br from-gray-100 to-gray-200 overflow-hidden">
                                {state?.recommendation === vehicle.type && (
                                    <div className="absolute top-4 right-4 bg-purple-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg z-10 flex items-center gap-1.5 backdrop-blur-sm bg-opacity-90">
                                        <CheckCircle className="w-3.5 h-3.5" />
                                        Recommended
                                    </div>
                                )}
                                <img
                                    src={vehicle.image}
                                    alt={vehicle.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Vehicle Details */}
                            <div className="p-4 sm:p-6">
                                <div className="flex justify-between items-start mb-3 sm:mb-4">
                                    <div>
                                        <h3 className="text-lg sm:text-xl font-bold text-gray-900">{vehicle.name}</h3>
                                        <p className="text-xs sm:text-sm text-gray-500">{vehicle.type}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xl sm:text-2xl font-bold text-blue-600">{vehicle.price}</p>
                                        <p className="text-xs text-gray-500">{vehicle.priceType}</p>
                                    </div>
                                </div>

                                {/* Specifications */}
                                <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6 py-3 sm:py-4 border-y border-gray-100">
                                    <div className="flex flex-col items-center gap-1">
                                        <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                                        <span className="text-xs text-gray-600 text-center">
                                            {vehicle.automatic ? 'Automatic' : 'Manual'}
                                        </span>
                                    </div>
                                    <div className="flex flex-col items-center gap-1">
                                        <Users className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                                        <span className="text-xs text-gray-600">{vehicle.seats} Seats</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-1">
                                        <Fuel className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                                        <span className="text-xs text-gray-600">{vehicle.petrol}</span>
                                    </div>
                                </div>

                                {/* Rating */}
                                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                                    <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-yellow-400" />
                                    <span className="font-semibold text-gray-900 text-sm sm:text-base">{vehicle.rating}</span>
                                    <span className="text-xs sm:text-sm text-gray-500">(100+)</span>
                                </div>

                                {/* Book Now Button */}
                                <button
                                    onClick={() => handleBookNow(vehicle.name)}
                                    className="w-full py-2.5 sm:py-3 bg-linear-to-r from-blue-600 to-purple-600 text-white text-sm sm:text-base font-bold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
                                >
                                    Book Now
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            {/* Enhanced Footer */}
            <footer className="mt-20 bg-gray-900 text-white">
                <div className="max-w-7xl mx-auto px-6 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                        {/* Brand Section */}
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                                    <span className="text-white text-2xl font-bold">D</span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold">DriveFlow</h3>
                                    <p className="text-xs text-gray-400 uppercase">Premium Mobility</p>
                                </div>
                            </div>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                The Automated Standard For Global Mobility. Systematic Fleet Matching And Bank-Level Security Infrastructure For A Seamless Journey.
                            </p>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h4 className="text-lg font-bold mb-4">Quick Links</h4>
                            <ul className="space-y-2">
                                <li>
                                    <button
                                        onClick={() => handleNavigation('about')}
                                        className="text-gray-400 hover:text-white transition-colors"
                                    >
                                        About Us
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={() => handleNavigation('fleet')}
                                        className="text-gray-400 hover:text-white transition-colors"
                                    >
                                        Our Fleet
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={() => handleNavigation('pricing')}
                                        className="text-gray-400 hover:text-white transition-colors"
                                    >
                                        Pricing
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={() => handleNavigation('contact')}
                                        className="text-gray-400 hover:text-white transition-colors"
                                    >
                                        Contact Us
                                    </button>
                                </li>
                            </ul>
                        </div>

                        {/* Services */}
                        <div>
                            <h4 className="text-lg font-bold mb-4">Services</h4>
                            <ul className="space-y-2">
                                <li>
                                    <button
                                        onClick={() => handleNavigation('self-drive')}
                                        className="text-gray-400 hover:text-white transition-colors"
                                    >
                                        Self Drive
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={() => handleNavigation('chauffeur')}
                                        className="text-gray-400 hover:text-white transition-colors"
                                    >
                                        Chauffeur Service
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={() => handleNavigation('corporate')}
                                        className="text-gray-400 hover:text-white transition-colors"
                                    >
                                        Corporate Rentals
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={() => handleNavigation('long-term')}
                                        className="text-gray-400 hover:text-white transition-colors"
                                    >
                                        Long Term Leasing
                                    </button>
                                </li>
                            </ul>
                        </div>

                        {/* Contact Info */}
                        <div>
                            <h4 className="text-lg font-bold mb-4">Get In Touch</h4>
                            <ul className="space-y-3">
                                <li className="flex items-center gap-3">
                                    <Mail className="w-5 h-5 text-blue-500" />
                                    <a href="mailto:info@driveflow.com" className="text-gray-400 hover:text-white transition-colors">
                                        info@driveflow.com
                                    </a>
                                </li>
                                <li className="flex items-center gap-3">
                                    <Phone className="w-5 h-5 text-blue-500" />
                                    <a href="tel:+1234567890" className="text-gray-400 hover:text-white transition-colors">
                                        +1 (234) 567-890
                                    </a>
                                </li>
                                <li className="flex items-start gap-3">
                                    <MapPin className="w-5 h-5 text-blue-500 mt-1" />
                                    <span className="text-gray-400">
                                        123 Premium Street<br />New York, NY 10001
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Social Media & Copyright */}
                    <div className="border-t border-gray-800 pt-8">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                            <p className="text-gray-400 text-sm">
                                © 2025 DriveFlow - Premium Mobility Solutions. All rights reserved.
                            </p>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => handleNavigation('facebook')}
                                    className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
                                >
                                    <Facebook className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => handleNavigation('twitter')}
                                    className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-400 transition-colors"
                                >
                                    <Twitter className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => handleNavigation('instagram')}
                                    className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-pink-600 transition-colors"
                                >
                                    <Instagram className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => handleNavigation('linkedin')}
                                    className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
                                >
                                    <Linkedin className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default FleetPage;