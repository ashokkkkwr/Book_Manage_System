import React, { useState } from 'react';
import axiosInstance from '../service/axiosInstance';

interface ReviewProps {
  bookId: string;
  closeModal: () => void;
}

const Review: React.FC<ReviewProps> = ({ bookId, closeModal }) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitReview = async () => {
    if (rating === 0) {
      alert('Please select a star rating');
      return;
    }
    if (!review.trim()) {
      alert('Please write a review');
      return;
    }

    setIsSubmitting(true);
    try {
      await axiosInstance.post(`/books/${bookId}/reviews`, {
        rating,
        comment: review,
      });
      alert('Review submitted successfully!');
      closeModal();
    } catch (err) {
      alert('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50"
      onClick={closeModal}
    >
      <div
        className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800">
            {/* Review: <span className="text-indigo-600">{bookTitle}</span> */}
          </h3>
          <button
            onClick={closeModal}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`text-3xl transition-colors ${
                  star <= rating ? 'text-yellow-400' : 'text-gray-300'
                } hover:text-yellow-500 focus:outline-none`}
                aria-label={`Rate ${star} stars`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Review</label>
          <textarea
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            rows={4}
            placeholder="Share your experience with this book..."
            value={review}
            onChange={(e) => setReview(e.target.value)}
          />
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={closeModal}
            disabled={isSubmitting}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={submitReview}
            disabled={isSubmitting}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Review;
