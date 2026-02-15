import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const DriveFlowLogin: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async () => {
        setError('');
        try {
            // 1. Try User Login
            const response = await axios.post('http://localhost:5000/api/users/login', {
                email,
                password
            });

            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                navigate('/home');
                return;
            }
        } catch (userErr: any) {
            // 2. If User Login fails, Try Admin Login
            console.log("User login failed, trying admin...", userErr.response?.data?.message);

            try {
                const adminResponse = await axios.post('http://localhost:5000/api/admin/login', {
                    email,
                    password
                });

                if (adminResponse.data.token) {
                    localStorage.setItem('adminToken', adminResponse.data.token);
                    localStorage.setItem('adminUser', JSON.stringify(adminResponse.data.admin));
                    navigate('/admin');
                    return;
                }
            } catch (adminErr: any) {
                console.error("Admin login failed", adminErr);
                // 3. If both fail, show error
                // Prefer the error message from the first attempt if it's "Invalid credentials" type, 
                // or just a generic "Invalid email or password"
                setError('Invalid email or password');
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <header className="p-6">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-2xl font-bold">D</span>
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">DriveFlow</h1>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Premium Mobility</p>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center px-6 py-12">
                <div className="w-full max-w-md">
                    {/* Welcome Back Badge */}
                    <div className="flex justify-center mb-8">
                        <span className="inline-block px-8 py-3 bg-blue-200 text-blue-700 rounded-full text-sm font-medium uppercase tracking-wide">
                            Welcome Back
                        </span>
                    </div>

                    {/* Title */}
                    <div className="text-center mb-8">
                        <h2 className="text-4xl font-bold text-gray-900 mb-2">Login to DriveFlow</h2>
                        <p className="text-gray-600 text-lg">Manage Your Trips And Exclusive Rentals</p>
                    </div>

                    {/* Login Form */}
                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm text-center">
                            {error}
                        </div>
                    )}
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-4 bg-gray-200 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-4 bg-gray-200 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <div className="text-right mt-2">
                                <button className="text-sm font-bold text-purple-600 hover:text-purple-700 uppercase">
                                    Forgot?
                                </button>
                            </div>
                        </div>

                        <button
                            onClick={handleSubmit}
                            className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition-colors uppercase tracking-wide"
                        >
                            Sign In?
                        </button>
                    </div>

                    {/* Register Link */}
                    <div className="text-center mt-6">
                        <span className="text-gray-600">Don't have an account? </span>
                        <button
                            onClick={() => navigate('/register')}
                            className="text-blue-600 hover:text-blue-700 font-semibold"
                        >
                            Register now
                        </button>
                    </div>
                </div>

                {/* Car Image */}
                {/* <div className="hidden lg:block absolute bottom-0 right-0 w-1/2 max-w-2xl">
                    <img
                        src="https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800&q=80"
                        alt="Luxury sports car"
                        className="w-full h-auto object-contain"
                    />
                </div> */}
            </main>
        </div>
    );
};

export default DriveFlowLogin;