import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookmarkPlus, BookmarkCheck, ShoppingCart, Star } from 'lucide-react';
import type { Book } from '../types/index';
import { toast } from 'react-toastify';

interface BookCardProps {
  book: Book;
  isBookmarked?: boolean;
}

export const BookCard = ({ book, isBookmarked = false }: BookCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [bookmarked, setBookmarked] = useState(isBookmarked);
  
  const placeholderImage = 'https://images.pexels.com/photos/1907785/pexels-photo-1907785.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2';

  const handleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    

    
    try {
      setBookmarked(!bookmarked);
      toast.success(bookmarked ? 'Bookmark removed' : 'Book bookmarked');
    } catch (error) {
      toast.error('Failed to update bookmark');
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <Link 
      to={`/books/${book.id}`}
      className="card group h-full flex flex-col transform hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden aspect-[2/3]">
        <img 
          src={book.coverImage || placeholderImage} 
          alt={book.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-0 right-0 p-2">
          <button 
            onClick={handleBookmark}
            className="p-1.5 bg-white dark:bg-gray-800 rounded-full shadow text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            {bookmarked ? (
              <BookmarkCheck className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            ) : (
              <BookmarkPlus className="h-5 w-5" />
            )}
          </button>
        </div>
        <div className={`absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <button
            onClick={handleAddToCart}
            className="w-full btn btn-primary text-sm flex items-center justify-center gap-2"
          >
            <ShoppingCart className="h-4 w-4" />
            Add to Cart
          </button>
        </div>
      </div>
      <div className="p-4 flex-grow flex flex-col">
        <div className="flex items-start justify-between mb-1">
          <h3 className="font-medium text-gray-900 dark:text-white line-clamp-2 leading-tight">{book.title}</h3>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{book.authorName}</p>
        <div className="flex items-center mt-auto">
          <div className="flex items-center">
            <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
            <span className="ml-1 text-sm font-medium">{book.rating?.toFixed(1) || 'N/A'}</span>
          </div>
          <span className="ml-auto font-medium text-indigo-600 dark:text-indigo-400">${book.price.toFixed(2)}</span>
        </div>
      </div>
    </Link>
  );
};