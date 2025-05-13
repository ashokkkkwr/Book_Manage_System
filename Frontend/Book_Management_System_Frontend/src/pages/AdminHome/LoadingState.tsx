import React from 'react';

const LoadingState: React.FC = () => {
  return (
    <div className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                <div className="h-64 bg-gray-300 dark:bg-gray-700"></div>
                <div className="p-5 space-y-3">
                  <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/3"></div>
                  <div className="flex justify-between pt-4">
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingState;