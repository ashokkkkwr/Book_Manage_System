import { useState, useEffect } from 'react';
import { SearchX } from 'lucide-react';
import axiosInstance from '../service/axiosInstance';

interface Book {
  bookId: string;
  title: string;
  isbn: string;
  description: string;
  publicationDate: string;
  publisherName: string;
  genreName: string;
  language: string;
  authorFullName: string;
  format: string;
  price: number;
  stockCount: number;
  bookImagePath: string;
  publisher: Publisher;
  genre: Genre;
  author: Author;
}

interface Author{
  authorId:string;
  firstName:string;
  lastName:string;
}
interface Genre{
  genreId:string;
  name:string;
}
interface Publisher{
  publisherId:string;
  name:string;

}
const AdminHome = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axiosInstance.get('/Book/getAllBooks');
        setBooks(res.data);
        setIsLoading(false);
      } catch (err) {
        console.error('Failed to fetch books:', err);
        setError('Failed to load books.');
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
      book.author.firstName.toLowerCase().includes(query) ||
      book.genre.name?.toLowerCase().includes(query) ||
      book.publisher.name?.toLowerCase().includes(query)
    );
  });

  if (isLoading) return <div className="text-center py-12">Loading...</div>;

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 btn btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-200 pb-16">
      {/* Hero Section */}
      <section className="relative bg-indigo-600 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-indigo-500 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1370298/pexels-photo-1370298.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')] bg-cover bg-center opacity-20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 slide-up">
              Discover Your Next Favorite Book
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto text-indigo-100 mb-8 slide-up" style={{ animationDelay: '100ms' }}>
              Explore our vast collection of books across all genres
            </p>
            <div className="max-w-xl mx-auto slide-up" style={{ animationDelay: '200ms' }}>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by title, author, or genre..."
                  className="w-full px-5 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-white text-gray-900 shadow-lg"
                />
                <button
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-indigo-800 text-white p-2 rounded-full hover:bg-indigo-700 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {searchQuery ? 'Search Results' : 'Browse Our Collection'}
          </h2>
        </div>

        {filteredBooks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBooks.map(book => (
              <div key={book.bookId} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                {book.bookImagePath && (
                  <img
                    src={`http://localhost:5226/${book.bookImagePath}`}
                    alt={book.title}
                    className="w-full h-64 object-cover rounded-lg mb-4"
                  />
                )}
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{book.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">Author: {book.author.firstName} {book.author.lastName}</p>
                <p className="text-gray-600 dark:text-gray-400">Genre: {book.genre.name}</p>
                <p className="text-gray-600 dark:text-gray-400">Publisher: {book.publisher.name}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <SearchX className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No books found</h3>
            <p className="text-gray-600 dark:text-gray-400">
              We couldn't find any books matching your search criteria.
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="mt-4 btn btn-outline"
              >
                Clear Search
              </button>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminHome;
