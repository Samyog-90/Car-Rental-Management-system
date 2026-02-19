import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const DriveFlowSignUp: React.FC = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleForgot = () => {
    alert('Redirecting to password recovery...');
  };

  const handleSignIn = () => {
    navigate('/');
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        const response = await axios.post('http://localhost:5000/api/users/register', {
          fullName,
          email,
          password
        });

        if (response.status === 201 || response.status === 200) {
          alert('Account created successfully! Please login.');
          navigate('/');
        }
      } catch (err: any) {
        setErrors({ ...errors, api: err.response?.data?.message || 'Registration failed' });
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
        <div className="w-full max-w-2xl">
          {/* Start Journey Badge */}
          <div className="flex justify-center mb-8">
            <span className="inline-block px-8 py-3 bg-blue-200 text-blue-700 rounded-full text-sm font-medium uppercase tracking-wide">
              Start Journey
            </span>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-gray-900 mb-2">CREATE ACCOUNT</h2>
            <p className="text-gray-600 text-lg">Join 10k+ Users Renting With DriveFlow</p>
          </div>

          {/* Sign Up Form */}
          <div className="space-y-6">
            {errors.api && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center">
                {errors.api}
              </div>
            )}
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-4 bg-gray-200 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-4 bg-gray-200 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
              <div className="text-right mt-2">
                <button
                  onClick={handleForgot}
                  className="text-sm font-bold text-purple-600 hover:text-purple-700 uppercase transition-colors"
                >
                  Forgot?
                </button>
              </div>
            </div>

            {/* Password Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-4 bg-gray-200 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                  Confirm
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-4 bg-gray-200 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Join DriveFlow
            </button>
          </div>

          {/* Sign In Link */}
          <div className="text-center mt-6">
            <span className="text-gray-600">Already have an account? </span>
            <button
              onClick={handleSignIn}
              className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
            >
              Sign in
            </button>
          </div>
        </div>

        {/* Car Image */}
        {/* <div className="hidden lg:block absolute bottom-0 right-0 w-1/2 max-w-xl">
          <img
            src="https://images.unsplash.com/photo-1619405399517-d7fce0f13302?w=800&q=80"
            alt="Luxury white sports car"
            className="w-full h-auto object-contain"
          />
        </div> */}
      </main>
    </div>
  );
};

export default DriveFlowSignUp;