import React from 'react';
import { X } from 'lucide-react';
import type { Filters } from './FilterPanels';

interface ActiveFiltersProps {
  filters: Filters;
  onRemoveFilter: (filterType: string, value: string | number | boolean) => void;
  authorMap: Record<string, string>;
  genreMap: Record<string, string>;
}

const ActiveFilters: React.FC<ActiveFiltersProps> = ({ 
  filters, 
  onRemoveFilter,
  authorMap,
  genreMap
}) => {
  if (
    filters.authors.length === 0 &&
    filters.genres.length === 0 &&
    filters.languages.length === 0 &&
    filters.formats.length === 0 &&
    filters.publishers.length === 0 &&
    filters.ratings === null &&
    filters.availability === null &&
    filters.priceRange[0] === 0 &&
    filters.priceRange[1] === 1000
  ) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 mb-4 animate-fadeIn">
      {filters.authors.map(authorId => (
        <FilterBadge 
          key={`author-${authorId}`} 
          label={`Author: ${authorMap[authorId] || authorId}`}
          onRemove={() => onRemoveFilter('authors', authorId)}
        />
      ))}
      
      {filters.genres.map(genreId => (
        <FilterBadge 
          key={`genre-${genreId}`} 
          label={`Genre: ${genreMap[genreId] || genreId}`}
          onRemove={() => onRemoveFilter('genres', genreId)}
        />
      ))}
      
      {filters.languages.map(language => (
        <FilterBadge 
          key={`language-${language}`} 
          label={`Language: ${language}`}
          onRemove={() => onRemoveFilter('languages', language)}
        />
      ))}
      
      {filters.formats.map(format => (
        <FilterBadge 
          key={`format-${format}`} 
          label={`Format: ${format}`}
          onRemove={() => onRemoveFilter('formats', format)}
        />
      ))}
      
      {filters.publishers.map(publisher => (
        <FilterBadge 
          key={`publisher-${publisher}`} 
          label={`Publisher: ${publisher}`}
          onRemove={() => onRemoveFilter('publishers', publisher)}
        />
      ))}
      
      {filters.ratings !== null && (
        <FilterBadge 
          label={`Rating: ${filters.ratings}+ Stars`}
          onRemove={() => onRemoveFilter('ratings', filters.ratings)}
        />
      )}
      
      {(filters.priceRange[0] > 0 || filters.priceRange[1] < 1000) && (
        <FilterBadge 
          label={`Price: $${filters.priceRange[0]} - $${filters.priceRange[1]}`}
          onRemove={() => onRemoveFilter('priceRange', 0)}
        />
      )}
      
      {filters.availability !== null && (
        <FilterBadge 
          label={`Availability: ${filters.availability ? 'In Stock' : 'Out of Stock'}`}
          onRemove={() => onRemoveFilter('availability', filters.availability)}
        />
      )}
    </div>
  );
};

const FilterBadge: React.FC<{ label: string; onRemove: () => void }> = ({ label, onRemove }) => (
  <div className="flex items-center bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full text-sm">
    <span>{label}</span>
    <button 
      onClick={onRemove}
      className="ml-1 p-1 hover:bg-emerald-100 rounded-full transition-colors"
    >
      <X size={14} />
    </button>
  </div>
);

export default ActiveFilters;