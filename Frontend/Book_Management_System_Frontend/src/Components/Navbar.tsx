import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { BookOpen, ShoppingCart, User, Menu, X, Moon, Sun, Search } from 'lucide-react';
import axiosInstance from '../service/axiosInstance';
import debounce from 'lodash.debounce';
import  NotificationListener from './NotificaitonDropdown';

interface User {
  fullName: string;
  email: string;
  roles: string;
}

export const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [user, setUser] = useState<User>();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(() =>
    localStorage.theme === 'dark' ||
    (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
  );

  const isAuthenticated = !!localStorage.getItem('token');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setIsMenuOpen(false);
    setIsSearchOpen(false);
  }, [location.pathname]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
    }
  };

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, []);

  const getUser = async () => {
    try {
      const res = await axiosInstance.get("/abc/getuser");
      setUser(res.data);
    } catch (error: any) {
      console.error("Error fetching user:", error);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate('/login');
  };

  const searchBooks = async (query: string) => {
    try {
      const res = await axiosInstance.get(`/book/search?title=${query}`);
      setSearchResults(res.data);
    } catch (error) {
      console.error("Error searching books:", error);
    }
  };

  const debouncedSearch = debounce((value: string) => {
    if (value.trim().length > 0) searchBooks(value);
    else setSearchResults([]);
  }, 300);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  const handleClick = (bookId: string) => {
    navigate("/user/book-details", { state: { bookId } });
    setSearchResults([]);
  };

  return (
    <header className="shadow-sm sticky top-0 z-40 bg-white dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <BookOpen className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
              <span className="ml-2 text-xl text-black dark:text-white font-bold">Bibliofile</span>
            </Link>
            <nav className="hidden md:ml-6 md:flex md:space-x-8">
              <Link to="/user/" className="px-3 py-2 text-sm font-medium text-black dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400">Home</Link>
              <Link to="/user/books" className="px-3 py-2 text-sm font-medium text-black dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400">Book</Link>
              <Link to="/user/order" className="px-3 py-2 text-sm font-medium text-black dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400">Orders</Link>
              <Link to="/user/announcement" className="px-3 py-2 text-sm font-medium text-black dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400">Announcement</Link>
              <Link to="/user/bookmark" className="px-3 py-2 text-sm font-medium text-black dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400">Bookmark</Link>
            </nav>
          </div>

          <div className="hidden md:flex items-center space-x-4 relative">
            <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="p-2 rounded-full text-black dark:text-white hover:text-indigo-400">
              <Search className="h-5 w-5" />
            </button>
            <NotificationListener />
            <button onClick={toggleDarkMode} className="p-2 rounded-full text-black dark:text-white hover:text-indigo-400">
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <Link to="/user/cart" className="relative p-2 rounded-full text-black dark:text-white hover:text-indigo-400">
              <ShoppingCart className="h-5 w-5" />
            </Link>
            {isAuthenticated ? (
              <div className="flex space-x-2 items-center">
                <Link to="/profile" className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-black dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400">
                  <User className="h-5 w-5" />
                  <span>{user?.fullName}</span>
                </Link>
                <button onClick={handleLogout} className="text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 px-3 py-2 text-sm rounded-md">
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex space-x-2">
                <Link to="/login" className="btn btn-outline">Login</Link>
                <Link to="/register" className="btn btn-primary">Sign Up</Link>
              </div>
            )}
          </div>

          <div className="flex md:hidden items-center space-x-3">
            <button onClick={toggleDarkMode} className="p-2 rounded-full hover:text-indigo-400">
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <Link to="/user/cart" className="relative p-2 rounded-full hover:text-indigo-400">
              <ShoppingCart className="h-5 w-5" />
            </Link>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="inline-flex items-center justify-center p-2 rounded-md hover:text-indigo-400">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 shadow-lg border-t dark:border-gray-700">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100 dark:hover:bg-gray-700">Home</Link>
            <Link to="/user/books" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100 dark:hover:bg-gray-700">Books</Link>
            <Link to="/user/order" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100 dark:hover:bg-gray-700">Orders</Link>
            <Link to="/user/bookmark" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100 dark:hover:bg-gray-700">Bookmark</Link>
            <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100 dark:hover:bg-gray-700">Search</button>
            {isAuthenticated ? (
              <>
                <Link to="/profile" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100 dark:hover:bg-gray-700">Profile</Link>
                <button onClick={handleLogout} className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100 dark:hover:bg-gray-700">Login</Link>
                <Link to="/register" className="block px-3 py-2 rounded-md text-base font-medium text-indigo-600 dark:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-700">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}

      {isSearchOpen && (
        <div className="bg-white dark:bg-gray-900 px-4 py-3 border-t shadow-lg relative">
          <div className="max-w-md mx-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-500" />
              </div>
              <input
                value={searchTerm}
                onChange={handleSearchChange}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-200 rounded-md leading-5 bg-white dark:bg-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-gray-900 dark:text-black sm:text-sm transition duration-150 ease-in-out"
                placeholder="Search for books, authors..."
                type="search"
              />
              {searchResults.length > 0 && (
                <div className="absolute z-50 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 w-full mt-1 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {searchResults.map((book, index) => (
                    <button
                      key={index}
                      onClick={() => handleClick(book.bookId)}
                      className="block px-4 py-2 w-full text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      {book.title}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
