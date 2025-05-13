import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  placeholder?: string;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  searchQuery, 
  onSearchChange, 
  placeholder = "Search...",
  className = ""
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus the input on mount for better UX
  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputRef.current) inputRef.current.focus();
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const handleClear = () => {
    onSearchChange('');
    if (inputRef.current) inputRef.current.focus();
  };

  return (
    <div className={`relative ${className}`}>
      <div className={`flex items-center relative rounded-full transition-all duration-300 shadow-lg ${
        isFocused ? 'ring-2 ring-indigo-300 bg-white/95' : 'bg-white/90'
      }`}>
        <div className="pl-4 pr-1 py-3 text-gray-500">
          <Search size={20} />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent px-1 py-3 outline-none text-gray-900 placeholder-gray-500"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        {searchQuery && (
          <button
            onClick={handleClear}
            className="flex items-center justify-center h-8 w-8 mr-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X size={16} />
          </button>
        )}
        <button
          className="ml-auto mr-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full transition-colors duration-200"
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default SearchBar;