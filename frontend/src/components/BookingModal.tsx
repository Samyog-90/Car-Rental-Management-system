import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Calendar, MapPin, Upload, CreditCard, CheckCircle, AlertCircle, FileText, User } from 'lucide-react';

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    car: {
        id: number;
        name: string;
        price: string;
        image: string;
    } | null;
}

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, car }) => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form State
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [location, setLocation] = useState('');

    // License
    const [licenseNumber, setLicenseNumber] = useState('');
    const [licenseFile, setLicenseFile] = useState<File | null>(null);
    const [licenseStatus, setLicenseStatus] = useState<'unverified' | 'verifying' | 'valid' | 'invalid'>('unverified');

    // National ID
    const [nationalIdNumber, setNationalIdNumber] = useState('');
    const [nationalIdFile, setNationalIdFile] = useState<File | null>(null);
    const [nationalIdStatus, setNationalIdStatus] = useState<'unverified' | 'verifying' | 'valid' | 'invalid'>('unverified');

    // Payment (Mock)
    const [cardNumber, setCardNumber] = useState('');
    const [cardExpiry, setCardExpiry] = useState('');
    const [cardCVC, setCardCVC] = useState('');

    useEffect(() => {
        if (isOpen) {
            setStep(1);
            setError(null);
            setLoading(false);
            // Reset form fields if needed
        }
    }, [isOpen]);

    const handleVerifyLicense = async () => {
        if (!licenseNumber) return;
        setLicenseStatus('verifying');
        setError(null);
        try {
            const response = await axios.get(`http://localhost:5000/api/gov/license/check/${licenseNumber}`);
            if (response.data.valid) {
                setLicenseStatus('valid');
            } else {
                setLicenseStatus('invalid');
                setError('License is invalid or expired.');
            }
        } catch (err) {
            setLicenseStatus('invalid');
            setError('Failed to verify license. Please check the number.');
        }
    };

    const handleVerifyNationalId = async () => {
        // Mock verification for National ID
        if (!nationalIdNumber) return;
        setNationalIdStatus('verifying');
        setTimeout(() => {
            setNationalIdStatus('valid');
        }, 1500);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'license' | 'nationalId') => {
        if (e.target.files && e.target.files[0]) {
            if (field === 'license') setLicenseFile(e.target.files[0]);
            else setNationalIdFile(e.target.files[0]);
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('carId', car?.id.toString() || '');
            formData.append('carName', car?.name || '');
            formData.append('startDate', startDate);
            formData.append('endDate', endDate);
            formData.append('location', location);
            formData.append('licenseNumber', licenseNumber);
            formData.append('nationalIdNumber', nationalIdNumber);

            if (licenseFile) formData.append('licenseImage', licenseFile);
            if (nationalIdFile) formData.append('nationalIdImage', nationalIdFile);

            // Mock Payment Data (Security: Don't send real card data)
            formData.append('paymentStatus', 'Completed');

            await axios.post('http://localhost:5000/api/bookings', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setStep(5);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create booking.');
        } finally {
            setLoading(false);
        }
    };

    const nextStep = () => {
        if (step === 1) {
            if (!startDate || !endDate || !location) {
                setError('Please fill in all trip details.');
                return;
            }
        }
        if (step === 2) {
            if (licenseStatus !== 'valid' || !licenseFile) {
                setError('Please verify your license and upload a copy.');
                return;
            }
        }
        if (step === 3) {
            if (nationalIdStatus !== 'valid' || !nationalIdFile) {
                setError('Please verify your National ID and upload a copy.');
                return;
            }
        }
        if (step === 4) {
            if (!cardNumber || !cardExpiry || !cardCVC) {
                setError('Please enter payment details.');
                return;
            }
            // Proceed to submit
            handleSubmit();
            return;
        }

        setError(null);
        setStep(step + 1);
    };

    if (!isOpen || !car) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-300">

                {/* Header */}
                <div className="bg-gray-900 px-6 py-4 flex justify-between items-center text-white">
                    <div>
                        <h2 className="text-xl font-bold">Book {car.name}</h2>
                        <p className="text-gray-400 text-xs uppercase tracking-wider">Step {step} of 5</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Progress Bar */}
                <div className="h-1 bg-gray-100 flex">
                    <div className={`h-full bg-blue-600 transition-all duration-500`} style={{ width: `${(step / 5) * 100}%` }}></div>
                </div>

                {/* Content */}
                <div className="p-6 sm:p-8">
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-3">
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            <p className="text-sm">{error}</p>
                        </div>
                    )}

                    {step === 1 && (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                <Calendar className="w-6 h-6 text-blue-600" />
                                Trip Details
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Start Date</label>
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">End Date</label>
                                    <input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Pick-up Location</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Enter pick-up location"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                <FileText className="w-6 h-6 text-blue-600" />
                                Driving License Verification
                            </h3>
                            <div className="bg-blue-50 p-4 rounded-lg flex gap-3 text-blue-800 text-sm">
                                <CheckCircle className="w-5 h-5 shrink-0" />
                                <p>We verify your license instantly with the government database.</p>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">License Number</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="e.g. B1234567"
                                        value={licenseNumber}
                                        onChange={(e) => setLicenseNumber(e.target.value)}
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                    <button
                                        onClick={handleVerifyLicense}
                                        disabled={licenseStatus === 'verifying' || licenseStatus === 'valid'}
                                        className={`px-4 py-2 rounded-lg font-semibold text-white transition-all ${licenseStatus === 'valid' ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700'
                                            }`}
                                    >
                                        {licenseStatus === 'verifying' ? 'Checking...' : licenseStatus === 'valid' ? 'Verified' : 'Verify'}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Upload License Image</label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer relative">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleFileChange(e, 'license')}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                    <p className="text-sm text-gray-600">
                                        {licenseFile ? licenseFile.name : "Click to upload or drag and drop"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                <User className="w-6 h-6 text-blue-600" />
                                National Identity Verification
                            </h3>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">National ID Number</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="e.g. 123-456-789"
                                        value={nationalIdNumber}
                                        onChange={(e) => setNationalIdNumber(e.target.value)}
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                    <button
                                        onClick={handleVerifyNationalId}
                                        disabled={nationalIdStatus === 'verifying' || nationalIdStatus === 'valid'}
                                        className={`px-4 py-2 rounded-lg font-semibold text-white transition-all ${nationalIdStatus === 'valid' ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700'
                                            }`}
                                    >
                                        {nationalIdStatus === 'verifying' ? 'Checking...' : nationalIdStatus === 'valid' ? 'Verified' : 'Verify'}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Upload National ID Image</label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer relative">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleFileChange(e, 'nationalId')}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                    <p className="text-sm text-gray-600">
                                        {nationalIdFile ? nationalIdFile.name : "Click to upload or drag and drop"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                <CreditCard className="w-6 h-6 text-blue-600" />
                                Secure Payment
                            </h3>
                            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                                <div className="flex justify-between items-center mb-6">
                                    <span className="text-gray-600">Total Amount</span>
                                    <span className="text-2xl font-bold text-gray-900">{car.price}</span>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Card Number</label>
                                        <input
                                            type="text"
                                            placeholder="0000 0000 0000 0000"
                                            value={cardNumber}
                                            onChange={(e) => setCardNumber(e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Expiry Date</label>
                                            <input
                                                type="text"
                                                placeholder="MM/YY"
                                                value={cardExpiry}
                                                onChange={(e) => setCardExpiry(e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">CVC</label>
                                            <input
                                                type="text"
                                                placeholder="123"
                                                value={cardCVC}
                                                onChange={(e) => setCardCVC(e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 5 && (
                        <div className="text-center py-8 animate-in zoom-in duration-500">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle className="w-10 h-10 text-green-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h3>
                            <p className="text-gray-600 mb-8 max-w-sm mx-auto">
                                Your {car.name} has been successfully booked. You will receive a confirmation email shortly.
                            </p>
                            <button
                                onClick={onClose}
                                className="px-8 py-3 bg-gray-900 text-white font-bold rounded-lg hover:bg-gray-800 transition-all shadow-lg"
                            >
                                Close & Return to Fleet
                            </button>
                        </div>
                    )}
                </div>

                {/* Footer Buttons */}
                {step < 5 && (
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                        {step > 1 ? (
                            <button
                                onClick={() => setStep(step - 1)}
                                className="px-6 py-2 text-gray-600 font-semibold hover:text-gray-900 transition-colors"
                            >
                                Back
                            </button>
                        ) : (
                            <div></div>
                        )}
                        <button
                            onClick={nextStep}
                            disabled={loading}
                            className={`px-8 py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all shadow-md flex items-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {loading ? 'Processing...' : step === 4 ? 'Confirm Payment' : 'Next Step'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookingModal;
