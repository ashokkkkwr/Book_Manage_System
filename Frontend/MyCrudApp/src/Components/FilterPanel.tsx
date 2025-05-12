import { X } from 'lucide-react';

interface FilterPanelProps {
  onClose: () => void;
}

export const FilterPanel = ({ onClose }: FilterPanelProps) => {
  return (
    <div className="card p-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">Filters</h3>
        <button onClick={onClose} className="p-1 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
          <X className="h-5 w-5" />
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h4 className="font-medium text-sm mb-2">Price Range</h4>
          <div className="flex space-x-3">
            <input 
              type="number" 
              min="0" 
              placeholder="Min" 
              className="input"
            />
            <input 
              type="number" 
              min="0" 
              placeholder="Max" 
              className="input"
            />
          </div>
        </div>
        
        <div>
          <h4 className="font-medium text-sm mb-2">Genre</h4>
          <select className="input">
            <option value="">All Genres</option>
            <option value="fiction">Fiction</option>
            <option value="non-fiction">Non-Fiction</option>
            <option value="mystery">Mystery</option>
            <option value="sci-fi">Science Fiction</option>
            <option value="romance">Romance</option>
          </select>
        </div>
        
        <div>
          <h4 className="font-medium text-sm mb-2">Rating</h4>
          <div className="space-y-2">
            {[4, 3, 2, 1].map((rating) => (
              <label key={rating} className="flex items-center">
                <input type="checkbox" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  {rating}+ Stars
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>
      
      <div className="mt-6 flex justify-end space-x-3">
        <button className="btn btn-outline">Clear All</button>
        <button className="btn btn-primary">Apply Filters</button>
      </div>
    </div>
  );
};