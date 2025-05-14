import React, { useEffect, useState } from 'react';
import BookForm from '../Components/BookForm';
import { Plus } from 'lucide-react';
import axiosInstance from '../service/axiosInstance';
import EditBookForm from '../Components/EditBook';

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
  stockCount: number;
  bookImagePath: string;
  publisher: Publisher;
  genre: Genre;
  author: Author;
  price: number;
  discount: {
    bookDiscounts: Discount[];
  };
}

interface Author {
  authorId: string;
  firstName: string;
  lastName: string;
}

interface Genre {
  genreId: string;
  name: string;
}

interface Publisher {
  publisherId: string;
  name: string;
}

interface Discount {
  bookDiscountId: string;
  bookId: string;
  discountPercentage: number;
  startAt: string;
  endAt: string;
}

const BookList: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [bookId, setBookId] = useState('');
  const [editForm, setEditForm] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book>();
  const [showDiscountForm, setShowDiscountForm] = useState(false);
  const [discountForm, setDiscountForm] = useState({
    discountPercentage: '',
    startAt: '',
    endAt: '',
  });

  const fetchBooks = async () => {
    try {
      const res = await axiosInstance.get('/Book/getAllBooks');
      setBooks(res.data);
    } catch (err) {
      console.error('Failed to fetch books:', err);
    }
  };

  const handleDelete = async (bookId: string) => {
    try {
      await axiosInstance.delete(`/Book/deleteBook/${bookId}`);
      fetchBooks();
    } catch {
      alert("Failed to delete the book.");
    }
  };

  const openDiscountForm = (bookId: string) => {
    setBookId(bookId);
    setDiscountForm({ discountPercentage: '', startAt: '', endAt: '' });
    setShowDiscountForm(true);
  };

  const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDiscountForm(prev => ({ ...prev, [name]: value }));
  };

  const handleDiscountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { discountPercentage, startAt, endAt } = discountForm;
  
    if (!discountPercentage || !startAt || !endAt) {
      alert("All fields are required.");
      return;
    }
  
    try {
      const formData = new FormData();
      formData.append('BookId', bookId);
      formData.append('DiscountPercentage', discountPercentage);
      formData.append('OnSale', 'true');
      formData.append('StartAt', startAt);
      formData.append('EndAt', endAt);
  
      await axiosInstance.post('/Book/addDiscount', formData);
      setShowDiscountForm(false);
      fetchBooks();
    } catch (err) {
      console.error("Error adding discount:", err);
      alert("Error adding discount.");
    }
  };

  const handleDeleteDiscount = async (discountId: string) => {
    try {
     const res =  await axiosInstance.delete(`/Book/discount/delete/${discountId}`);
      fetchBooks();
    } catch(error) {
      console.log("🚀 ~ handleDeleteDiscount ~ error:", error)
    }
  };

  useEffect(() => { fetchBooks(); }, []);

  const handleFormClose = () => {
    setShowForm(false);
    setSelectedBook(undefined);
    fetchBooks();
  };

  return (
    <div className="p-8 min-h-screen bg-slate-100 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Book Management</h1>
          <button
            onClick={() => setShowForm(true)}
            className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-700 transition flex items-center gap-2"
          >
            <Plus size={20} /> Add Book
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map(book => (
            <div key={book.bookId} className="relative bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4">
              {book.discount.bookDiscounts.map((discount) => (
                <div 
                  key={discount.bookDiscountId}
                  className="absolute top-4 right-4 bg-rose-600 text-white px-3 py-1 text-sm rounded-full z-10"
                >
                  {discount.discountPercentage}% OFF
                </div>
              ))}

              {book.bookImagePath && (
                <img
                  src={`http://localhost:5226/${book.bookImagePath}`}
                  alt={book.title}
                  className="w-full h-64 object-cover rounded-lg mb-4"
                />
              )}
              <h3 className="text-xl font-semibold truncate">{book.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 italic truncate">
                {book.authorFullName}
              </p>

              <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                <div className="col-span-2">
                  <div className="flex justify-between px-2  bg-slate-50 dark:bg-slate-700/40 rounded-md">
                    <span className="text-slate-500 dark:text-slate-300 text-sm">Price:</span>
                    <div className="flex flex-col items-end">
                      <span className={`${book.discount.bookDiscounts.length > 0 ? 'line-through text-slate-400 dark:text-slate-500' : ''}`}>
                        ${book.price?.toFixed(2)}
                      </span>
                      {book.discount.bookDiscounts.map(discount => (
                        <span
                          key={discount.bookDiscountId}
                          className="text-emerald-600 dark:text-emerald-400"
                        >
                          ${(book.price * (1 - discount.discountPercentage / 100)).toFixed(2)}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <DetailItem label="Stock" value={book.stockCount} />
                <DetailItem label="Genre" value={book.genre.name} />
                <DetailItem label="Publisher" value={book.publisher.name} />
                <DetailItem label="Author" value={book.author.firstName} />
              </div>

              <div className="flex flex-wrap justify-end gap-2 mt-4">
                {book.discount.bookDiscounts.length === 0 ? (
                  <button
                    onClick={() => openDiscountForm(book.bookId)}
                    className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg"
                  >
                    Add Discount
                  </button>
                ) : (
                  book.discount.bookDiscounts.map(discount => (
                    <button
                      key={discount.bookDiscountId}
                      onClick={() => handleDeleteDiscount(discount.bookDiscountId)}
                      className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg"
                    >
                      Delete Discount
                    </button>
                  ))
                )}
                <button
                  onClick={() => {
                    if (confirm("Are you sure to delete this book?")) handleDelete(book.bookId);
                  }}
                  className="px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                >
                  Delete
                </button>
                <button
                  onClick={() => {
                    setSelectedBook(book);
                    setEditForm(true);
                  }}
                  className="px-4 py-2 bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg"
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Book Form Modal */}
      {(showForm || editForm) && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-3xl w-full">
            <div className="p-8">
              {showForm && <BookForm onSuccess={handleFormClose} onCancel={handleFormClose} />}
              {editForm && selectedBook && (
                <EditBookForm
                  book={selectedBook}
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

      {/* Discount Form Modal */}
      {showDiscountForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <form onSubmit={handleDiscountSubmit} className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-xl w-full max-w-md space-y-4">
            <h2 className="text-xl font-semibold">Add Discount</h2>
            <div>
              <label className="block text-sm font-medium mb-1">Discount Percentage</label>
              <input
                type="number"
                name="discountPercentage"
                value={discountForm.discountPercentage}
                onChange={handleDiscountChange}
                className="w-full px-4 py-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Start Date</label>
              <input
                type="datetime-local"
                name="startAt"
                value={discountForm.startAt}
                onChange={handleDiscountChange}
                className="w-full px-4 py-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">End Date</label>
              <input
                type="datetime-local"
                name="endAt"
                value={discountForm.endAt}
                onChange={handleDiscountChange}
                className="w-full px-4 py-2 border rounded"
                required
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowDiscountForm(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

const DetailItem: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
  <div className="flex justify-between px-2 py-1 bg-slate-50 dark:bg-slate-700/40 rounded-md">
    <span className="text-slate-500 dark:text-slate-300 text-sm">{label}:</span>
    <span className="text-slate-700 dark:text-white text-sm">{value}</span>
  </div>
);

export default BookList;
