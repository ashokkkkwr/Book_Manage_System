import React, { useEffect, useState } from 'react';
import axiosInstance from '../service/axiosInstance';
import { Bookmark, X } from 'lucide-react';

interface BookmarkType {
  bookmarkId: string;
  book: {
    bookId: string;
    title: string;
    price: number;
    bookImagePath: string;
    averageRating?: number;
  };
}

const Bookmarks: React.FC = () => {
  const [bookmarks, setBookmarks] = useState<BookmarkType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookmarks = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/BookMark/getBookmark');
      console.log("🚀 ~ fetchBookmarks ~ res:", res)
      setBookmarks(res.data);
    } catch (err) {
      setError('Failed to load bookmarks.');
    } finally {
      setLoading(false);
    }
  };

  const removeBookmark = async (bookId: string) => {
    try {
      await axiosInstance.post('/BookMark/toggle', { bookId });
      fetchBookmarks();
    } catch (error) {
      console.error('Failed to remove bookmark:', error);
    }
  };

  const addToCart = async (bookId: string) => {
    try {
      await axiosInstance.post('/Cart/create', { bookId, quantity: 1 });
    } catch (err) {
      console.error('Failed to add to cart:', err);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-center">
          <p className="text-xl font-semibold mb-2">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (bookmarks.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bookmark size={24} className="text-slate-400" />
          </div>
          <h2 className="text-2xl font-semibold text-slate-800 mb-2">No bookmarks yet</h2>
          <p className="text-slate-600">Start adding books to your bookmarks!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-800 text-center mb-8">My Bookmarks</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {bookmarks.map((bookmark) => (
            <div 
              key={bookmark.bookmarkId}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
            >
              <div className="relative">
                <img
                  src={`http://localhost:5226/${bookmark.book.bookImagePath}`}
                  alt={bookmark.book.title}
                  className="w-full h-48 object-cover"
                />
                <button
                  onClick={() => removeBookmark(bookmark.book.bookId)}
                  className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-slate-50 transition-colors"
                >
                  <X size={16} className="text-slate-600" />
                </button>
              </div>
              
              <div className="p-4">
                <h3 className="text-lg font-semibold text-slate-800 mb-1 truncate">
                  {bookmark.book.title}
                </h3>
               
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-emerald-600">
                      ${bookmark.book.price.toFixed(2)}
                    </span>
                    {bookmark.book.averageRating && (
                      <div className="flex items-center bg-emerald-50 px-2 py-1 rounded-full">
                        <span className="text-emerald-700 text-sm">
                          {bookmark.book.averageRating.toFixed(1)}★
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <button
                    onClick={() => addToCart(bookmark.book.bookId)}
                    className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Bookmarks;