import React from 'react';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
    return (
        <footer className="mt-20 bg-gray-900 text-white">
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                    {/* Brand Section */}
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                                <span className="text-white text-2xl font-bold">D</span>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold">DriveFlow</h3>
                                <p className="text-xs text-gray-400 uppercase">Premium Mobility</p>
                            </div>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            The Automated Standard For Global Mobility. Systematic Fleet Matching And Bank-Level Security Infrastructure For A Seamless Journey.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-bold mb-4">Quick Links</h4>
                        <ul className="space-y-2">
                            <li>
                                <button className="text-gray-400 hover:text-white transition-colors">
                                    About Us
                                </button>
                            </li>
                            <li>
                                <button className="text-gray-400 hover:text-white transition-colors">
                                    Our Fleet
                                </button>
                            </li>
                            <li>
                                <button className="text-gray-400 hover:text-white transition-colors">
                                    Pricing
                                </button>
                            </li>
                            <li>
                                <button className="text-gray-400 hover:text-white transition-colors">
                                    Contact Us
                                </button>
                            </li>
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h4 className="text-lg font-bold mb-4">Services</h4>
                        <ul className="space-y-2">
                            <li>
                                <button className="text-gray-400 hover:text-white transition-colors">
                                    Self Drive
                                </button>
                            </li>
                            <li>
                                <button className="text-gray-400 hover:text-white transition-colors">
                                    Chauffeur Service
                                </button>
                            </li>
                            <li>
                                <button className="text-gray-400 hover:text-white transition-colors">
                                    Corporate Rentals
                                </button>
                            </li>
                            <li>
                                <button className="text-gray-400 hover:text-white transition-colors">
                                    Long Term Leasing
                                </button>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-lg font-bold mb-4">Get In Touch</h4>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-blue-500" />
                                <a href="mailto:info@driveflow.com" className="text-gray-400 hover:text-white transition-colors">
                                    info@driveflow.com
                                </a>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-blue-500" />
                                <a href="tel:+1234567890" className="text-gray-400 hover:text-white transition-colors">
                                    +1 (234) 567-890
                                </a>
                            </li>
                            <li className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-blue-500 mt-1" />
                                <span className="text-gray-400">
                                    123 Premium Street<br />New York, NY 10001
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Social Media & Copyright */}
                <div className="border-t border-gray-800 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-gray-400 text-sm">
                            © 2025 DriveFlow - Premium Mobility Solutions. All rights reserved.
                        </p>
                        <div className="flex gap-4">
                            <button className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                                <Facebook className="w-5 h-5" />
                            </button>
                            <button className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-400 transition-colors">
                                <Twitter className="w-5 h-5" />
                            </button>
                            <button className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-pink-600 transition-colors">
                                <Instagram className="w-5 h-5" />
                            </button>
                            <button className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                                <Linkedin className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
