import { useEffect, useState } from 'react';
import axiosInstance from '../service/axiosInstance';
import { toast } from 'react-toastify';

interface Genre {
  id: number;
  name: string;
}

const AdminGenres = () => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [newGenre, setNewGenre] = useState('');

  const fetchGenres = async () => {
    const res = await axiosInstance.get('/Genre/getAllGenres');
    setGenres(res.data);
  };

  const createGenre = async () => {
    if (!newGenre.trim()) return;
    const res = await axiosInstance.post('/Genre/create', { name: newGenre });
    setNewGenre('');
    toast.success(res.data.message);
    fetchGenres();
  };

  useEffect(() => {
    fetchGenres();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8 border-b-2 border-indigo-500 pb-4">
          Manage Genres
        </h1>

        {/* Add Genre Form */}
        <div className="mb-8 bg-gray-800 p-6 rounded-lg shadow-xl">
          <div className="flex gap-4">
            <input
              type="text"
              value={newGenre}
              onChange={(e) => setNewGenre(e.target.value)}
              placeholder="Enter new genre name"
              className="flex-grow bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400"
              onKeyPress={(e) => e.key === 'Enter' && createGenre()}
            />
            <button
              onClick={createGenre}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
            >
              Add Genre
            </button>
          </div>
        </div>

        {/* Genres List */}
        <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-700">
            <h2 className="text-xl font-semibold text-white">Existing Genres</h2>
          </div>
          <div className="divide-y divide-gray-700">
            {genres.map((genre) => (
              <div
                key={genre.id}
                className="px-6 py-4 hover:bg-gray-750 transition-colors duration-200"
              >
                <span className="text-gray-200 font-medium">{genre.name}</span>
              </div>
            ))}
          </div>
          {genres.length === 0 && (
            <div className="px-6 py-8 text-center">
              <p className="text-gray-400">No genres found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminGenres;