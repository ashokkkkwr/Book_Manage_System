import React, { useEffect, useState } from 'react';
import BookForm from '../components/BookForm';
import { Plus } from 'lucide-react';
import axiosInstance from '../service/axiosInstance';
import EditBookForm from '../components/EditBook';

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
const BookList: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editForm, setEditForm] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book>();

  const fetchBooks = async () => {
    try {
      const res = await axiosInstance.get('/Book/getAllBooks');
      console.log("🚀 ~ fetchBooks ~ res:", res)
      setBooks(res.data);
    } catch (err) {
      console.error('Failed to fetch books:', err);
    }
  };

  const handleDelete = async (bookId: string) => {
    try {
      await axiosInstance.delete(`/Book/deleteBook/${bookId}`);
      fetchBooks();
    } catch (err) {
      console.error('Failed to delete book:', err);
      alert("Failed to delete the book.");
    }
  };

  useEffect(() => { fetchBooks(); }, []);

  const handleAddClick = () => {
    setSelectedBook(undefined); 
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setSelectedBook(undefined);
    fetchBooks();
  };

  return (
    <div className="bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Book Management</h1>
          <button
            onClick={handleAddClick}
            className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2"
          >
            <Plus size={20} />
            Add Book
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {books?.map(book => (
            <div key={book.bookId} className="bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="p-4">
                {book.bookImagePath && (
                  <img
                    src={`http://localhost:5226/${book.bookImagePath}`}
                    alt={book.title}
                    className="w-full h-64 object-cover rounded-lg mb-4"
                  />
                )}
                <h3 className="text-xl font-semibold text-slate-800 dark:text-white truncate">{book.title}</h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm mb-4 italic truncate">{book.authorFullName}</p>
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <DetailItem label="Price" value={`$${book.price.toFixed(2)}`} />
                  <DetailItem label="Stock" value={book.stockCount} />
                  <DetailItem label="Genre" value={book.genreName} />
                  <DetailItem label="Publisher" value={book.publisherName} />
                  <DetailItem label="ISBN" value={book.isbn} />
                  <DetailItem label="Language" value={book.language} />
                </div>

                <div className="flex justify-end gap-2 mt-4">
                  <button
                    onClick={() => {
                      if (confirm("Are you sure you want to delete this book?")) {
                        handleDelete(book.bookId);
                      }
                    }}
                    className="px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => {
                      setSelectedBook(book);
                      setEditForm(true);
                    }}
                    className="px-4 py-2 bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg transition-colors"
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {(showForm || editForm) && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-3xl w-full shadow-2xl">
            <div className="p-8">
              {showForm && (
                <BookForm
                  onSuccess={handleFormClose}
                  onCancel={handleFormClose}
                />
              )}
              {editForm && (
                <EditBookForm
                  book={selectedBook!}
                  onSuccess={() => {
                    setEditForm(false);
                    fetchBooks();
                  }}
                  onCancel={() => setEditForm(false)}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const DetailItem: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
  <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700/30 rounded-lg">
    <span className="text-slate-500 dark:text-slate-400 font-medium">{label}:</span>
    <span className="text-slate-800 dark:text-slate-200">{value}</span>
  </div>
);

export default BookList;