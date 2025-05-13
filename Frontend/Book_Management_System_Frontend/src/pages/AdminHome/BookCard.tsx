import React from 'react';
import type { Book } from '../../types/BookTypes';
import { BookOpen, DollarSign, Hash } from 'lucide-react';

interface BookCardProps {
  book: Book;
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const imageUrl = book.bookImagePath 
    ? `http://localhost:5226/${book.bookImagePath}`
    : 'https://images.pexels.com/photos/1370295/pexels-photo-1370295.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2';
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }).format(date);
  };

  return (
    <div className="group bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1">
      <div className="relative h-64 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"></div>
        <img
          src={imageUrl}
          alt={book.title}
          className="w-full h-full object-cover object-center transition-transform duration-700 ease-in-out group-hover:scale-110"
        />
        <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
          <span className="px-2 py-1 bg-indigo-600 text-white text-xs font-medium rounded-full">
            {book.genre.name}
          </span>
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">
          {book.title}
        </h3>
        <p className="text-gray-700 dark:text-gray-300 mb-2 flex items-center">
          <BookOpen size={16} className="mr-2 text-indigo-500" />
          <span>
            {book.author.firstName} {book.author.lastName}
          </span>
        </p>
        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
            <Hash size={14} className="mr-1" />
            <span>{book.stockCount} in stock</span>
          </div>
          <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm font-semibold">
            <DollarSign size={14} className="mr-1" />
            <span>${book.price.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCard;