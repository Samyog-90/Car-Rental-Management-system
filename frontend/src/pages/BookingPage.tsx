import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Calendar, MapPin, Upload, CreditCard, CheckCircle, AlertCircle, FileText, User, ChevronLeft } from 'lucide-react';

const BookingPage: React.FC = () => {
    const navigate = useNavigate();
    const locationHook = useLocation();
    const car = locationHook.state?.car;

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form State
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [location, setLocation] = useState('');

    // License
    const [licenseNumber, setLicenseNumber] = useState('');
    const [licenseFront, setLicenseFront] = useState<File | null>(null);
    const [licenseBack, setLicenseBack] = useState<File | null>(null);
    const [licenseStatus, setLicenseStatus] = useState<'unverified' | 'verifying' | 'valid' | 'invalid'>('unverified');

    // National ID
    const [nidNumber, setNidNumber] = useState('');
    const [nidFront, setNidFront] = useState<File | null>(null);
    const [nidBack, setNidBack] = useState<File | null>(null);
    const [nidStatus, setNidStatus] = useState<'unverified' | 'verifying' | 'valid' | 'invalid'>('unverified');

    // Payment (Mock)
    const [cardNumber, setCardNumber] = useState('');
    const [cardExpiry, setCardExpiry] = useState('');

    const [paymentMethod, setPaymentMethod] = useState<'card' | 'esewa'>('esewa');

    useEffect(() => {
        if (!car) {
            navigate('/fleet');
        }
    }, [car, navigate]);

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
        } catch (err: any) {
            setLicenseStatus('invalid');
            setError(err.response?.data?.message || 'Failed to verify license. Make sure records exist.');
        }
    };

    const handleVerifyNID = async () => {
        if (!nidNumber) return;
        setNidStatus('verifying');
        setError(null);
        try {
            const response = await axios.get(`http://localhost:5000/api/gov/nid/check/${nidNumber}`);
            if (response.data.valid) {
                setNidStatus('valid');
            } else {
                setNidStatus('invalid');
                setError('National ID is invalid or not found.');
            }
        } catch (err: any) {
            setNidStatus('invalid');
            setError(err.response?.data?.message || 'Failed to verify National ID. Make sure records exist.');
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'licenseFront' | 'licenseBack' | 'nidFront' | 'nidBack') => {
        if (e.target.files && e.target.files[0]) {
            if (field === 'licenseFront') setLicenseFront(e.target.files[0]);
            if (field === 'licenseBack') setLicenseBack(e.target.files[0]);
            if (field === 'nidFront') setNidFront(e.target.files[0]);
            if (field === 'nidBack') setNidBack(e.target.files[0]);
        }
    };

    const handleSubmit = async (isEsewa = false) => {
        setLoading(true);
        setError(null);

        try {
            const formData = new FormData();
            const bookingCarId = car?._id || car?.id;
            if (!bookingCarId) {
                throw new Error("Car identification missing. Please try selecting a car again.");
            }
            formData.append('carId', bookingCarId);
            formData.append('carName', car?.name || '');
            formData.append('startDate', startDate);
            formData.append('endDate', endDate);
            formData.append('location', location);

            formData.append('licenseNumber', licenseNumber);
            formData.append('nidNumber', nidNumber);

            if (licenseFront) formData.append('licenseFront', licenseFront);
            if (licenseBack) formData.append('licenseBack', licenseBack);
            if (nidFront) formData.append('nidFront', nidFront);
            if (nidBack) formData.append('nidBack', nidBack);

            formData.append('paymentMethod', paymentMethod);
            if (paymentMethod === 'card') {
                formData.append('cardNumber', cardNumber);
                formData.append('cardExpiry', cardExpiry);
            }

            formData.append('paymentStatus', isEsewa ? 'Pending' : 'Completed');
            // Assuming price is "Rs. 2000" or similar, need numeric for eSewa
            const numericPrice = parseFloat(String(car?.price).replace(/[^0-9.]/g, '')) || 0;
            formData.append('totalPrice', String(numericPrice));

            const response = await axios.post('http://localhost:5000/api/bookings', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (isEsewa) {
                return { bookingId: response.data._id, totalPrice: numericPrice };
            }

            setStep(5);
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || err.message || 'Failed to create booking.';
            setError(errorMsg);
            console.error("Booking Error:", err);
        } finally {
            if (!isEsewa) setLoading(false);
        }
    };

    const nextStep = async () => {
        // Validation Logic
        if (step === 1) {
            if (!startDate || !endDate || !location) {
                setError('Please fill in all trip details.');
                return;
            }
        }
        if (step === 2) {
            if (licenseStatus !== 'valid' || !licenseFront || !licenseBack) {
                setError('Please verify your license and upload both front and back images.');
                return;
            }
        }
        if (step === 3) {
            if (nidStatus !== 'valid' || !nidFront || !nidBack) {
                setError('Please verify your National ID and upload both front and back images.');
                return;
            }
        }
        if (step === 4) {
            if (paymentMethod === 'card') {
                if (!cardNumber || !cardExpiry) {
                    setError('Please enter payment details.');
                    return;
                }
                handleSubmit(false);
                return;
            } else if (paymentMethod === 'esewa') {
                // eSewa Flow
                try {
                    const result = await handleSubmit(true);
                    if (result && result.bookingId) {
                        // Get eSewa Config
                        const configRes = await axios.post('http://localhost:5000/api/payment/esewa-config', {
                            amount: result.totalPrice,
                            transactionUuid: result.bookingId
                        });

                        const { signature, productCode, totalAmount, transactionUuid, successUrl, failureUrl } = configRes.data;

                        // Create and submit form
                        const form = document.createElement("form");
                        form.setAttribute("method", "POST");
                        form.setAttribute("action", "https://rc-epay.esewa.com.np/api/epay/main/v2/form");
                        form.setAttribute("target", "_self");

                        const params = {
                            amount: totalAmount,
                            tax_amount: 0,
                            total_amount: totalAmount,
                            transaction_uuid: transactionUuid,
                            product_code: productCode,
                            product_service_charge: 0,
                            product_delivery_charge: 0,
                            success_url: successUrl,
                            failure_url: failureUrl,
                            signed_field_names: "total_amount,transaction_uuid,product_code",
                            signature: signature
                        };

                        for (const key in params) {
                            const hiddenField = document.createElement("input");
                            hiddenField.setAttribute("type", "hidden");
                            hiddenField.setAttribute("name", key);
                            // @ts-ignore
                            hiddenField.setAttribute("value", params[key]);
                            form.appendChild(hiddenField);
                        }

                        document.body.appendChild(form);
                        form.submit();
                    }
                } catch (e: any) {
                    console.error(e);
                    setError("Failed to initiate eSewa payment");
                    setLoading(false);
                }
                return;
            }
        }

        setError(null);
        setStep(step + 1);
    };

    if (!car) return null;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden">

                {/* Header */}
                <div className="bg-gray-900 px-8 py-6 flex justify-between items-center text-white">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/fleet')} className="text-gray-400 hover:text-white transition-colors">
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold">Book {car.name}</h1>
                            <p className="text-gray-400 text-sm">{car.type} • {car.price}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-sm uppercase tracking-wider text-gray-400">Step {step} of 5</p>
                        <p className="font-semibold text-blue-400">
                            {step === 1 && "Trip Details"}
                            {step === 2 && "License Verification"}
                            {step === 3 && "Identity Verification"}
                            {step === 4 && "Payment"}
                            {step === 5 && "Confirmation"}
                        </p>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="h-1.5 bg-gray-100 flex">
                    <div className="h-full bg-blue-600 transition-all duration-700 ease-in-out" style={{ width: `${(step / 5) * 100}%` }}></div>
                </div>

                <div className="p-8 sm:p-12 min-h-[500px] flex flex-col">
                    {error && (
                        <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-3 animate-in slide-in-from-top-2">
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            <p className="font-medium">{error}</p>
                        </div>
                    )}

                    <div className="flex-1">
                        {step === 1 && (
                            <div className="animate-in fade-in slide-in-from-right-8 duration-500 space-y-8">
                                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                                    <Calendar className="w-8 h-8 text-blue-600" />
                                    When are you traveling?
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Start Date</label>
                                        <input
                                            type="date"
                                            value={startDate}
                                            onChange={(e) => setStartDate(e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">End Date</label>
                                        <input
                                            type="date"
                                            value={endDate}
                                            onChange={(e) => setEndDate(e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Pick-up Location</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Enter complete address"
                                            value={location}
                                            onChange={(e) => setLocation(e.target.value)}
                                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="animate-in fade-in slide-in-from-right-8 duration-500 space-y-8">
                                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                                    <FileText className="w-8 h-8 text-blue-600" />
                                    Driver's Verification
                                </h2>

                                {/* License Check */}
                                <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                                    <label className="block text-sm font-bold text-blue-900 mb-2">Driving License Number</label>
                                    <div className="flex gap-4">
                                        <input
                                            type="text"
                                            placeholder="LICENSE-NO-123"
                                            value={licenseNumber}
                                            onChange={(e) => setLicenseNumber(e.target.value)}
                                            className="flex-1 px-4 py-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                        />
                                        <button
                                            onClick={handleVerifyLicense}
                                            disabled={licenseStatus === 'verifying' || licenseStatus === 'valid'}
                                            className={`px-6 py-3 rounded-xl font-bold text-white transition-all shadow-md ${licenseStatus === 'valid' ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700'
                                                }`}
                                        >
                                            {licenseStatus === 'verifying' ? 'Verifying...' : licenseStatus === 'valid' ? 'Verified' : 'Verify'}
                                        </button>
                                    </div>
                                    {licenseStatus === 'valid' && (
                                        <p className="mt-2 text-sm text-green-700 font-medium flex items-center gap-1">
                                            <CheckCircle className="w-4 h-4" /> License Validated Successfully
                                        </p>
                                    )}
                                </div>

                                {/* Uploads */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Front */}
                                    <div>
                                        <p className="block text-sm font-semibold text-gray-700 mb-2">Front Side</p>
                                        <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:bg-gray-50 transition-all cursor-pointer relative group">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleFileChange(e, 'licenseFront')}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                            />
                                            <div className="group-hover:scale-105 transition-transform duration-300">
                                                {licenseFront ? (
                                                    <div className="flex flex-col items-center text-green-600">
                                                        <CheckCircle className="w-10 h-10 mb-2" />
                                                        <span className="text-sm font-medium truncate max-w-[200px]">{licenseFront.name}</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col items-center text-gray-400">
                                                        <Upload className="w-10 h-10 mb-2" />
                                                        <span className="text-sm font-medium">Upload Front</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    {/* Back */}
                                    <div>
                                        <p className="block text-sm font-semibold text-gray-700 mb-2">Back Side</p>
                                        <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:bg-gray-50 transition-all cursor-pointer relative group">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleFileChange(e, 'licenseBack')}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                            />
                                            <div className="group-hover:scale-105 transition-transform duration-300">
                                                {licenseBack ? (
                                                    <div className="flex flex-col items-center text-green-600">
                                                        <CheckCircle className="w-10 h-10 mb-2" />
                                                        <span className="text-sm font-medium truncate max-w-[200px]">{licenseBack.name}</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col items-center text-gray-400">
                                                        <Upload className="w-10 h-10 mb-2" />
                                                        <span className="text-sm font-medium">Upload Back</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="animate-in fade-in slide-in-from-right-8 duration-500 space-y-8">
                                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                                    <User className="w-8 h-8 text-blue-600" />
                                    Identity Verification
                                </h2>

                                <div className="bg-purple-50 p-6 rounded-2xl border border-purple-100">
                                    <label className="block text-sm font-bold text-purple-900 mb-2">National ID (NID) Number</label>
                                    <div className="flex gap-4">
                                        <input
                                            type="text"
                                            placeholder="NID-XXXX-XXXX"
                                            value={nidNumber}
                                            onChange={(e) => setNidNumber(e.target.value)}
                                            className="flex-1 px-4 py-3 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none bg-white"
                                        />
                                        <button
                                            onClick={handleVerifyNID}
                                            disabled={nidStatus === 'verifying' || nidStatus === 'valid'}
                                            className={`px-6 py-3 rounded-xl font-bold text-white transition-all shadow-md ${nidStatus === 'valid' ? 'bg-green-600' : 'bg-purple-600 hover:bg-purple-700'
                                                }`}
                                        >
                                            {nidStatus === 'verifying' ? 'Verifying...' : nidStatus === 'valid' ? 'Verified' : 'Verify'}
                                        </button>
                                    </div>
                                </div>

                                {/* Uploads */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Front */}
                                    <div>
                                        <p className="block text-sm font-semibold text-gray-700 mb-2">Front Side</p>
                                        <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:bg-gray-50 transition-all cursor-pointer relative group">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleFileChange(e, 'nidFront')}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                            />
                                            <div className="group-hover:scale-105 transition-transform duration-300">
                                                {nidFront ? (
                                                    <div className="flex flex-col items-center text-green-600">
                                                        <CheckCircle className="w-10 h-10 mb-2" />
                                                        <span className="text-sm font-medium truncate max-w-[200px]">{nidFront.name}</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col items-center text-gray-400">
                                                        <Upload className="w-10 h-10 mb-2" />
                                                        <span className="text-sm font-medium">Upload Front</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    {/* Back */}
                                    <div>
                                        <p className="block text-sm font-semibold text-gray-700 mb-2">Back Side</p>
                                        <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:bg-gray-50 transition-all cursor-pointer relative group">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleFileChange(e, 'nidBack')}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                            />
                                            <div className="group-hover:scale-105 transition-transform duration-300">
                                                {nidBack ? (
                                                    <div className="flex flex-col items-center text-green-600">
                                                        <CheckCircle className="w-10 h-10 mb-2" />
                                                        <span className="text-sm font-medium truncate max-w-[200px]">{nidBack.name}</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col items-center text-gray-400">
                                                        <Upload className="w-10 h-10 mb-2" />
                                                        <span className="text-sm font-medium">Upload Back</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 4 && (
                            <div className="animate-in fade-in slide-in-from-right-8 duration-500 space-y-8">
                                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                                    <CreditCard className="w-8 h-8 text-blue-600" />
                                    Secure Payment
                                </h2>
                                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8">
                                    <div className="flex justify-between items-center mb-8 pb-8 border-b border-gray-200">
                                        <span className="text-gray-600 font-medium">Total Amount Due</span>
                                        <span className="text-4xl font-bold text-gray-900">{car.price}</span>
                                    </div>

                                    {/* Payment Method Selector */}
                                    <div className="grid grid-cols-2 gap-4 mb-8">
                                        <div
                                            onClick={() => setPaymentMethod('esewa')}
                                            className={`cursor-pointer p-4 border rounded-xl flex items-center justify-center gap-2 transition-all ${paymentMethod === 'esewa' ? 'border-green-500 bg-green-50 ring-2 ring-green-200' : 'border-gray-200 hover:border-gray-300'}`}
                                        >
                                            <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white font-bold text-xs">e</div>
                                            <span className="font-bold text-gray-800">eSewa</span>
                                        </div>
                                        <div
                                            onClick={() => setPaymentMethod('card')}
                                            className={`cursor-pointer p-4 border rounded-xl flex items-center justify-center gap-2 transition-all ${paymentMethod === 'card' ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-300'}`}
                                        >
                                            <CreditCard className="w-5 h-5 text-gray-600" />
                                            <span className="font-bold text-gray-800">Card</span>
                                        </div>
                                    </div>

                                    {paymentMethod === 'esewa' ? (
                                        <div className="text-center py-6">
                                            <p className="text-gray-600 mb-4">You will be redirected to eSewa to complete your payment securely.</p>
                                            <div className="inline-block px-4 py-2 bg-green-100 text-green-800 rounded-lg text-sm font-medium">
                                                Fast & Secure Connection
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2">Card Number</label>
                                                <input
                                                    type="text"
                                                    placeholder="Enter any random number (Test Mode)"
                                                    value={cardNumber}
                                                    onChange={(e) => setCardNumber(e.target.value)}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                                />
                                            </div>
                                            <div className="grid grid-cols-1 gap-6">
                                                <div>
                                                    <label className="block text-sm font-bold text-gray-700 mb-2">Expiry Date</label>
                                                    <input
                                                        type="text"
                                                        placeholder="DD-MM-YYYY (Any future date)"
                                                        value={cardExpiry}
                                                        onChange={(e) => setCardExpiry(e.target.value)}
                                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {step === 5 && (
                            <div className="h-full flex flex-col items-center justify-center text-center animate-in zoom-in duration-500 py-12">
                                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-600 shadow-sm">
                                    <CheckCircle className="w-12 h-12" />
                                </div>
                                <h2 className="text-3xl font-bold text-gray-900 mb-4">Booking Request Sent!</h2>
                                <p className="text-gray-600 max-w-lg mx-auto text-lg leading-relaxed">
                                    Your request for the <strong>{car.name}</strong> has been successfully submitted. We will review your documents and send a confirmation to your email shortly.
                                </p>
                                <button
                                    onClick={() => navigate('/fleet')}
                                    className="mt-10 px-10 py-4 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                                >
                                    Return to Fleet
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Buttons */}
                {step < 5 && (
                    <div className="px-8 py-6 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
                        <button
                            onClick={() => step > 1 ? setStep(step - 1) : navigate('/fleet')}
                            className="px-8 py-3 text-gray-600 font-semibold hover:text-gray-900 transition-colors flex items-center gap-2"
                        >
                            {step > 1 ? 'Back' : 'Cancel'}
                        </button>
                        <button
                            onClick={nextStep}
                            disabled={loading}
                            className={`px-10 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {loading ? 'Processing...' : step === 4 ? 'Confirm Payment' : 'Next Step'}
                        </button>
                    </div>
                )}
            </div>
        </div>

    );
};

export default BookingPage;
