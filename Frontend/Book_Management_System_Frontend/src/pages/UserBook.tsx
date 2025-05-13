import React, { useEffect, useState } from 'react';
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
  publisherId: string;
  genreId: string;
  authorId: string;
  averageRating?: number;
}

interface Review {
  reviewId: string;
  rating: number;
  comment: string;
  createdAt: string;
  fullName: string;
  userId: string;
 
}

interface Bookmark {
  bookId: string;
}

const UserBook: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [bookmarked, setBookmarked] = useState<{ [key: string]: boolean }>({});
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsError, setReviewsError] = useState<string | null>(null);

  const fetchBooks = async () => {
    try {
      const res = await axiosInstance.get('/Book/getAllBooks');
      setBooks(res.data);
    } catch (err) {
      console.error('Failed to fetch books:', err);
    }
  };

  const fetchBookmarks = async () => {
    try {
      const res = await axiosInstance.get<Bookmark[]>('/BookMark/getBookmark');
      const bookmarkMap: { [key: string]: boolean } = {};
      res.data.forEach((bm) => {
        bookmarkMap[bm.bookId] = true;
      });
      setBookmarked(bookmarkMap);
    } catch (err) {
      console.error('Failed to fetch bookmarks:', err);
    }
  };

  const fetchReviews = async (bookId: string) => {
    try {
      setReviewsLoading(true);
      setReviewsError(null);
      const res = await axiosInstance.get<Review[]>(`/books/${bookId}/reviews`);
      setReviews(res.data);
      console.log("🚀 ~ fetchReviews ~ res:", res)
    } catch (err) {
      setReviewsError('Failed to load reviews');
    } finally {
      setReviewsLoading(false);
    }
  };

  const addToCart = async (bookId: string, quantity: number) => {
    try {
      await axiosInstance.post('/Cart/create', { bookId, quantity });
      setQuantities(prev => ({ ...prev, [bookId]: 1 }));
    } catch (err) {
      console.error('Failed to add to cart:', err);
    }
  };

  const toggleBookmark = async (bookId: string) => {
    try {
      await axiosInstance.post('/BookMark/toggle', { bookId });
      setBookmarked(prev => ({
        ...prev,
        [bookId]: !prev[bookId],
      }));
    } catch (error) {
      console.error('Failed to toggle bookmark:', error);
    }
  };

  const incrementQuantity = (bookId: string) => {
    setQuantities(prev => ({ ...prev, [bookId]: (prev[bookId] || 1) + 1 }));
  };

  const decrementQuantity = (bookId: string) => {
    setQuantities(prev => ({ ...prev, [bookId]: Math.max((prev[bookId] || 1) - 1, 1) }));
  };

  useEffect(() => {
    fetchBooks();
    fetchBookmarks();
  }, []);

  useEffect(() => {
    if (selectedBook) {
      fetchReviews(selectedBook.bookId);
    }
  }, [selectedBook]);

  return (
    <div className="bg-gradient-to-b from-slate-50 to-slate-100 min-h-screen p-8">
      <h1 className="text-4xl font-bold text-slate-800 mb-8 text-center">Book Collection</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {books.map(book => (
          <div key={book.bookId} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="p-4" onClick={() => setSelectedBook(book)}>
              {book.bookImagePath && (
                <img
                  src={`http://localhost:5226/${book.bookImagePath}`}
                  alt={book.title}
                  className="w-full h-64 object-cover rounded-lg mb-4"
                />
              )}
              <h3 className="text-xl font-semibold text-slate-800 truncate mb-2">{book.title}</h3>
              <p className="text-slate-600 text-sm mb-4 italic truncate">{book.authorFullName}</p>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-emerald-600">${book.price.toFixed(2)}</span>
                  {book.averageRating && (
                    <div className="flex items-center bg-emerald-100 px-2 py-1 rounded-full">
                      <span className="text-emerald-700 text-sm font-medium">
                        {book.averageRating.toFixed(1)}
                      </span>
                      <svg className="w-4 h-4 text-emerald-600 ml-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 bg-slate-100 rounded-full p-1">
                  <button
                    onClick={(e) => { e.stopPropagation(); decrementQuantity(book.bookId); }}
                    className="w-8 h-8 rounded-full bg-white shadow-sm text-emerald-600 hover:bg-emerald-50 transition-colors"
                  >
                    −
                  </button>
                  <span className="w-8 text-center">{quantities[book.bookId] || 1}</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); incrementQuantity(book.bookId); }}
                    className="w-8 h-8 rounded-full bg-white shadow-sm text-emerald-600 hover:bg-emerald-50 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleBookmark(book.bookId);
                }}
                className={`w-full mt-3 py-2 rounded-lg font-medium ${
                  bookmarked[book.bookId] ? 'bg-yellow-400 text-white' : 'bg-slate-200 text-slate-700'
                }`}
              >
                {bookmarked[book.bookId] ? 'Bookmarked' : 'Bookmark'}
              </button>

              <button
                onClick={(e) => { e.stopPropagation(); addToCart(book.bookId, quantities[book.bookId] || 1); }}
                className="w-full mt-3 bg-emerald-600 text-white py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedBook && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedBook(null)}
              className="sticky top-4 right-4 ml-auto p-2 rounded-full hover:bg-slate-100 transition-colors bg-white shadow-sm z-10"
            >
              <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="grid md:grid-cols-2 gap-8 p-8">
              <img
                src={`http://localhost:5226/${selectedBook.bookImagePath}`}
                alt={selectedBook.title}
                className="w-full h-96 object-cover rounded-xl"
              />
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-slate-800">{selectedBook.title}</h2>
                <p className="text-slate-600 text-lg">{selectedBook.description}</p>
                
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="space-y-2">
                    <DetailItem label="Author" value={selectedBook.authorFullName} />
                    <DetailItem label="Genre" value={selectedBook.genreName} />
                    <DetailItem label="Publisher" value={selectedBook.publisherName} />
                  </div>
                  <div className="space-y-2">
                    <DetailItem label="ISBN" value={selectedBook.isbn} />
                    <DetailItem label="Language" value={selectedBook.language} />
                    <DetailItem label="Stock" value={selectedBook.stockCount} />
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100">
                  <h3 className="text-xl font-semibold text-slate-800 mb-4">Customer Reviews</h3>
                  
                  {reviewsLoading ? (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
                    </div>
                  ) : reviewsError ? (
                    <p className="text-red-500 text-center">{reviewsError}</p>
                  ) : reviews.length === 0 ? (
                    <p className="text-slate-500 text-center">No reviews yet</p>
                  ) : (
                    <div className="space-y-6">
                      {reviews.map((review) => (
                        <div key={review.reviewId} className="border-b border-slate-100 pb-6 last:border-b-0">
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                              <span className="text-emerald-700 font-medium">
                                {review.fullName.charAt(0)}
                              </span>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h4 className="font-medium text-slate-800">{review.fullName}</h4>
                                <span className="text-sm text-slate-500">
                                  {new Date(review.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              <div className="flex items-center gap-1 mb-2">
                                {[...Array(5)].map((_, i) => (
                                  <svg
                                    key={i}
                                    className={`w-5 h-5 ${i < review.rating ? 'text-yellow-400' : 'text-slate-300'}`}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                ))}
                              </div>
                              <p className="text-slate-700">{review.comment}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="sticky bottom-0 bg-white pt-6">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold text-emerald-600">${selectedBook.price.toFixed(2)}</span>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 bg-slate-100 rounded-full p-1">
                        <button
                          onClick={() => decrementQuantity(selectedBook.bookId)}
                          className="w-8 h-8 rounded-full bg-white shadow-sm text-emerald-600 hover:bg-emerald-50"
                        >
                          −
                        </button>
                        <span className="w-8 text-center">{quantities[selectedBook.bookId] || 1}</span>
                        <button
                          onClick={() => incrementQuantity(selectedBook.bookId)}
                          className="w-8 h-8 rounded-full bg-white shadow-sm text-emerald-600 hover:bg-emerald-50"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => {
                          addToCart(selectedBook.bookId, quantities[selectedBook.bookId] || 1);
                          setSelectedBook(null);
                        }}
                        className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleBookmark(selectedBook.bookId)}
                    className={`w-full mt-4 py-2 rounded-lg font-medium ${
                      bookmarked[selectedBook.bookId] ? 'bg-yellow-400 text-white' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {bookmarked[selectedBook.bookId] ? 'Bookmarked' : 'Bookmark'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const DetailItem: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
  <div className="flex justify-between items-center border-b border-slate-100 pb-2">
    <span className="text-slate-500 font-medium">{label}:</span>
    <span className="text-slate-800">{value}</span>
  </div>
);

export default UserBook;