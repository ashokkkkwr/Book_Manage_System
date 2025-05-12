import { useState } from 'react';
import type { Book } from '../types/index';
import { BookCard } from './BookCard';
import { List, Grid, SlidersHorizontal } from 'lucide-react';
import { FilterPanel } from './FilterPanel';

interface BookGridProps {
  books: Book[];
  bookmarks?: string[];
  isLoading?: boolean;
}

export const BookGrid = ({ books, bookmarks = [], isLoading = false }: BookGridProps) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {Array.from({ length: 10 }).map((_, index) => (
          <div key={index} className="card animate-pulse">
            <div className="bg-gray-300 dark:bg-gray-700 aspect-[2/3]"></div>
            <div className="p-4 space-y-3">
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
              <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-2/3"></div>
              <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-600 dark:text-gray-400">No books found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Showing {books.length} result{books.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="btn btn-outline flex items-center gap-2 sm:px-3"
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span className="hidden sm:inline">Filters</span>
          </button>
          <div className="flex border dark:border-gray-600 rounded-md overflow-hidden">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-gray-100 dark:bg-gray-700' : 'bg-white dark:bg-gray-800'}`}
            >
              <Grid className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-gray-100 dark:bg-gray-700' : 'bg-white dark:bg-gray-800'}`}
            >
              <List className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      {isFilterOpen && <FilterPanel onClose={() => setIsFilterOpen(false)} />}

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {books.map(book => (
            <BookCard 
              key={book.id} 
              book={book} 
              isBookmarked={bookmarks.includes(book.id)}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {books.map(book => (
            <div key={book.id} className="card flex flex-row overflow-hidden">
              <div className="w-1/3 sm:w-1/4 md:w-1/5">
                <img 
                  src={book.coverImage || 'https://images.pexels.com/photos/1907785/pexels-photo-1907785.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'} 
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 flex-1">
                <h3 className="font-medium text-gray-900 dark:text-white">{book.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{book.authorName}</p>
                <div className="flex items-center mt-2">
                  <div className="flex items-center">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                      {book.rating?.toFixed(1) || 'N/A'} ★
                    </span>
                  </div>
                  <span className="ml-auto font-medium text-indigo-600 dark:text-indigo-400">${book.price.toFixed(2)}</span>
                </div>
                <div className="mt-4 flex space-x-2">
                  <button className="btn btn-primary">View Details</button>
                  <button className="btn btn-outline">Add to Cart</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};