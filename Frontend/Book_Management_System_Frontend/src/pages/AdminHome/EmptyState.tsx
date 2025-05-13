import React from 'react';
import { SearchX } from 'lucide-react';

interface EmptyStateProps {
  searchQuery: string;
  onClearSearch?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ searchQuery, onClearSearch }) => {
  return (
    <div className="text-center py-16 px-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm animate-fadeIn">
      <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-6">
        <SearchX className="h-8 w-8 text-gray-500 dark:text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">No books found</h3>
      <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-8">
        {searchQuery
          ? `We couldn't find any books matching "${searchQuery}". Try adjusting your search criteria.`
          : "It seems our library is empty. New books will appear here once they're added to the system."}
      </p>
      {searchQuery && onClearSearch && (
        <button
          onClick={onClearSearch}
          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors duration-200"
        >
          Clear Search
        </button>
      )}
    </div>
  );
};

export default EmptyState;