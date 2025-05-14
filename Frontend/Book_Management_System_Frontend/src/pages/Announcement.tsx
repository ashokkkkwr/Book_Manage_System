import React, { useEffect, useState } from 'react';
import axiosInstance from '../service/axiosInstance';

type Announcement = {
    announcementId: string;
    title: string;
    message: string;
    startAt: string;
    endAt: string;
};

const Announcement = () => {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [activeOnly, setActiveOnly] = useState(false);
    const [form, setForm] = useState({
        title: '',
        message: '',
        startAt: '',
        endAt: ''
    });

    const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);

    const fetchAnnouncements = async () => {
        try {
          const response = activeOnly
            ? await axiosInstance.get('/Announcement/active')
            : await axiosInstance.get('/Announcement/getAnnouncements');
    
          const data = Array.isArray(response.data) ? response.data : [response.data];
          console.log("🚀 ~ fetchAnnouncements ~ data:", data)
          setAnnouncements(data);
        } catch (error) {
          console.error('Failed to fetch announcements', error);
        }
      };

    const createAnnouncement = async () => {
        try {
            await axiosInstance.post('/Announcement/createAnnouncement', {
                title: form.title,
                message: form.message,
                startAt: new Date(form.startAt).toISOString(),
                endAt: new Date(form.endAt).toISOString()
            });
            setForm({ title: '', message: '', startAt: '', endAt: '' });
            fetchAnnouncements();
        } catch (error) {
            console.error('Error creating announcement:', error);
        }
    };

    const deleteAnnouncement = async (id: string) => {
        try {
            await axiosInstance.delete(`/Announcement/${id}`);
            fetchAnnouncements();
        } catch (error) {
            console.error('Error deleting announcement:', error);
        }
    };

    const handleAnnouncementClick = async (id: string) => {
        try {
            const response = await axiosInstance.get('/Announcement/getAnnouncement', {
                params: { id }
            });
            setSelectedAnnouncement(response.data);
        } catch (error) {
            console.error('Failed to get announcement by ID', error);
        }
    };

    const closePopup = () => {
        setSelectedAnnouncement(null);
    };

    useEffect(() => {
        fetchAnnouncements();
    }, [activeOnly]);

    return (
        <div className="bg-slate-900 text-white min-h-screen p-8">
            <h1 className="text-2xl font-bold mb-6">Announcements</h1>

            {/* Create form */}
            <div className="mb-6 space-y-2">
                <input
                    type="text"
                    placeholder="Title"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full p-2 rounded bg-slate-800"
                />
                <textarea
                    placeholder="Message"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full p-2 rounded bg-slate-800"
                />
                <input
                    type="datetime-local"
                    value={form.startAt}
                    onChange={(e) => setForm({ ...form, startAt: e.target.value })}
                    className="w-full p-2 rounded bg-slate-800"
                />
                <input
                    type="datetime-local"
                    value={form.endAt}
                    onChange={(e) => setForm({ ...form, endAt: e.target.value })}
                    className="w-full p-2 rounded bg-slate-800"
                />
                <button
                    onClick={createAnnouncement}
                    className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
                >
                    Create Announcement
                </button>
            </div>

            {/* Toggle active */}
            <div className="mb-4">
                <label className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        checked={activeOnly}
                        onChange={() => setActiveOnly(!activeOnly)}
                    />
                    <span>Show only active announcements</span>
                </label>
            </div>

            {/* List */}
            <div className="space-y-4">
                {announcements.map((a) => (
                    <div
                        key={a.announcementId}
                        className="bg-slate-800 p-4 rounded cursor-pointer hover:bg-slate-700"
                        onClick={() => handleAnnouncementClick(a.announcementId)}
                    >
                        <h2 className="text-xl font-semibold">{a.title}</h2>
                        <p>{a.message}</p>
                        <p className="text-sm text-gray-400">
                            {new Date(a.startAt).toLocaleString()} - {new Date(a.endAt).toLocaleString()}
                        </p>
                        <button
                            onClick={(e) => {
                                e.stopPropagation(); // prevent parent click
                                deleteAnnouncement(a.announcementId);
                            }}
                            className="mt-2 bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
                        >
                            Delete
                        </button>
                    </div>
                ))}
            </div>

            {selectedAnnouncement && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 transition-all duration-300">
                    <div className="relative bg-gradient-to-br from-white to-gray-50 text-gray-800 rounded-xl shadow-2xl p-8 w-[95%] max-w-2xl animate-pop-in">
                        <button
                            className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 transition-colors duration-200 p-1 -m-1"
                            onClick={closePopup}
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <div className="space-y-6">
                            <div className="border-b pb-4 border-gray-200">
                                <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
                                    {selectedAnnouncement.title}
                                </h2>
                            </div>

                            <div className="prose prose-lg max-w-none text-gray-600">
                                <p className="whitespace-pre-line leading-relaxed font-serif">
                                    {selectedAnnouncement.message}
                                </p>
                            </div>

                            <div className="bg-gray-50/60 rounded-lg p-4 space-y-2.5">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div className="space-y-1">
                                        <p className="font-medium text-gray-500">Start Date</p>
                                        <p className="text-gray-700 font-mono">
                                            {new Date(selectedAnnouncement.startAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="font-medium text-gray-500">End Date</p>
                                        <p className="text-gray-700 font-mono">
                                            {new Date(selectedAnnouncement.endAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-2 text-right">
                                <span className="text-xs text-gray-400 tracking-wide font-mono">
                                    ID: {selectedAnnouncement.announcementId}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Announcement;
