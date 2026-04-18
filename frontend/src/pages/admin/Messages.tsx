import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Mail, Trash2, CheckCircle, Clock } from 'lucide-react';

const Messages: React.FC = () => {
    const [messages, setMessages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedMessage, setSelectedMessage] = useState<any | null>(null);

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await axios.get('http://localhost:5000/api/messages/all', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessages(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error("Failed to fetch messages", error);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id: string) => {
        try {
            const token = localStorage.getItem('adminToken');
            await axios.put(`http://localhost:5000/api/messages/read/${id}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessages(messages.map(m => m._id === id ? { ...m, status: 'read' } : m));
            if (selectedMessage?._id === id) {
                setSelectedMessage({ ...selectedMessage, status: 'read' });
            }
        } catch (error) {
            console.error("Failed to mark as read", error);
        }
    };

    const deleteMessage = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this message?")) return;
        try {
            const token = localStorage.getItem('adminToken');
            await axios.delete(`http://localhost:5000/api/messages/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessages(messages.filter(m => m._id !== id));
            if (selectedMessage?._id === id) setSelectedMessage(null);
        } catch (error) {
            console.error("Failed to delete message", error);
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading messages...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">User inquiries</h1>
                    <p className="text-gray-500 mt-1">Manage and respond to messages from the contact form.</p>
                </div>
                <div className="bg-blue-50 px-4 py-2 rounded-xl text-blue-700 font-bold text-sm flex items-center gap-2">
                    <Mail size={18} />
                    {messages.filter(m => m.status === 'unread').length} New Messages
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Messages List */}
                <div className="lg:col-span-5 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-4 border-b border-gray-50 bg-gray-50/50">
                        <h3 className="font-bold text-gray-700 text-sm uppercase tracking-wider">Inbox</h3>
                    </div>
                    <div className="divide-y divide-gray-50 max-h-[600px] overflow-y-auto">
                        {messages.length === 0 ? (
                            <div className="p-12 text-center">
                                <Mail className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                                <p className="text-gray-400">No messages found.</p>
                            </div>
                        ) : (
                            messages.map((m) => (
                                <div 
                                    key={m._id}
                                    onClick={() => {
                                        setSelectedMessage(m);
                                        if (m.status === 'unread') markAsRead(m._id);
                                    }}
                                    className={`p-4 cursor-pointer transition-all hover:bg-blue-50/50 relative ${selectedMessage?._id === m._id ? 'bg-blue-50 border-l-4 border-blue-600' : ''}`}
                                >
                                    {m.status === 'unread' && (
                                        <div className="absolute top-4 right-4 w-2 h-2 bg-blue-600 rounded-full"></div>
                                    )}
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className={`text-sm ${m.status === 'unread' ? 'font-bold text-gray-900' : 'font-medium text-gray-600'}`}>
                                            {m.name}
                                        </h4>
                                        <span className="text-[10px] text-gray-400 font-medium">
                                            {new Date(m.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className={`text-xs truncate ${m.status === 'unread' ? 'text-gray-700 font-semibold' : 'text-gray-400'}`}>
                                        {m.subject}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Message Detail */}
                <div className="lg:col-span-7">
                    {selectedMessage ? (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full min-h-[500px] animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 font-bold text-xl">
                                        {selectedMessage.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">{selectedMessage.name}</h3>
                                        <p className="text-sm text-gray-500">{selectedMessage.email}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => deleteMessage(selectedMessage._id)}
                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                        title="Delete Message"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>

                            <div className="p-8 flex-1">
                                <div className="mb-8">
                                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest block mb-2">Subject</span>
                                    <h2 className="text-2xl font-bold text-gray-900">{selectedMessage.subject}</h2>
                                    <div className="flex items-center gap-4 mt-4 text-xs text-gray-400 font-medium">
                                        <div className="flex items-center gap-1">
                                            <Clock size={14} />
                                            {new Date(selectedMessage.createdAt).toLocaleString()}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <CheckCircle size={14} className={selectedMessage.status === 'read' ? 'text-green-500' : 'text-gray-300'} />
                                            {selectedMessage.status === 'read' ? 'Read' : 'Unread'}
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                        {selectedMessage.message}
                                    </p>
                                </div>
                            </div>

                            <div className="p-6 border-t border-gray-50 bg-gray-50/30">
                                <a 
                                    href={`mailto:${selectedMessage.email}?subject=RE: ${selectedMessage.subject}`}
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-all shadow-lg active:scale-95"
                                >
                                    <Mail size={18} />
                                    Reply via Email
                                </a>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 h-full min-h-[500px] flex flex-col items-center justify-center text-center p-12">
                            <div className="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center mb-6 text-gray-300">
                                <Mail size={40} />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Select a message</h3>
                            <p className="text-gray-500 max-w-sm">Choose an inquiry from the inbox to view details and respond to the user.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Messages;
