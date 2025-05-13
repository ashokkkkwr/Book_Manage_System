import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ message, onRetry }) => {
  return (
    <div className="max-w-xl mx-auto px-4 py-16 text-center">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 border-l-4 border-red-500">
        <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-6">
          <AlertTriangle className="h-8 w-8 text-red-500" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
          Something went wrong
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">{message}</p>
        <button
          onClick={onRetry}
          className="inline-flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors duration-200"
        >
          Try Again
        </button>
      </div>
    </div>
  );
};

export default ErrorState;