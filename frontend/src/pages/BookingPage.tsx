import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Calendar, MapPin, Upload, CreditCard, CheckCircle, AlertCircle, FileText, User, ChevronLeft, Loader2 } from 'lucide-react';

const BookingPage: React.FC = () => {
    const navigate = useNavigate();
    const locationHook = useLocation();
    const car = locationHook.state?.car;

    const [step, setStep] = useState(() => {
        const prefilled = locationHook.state?.prefilledData;
        if (prefilled?.startDate && prefilled?.endDate && prefilled?.location) {
            return prefilled.rentalType === 'driver' ? 3 : 2;
        }
        return 1;
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form State
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [location, setLocation] = useState('');
    const [destination, setDestination] = useState('');
    const [rentalType, setRentalType] = useState<'self' | 'driver'>('self');

    // License
    const [licenseNumber, setLicenseNumber] = useState('');
    const [licenseName, setLicenseName] = useState('');
    const [licenseFront, setLicenseFront] = useState<File | null>(null);
    const [licenseBack, setLicenseBack] = useState<File | null>(null);
    const [licenseStatus, setLicenseStatus] = useState<'unverified' | 'verifying' | 'valid' | 'invalid'>('unverified');

    // National ID
    const [nidNumber, setNidNumber] = useState('');
    const [nidName, setNidName] = useState('');
    const [nidFront, setNidFront] = useState<File | null>(null);
    const [nidBack, setNidBack] = useState<File | null>(null);
    const [nidStatus, setNidStatus] = useState<'unverified' | 'verifying' | 'valid' | 'invalid'>('unverified');

    const [paymentMethod] = useState<'esewa'>('esewa');
    const [isRedirecting, setIsRedirecting] = useState(false);

    // Calculate Total Price (Rate * Days + Driver Fee)
    const calculateTotal = () => {
        const defaultValues = { totalAmount: 0, diffDays: 0, dailyRate: 0, driverFeePerDay: 0 };
        if (!startDate || !endDate || !car) return defaultValues;
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
        const dailyRate = parseFloat(String(car?.price).replace(/[^0-9.]/g, '')) || 0;
        const driverFeePerDay = rentalType === 'driver' ? 1000 : 0;
        return {
            totalAmount: (dailyRate + driverFeePerDay) * diffDays,
            diffDays,
            dailyRate,
            driverFeePerDay
        };
    };

    const { totalAmount, diffDays, dailyRate, driverFeePerDay } = calculateTotal();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/');
            return;
        }

        if (!car) {
            navigate('/fleet');
            return;
        }

        // Handle pre-filled data from Home Page
        const prefilled = locationHook.state?.prefilledData;
        if (prefilled) {
            if (prefilled.startDate) setStartDate(prefilled.startDate);
            if (prefilled.endDate) setEndDate(prefilled.endDate);
            if (prefilled.location) setLocation(prefilled.location);
            if (prefilled.destination) setDestination(prefilled.destination);
            if (prefilled.rentalType) setRentalType(prefilled.rentalType);
        }
    }, [car, navigate, locationHook.state]);

    const handleVerifyLicense = async () => {
        if (!licenseNumber || !licenseFront) {
            setError('Please enter license number and upload the front image first.');
            return;
        }
        setLicenseStatus('verifying');
        setError(null);
        try {
            // 1. OCR Verification
            const ocrFormData = new FormData();
            ocrFormData.append('documentImage', licenseFront);
            ocrFormData.append('docType', 'LICENSE_FRONT');

            const ocrRes = await axios.post('http://localhost:5000/api/ocr/process', ocrFormData);
            const { licenseNumber: extractedNumber, fullName: extractedName } = ocrRes.data.extractedData?.fields || {};

            if (!extractedNumber) {
                setLicenseStatus('invalid');
                setError('Could not detect a license number in the image. Please ensure the photo is clear and well-lit.');
                return;
            }

            const normExtracted = extractedNumber.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
            const normInput = licenseNumber.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();

            if (normExtracted !== normInput && !normExtracted.includes(normInput) && !normInput.includes(normExtracted)) {
                setLicenseStatus('invalid');
                setError(`ID Mismatch! Image contains number "${extractedNumber}" but you entered "${licenseNumber}".`);
                return;
            }

            if (!extractedName) {
                setLicenseStatus('invalid');
                setError('Could not detect a name in the license image. Please ensure the full name is visible.');
                return;
            }

            const normExtractedName = extractedName.toLowerCase().trim();
            const normInputName = licenseName.toLowerCase().trim();
            // Check for significant overlap to avoid OCR noise issues
            if (!normExtractedName.includes(normInputName) && !normInputName.includes(normExtractedName)) {
                setLicenseStatus('invalid');
                setError(`Name Mismatch! Image contains name "${extractedName}" but you entered "${licenseName}".`);
                return;
            }

            // 2. Database Verification
            const response = await axios.get(`http://localhost:5000/api/gov/license/check/${licenseNumber}`);
            if (response.data.valid) {
                setLicenseStatus('valid');
                if (response.data.holderName) setLicenseName(response.data.holderName);
            } else {
                setLicenseStatus('invalid');
                setError('License is invalid or expired.');
            }
        } catch (err: any) {
            setLicenseStatus('invalid');
            setError(err.response?.data?.message || 'Failed to verify license.');
        }
    };

    const handleVerifyNID = async () => {
        if (!nidNumber || !nidFront) {
            setError('Please enter NID number and upload the front image first.');
            return;
        }
        setNidStatus('verifying');
        setError(null);
        try {
            // 1. OCR Verification
            const ocrFormData = new FormData();
            ocrFormData.append('documentImage', nidFront);
            ocrFormData.append('docType', 'NID_FRONT');

            const ocrRes = await axios.post('http://localhost:5000/api/ocr/process', ocrFormData);
            const { nidNumber: extractedNumber, fullName: extractedName } = ocrRes.data.extractedData?.fields || {};

            if (!extractedNumber) {
                setNidStatus('invalid');
                setError('Could not detect a National ID number in the image. Please ensure the photo is clear and well-lit.');
                return;
            }

            const normExtracted = extractedNumber.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
            const normInput = nidNumber.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();

            if (normExtracted !== normInput && !normExtracted.includes(normInput) && !normInput.includes(normExtracted)) {
                setNidStatus('invalid');
                setError(`NID Mismatch! Image contains number "${extractedNumber}" but you entered "${nidNumber}".`);
                return;
            }

            if (!extractedName) {
                setNidStatus('invalid');
                setError('Could not detect a name in the National ID image. Please ensure the full name is visible.');
                return;
            }

            const normExtractedName = extractedName.toLowerCase().trim();
            const normInputName = nidName.toLowerCase().trim();
            if (!normExtractedName.includes(normInputName) && !normInputName.includes(normExtractedName)) {
                setNidStatus('invalid');
                setError(`Name Mismatch! Image contains name "${extractedName}" but you entered "${nidName}".`);
                return;
            }

            // 2. Database Verification
            const response = await axios.get(`http://localhost:5000/api/gov/nid/check/${nidNumber}`);
            if (response.data.valid) {
                setNidStatus('valid');
                if (response.data.fullName) setNidName(response.data.fullName);
            } else {
                setNidStatus('invalid');
                setError('National ID is invalid or not found.');
            }
        } catch (err: any) {
            setNidStatus('invalid');
            setError(err.response?.data?.message || 'Failed to verify National ID.');
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'licenseFront' | 'licenseBack' | 'nidFront' | 'nidBack') => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            
            // 1. File Type Check
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
            if (!allowedTypes.includes(file.type)) {
                setError('Only JPG, JPEG and PNG files are allowed.');
                return;
            }

            // 2. File Size Check (10MB)
            const maxSize = 10 * 1024 * 1024;
            if (file.size > maxSize) {
                setError('File size too large. Maximum limit is 10MB.');
                return;
            }

            setError(null); // Clear any previous file errors
            if (field === 'licenseFront') {
                setLicenseFront(file);
                setLicenseStatus('unverified');
            }
            if (field === 'licenseBack') setLicenseBack(file);
            if (field === 'nidFront') {
                setNidFront(file);
                setNidStatus('unverified');
            }
            if (field === 'nidBack') setNidBack(file);
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
            formData.append('destination', destination);
            formData.append('rentalType', rentalType);

            if (rentalType === 'self') {
                formData.append('licenseNumber', licenseNumber);
                formData.append('licenseName', licenseName);
            } else {
                formData.append('nidNumber', nidNumber);
                formData.append('nidName', nidName);
            }

            if (licenseFront) formData.append('licenseFront', licenseFront);
            if (licenseBack) formData.append('licenseBack', licenseBack);
            if (nidFront) formData.append('nidFront', nidFront);
            if (nidBack) formData.append('nidBack', nidBack);

            formData.append('paymentMethod', paymentMethod);

            formData.append('paymentStatus', isEsewa ? 'Pending' : 'Completed');

            // Use the calculated total price
            formData.append('totalPrice', String(totalAmount));

            const response = await axios.post('http://localhost:5000/api/bookings', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${localStorage.getItem('token') || localStorage.getItem('adminToken')}`
                }
            });

            if (isEsewa) {
                return { bookingId: response.data._id, totalPrice: totalAmount };
            }

            setStep(6);
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || err.message || 'Failed to create booking.';
            setError(errorMsg);
            console.error("Booking Error:", err);
            return null; // Return null on error
        } finally {
            if (!isEsewa) setLoading(false);
        }
    };


    const nextStep = async () => {
        // Validation Logic
        if (step === 1) {
            if (!startDate || !endDate || !location || !destination) {
                setError('Please fill in all trip details.');
                return;
            }
        }
        if (step === 2) {
            if (rentalType === 'self') {
                if (!licenseName || licenseStatus !== 'valid' || !licenseFront || !licenseBack) {
                    setError('Please provide your name, verify your license and upload both front and back images.');
                    return;
                }
                // If self drive, we jump to step 4 (Summary) skipping step 3 (NID specifically for drivers)
                setStep(4);
                return;
            } else {
                // If driver, we proceed to step 3 (NID)
            }
        }
        if (step === 3) {
            if (rentalType === 'driver') {
                if (!nidName || nidStatus !== 'valid' || !nidFront || !nidBack) {
                    setError('Please provide your name, verify your National ID and upload both front and back images.');
                    return;
                }
            }
        }
        if (step === 5) {
            if (paymentMethod === 'esewa') {
                // eSewa Flow
                try {
                    const result = await handleSubmit(true);
                    if (result && result.bookingId) {
                        setIsRedirecting(true);
                        setStep(6);
                        
                        setTimeout(() => {
                            // Get eSewa Config
                            axios.post('http://localhost:5000/api/payment/esewa-config', {
                                amount: result.totalPrice,
                                transactionUuid: result.bookingId
                            }).then(configRes => {
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
                            }).catch(err => {
                                console.error(err);
                                setError("Failed to fetch eSewa config");
                                setIsRedirecting(false);
                                setStep(5);
                            });
                        }, 4000);
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
        if (step === 1 && rentalType === 'driver') {
            setStep(3); // Skip Step 2 (License) for driver rentals
        } else {
            setStep(step + 1);
        }
    };

    const prevStep = () => {
        if (step === 4 && rentalType === 'self') {
            setStep(2);
        } else if (step === 3 && rentalType === 'driver') {
            setStep(1);
        } else {
            setStep(step - 1);
        }
    };

    if (!car) return null;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden">

                {/* Header */}
                <div className="bg-gray-900 px-6 sm:px-8 py-4 sm:py-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-white">
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                        <button onClick={() => navigate('/fleet')} className="text-gray-400 hover:text-white transition-colors p-1 -ml-1">
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold truncate max-w-[200px] sm:max-w-none">{car.name}</h1>
                            <p className="text-gray-400 text-xs sm:text-sm">{car.type} • {car.price}</p>
                        </div>
                    </div>
                    <div className="text-left sm:text-right w-full sm:w-auto border-t border-gray-800 sm:border-0 pt-3 sm:pt-0">
                        <p className="text-[10px] sm:text-sm uppercase tracking-wider text-gray-400">Step {step} of 6</p>
                        <p className="font-semibold text-blue-400 text-sm sm:text-base">
                            {step === 1 && "Trip Details"}
                            {step === 2 && "License Verification"}
                            {step === 3 && "Identity Verification"}
                            {step === 4 && "Review Summary"}
                            {step === 5 && "Payment"}
                            {step === 6 && "Confirmation"}
                        </p>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="h-1.5 bg-gray-100 flex">
                    <div className="h-full bg-blue-600 transition-all duration-700 ease-in-out" style={{ width: `${(step / 6) * 100}%` }}></div>
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
                                            min={new Date().toISOString().split('T')[0]}
                                            onChange={(e) => {
                                                setStartDate(e.target.value);
                                                if (endDate && e.target.value > endDate) setEndDate('');
                                            }}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">End Date</label>
                                        <input
                                            type="date"
                                            value={endDate}
                                            min={startDate || new Date().toISOString().split('T')[0]}
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
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Destination</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-3.5 w-5 h-5 text-purple-400" />
                                        <input
                                            type="text"
                                            placeholder="Enter destination address"
                                            value={destination}
                                            onChange={(e) => setDestination(e.target.value)}
                                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="pt-8 border-t border-gray-100 space-y-4">
                                    <label className="block text-sm font-bold text-gray-700 uppercase tracking-widest">Choose Service Type</label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div
                                            onClick={() => setRentalType('self')}
                                            className={`cursor-pointer p-6 border-2 rounded-2xl transition-all flex items-center gap-4 ${rentalType === 'self' ? 'border-blue-600 bg-blue-50 ring-4 ring-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
                                        >
                                            <div className={`p-4 rounded-full ${rentalType === 'self' ? 'bg-blue-600 text-white' : 'bg-gray-50 text-gray-400'}`}>
                                                <User className="w-6 h-6" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-bold text-gray-900">Self Drive</p>
                                                <p className="text-xs text-gray-500 mt-1">Rent and drive the car on your own.</p>
                                            </div>
                                        </div>
                                        <div
                                            onClick={() => setRentalType('driver')}
                                            className={`cursor-pointer p-6 border-2 rounded-2xl transition-all flex items-center gap-4 ${rentalType === 'driver' ? 'border-blue-600 bg-blue-50 ring-4 ring-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
                                        >
                                            <div className={`p-4 rounded-full ${rentalType === 'driver' ? 'bg-blue-600 text-white' : 'bg-gray-50 text-gray-400'}`}>
                                                <CreditCard className="w-6 h-6" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-bold text-gray-900">Hire a Driver</p>
                                                <p className="text-xs text-gray-500 mt-1">Get a verified professional driver.</p>
                                            </div>
                                        </div>
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
                                <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold text-blue-900 mb-2">Full Name (as on License)</label>
                                        <input
                                            type="text"
                                            placeholder="Enter your full name"
                                            value={licenseName}
                                            onChange={(e) => {
                                                setLicenseName(e.target.value);
                                                setLicenseStatus('unverified');
                                            }}
                                            className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-blue-900 mb-2">Driving License Number</label>
                                        <div className="flex gap-4">
                                            <input
                                                type="text"
                                                placeholder="LICENSE-NO-123"
                                                value={licenseNumber}
                                                onChange={(e) => {
                                                    setLicenseNumber(e.target.value);
                                                    setLicenseStatus('unverified');
                                                }}
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

                                <div className="bg-purple-50 p-6 rounded-2xl border border-purple-100 space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold text-purple-900 mb-2">Full Name (as on NID)</label>
                                        <input
                                            type="text"
                                            placeholder="Enter your full name"
                                            value={nidName}
                                            onChange={(e) => {
                                                setNidName(e.target.value);
                                                setNidStatus('unverified');
                                            }}
                                            className="w-full px-4 py-3 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none bg-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-purple-900 mb-2">National ID (NID) Number</label>
                                        <div className="flex gap-4">
                                            <input
                                                type="text"
                                                placeholder="NID-XXXX-XXXX"
                                                value={nidNumber}
                                                onChange={(e) => {
                                                    setNidNumber(e.target.value);
                                                    setNidStatus('unverified');
                                                }}
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
                                        <CheckCircle className="w-8 h-8 text-blue-600" />
                                        Review Your Booking
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-gray-50 p-8 rounded-2xl border border-gray-200">
                                        <div className="space-y-4">
                                            <h3 className="text-xl font-bold text-gray-800 border-b pb-4 flex items-center justify-between">
                                                <span>Trip Details</span>
                                                <span className="text-xs font-normal text-blue-600 bg-blue-50 px-2 py-1 rounded">Confirmed</span>
                                            </h3>
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-gray-500">Duration:</span>
                                                <span className="font-semibold text-gray-900">{startDate} to {endDate} ({diffDays} days)</span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-gray-500">Pick-up:</span>
                                                <span className="font-semibold text-gray-900">{location}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-gray-500">Destination:</span>
                                                <span className="font-semibold text-gray-900">{destination}</span>
                                            </div>
                                            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 bg-white rounded-lg border flex items-center justify-center p-1">
                                                        <img src={car.image || "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80"} alt={car.name} className="w-full h-full object-contain" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-900">{car.name}</p>
                                                        <p className="text-xs text-gray-500">{car.type}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center pt-2 text-sm">
                                                <span className="text-gray-500">Service:</span>
                                                <span className="font-bold text-blue-600">{rentalType === 'self' ? 'Self Drive' : 'Hire a Driver'}</span>
                                            </div>
                                            <div className="flex justify-between items-center pt-2 text-sm">
                                                <span className="text-gray-500">Daily Rate:</span>
                                                <span className="font-medium text-gray-900">Rs. {dailyRate}</span>
                                            </div>
                                            {rentalType === 'driver' && (
                                                <div className="flex justify-between items-center pt-2 text-sm">
                                                    <span className="text-gray-500">Driver Fee:</span>
                                                    <span className="font-medium text-gray-900">Rs. {driverFeePerDay} / day</span>
                                                </div>
                                            )}
                                            <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-gray-200 shadow-sm">
                                                <span className="font-bold text-gray-700">Total Calculation:</span>
                                                <span className="text-xl font-black text-blue-600">Rs. {totalAmount}</span>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <h3 className="text-xl font-bold text-gray-800 border-b pb-4">Verification Details</h3>
                                            <div className="space-y-3">
                                                {rentalType === 'self' ? (
                                                    <div className="p-4 bg-white rounded-xl border border-gray-200 space-y-2">
                                                        <div className="flex items-center justify-between">
                                                            <p className="text-xs font-bold text-gray-400 uppercase">Driving License</p>
                                                            <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">VERIFIED</span>
                                                        </div>
                                                        <div className="flex justify-between text-sm">
                                                            <span className="text-gray-500">Holder Name:</span>
                                                            <span className="font-bold text-gray-900">{licenseName}</span>
                                                        </div>
                                                        <div className="flex justify-between text-sm">
                                                            <span className="text-gray-500">ID Number:</span>
                                                            <span className="font-mono text-gray-900">{licenseNumber}</span>
                                                        </div>
                                                        <div className="flex gap-2 pt-1">
                                                            <div className="px-2 py-1 bg-gray-50 border rounded text-[10px] text-gray-600 flex items-center gap-1">
                                                                <CheckCircle className="w-3 h-3 text-green-500" /> Front Image
                                                            </div>
                                                            <div className="px-2 py-1 bg-gray-50 border rounded text-[10px] text-gray-600 flex items-center gap-1">
                                                                <CheckCircle className="w-3 h-3 text-green-500" /> Back Image
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="p-4 bg-white rounded-xl border border-gray-200 space-y-2">
                                                        <div className="flex items-center justify-between">
                                                            <p className="text-xs font-bold text-gray-400 uppercase">National ID</p>
                                                            <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">VERIFIED</span>
                                                        </div>
                                                        <div className="flex justify-between text-sm">
                                                            <span className="text-gray-500">Name:</span>
                                                            <span className="font-bold text-gray-900">{nidName}</span>
                                                        </div>
                                                        <div className="flex justify-between text-sm">
                                                            <span className="text-gray-500">NID Number:</span>
                                                            <span className="font-mono text-gray-900">{nidNumber}</span>
                                                        </div>
                                                        <div className="flex gap-2 pt-1">
                                                            <div className="px-2 py-1 bg-gray-50 border rounded text-[10px] text-gray-600 flex items-center gap-1">
                                                                <CheckCircle className="w-3 h-3 text-green-500" /> Front Image
                                                            </div>
                                                            <div className="px-2 py-1 bg-gray-50 border rounded text-[10px] text-gray-600 flex items-center gap-1">
                                                                <CheckCircle className="w-3 h-3 text-green-500" /> Back Image
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-blue-50 p-5 rounded-2xl text-blue-800 text-sm flex items-start gap-4">
                                        <AlertCircle className="w-6 h-6 shrink-0 text-blue-400" />
                                        <div>
                                            <p className="font-bold mb-1">Final Confirmation Required</p>
                                            <p>Please review everything above. Once you click <strong>Confirm Details</strong>, you'll be able to proceed with payment and finalize your booking.</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                        {step === 5 && (
                            <div className="animate-in fade-in slide-in-from-right-8 duration-500 space-y-8">
                                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                                    <CreditCard className="w-8 h-8 text-blue-600" />
                                    Secure Payment
                                </h2>
                                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8">
                                    <div className="flex justify-between items-center mb-8 pb-8 border-b border-gray-200">
                                        <span className="text-gray-600 font-medium">Total Amount Due</span>
                                        <span className="text-4xl font-bold text-gray-900">Rs. {totalAmount}</span>
                                    </div>

                                    {/* Payment Method Selector */}
                                    <div className="flex justify-center mb-8">
                                        <div
                                            className="p-4 border border-green-500 bg-green-50 ring-2 ring-green-200 rounded-xl flex items-center justify-center gap-2 w-full max-w-xs"
                                        >
                                            <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white font-bold text-xs">e</div>
                                            <span className="font-bold text-gray-800">eSewa</span>
                                        </div>
                                    </div>

                                    <div className="text-center py-6">
                                        <p className="text-gray-600 mb-4">You will be redirected to eSewa to complete your payment securely.</p>
                                        <div className="inline-block px-4 py-2 bg-green-100 text-green-800 rounded-lg text-sm font-medium">
                                            Nepal's Most Trusted Payment Gateway
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 6 && (
                                <div className="h-full flex flex-col items-center animate-in zoom-in duration-500 py-6">
                                    <div className={`w-20 h-20 ${isRedirecting ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'} rounded-full flex items-center justify-center mb-6 shadow-sm`}>
                                        {isRedirecting ? <Loader2 className="w-10 h-10 animate-spin" /> : <CheckCircle className="w-10 h-10" />}
                                    </div>
                                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                        {isRedirecting ? "Processing Payment..." : "Booking Confirmed!"}
                                    </h2>
                                    <p className="text-gray-600 mb-8">
                                        {isRedirecting ? "Securely connecting to eSewa. Please do not close this window." : "Your trip has been successfully scheduled."}
                                    </p>

                                    {/* Invoice Section - Only show if not redirecting or show as preview */}
                                    <div className="w-full max-w-lg bg-white border-2 border-gray-100 rounded-2xl shadow-sm overflow-hidden text-left opacity-90">
                                        <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
                                            <h3 className="font-bold text-gray-800 uppercase tracking-wider text-sm">Booking Preview</h3>
                                            <span className="text-[10px] font-black bg-blue-100 text-blue-700 px-3 py-1 rounded-full">{isRedirecting ? 'INITIALIZING' : 'CONFIRMED'}</span>
                                        </div>
                                        <div className="p-6 space-y-4 font-medium">
                                            <div className="flex justify-between border-b pb-2">
                                                <span className="text-gray-500 text-sm">Vehicle:</span>
                                                <span className="font-bold text-gray-900">{car.name}</span>
                                            </div>
                                            <div className="flex justify-between border-b pb-2">
                                                <span className="text-gray-500 text-sm">Duration:</span>
                                                <span className="font-bold text-gray-900">{diffDays} Days</span>
                                            </div>
                                            <div className="flex justify-between border-b pb-2">
                                                <span className="text-gray-500 text-sm">Gateway:</span>
                                                <span className="font-bold text-green-600 flex items-center gap-1">eSewa Nepal</span>
                                            </div>
                                            <div className="flex justify-between text-lg font-black text-blue-600 pt-2 border-t">
                                                <span>Total Amount</span>
                                                <span>Rs. {totalAmount}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {!isRedirecting && (
                                        <div className="mt-8 flex gap-4">
                                            <button
                                                onClick={() => window.print()}
                                                className="px-6 py-3 border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all flex items-center gap-2"
                                            >
                                                <FileText className="w-4 h-4" />
                                                Print Invoice
                                            </button>
                                            <button
                                                onClick={() => navigate('/home')}
                                                className="px-10 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-all shadow-lg transform hover:-translate-y-1"
                                            >
                                                Done
                                            </button>
                                        </div>
                                    )}
                                    {isRedirecting && (
                                        <div className="mt-8 flex items-center gap-3 text-sm text-gray-400 font-bold bg-gray-50 px-6 py-3 rounded-xl border border-gray-100">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                                            Redirecting in 4 seconds...
                                        </div>
                                    )}
                                </div>
                            )}
                    </div>
                </div>

                {/* Footer Buttons */}
                {step < 6 && (
                    <div className="px-6 sm:px-8 py-4 sm:py-6 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <button
                            onClick={prevStep}
                            className="order-2 sm:order-1 w-full sm:w-auto px-8 py-3 text-gray-600 font-semibold hover:text-gray-900 transition-colors flex items-center justify-center gap-2"
                        >
                            {step > 1 ? 'Back' : (
                                <div className="flex items-center gap-2">
                                    <ChevronLeft className="w-4 h-4" />
                                    <span>Cancel</span>
                                </div>
                            )}
                        </button>
                        <button
                            onClick={nextStep}
                            disabled={loading}
                            className={`order-1 sm:order-2 w-full sm:w-auto px-10 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {loading ? 'Processing...' : step === 5 ? 'Confirm & Pay' : (step === 4) ? 'Confirm Details' : 'Next Step'}
                        </button>
                    </div>
                )}
            </div>
        </div>

    );
};

export default BookingPage;
