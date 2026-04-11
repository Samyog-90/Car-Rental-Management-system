import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Star, Users, Fuel, Settings, CheckCircle, Search } from 'lucide-react';
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
            filtered = vehicles.filter(v => 
                v.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                v.type.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (!state?.recommendation) return filtered;

        return [...filtered].sort((a, b) => {
            const aMatch = a.type === state.recommendation;
            const bMatch = b.type === state.recommendation;
            if (aMatch && !bMatch) return -1;
            if (!aMatch && bMatch) return 1;
            return 0;
        });
    }, [vehicles, state?.recommendation, searchTerm]);

    const handleBookNow = (car: any) => {
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
                    <div className="w-full sm:w-auto relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search cars by name or type..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full sm:w-80 pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm"
                        />
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
                                    className={`w-full py-2.5 sm:py-3 text-white text-sm sm:text-base font-bold rounded-lg shadow-md transition-all ${
                                        vehicle.isAvailable 
                                        ? 'bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:shadow-lg' 
                                        : 'bg-gray-400 cursor-not-allowed'
                                    }`}
                                >
                                    {vehicle.isAvailable ? 'Book Now' : 'Currently Unavailable'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </main>


            <Footer />
        </div>
    );
};

export default FleetPage;