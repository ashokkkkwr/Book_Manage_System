import { useEffect, useState } from 'react';
import axiosInstance from '../service/axiosInstance';
import { toast } from 'react-toastify';

interface Publisher {
  id: number;
  name: string;
  website: string;
  description: string;
}

const AdminPublishers = () => {
  const [publishers, setPublishers] = useState<Publisher[]>([]);
  const [newPublisher, setNewPublisher] = useState('');
  const [website, setWebsite] = useState('');
  const [description, setDescription] = useState('');

  const fetchPublishers = async () => {
    const res = await axiosInstance.get('/Publisher/getAllPublishers');
    setPublishers(res.data);
  };

  const createPublisher = async () => {
    if (!newPublisher.trim()) return;
    const res = await axiosInstance.post('/Publisher/create', { 
      name: newPublisher, 
      website,
      description
    });
    toast.success(res.data.message);
    setNewPublisher('');
    setWebsite('');
    setDescription('');
    fetchPublishers();
  };

  useEffect(() => {
    fetchPublishers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8 border-b-2 border-indigo-500 pb-4">
          Manage Publishers
        </h1>

        {/* Add Publisher Form */}
        <div className="mb-8 bg-gray-800 p-6 rounded-lg shadow-xl">
          <div className="flex flex-col gap-4">
            <input
              type="text"
              value={newPublisher}
              onChange={(e) => setNewPublisher(e.target.value)}
              placeholder="Publisher Name"
              className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400"
              onKeyPress={(e) => e.key === 'Enter' && createPublisher()}
            />
            <input
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="Website URL"
              className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400"
              onKeyPress={(e) => e.key === 'Enter' && createPublisher()}
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400 resize-none"
              rows={3}
            />
            <button
              onClick={createPublisher}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 self-end"
            >
              Add Publisher
            </button>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-700">
            <h2 className="text-xl font-semibold text-white">Existing Publishers</h2>
          </div>
          <div className="divide-y divide-gray-700">
            {publishers.map((publisher) => (
              <div
                key={publisher.id}
                className="px-6 py-4 hover:bg-gray-750 transition-colors duration-200"
              >
                <div className="flex flex-col gap-2">
                  <h3 className="text-lg font-medium text-white">Name: {publisher.name}</h3>
                  {publisher.website && (
                    <a 
                      href={publisher.website} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-400 hover:text-indigo-300 text-sm"
                    >
                     Website: {publisher.website}
                    </a>
                  )}
                  {publisher.description && (
                    <p className="text-gray-400 text-sm">Description: {publisher.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
          {publishers.length === 0 && (
            <div className="px-6 py-8 text-center">
              <p className="text-gray-400">No publishers found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPublishers;