import React, { useEffect, useState } from 'react';
import axiosInstance from '../service/axiosInstance';
import { X, ChevronDown, ChevronUp } from 'lucide-react';

interface Genre {
  genreId: string;
  name: string;
}

interface Author {
  authorId: string;
  firstName: string;
  lastName: string;
}

interface FilterProps {
  onFilterChange: (filters: Filters) => void;
  clearAllFilters: () => void;
  activeFilters: Filters;
}

export interface Filters {
  authors: string[];
  genres: string[];
  priceRange: [number, number];
  ratings: number | null;
  languages: string[];
  formats: string[];
  publishers: string[];
  availability: boolean | null;
}

const FilterPanel: React.FC<FilterProps> = ({ onFilterChange, clearAllFilters, activeFilters }) => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState({
    genres: true,
    authors: true,
    price: true,
    ratings: true,
    languages: true,
    formats: true,
    publishers: true,
    availability: true,
  });

  // Languages array
  const languages = [
    'English','Nepali', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Russian', 
    'Chinese', 'Japanese', 'Korean', 'Arabic', 'Hindi', 'Bengali', 'Polish', 
    'Dutch', 'Swedish', 'Norwegian', 'Finnish', 'Danish', 'Greek', 'Turkish', 
    'Hebrew', 'Latin', 'Welsh', 'Irish'
  ];

  // Book formats
  const formats = [
    'Paperback', 'Hardcover', 'E-book', 'Audiobook', 'Large Print', 'Leather Bound',
    'Library Binding', 'Board Book', 'Spiral-bound', 'Mass Market Paperback',
    'Trade Paperback', 'Signed Edition', 'Limited Edition', 'First Edition',
    'Collector\'s Edition', 'Author\'s Edition', 'Deluxe Edition', 'Illustrated Edition',
    'Graphic Novel', 'Interactive Edition', 'Pop-up Book', 'Digital Download'
  ];

  // Publishers array
  const publishers = [
    'Penguin Random House', 'HarperCollins', 'Simon & Schuster', 'Hachette Book Group',
    'Macmillan Publishers', 'Oxford University Press', 'Cambridge University Press',
    'Scholastic', 'Wiley', 'Pearson Education', 'McGraw Hill', 'Bloomsbury',
    'Dover Publications', 'Chronicle Books', 'Abrams Books', 'Candlewick Press',
    'Beacon Press', 'Hay House', 'MIT Press', 'Princeton University Press'
  ];

  const fetchGenres = async () => {
    try {
      const res = await axiosInstance.get('/Genre/getAllGenres');
      setGenres(res.data);
    } catch (error) {
      console.error('Failed to fetch genres:', error);
    }
  };

  const fetchAuthors = async () => {
    try {
      const res = await axiosInstance.get('/Author/getAllAuthors');
      setAuthors(res.data);
    } catch (error) {
      console.error('Failed to fetch authors:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await Promise.all([fetchGenres(), fetchAuthors()]);
      setIsLoading(false);
    };
    
    fetchData();
  }, []);

  const handleToggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleSelectAuthor = (authorId: string) => {
    const newAuthors = activeFilters.authors.includes(authorId)
      ? activeFilters.authors.filter(id => id !== authorId)
      : [...activeFilters.authors, authorId];
    
    onFilterChange({
      ...activeFilters,
      authors: newAuthors
    });
  };

  const handleSelectGenre = (genreId: string) => {
    const newGenres = activeFilters.genres.includes(genreId)
      ? activeFilters.genres.filter(id => id !== genreId)
      : [...activeFilters.genres, genreId];
    
    onFilterChange({
      ...activeFilters,
      genres: newGenres
    });
  };

  const handlePriceChange = (min: number, max: number) => {
    onFilterChange({
      ...activeFilters,
      priceRange: [min, max]
    });
  };

  const handleRatingChange = (rating: number | null) => {
    onFilterChange({
      ...activeFilters,
      ratings: rating
    });
  };

  const handleLanguageChange = (language: string) => {
    const newLanguages = activeFilters.languages.includes(language)
      ? activeFilters.languages.filter(lang => lang !== language)
      : [...activeFilters.languages, language];
    
    onFilterChange({
      ...activeFilters,
      languages: newLanguages
    });
  };

  const handleFormatChange = (format: string) => {
    const newFormats = activeFilters.formats.includes(format)
      ? activeFilters.formats.filter(fmt => fmt !== format)
      : [...activeFilters.formats, format];
    
    onFilterChange({
      ...activeFilters,
      formats: newFormats
    });
  };

  const handlePublisherChange = (publisher: string) => {
    const newPublishers = activeFilters.publishers.includes(publisher)
      ? activeFilters.publishers.filter(pub => pub !== publisher)
      : [...activeFilters.publishers, publisher];
    
    onFilterChange({
      ...activeFilters,
      publishers: newPublishers
    });
  };

  const handleAvailabilityChange = (availability: boolean | null) => {
    onFilterChange({
      ...activeFilters,
      availability
    });
  };

  const hasActiveFilters = () => {
    return (
      activeFilters.authors.length > 0 ||
      activeFilters.genres.length > 0 ||
      activeFilters.priceRange[0] > 0 ||
      activeFilters.priceRange[1] < 1000 ||
      activeFilters.ratings !== null ||
      activeFilters.languages.length > 0 ||
      activeFilters.formats.length > 0 ||
      activeFilters.publishers.length > 0 ||
      activeFilters.availability !== null
    );
  };

  if (isLoading) {
    return (
      <div className="p-4 bg-white rounded-xl shadow-md">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-200 rounded"></div>
          <div className="h-24 bg-slate-200 rounded"></div>
          <div className="h-32 bg-slate-200 rounded"></div>
          <div className="h-24 bg-slate-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl flex flex-col shadow-md overflow-hidden transition-all duration-300 w-full">
      <div className="p-4 border-b border-slate-100 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-slate-800">Filters</h2>
        {hasActiveFilters() && (
          <button 
            onClick={clearAllFilters}
            className="text-sm text-emerald-600 hover:text-emerald-800 flex items-center gap-1 transition-colors"
          >
            <X size={16} />
            Clear All
          </button>
        )}
      </div>

      <div className="p-4 overflow-y-auto max-h-[calc(100vh-200px)]">
        {/* Genres */}
        <div className="mb-4 border-b border-slate-100 pb-4">
          <button 
            className="flex justify-between items-center w-full text-left mb-2"
            onClick={() => handleToggleSection('genres')}
          >
            <h3 className="font-medium text-slate-800">Genres</h3>
            {expandedSections.genres ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
          
          {expandedSections.genres && (
            <div className="mt-2 space-y-1 max-h-48 overflow-y-auto pr-2 transition-all duration-300">
              {genres.map(genre => (
                <label key={genre.genreId} className="flex items-center space-x-2 cursor-pointer hover:bg-slate-50 p-1 rounded transition-colors">
                  <input
                    type="checkbox"
                    checked={activeFilters.genres.includes(genre.genreId)}
                    onChange={() => handleSelectGenre(genre.genreId)}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-sm text-slate-700">{genre.name}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Authors */}
        <div className="mb-4 border-b border-slate-100 pb-4">
          <button 
            className="flex justify-between items-center w-full text-left mb-2"
            onClick={() => handleToggleSection('authors')}
          >
            <h3 className="font-medium text-slate-800">Authors</h3>
            {expandedSections.authors ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
          
          {expandedSections.authors && (
            <div className="mt-2 space-y-1 max-h-48 overflow-y-auto pr-2 transition-all duration-300">
              {authors.map(author => (
                <label key={author.authorId} className="flex items-center space-x-2 cursor-pointer hover:bg-slate-50 p-1 rounded transition-colors">
                  <input
                    type="checkbox"
                    checked={activeFilters.authors.includes(author.authorId)}
                    onChange={() => handleSelectAuthor(author.authorId)}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-sm text-slate-700">{author.firstName} {author.lastName}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Price Range */}
        <div className="mb-4 border-b border-slate-100 pb-4">
          <button 
            className="flex justify-between items-center w-full text-left mb-2"
            onClick={() => handleToggleSection('price')}
          >
            <h3 className="font-medium text-slate-800">Price Range</h3>
            {expandedSections.price ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
          
          {expandedSections.price && (
            <div className="mt-2 space-y-3 transition-all duration-300">
              <div className="flex justify-between text-sm text-slate-600 mb-1">
                <span>${activeFilters.priceRange[0]}</span>
                <span>${activeFilters.priceRange[1]}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1000"
                step="10"
                value={activeFilters.priceRange[0]}
                onChange={(e) => handlePriceChange(parseInt(e.target.value), activeFilters.priceRange[1])}
                className="w-full accent-emerald-600"
              />
              <input
                type="range"
                min="0"
                max="1000"
                step="10"
                value={activeFilters.priceRange[1]}
                onChange={(e) => handlePriceChange(activeFilters.priceRange[0], parseInt(e.target.value))}
                className="w-full accent-emerald-600"
              />
            </div>
          )}
        </div>

        {/* Ratings */}
        <div className="mb-4 border-b border-slate-100 pb-4">
          <button 
            className="flex justify-between items-center w-full text-left mb-2"
            onClick={() => handleToggleSection('ratings')}
          >
            <h3 className="font-medium text-slate-800">Ratings</h3>
            {expandedSections.ratings ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
          
          {expandedSections.ratings && (
            <div className="mt-2 space-y-2 transition-all duration-300">
              {[4, 3, 2, 1].map(rating => (
                <label key={rating} className="flex items-center space-x-2 cursor-pointer hover:bg-slate-50 p-1 rounded transition-colors">
                  <input
                    type="radio"
                    name="rating"
                    checked={activeFilters.ratings === rating}
                    onChange={() => handleRatingChange(rating)}
                    className="text-emerald-600 focus:ring-emerald-500"
                  />
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-slate-300'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="ml-1 text-sm text-slate-700">& up</span>
                  </div>
                </label>
              ))}
              <button 
                onClick={() => handleRatingChange(null)} 
                className="text-sm text-emerald-600 hover:text-emerald-800 transition-colors"
              >
                Clear rating filter
              </button>
            </div>
          )}
        </div>

        {/* Languages */}
        <div className="mb-4 border-b border-slate-100 pb-4">
          <button 
            className="flex justify-between items-center w-full text-left mb-2"
            onClick={() => handleToggleSection('languages')}
          >
            <h3 className="font-medium text-slate-800">Languages</h3>
            {expandedSections.languages ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
          
          {expandedSections.languages && (
            <div className="mt-2 space-y-1 max-h-48 overflow-y-auto pr-2 transition-all duration-300">
              {languages.map(language => (
                <label key={language} className="flex items-center space-x-2 cursor-pointer hover:bg-slate-50 p-1 rounded transition-colors">
                  <input
                    type="checkbox"
                    checked={activeFilters.languages.includes(language)}
                    onChange={() => handleLanguageChange(language)}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-sm text-slate-700">{language}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Formats */}
        <div className="mb-4 border-b border-slate-100 pb-4">
          <button 
            className="flex justify-between items-center w-full text-left mb-2"
            onClick={() => handleToggleSection('formats')}
          >
            <h3 className="font-medium text-slate-800">Formats</h3>
            {expandedSections.formats ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
          
          {expandedSections.formats && (
            <div className="mt-2 space-y-1 max-h-48 overflow-y-auto pr-2 transition-all duration-300">
              {formats.map(format => (
                <label key={format} className="flex items-center space-x-2 cursor-pointer hover:bg-slate-50 p-1 rounded transition-colors">
                  <input
                    type="checkbox"
                    checked={activeFilters.formats.includes(format)}
                    onChange={() => handleFormatChange(format)}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-sm text-slate-700">{format}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Publishers */}
        <div className="mb-4 border-b border-slate-100 pb-4">
          <button 
            className="flex justify-between items-center w-full text-left mb-2"
            onClick={() => handleToggleSection('publishers')}
          >
            <h3 className="font-medium text-slate-800">Publishers</h3>
            {expandedSections.publishers ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
          
          {expandedSections.publishers && (
            <div className="mt-2 space-y-1 max-h-48 overflow-y-auto pr-2 transition-all duration-300">
              {publishers.map(publisher => (
                <label key={publisher} className="flex items-center space-x-2 cursor-pointer hover:bg-slate-50 p-1 rounded transition-colors">
                  <input
                    type="checkbox"
                    checked={activeFilters.publishers.includes(publisher)}
                    onChange={() => handlePublisherChange(publisher)}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-sm text-slate-700">{publisher}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Availability */}
        <div className="mb-4">
          <button 
            className="flex justify-between items-center w-full text-left mb-2"
            onClick={() => handleToggleSection('availability')}
          >
            <h3 className="font-medium text-slate-800">Availability</h3>
            {expandedSections.availability ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
          
          {expandedSections.availability && (
            <div className="mt-2 space-y-2 transition-all duration-300">
              <label className="flex items-center space-x-2 cursor-pointer hover:bg-slate-50 p-1 rounded transition-colors">
                <input
                  type="radio"
                  name="availability"
                  checked={activeFilters.availability === true}
                  onChange={() => handleAvailabilityChange(true)}
                  className="text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-sm text-slate-700">In Stock</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer hover:bg-slate-50 p-1 rounded transition-colors">
                <input
                  type="radio"
                  name="availability"
                  checked={activeFilters.availability === false}
                  onChange={() => handleAvailabilityChange(false)}
                  className="text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-sm text-slate-700">Out of Stock</span>
              </label>
              <button 
                onClick={() => handleAvailabilityChange(null)} 
                className="text-sm text-emerald-600 hover:text-emerald-800 transition-colors"
              >
                Show All
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;