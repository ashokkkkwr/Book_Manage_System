import React, { useState, useEffect } from 'react';
import axiosInstance from '../../service/axiosInstance';
import type{ Book } from '../../types/BookTypes';
import HeroSection from './HeroSection';
import BookGrid from './BookGrid';
import LoadingState from './LoadingState';
import ErrorState from './ErrorState';

const AdminHome: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchBooks = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const res = await axiosInstance.get('/Book/getAllBooks');
      setBooks(res.data);
    } catch (err) {
      console.error('Failed to fetch books:', err);
      setError('Failed to load books. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const filteredBooks = books?.filter(book => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      book.title.toLowerCase().includes(query) ||
      book.author.firstName.toLowerCase().includes(query) ||
      book.author.lastName.toLowerCase().includes(query) ||
      book.genre.name?.toLowerCase().includes(query) ||
      book.publisher.name?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-200">
      <HeroSection searchQuery={searchQuery} onSearchChange={handleSearchChange} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-20">
        <header className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {searchQuery ? 'Search Results' : 'Library Collection'}
            </h2>
            {searchQuery && (
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Found {filteredBooks.length} {filteredBooks.length === 1 ? 'book' : 'books'} matching "{searchQuery}"
              </p>
            )}
          </div>
          
          {books.length > 0 && (
            <button 
              onClick={() => setSearchQuery('')}
              className={`mt-3 sm:mt-0 text-sm font-medium ${searchQuery ? 'text-indigo-600 hover:text-indigo-800' : 'text-gray-400 cursor-default'}`}
              disabled={!searchQuery}
            >
              {searchQuery ? 'Clear filters' : ''}
            </button>
          )}
        </header>

        {isLoading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState message={error} onRetry={fetchBooks} />
        ) : (
          <BookGrid 
            books={filteredBooks} 
            searchQuery={searchQuery} 
          />
        )}
      </main>
    </div>
  );
};

export default AdminHome;