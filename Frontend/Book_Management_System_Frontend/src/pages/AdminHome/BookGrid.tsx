import React from 'react';
import type { Book } from '../../types/BookTypes';
import BookCard from './BookCard';
import EmptyState from './EmptyState';

interface BookGridProps {
  books: Book[];
  searchQuery: string;
}

const BookGrid: React.FC<BookGridProps> = ({ books, searchQuery }) => {
  if (books.length === 0) {
    return <EmptyState searchQuery={searchQuery} />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8 animate-fadeIn">
      {books.map(book => (
        <BookCard key={book.bookId} book={book} />
      ))}
    </div>
  );
};

export default BookGrid;