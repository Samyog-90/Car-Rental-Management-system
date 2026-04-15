import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Star, Users, Fuel, Settings, CheckCircle, Search, Info, X } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const FleetPage: React.FC = () => {
    const locationHook = useLocation();
    const state = locationHook.state as {
        hireDriver?: string;
        location?: string;
        destination?: string;
        capacity?: string;
        roadCondition?: string;
        recommendation?: string;
        startDate?: string;
        endDate?: string;
    } | null;

    const [vehicles, setVehicles] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [selectedCarForDetails, setSelectedCarForDetails] = useState<any | null>(null);

    useEffect(() => {
        const fetchCars = async () => {
            try {

                const response = await fetch('http://localhost:5000/api/cars');
                const data = await response.json();
                setVehicles(data);
            } catch (error) {
                console.error("Failed to fetch fleet:", error);
            }
        };
        fetchCars();
    }, []);

    const displayVehicles = useMemo(() => {
        let filtered = vehicles;
        if (searchTerm) {
            filtered = filtered.filter(v => 
                v.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                v.type.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (selectedCategory !== 'All') {
            filtered = filtered.filter(v => v.type === selectedCategory);
        }

        if (!state?.recommendation) return filtered;

        return [...filtered].sort((a, b) => {
            const aMatch = a.type === state.recommendation;
            const bMatch = b.type === state.recommendation;
            if (aMatch && !bMatch) return -1;
            if (!aMatch && bMatch) return 1;
            return 0;
        });
    }, [vehicles, state?.recommendation, searchTerm, selectedCategory]);

    const handleBookNow = (car: any) => {
        const token = localStorage.getItem('token');
        if (!token) {
            setShowAuthModal(true);
            return;
        }

        navigate('/booking', { 
            state: { 
                car,
                prefilledData: {
                    startDate: state?.startDate,
                    endDate: state?.endDate,
                    location: state?.location,
                    rentalType: state?.hireDriver === 'yes' ? 'driver' : 'self'
                }
            } 
        });
    };

    const categories = useMemo(() => {
        const cats = vehicles.map(v => v.type);
        return ['All', ...Array.from(new Set(cats))];
    }, [vehicles]);

    const navigate = useNavigate();



    return (
        <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50">

          
            <Navbar />

            
            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
                
                <div className="mb-8 sm:mb-12 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
                    <div>
                        <div className="inline-block px-4 sm:px-6 py-2 bg-purple-100 text-purple-700 rounded-full text-xs sm:text-sm font-semibold uppercase tracking-wide mb-3 sm:mb-4">
                            Corporate Catalog
                        </div>
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-2 sm:mb-4">PREMIUM FLEET</h1>
                        <p className="text-gray-600 text-base sm:text-lg">Browse Our Standardized Collection Of Premium Vehicles.</p>
                    </div>
                    <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search cars..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full sm:w-64 pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm"
                            />
                        </div>
                        <div className="relative">
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full sm:w-48 px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none appearance-none cursor-pointer shadow-sm font-semibold text-gray-700"
                            >
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat === 'All' ? 'All Categories' : cat}</option>
                                ))}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    </div>
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
                            key={vehicle._id}
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
                                        <p className="text-xs text-gray-500 mb-2">{vehicle.priceType}</p>
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${vehicle.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {vehicle.isAvailable ? 'Available' : 'Booked'}
                                        </span>
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
                                    onClick={() => handleBookNow(vehicle)}
                                    disabled={!vehicle.isAvailable}
                                    className={`w-full py-2.5 sm:py-3 text-white text-sm sm:text-base font-bold rounded-lg shadow-md transition-all mb-2 ${vehicle.isAvailable
                                            ? 'bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:shadow-lg'
                                            : 'bg-gray-400 cursor-not-allowed'
                                        }`}
                                >
                                    {vehicle.isAvailable ? 'Book Now' : 'Currently Unavailable'}
                                </button>
                                <button
                                    onClick={() => setSelectedCarForDetails(vehicle)}
                                    className="w-full py-2.5 text-gray-600 text-sm font-semibold rounded-lg border border-gray-200 hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                                >
                                    <Info className="w-4 h-4" />
                                    View Full Details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </main>


            <Footer />

            {/* Auth Modal */}
            {showAuthModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowAuthModal(false)}></div>
                    <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in duration-300">
                        <div className="h-24 bg-linear-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30">
                                <Users className="w-8 h-8 text-white" />
                            </div>
                        </div>
                        <div className="p-8 text-center">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Login Required</h2>
                            <p className="text-gray-500 mb-8 text-sm leading-relaxed">Please register or log in to your account to book this premium vehicle.</p>
                            
                            <div className="space-y-3">
                                <button 
                                    onClick={() => navigate('/')}
                                    className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
                                >
                                    Go to Login
                                </button>
                                <button 
                                    onClick={() => navigate('/register')}
                                    className="w-full py-3 bg-white text-gray-900 font-bold rounded-xl border-2 border-gray-100 hover:bg-gray-50 transition-colors"
                                >
                                    Create New Account
                                </button>
                                <button 
                                    onClick={() => setShowAuthModal(false)}
                                    className="w-full py-2 text-gray-400 text-xs font-medium hover:text-gray-600 transition-colors pt-2"
                                >
                                    Close and continue browsing
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Car Details Modal */}
            {selectedCarForDetails && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setSelectedCarForDetails(null)}></div>
                    <div className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                        <button 
                            onClick={() => setSelectedCarForDetails(null)}
                            className="absolute top-6 right-6 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full text-gray-500 hover:text-gray-900 transition-colors shadow-sm"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="flex flex-col h-full max-h-[90vh] overflow-y-auto">
                            {/* Top: Large Image Section */}
                            <div className="w-full relative h-[300px] sm:h-[400px]">
                                <img 
                                    src={selectedCarForDetails.image} 
                                    alt={selectedCarForDetails.name}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent"></div>
                                <div className="absolute bottom-8 left-8 text-white">
                                    <div className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-wider rounded-full mb-3 border border-white/30">
                                        {selectedCarForDetails.type}
                                    </div>
                                    <h2 className="text-4xl font-black">{selectedCarForDetails.name}</h2>
                                    <div className="flex items-center gap-2 mt-2">
                                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                        <span className="font-bold">{selectedCarForDetails.rating}</span>
                                        <span className="text-white/70 text-sm italic">- Premium Choice</span>
                                    </div>
                                </div>
                            </div>

                            {/* Bottom: Detailed Content Section */}
                            <div className="p-8 sm:p-12 space-y-10">
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                                    <div className="bg-blue-50/50 p-6 rounded-3xl flex flex-col items-center text-center gap-2 border border-blue-100">
                                        <div className="p-3 bg-blue-100 rounded-2xl text-blue-600">
                                            <Settings className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Gearbox</p>
                                            <p className="font-black text-gray-900">{selectedCarForDetails.automatic ? 'Automatic' : 'Manual'}</p>
                                        </div>
                                    </div>
                                    <div className="bg-purple-50/50 p-6 rounded-3xl flex flex-col items-center text-center gap-2 border border-purple-100">
                                        <div className="p-3 bg-purple-100 rounded-2xl text-purple-600">
                                            <Users className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest">Capacity</p>
                                            <p className="font-black text-gray-900">{selectedCarForDetails.seats} Person</p>
                                        </div>
                                    </div>
                                    <div className="bg-green-50/50 p-6 rounded-3xl flex flex-col items-center text-center gap-2 border border-green-100">
                                        <div className="p-3 bg-green-100 rounded-2xl text-green-600">
                                            <Fuel className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-green-400 uppercase tracking-widest">Energy</p>
                                            <p className="font-black text-gray-900">{selectedCarForDetails.petrol}</p>
                                        </div>
                                    </div>
                                    <div className="bg-orange-50/50 p-6 rounded-3xl flex flex-col items-center text-center gap-2 border border-orange-100">
                                        <div className="p-3 bg-orange-100 rounded-2xl text-orange-600">
                                            <CheckCircle className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest">Status</p>
                                            <p className="font-black text-gray-900">{selectedCarForDetails.isAvailable ? 'Available' : 'Booked'}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em]">Vehicle Description</h3>
                                    <p className="text-gray-600 text-lg leading-relaxed font-medium">
                                        Experience sheer driving pleasure with the {selectedCarForDetails.name}. This {selectedCarForDetails.type} is meticulously maintained and features high-end comfort settings. 
                                        {selectedCarForDetails.type === 'SUV' 
                                            ? ' Built for rugged terrain and long family journeys without compromising on safety.' 
                                            : ' Designed for elegant urban travel with efficient performance for your business or personal needs.'}
                                    </p>
                                </div>

                                <div className="pt-10 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-8">
                                    <div className="flex items-center gap-6">
                                        <div className="text-right sm:text-left">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Daily Rate</p>
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-5xl font-black text-gray-900">{selectedCarForDetails.price}</span>
                                                <span className="text-gray-400 font-bold">/ day</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <button 
                                        onClick={() => {
                                            setSelectedCarForDetails(null);
                                            handleBookNow(selectedCarForDetails);
                                        }}
                                        disabled={!selectedCarForDetails.isAvailable}
                                        className="w-full sm:w-auto px-12 py-5 bg-gray-900 text-white font-black rounded-[2rem] hover:bg-gray-800 transition-all shadow-2xl shadow-gray-200 active:scale-95 disabled:bg-gray-300 disabled:cursor-not-allowed"
                                    >
                                        {selectedCarForDetails.isAvailable ? 'CONFIRM BOOKING' : 'CURRENTLY UNAVAILABLE'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FleetPage;