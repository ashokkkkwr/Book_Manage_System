import { useState, useEffect } from 'react';
import type { Book } from '../types/index';
import { BookGrid } from '../components/BookGrid';
import { SearchX, Sparkles } from 'lucide-react';

const Home = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setIsLoading(true);
        // Add your actual API call here
        // const res = await axiosInstance.get('/books');
        // setBooks(res.data);
      } catch (err) {
        setError('Failed to fetch books. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const filteredBooks = books?.filter(book => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      book.title.toLowerCase().includes(query) ||
      book.authorName.toLowerCase().includes(query) ||
      book.genreName?.toLowerCase().includes(query) ||
      book.publisherName?.toLowerCase().includes(query)
    );
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-emerald-100 animate-pulse"></div>
            <Sparkles className="absolute -top-2 -right-2 w-5 h-5 text-emerald-500 animate-pulse" />
          </div>
          <span className="text-slate-600">Curating your library...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md p-8">
          <div className="inline-block p-4 bg-red-100 rounded-full mb-6">
            <SearchX className="w-12 h-12 text-red-500" />
          </div>
          <h2 className="text-2xl font-semibold text-slate-800 mb-4">Loading Error</h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-slate-50 pt-24 pb-32 overflow-hidden border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center space-y-8">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-slate-900">
            Bibliofile
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Explore our collection of timeless and contemporary works
            </p>
            <div className="max-w-2xl mx-auto">
              <div className="relative group">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search across our collection..."
                  className="w-full px-6 py-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-900 placeholder:text-slate-400 shadow-sm transition-all duration-200"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <kbd className="px-2 py-1 text-xs bg-slate-100 rounded-md text-slate-600">⌘K</kbd>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200">
          <div className="px-6 py-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-semibold text-slate-900">
                {searchQuery ? `Results for "${searchQuery}"` : 'Featured Collection'}
              </h2>
              <span className="text-slate-500 text-sm">
                {filteredBooks.length} titles
              </span>
            </div>

            {filteredBooks.length > 0 ? (
              <BookGrid books={filteredBooks} />
            ) : (
              <div className="py-16 text-center">
                <div className="inline-block p-6 bg-slate-100 rounded-2xl mb-6">
                  <svg className="w-24 h-24 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-slate-800 mb-3">
                  No matches found
                </h3>
                <p className="text-slate-600 mb-6 max-w-md mx-auto">
                  Try adjusting your search terms or explore our recommendations
                </p>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="inline-flex items-center bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Show All Books
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Accent Elements */}
      <div className="absolute top-0 left-0 w-full h-[600px] pointer-events-none">
        <div className="absolute top-48 left-[10%] w-64 h-64 bg-emerald-100 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute top-32 right-[15%] w-48 h-48 bg-cyan-100 rounded-full blur-3xl opacity-50"></div>
      </div>
    </div>
  );
};

export default Home;