import React, { useState } from 'react';
import { ChevronRight, Car, Users, Search, Calendar, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PlaceAutocomplete from '../components/PlaceAutocomplete';
import MapComponent from '../components/MapComponent';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Home: React.FC = () => {
    const navigate = useNavigate();
    const [hireDriver, setHireDriver] = useState('');
    const [location, setLocation] = useState('');
    const [destination, setDestination] = useState('');
    const [capacity, setCapacity] = useState('');
    const [roadCondition, setRoadCondition] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const [vehicles] = useState([
        { id: 1, name: "Toyota Corolla", price: "Rs. 2,000/day", image: "https://imagecdnsa.zigwheels.ae/large/gallery/exterior/40/417/toyota-corolla-front-angle-low-view-931780.jpg" },
        { id: 2, name: "Hyundai Creta", price: "Rs. 3,000/day", image: "https://ymimg1.b8cdn.com/resized/car_model/12271/logo/webp_mobile_listing_main_2023_Hyundai_Creta_Exterior_01.webp" },
        { id: 3, name: "Suzuki Swift", price: "Rs. 1,000/day", image: "https://media.umbraco.io/suzuki-gb/o0yoypmz/10816_suzuki_swift_501_r1.jpg" },
    ]);

    const getRecommendedVehicle = (condition: string): string => {
        const lowerCondition = condition.toLowerCase();
        if (lowerCondition.includes('off') || lowerCondition.includes('rough') || lowerCondition.includes('mountain') || lowerCondition.includes('hill')) {
            return 'SUV';
        } else if (lowerCondition.includes('highway') || lowerCondition.includes('long')) {
            return 'Sedan';
        } else if (lowerCondition.includes('city') || lowerCondition.includes('narrow')) {
            return 'Hatchback';
        }
        return '';
    };

    const handleAnalyzeFleet = () => {
        const recommendation = roadCondition ? getRecommendedVehicle(roadCondition) : '';
        navigate('/fleet', {
            state: {
                hireDriver,
                location,
                destination,
                capacity,
                roadCondition,
                recommendation,
                startDate,
                endDate
            }
        });
    };

    const handleSelfDrive = () => navigate('/fleet', { state: { hireDriver: 'no' } });
    const handleHireDriver = () => navigate('/fleet', { state: { hireDriver: 'yes' } });

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-blue-50">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16">
                {/* Hero Section */}
                <div className="mb-10 lg:mb-16 text-center lg:text-left">
                    <div className="inline-flex items-center gap-2 bg-blue-600/10 text-blue-600 px-4 py-2 rounded-full text-sm font-bold mb-6">
                        <Car className="w-4 h-4" />
                        <span>Premium Car Rental</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-gray-900 mb-6 leading-[1.1]">
                        Drive Your <span className="text-blue-600">Dream</span> Journey
                    </h1>
                    <p className="text-lg text-gray-500 max-w-2xl leading-relaxed">
                        Experience the gold standard in premium mobility. From self-drive independence to chauffeur-driven luxury, find your perfect match today.
                    </p>
                </div>

                {/* Search Box & Map Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 mb-16 lg:mb-24">
                    {/* Search Form */}
                    <div className="lg:col-span-8 bg-white rounded-3xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] p-6 lg:p-10 border border-gray-100 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-50"></div>
                        
                        <div className="relative grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Service Mode</label>
                                <select
                                    value={hireDriver}
                                    onChange={(e) => setHireDriver(e.target.value)}
                                    className="w-full px-4 py-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold text-gray-900"
                                >
                                    <option value="">Select option</option>
                                    <option value="yes">With driver</option>
                                    <option value="no">Self drive</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Passengers</label>
                                <div className="relative">
                                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                                    <input
                                        type="number"
                                        value={capacity}
                                        onChange={(e) => setCapacity(e.target.value)}
                                        placeholder="No. of people"
                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold text-gray-900"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Pick-up Location</label>
                                <PlaceAutocomplete
                                    value={location}
                                    onChange={setLocation}
                                    placeholder="Enter city or address"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Destination</label>
                                <PlaceAutocomplete
                                    value={destination}
                                    onChange={setDestination}
                                    placeholder="Enter destination"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Start Date</label>
                                <div className="relative">
                                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                                    <input
                                        type="date"
                                        value={startDate}
                                        min={new Date().toISOString().split('T')[0]}
                                        onChange={(e) => {
                                            setStartDate(e.target.value);
                                            if (endDate && e.target.value > endDate) setEndDate('');
                                        }}
                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold text-gray-900"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">End Date</label>
                                <div className="relative">
                                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                                    <input
                                        type="date"
                                        value={endDate}
                                        min={startDate || new Date().toISOString().split('T')[0]}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold text-gray-900"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Road Condition (AI Matching)</label>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                                    <input
                                        type="text"
                                        value={roadCondition}
                                        onChange={(e) => setRoadCondition(e.target.value)}
                                        placeholder="e.g. Off-Road, City Center, Long Highway..."
                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold text-gray-900"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={handleAnalyzeFleet}
                                className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 active:scale-[0.98] flex items-center justify-center gap-3"
                            >
                                <Search className="w-5 h-5" />
                                ANALYZE FLEET
                            </button>
                        </div>
                    </div>

                    {/* Integrated Map Component */}
                    <div className="lg:col-span-4 h-full min-h-[400px] lg:min-h-0 bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100">
                        <MapComponent location={location} destination={destination} />
                    </div>
                </div>

                {/* Experience Banner */}
                <div className="bg-gray-900 rounded-[32px] p-8 lg:p-12 text-white mb-10 overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600 rounded-full blur-[120px] -mr-48 -mt-48 opacity-20"></div>
                    <div className="relative z-10">
                        <h2 className="text-3xl lg:text-5xl font-black mb-4">Choose Your Experience</h2>
                        <p className="text-gray-400 text-lg lg:max-w-xl">
                            Select the mode that best fits your systematic travel requirements. Premium vehicles for every scenario.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10 mb-24">
                    {/* Self Drive Mode */}
                    <div className="bg-white rounded-[32px] shadow-xl p-10 border border-gray-100 hover:border-blue-500 transition-all group cursor-pointer" onClick={handleSelfDrive}>
                        <div className="mb-8">
                            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-200">
                                <Car className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Self Drive</h3>
                            <p className="text-gray-500 leading-relaxed text-lg font-medium">
                                Take control of your journey. Choose from our premium fleet and drive at your own pace with complete freedom.
                            </p>
                        </div>
                        <div className="flex items-center gap-3 text-blue-600 font-black group-hover:gap-5 transition-all">
                            <span>CONFIGURE DRIVE</span>
                            <ChevronRight className="w-6 h-6" />
                        </div>
                    </div>

                    {/* Hire a Driver */}
                    <div className="bg-white rounded-[32px] shadow-xl p-10 border border-gray-100 hover:border-purple-500 transition-all group cursor-pointer" onClick={handleHireDriver}>
                        <div className="mb-8">
                            <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-purple-200">
                                <Users className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Hire a Driver</h3>
                            <p className="text-gray-500 leading-relaxed text-lg font-medium">
                                Sit back and relax. Our professional chauffeurs ensure a comfortable, safe, and luxurious travel experience.
                            </p>
                        </div>
                        <div className="flex items-center gap-3 text-purple-600 font-black group-hover:gap-5 transition-all">
                            <span>CHOOSE CHAUFFEUR</span>
                            <ChevronRight className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                {/* Available Vehicles Section */}
                <div className="mb-10 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                        <h2 className="text-3xl lg:text-4xl font-black text-gray-900">Available Vehicles</h2>
                        <p className="text-gray-500 font-medium pt-1">Ready for immediate booking</p>
                    </div>
                    <button onClick={() => navigate('/fleet')} className="px-8 py-3 bg-gray-100 text-gray-900 font-bold rounded-xl hover:bg-gray-200 transition-all">
                        View All
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {vehicles.map((car) => (
                        <div key={car.id} className="bg-white rounded-[32px] shadow-lg overflow-hidden border border-gray-100 hover:shadow-2xl transition-all transform hover:-translate-y-2 group">
                            <div className="h-64 overflow-hidden relative">
                                <img
                                    src={car.image}
                                    alt={car.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl font-black text-blue-600 shadow-sm">
                                    {car.price}
                                </div>
                            </div>
                            <div className="p-8">
                                <h3 className="text-2xl font-black text-gray-900 mb-6">{car.name}</h3>
                                <button 
                                    onClick={() => navigate('/booking', { 
                                        state: { 
                                            car,
                                            prefilledData: { startDate, endDate, location, rentalType: hireDriver === 'yes' ? 'driver' : 'self' }
                                        } 
                                    })}
                                    className="w-full py-4 bg-gray-900 text-white font-black rounded-2xl hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-200 transition-all"
                                >
                                    BOOK NOW
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

export default Home;
