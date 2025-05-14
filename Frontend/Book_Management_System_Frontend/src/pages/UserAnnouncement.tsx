import { useEffect, useState } from 'react';
import axiosInstance from '../service/axiosInstance';

type Announcement = {
    announcementId: string;
    title: string;
    message: string;
    startAt: string;
    endAt: string;
};

const UserAnnouncement = () => {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [activeOnly, setActiveOnly] = useState(false);

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
        <div className="bg-gray-200 text-black min-h-screen p-8">
            <h1 className="text-2xl font-bold mb-6">Announcements</h1>
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
                        className="bg-gray-300 p-4 rounded cursor-pointer hover:bg-gray-500"
                        onClick={() => handleAnnouncementClick(a.announcementId)}
                    >
                        <h2 className="text-xl font-semibold">{a.title}</h2>
                        <p>{a.message}</p>
                        <p className="text-sm ">
                            {new Date(a.startAt).toLocaleString()} - {new Date(a.endAt).toLocaleString()}
                        </p>
                
                    </div>
                ))}
            </div>

            {selectedAnnouncement && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 transition-all duration-300">
                    <div className="relative bg-gradient-to-br from-white to-gray-50 text-gray-800 rounded-xl shadow-2xl p-8 w-[95%] max-w-2xl animate-pop-in">
                        <button
                            className="absolute top-5 right-5  hover:text-gray-700 transition-colors duration-200 p-1 -m-1"
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
                                <span className="text-xs  tracking-wide font-mono">
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

export default UserAnnouncement;
