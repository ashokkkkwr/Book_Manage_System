import React from 'react';
import { ArrowUpDown } from 'lucide-react';

export type SortOption = 'title' | 'publicationDate' | 'price-asc' | 'price-desc' | 'popularity';

interface SortOptionsProps {
  currentSort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

const SortOptions: React.FC<SortOptionsProps> = ({ currentSort, onSortChange }) => {
  const sortOptions = [
    { value: 'title', label: 'Title A-Z' },
    { value: 'publicationDate', label: 'Publication Date (Newest)' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'popularity', label: 'Popularity' }
  ];

  return (
    <div className="flex items-center gap-2 bg-white p-3 rounded-xl shadow-sm border border-slate-100 w-full md:w-auto">
      <ArrowUpDown size={20} className="text-slate-500" />
      <select
        value={currentSort}
        onChange={(e) => onSortChange(e.target.value as SortOption)}
        className="border-none focus:ring-0 text-slate-700 pr-8 py-1 rounded bg-transparent cursor-pointer w-full"
      >
        {sortOptions.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SortOptions;