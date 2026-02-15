import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Edit, Trash2, Plus, Search, Fuel, Users as UsersIcon, Settings } from 'lucide-react';

const Cars: React.FC = () => {
    const [cars, setCars] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCar, setEditingCar] = useState<any>(null);
    const [formData, setFormData] = useState({
        name: '', type: '', price: '', priceType: 'Daily Rate',
        seats: '', petrol: '', automatic: false, image: '', rating: '5.0'
    });

    useEffect(() => {
        fetchCars();
    }, []);

    const fetchCars = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/cars');
            setCars(response.data);
        } catch (error) {
            console.error("Failed to fetch cars", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Delete this car?')) return;
        try {
            const token = localStorage.getItem('adminToken');
            await axios.delete(`http://localhost:5000/api/cars/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchCars();
        } catch (error) {
            alert('Failed to delete car');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('adminToken');
            const headers = { Authorization: `Bearer ${token}` };

            const payload = {
                ...formData,
                seats: parseInt(formData.seats),
                rating: parseFloat(formData.rating)
            };

            if (editingCar) {
                await axios.put(`http://localhost:5000/api/cars/${editingCar._id}`, payload, { headers });
            } else {
                await axios.post('http://localhost:5000/api/cars', payload, { headers });
            }
            setIsModalOpen(false);
            fetchCars();
            resetForm();
        } catch (error) {
            alert('Operation failed');
        }
    };

    const resetForm = () => {
        setEditingCar(null);
        setFormData({
            name: '', type: '', price: '', priceType: 'Daily Rate',
            seats: '', petrol: '', automatic: false, image: '', rating: '5.0'
        });
    };

    const openEdit = (car: any) => {
        setEditingCar(car);
        setFormData({
            name: car.name, type: car.type, price: car.price, priceType: car.priceType,
            seats: car.seats, petrol: car.petrol, automatic: car.automatic, image: car.image, rating: car.rating
        });
        setIsModalOpen(true);
    };

    const filteredCars = cars.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Fleet Management</h1>
                <div className="flex gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search cars..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none w-64"
                        />
                    </div>
                    <button
                        onClick={() => { resetForm(); setIsModalOpen(true); }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                        <Plus size={20} /> Add Car
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCars.map(car => (
                    <div key={car._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                        <div className="h-48 bg-gray-100 relative">
                            <img src={car.image} alt={car.name} className="w-full h-full object-cover" />
                            <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-md text-xs font-bold shadow-sm">
                                {car.rating} ★
                            </div>
                        </div>
                        <div className="p-4">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="font-bold text-lg text-gray-900">{car.name}</h3>
                                    <p className="text-sm text-gray-500">{car.type}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-blue-600">{car.price}</p>
                                    <p className="text-xs text-gray-400">{car.priceType}</p>
                                </div>
                            </div>

                            <div className="flex justify-between border-t border-gray-100 pt-3 mt-2 text-xs text-gray-500">
                                <span className="flex items-center gap-1"><Settings size={12} /> {car.automatic ? 'Auto' : 'Manual'}</span>
                                <span className="flex items-center gap-1"><UsersIcon size={12} /> {car.seats} Seats</span>
                                <span className="flex items-center gap-1"><Fuel size={12} /> {car.petrol}</span>
                            </div>

                            <div className="flex gap-2 mt-4">
                                <button onClick={() => openEdit(car)} className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                                    <Edit size={16} /> Edit
                                </button>
                                <button onClick={() => handleDelete(car._id)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg p-6 animate-in zoom-in duration-200">
                        <h2 className="text-xl font-bold mb-4">{editingCar ? 'Edit Car' : 'Add New Car'}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <input placeholder="Name" className="p-2 border rounded-lg" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                                <input placeholder="Type (SUV, Sedan)" className="p-2 border rounded-lg" value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })} required />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <input placeholder="Price (e.g. Rs. 2000)" className="p-2 border rounded-lg" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} required />
                                <input placeholder="Fuel Type" className="p-2 border rounded-lg" value={formData.petrol} onChange={e => setFormData({ ...formData, petrol: e.target.value })} required />
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <input type="number" placeholder="Seats" className="p-2 border rounded-lg" value={formData.seats} onChange={e => setFormData({ ...formData, seats: e.target.value })} required />
                                <input type="number" step="0.1" placeholder="Rating" className="p-2 border rounded-lg" value={formData.rating} onChange={e => setFormData({ ...formData, rating: e.target.value })} />
                                <label className="flex items-center gap-2 p-2 border rounded-lg cursor-pointer">
                                    <input type="checkbox" checked={formData.automatic} onChange={e => setFormData({ ...formData, automatic: e.target.checked })} />
                                    <span className="text-sm">Auto</span>
                                </label>
                            </div>
                            <input placeholder="Image URL" className="w-full p-2 border rounded-lg" value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} required />

                            <div className="flex gap-3 mt-6">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg">Cancel</button>
                                <button type="submit" className="flex-1 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700">Save Car</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cars;
