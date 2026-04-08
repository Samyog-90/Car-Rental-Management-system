import React, { useState } from 'react';
import { ChevronRight, Car, Users } from 'lucide-react';
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

        console.log('Analyzing fleet...', { hireDriver, location, destination, capacity, roadCondition, recommendation });

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

    const handleSelfDrive = () => {
        navigate('/fleet', { state: { hireDriver: 'no' } });
    };

    const handleHireDriver = () => {
        navigate('/fleet', { state: { hireDriver: 'yes' } });
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50">
            {/* Navigation */}
            <Navbar />

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-6 py-12">
                {/* Hero Section */}
                <div className="mb-12">
                    <div className="inline-block bg-linear-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg">
                        Looking for a Car?
                    </div>
                </div>

                {/* Search Box & Map Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                    {/* Search Form */}
                    <div className="lg:col-span-2 bg-white rounded-2xl shadow-2xl p-8 border-2 border-gray-100 h-full flex flex-col justify-between">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Hire a Driver
                                </label>
                                <select
                                    value={hireDriver}
                                    onChange={(e) => setHireDriver(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">Select option</option>
                                    <option value="yes">Yes, with driver</option>
                                    <option value="no">No, self drive</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Capacity
                                </label>
                                <div className="relative">
                                    <Users className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                                    <input
                                        type="number"
                                        value={capacity}
                                        onChange={(e) => setCapacity(e.target.value)}
                                        placeholder="Passengers"
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                           
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Location
                                </label>
                                <PlaceAutocomplete
                                    value={location}
                                    onChange={setLocation}
                                    placeholder="Pick-up location (e.g. Kathmandu)"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Destination
                                </label>
                                <PlaceAutocomplete
                                    value={destination}
                                    onChange={setDestination}
                                    placeholder="Drop-off location (e.g. Pokhara)"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Start Date
                                </label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    End Date
                                </label>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Road Condition (Optional)
                                </label>
                                <input
                                    type="text"
                                    value={roadCondition}
                                    onChange={(e) => setRoadCondition(e.target.value)}
                                    placeholder="Describe road condition (e.g. Off-Road, Highway)"
                                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <p className="text-xs text-gray-500 mt-1">We'll recommend the best car for these conditions.</p>
                            </div>

                            <button
                                onClick={handleAnalyzeFleet}
                                className="w-full px-8 py-3 bg-linear-to-r from-purple-600 to-blue-600 text-white font-bold rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                            >
                                Analyze Fleet
                            </button>
                        </div>
                    </div>

                    {/* Integrated Map Component */}
                    <div className="lg:col-span-1 h-full min-h-75">
                        <MapComponent location={location} destination={destination} />
                    </div>
                </div>

                {/* Experience Cards */}
                <div className="bg-linear-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white mb-8">
                    <h2 className="text-3xl font-bold mb-2">Choices of Experience</h2>
                    <p className="text-blue-100 text-lg">
                        Select the mode that best fits your systematic travel requirements.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    {/* Self Drive Mode */}
                    <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-gray-100 hover:border-blue-500 transition-all hover:shadow-2xl group">
                        <div className="mb-6">
                            <div className="w-16 h-16 bg-linear-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4">
                                <Car className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Self Drive mode</h3>
                            <p className="text-gray-600">
                                Take control of your journey. Choose from our premium fleet and drive at your own pace with complete freedom and flexibility.
                            </p>
                        </div>
                        <button
                            onClick={handleSelfDrive}
                            className="flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 group-hover:gap-4 transition-all"
                        >
                            Configure Self Drive
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Hire a Driver */}
                    <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-gray-100 hover:border-purple-500 transition-all hover:shadow-2xl group">
                        <div className="mb-6">
                            <div className="w-16 h-16 bg-linear-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4">
                                <Users className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Hire a Driver</h3>
                            <p className="text-gray-600">
                                Sit back and relax. Our professional chauffeurs ensure a comfortable, safe, and luxurious travel experience for you.
                            </p>
                        </div>
                        <button
                            onClick={handleHireDriver}
                            className="flex items-center gap-2 text-purple-600 font-semibold hover:text-purple-700 group-hover:gap-4 transition-all"
                        >
                            Hire a chauffeur
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Available Vehicles Section */}
                <div className="mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8">Available Vehicles</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {vehicles.map((car) => (
                            <div key={car.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all transform hover:-translate-y-1">
                                <div className="h-48 bg-linear-to-br from-gray-200 to-gray-300 overflow-hidden">
                                    <img
                                        src={car.image}
                                        alt={car.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{car.name}</h3>
                                    <p className="text-2xl font-bold text-blue-600 mb-4">{car.price}</p>
                                    <button 
                                        onClick={() => navigate('/booking', { 
                                            state: { 
                                                car,
                                                prefilledData: {
                                                    startDate,
                                                    endDate,
                                                    location,
                                                    rentalType: hireDriver === 'yes' ? 'driver' : 'self'
                                                }
                                            } 
                                        })}
                                        className="w-full py-3 bg-linear-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
                                    >
                                        Book Now
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default Home;
