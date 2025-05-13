import React from 'react';
import SearchBar from './SearchBar';

interface HeroSectionProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ searchQuery, onSearchChange }) => {
  return (
    <section className="relative text-white py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-purple-600"></div>
      <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1370298/pexels-photo-1370298.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')] bg-cover bg-center opacity-20"></div>
      
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 border border-indigo-300/20 rounded-full"></div>
        <div className="absolute top-20 -left-20 w-40 h-40 border border-indigo-300/20 rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-60 h-60 border border-indigo-300/30 rounded-full"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4 animate-slideDown">
            Literary Management Portal
          </h1>
          <p className="text-xl max-w-xl mx-auto text-indigo-100 mb-8 animate-slideDown opacity-90" style={{ animationDelay: '100ms' }}>
            Efficiently manage, organize, and discover your entire book collection
          </p>
          <div className="max-w-xl mx-auto animate-slideUp" style={{ animationDelay: '200ms' }}>
            <SearchBar 
              searchQuery={searchQuery} 
              onSearchChange={onSearchChange} 
              placeholder="Search by title, author, or genre..."
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;