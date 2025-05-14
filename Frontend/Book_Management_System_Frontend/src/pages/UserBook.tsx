import React, { useEffect, useState } from 'react';
import axiosInstance from '../service/axiosInstance';
import FilterPanel, { type Filters } from '../Components/FilterPanels';
import SortOptions, { type SortOption } from '../Components/SortOptions';
import ActiveFilters from '../Components/ActiveFilter';
import { Filter, X } from 'lucide-react';

interface Book {
  bookId: string;
  title: string;
  isbn: string;
  description: string;
  publicationDate: string;
  publisher: Publisher;
  genre: Genre;
  language: string;
  author: Author;
  format: string;
  price: number;
  stockCount: number;
  bookImagePath: string;
  publisherId: string;
  genreId: string;
  authorId: string;
  averageRating?: number;
  discount: {
    bookDiscounts: Discount[];
  };
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

interface Discount {
  bookDiscountId: string;
  bookId: string;
  discountPercentage: number;
  startAt: string;
  endAt: string;
}

interface Genre {
  genreId: string;
  name: string;
}

interface Author {
  authorId: string;
  firstName: string;
  lastName:string
}

interface Publisher {
  publisherId: string;
  name: string;
 
}

const UserBook: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [bookmarked, setBookmarked] = useState<{ [key: string]: boolean }>({});
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsError, setReviewsError] = useState<string | null>(null);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Filters>({
    authors: [],
    genres: [],
    priceRange: [0, 1000],
    ratings: null,
    languages: [],
    formats: [],
    publishers: [],
    availability: null
  });
  const [sortOption, setSortOption] = useState<SortOption>('title');
  
  // Maps for displaying names instead of IDs
  const [authorMap, setAuthorMap] = useState<Record<string, string>>({});
  const [genreMap, setGenreMap] = useState<Record<string, string>>({});

  const fetchBooks = async () => {
    try {
      const res = await axiosInstance.get('/Book/getAllBooks');
      setBooks(res.data);
      setFilteredBooks(res.data);
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

  const fetchGenres = async () => {
    try {
      const res = await axiosInstance.get('/Genre/getAllGenres');
      console.log("🚀 ~ fetchGenres ~ res:", res)
      setGenres(res.data);
      
      // Create genre map
      const map: Record<string, string> = {};
      res.data.forEach((genre: Genre) => {
        map[genre.genreId] = genre.name;
      });
      setGenreMap(map);
    } catch (error) {
      console.error('Failed to fetch genres:', error);
    }
  };

  const fetchAuthors = async () => {
    try {
      const res = await axiosInstance.get('/Author/getAllAuthors');
      setAuthors(res.data);
      
      // Create author map
      const map: Record<string, string> = {};
      res.data.forEach((author: Author) => {
        map[author.authorId] = author.firstName
        ;
      });
      setAuthorMap(map);
    } catch (error) {
      console.error('Failed to fetch authors:', error);
    }
  };

  const fetchReviews = async (bookId: string) => {
    try {
      setReviewsLoading(true);
      setReviewsError(null);
      const res = await axiosInstance.get<Review[]>(`/books/${bookId}/reviews`);
      setReviews(res.data);
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

  const handleFilterChange = (newFilters: Filters) => {
    setActiveFilters(newFilters);
  };

  const clearAllFilters = () => {
    setActiveFilters({
      authors: [],
      genres: [],
      priceRange: [0, 1000],
      ratings: null,
      languages: [],
      formats: [],
      publishers: [],
      availability: null
    });
  };

  const handleRemoveFilter = (filterType: string, value: string | number | boolean) => {
    if (filterType === 'authors') {
      setActiveFilters(prev => ({
        ...prev,
        authors: prev.authors.filter(id => id !== value)
      }));
    } else if (filterType === 'genres') {
      setActiveFilters(prev => ({
        ...prev,
        genres: prev.genres.filter(id => id !== value)
      }));
    } else if (filterType === 'languages') {
      setActiveFilters(prev => ({
        ...prev,
        languages: prev.languages.filter(lang => lang !== value)
      }));
    } else if (filterType === 'formats') {
      setActiveFilters(prev => ({
        ...prev,
        formats: prev.formats.filter(format => format !== value)
      }));
    } else if (filterType === 'publishers') {
      setActiveFilters(prev => ({
        ...prev,
        publishers: prev.publishers.filter(pub => pub !== value)
      }));
    } else if (filterType === 'ratings') {
      setActiveFilters(prev => ({
        ...prev,
        ratings: null
      }));
    } else if (filterType === 'priceRange') {
      setActiveFilters(prev => ({
        ...prev,
        priceRange: [0, 1000]
      }));
    } else if (filterType === 'availability') {
      setActiveFilters(prev => ({
        ...prev,
        availability: null
      }));
    }
  };

  const toggleFiltersPanel = () => {
    setShowFilters(prev => !prev);
  };

  useEffect(() => {
    fetchBooks();
    fetchBookmarks();
    fetchGenres();
    fetchAuthors();
  }, []);

  useEffect(() => {
    if (selectedBook) {
      fetchReviews(selectedBook.bookId);
    }
  }, [selectedBook]);

  // Apply filters and sorting
  useEffect(() => {
    let result = [...books];
    
    // Apply filters
    if (activeFilters.authors.length > 0) {
      result = result.filter(book => activeFilters.authors.includes(book.authorId));
    }
    
    if (activeFilters.genres.length > 0) {
      result = result.filter(book => activeFilters.genres.includes(book.genreId));
    }
    
    if (activeFilters.languages.length > 0) {
      result = result.filter(book => activeFilters.languages.includes(book.language));
    }
    
    if (activeFilters.formats.length > 0) {
      result = result.filter(book => activeFilters.formats.includes(book.format));
    }
    
    if (activeFilters.publishers.length > 0) {
      result = result.filter(book => activeFilters.publishers.includes(book.publisherId));
    }
    
    if (activeFilters.ratings !== null) {
      result = result.filter(book => 
        book.averageRating !== undefined && 
        book.averageRating >= activeFilters.ratings!
      );
    }
    
    if (activeFilters.availability !== null) {
      result = result.filter(book => 
        activeFilters.availability ? book.stockCount > 0 : book.stockCount === 0
      );
    }
    
    // Apply price range filter
    result = result.filter(book => 
      book.price >= activeFilters.priceRange[0] && 
      book.price <= activeFilters.priceRange[1]
    );
    
    // Apply sorting
    switch (sortOption) {
      case 'title':
        result = result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'publicationDate':
        result = result.sort((a, b) => new Date(b.publicationDate).getTime() - new Date(a.publicationDate).getTime());
        break;
      case 'price-asc':
        result = result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result = result.sort((a, b) => b.price - a.price);
        break;
      case 'popularity':
        // Assuming books with higher averageRating are more popular
        result = result.sort((a, b) => {
          const ratingA = a.averageRating || 0;
          const ratingB = b.averageRating || 0;
          return ratingB - ratingA;
        });
        break;
    }
    
    setFilteredBooks(result);
  }, [books, activeFilters, sortOption]);

  const getDiscountedPrice = (book: Book) => {
    const discount = book.discount.bookDiscounts[0];
    if (discount) {
      return book.price - (book.price * discount.discountPercentage) / 100;
    }
    return null;
  };

  return (
    <div className="bg-gradient-to-b from-slate-50 to-slate-100 min-h-screen">
      <header className="bg-white shadow-sm py-4 px-6 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-slate-800 text-center mb-4">Book Collection</h1>
          
          <div className="flex flex-col md:flex-row gap-4 justify-start items-center">
            <button 
              onClick={toggleFiltersPanel}
              className="md:hidden flex items-center justify-start gap-2 bg-white px-4 py-2 rounded-lg border border-slate-200 text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
            >
              <Filter size={18} />
              <span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
            </button>
            
            <div className="flex-1 flex flex-col md:flex-row gap-4 items-center w-full">
              <SortOptions 
                currentSort={sortOption}
                onSortChange={setSortOption}
              />
              
              <div className="flex-1">
                <ActiveFilters 
                  filters={activeFilters}
                  onRemoveFilter={handleRemoveFilter}
                  authorMap={authorMap}
                  genreMap={genreMap}
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className={`md:col-span-3 md:block ${showFilters ? 'block' : 'hidden'}`}>
            <FilterPanel 
              onFilterChange={handleFilterChange}
              clearAllFilters={clearAllFilters}
              activeFilters={activeFilters}
            />
          </div>
          
          <div className="md:col-span-9">
            <div className="mb-4 flex justify-between items-center">
              <p className="text-slate-600">
                Showing <span className="font-medium">{filteredBooks.length}</span> of <span className="font-medium">{books.length}</span> books
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBooks.length > 0 ? (
                filteredBooks.map(book => {
                  const discountedPrice = getDiscountedPrice(book);
                  
                  return (
                    <div key={book.bookId} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 relative group">
                      {book.discount.bookDiscounts.length > 0 && (
                        <div className="absolute top-4 right-4 bg-rose-600 text-white px-3 py-1 text-sm rounded-full z-10">
                          {book.discount.bookDiscounts[0].discountPercentage}% OFF
                        </div>
                      )}
                      
                      <div className="p-4" onClick={() => setSelectedBook(book)}>
                        {book.bookImagePath && (
                          <img
                            src={`http://localhost:5226/${book.bookImagePath}`}
                            alt={book.title}
                            className="w-full h-64 object-cover rounded-lg mb-4 group-hover:opacity-90 transition-opacity"
                          />
                        )}
                        <h3 className="text-xl font-semibold text-slate-800 truncate mb-2">{book.title}</h3>
                        <p className="text-slate-600 text-sm mb-4 italic truncate">{book.author.firstName} {book.author.lastName}</p>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            {discountedPrice !== null ? (
                              <div className="flex flex-col">
                                <span className="text-sm text-slate-400 line-through">${book.price.toFixed(2)}</span>
                                <span className="text-2xl font-bold text-emerald-600">${discountedPrice.toFixed(2)}</span>
                              </div>
                            ) : (
                              <span className="text-2xl font-bold text-emerald-600">${book.price.toFixed(2)}</span>
                            )}
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
                          } transition-colors duration-300`}
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
                  );
                })
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                    <Filter size={24} className="text-slate-400" />
                  </div>
                  <h3 className="text-xl font-medium text-slate-700 mb-2">No books found</h3>
                  <p className="text-slate-500 mb-6">Try adjusting your filters or search terms.</p>
                  <button
                    onClick={clearAllFilters}
                    className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {selectedBook && (
        <div className="fixed z-30 inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedBook(null)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 transition-colors bg-white shadow-sm z-10"
            >
              <X size={20} className="text-slate-600" />
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
                    <DetailItem label="Author" value={selectedBook.author.firstName} />
                    <DetailItem label="Genre" value={selectedBook.genre.name} />
                    <DetailItem label="Publisher" value={selectedBook.publisher.name} />
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
                    } transition-colors duration-300`}
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