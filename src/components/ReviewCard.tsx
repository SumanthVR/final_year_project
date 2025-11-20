import React, { useState } from 'react';
import { Review } from '../types/review';
import { SentimentBadge } from './SentimentBadge';
import { Star, CheckCircle, Calendar, Tag, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

interface ReviewCardProps {
  review: Review;
  onDelete?: () => void;
}

export function ReviewCard({ review, onDelete }: ReviewCardProps) {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
      setShowConfirmDelete(false);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-100 relative">
      {showConfirmDelete && (
        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-xl flex items-center justify-center z-10">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Review?</h3>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to delete this review? This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowConfirmDelete(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
            {review.author.charAt(0)}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-gray-900">{review.author}</h3>
              {review.verified && (
                <CheckCircle className="w-4 h-4 text-blue-500" />
              )}
            </div>
            <div className="flex items-center space-x-2 mt-1">
              <div className="flex items-center space-x-1">
                {renderStars(review.rating)}
              </div>
              <span className="text-sm text-gray-500">{review.rating}/5</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <SentimentBadge sentiment={review.sentiment} score={review.sentimentScore} />
          {onDelete && (
            <button
              onClick={() => setShowConfirmDelete(true)}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
              title="Delete review"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-4 mb-4 text-sm text-gray-500">
        <div className="flex items-center space-x-1">
          <Calendar className="w-4 h-4" />
          <span>{format(new Date(review.date), 'MMM dd, yyyy')}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Tag className="w-4 h-4" />
          <span className="capitalize">{review.category}</span>
        </div>
      </div>

      <p className="text-gray-700 mb-4 leading-relaxed">{review.content}</p>

      {review.pros.length > 0 && (
        <div className="mb-3">
          <h4 className="font-medium text-green-800 mb-2">Pros</h4>
          <ul className="space-y-1">
            {review.pros.slice(0, 2).map((pro, index) => (
              <li key={index} className="text-sm text-green-700 flex items-start">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                {pro}
              </li>
            ))}
          </ul>
        </div>
      )}

      {review.cons.length > 0 && (
        <div className="mb-3">
          <h4 className="font-medium text-red-800 mb-2">Cons</h4>
          <ul className="space-y-1">
            {review.cons.slice(0, 2).map((con, index) => (
              <li key={index} className="text-sm text-red-700 flex items-start">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                {con}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="pt-3 border-t border-gray-100">
        <h4 className="font-medium text-gray-800 mb-1">Summary</h4>
        <p className="text-sm text-gray-600">{review.summary}</p>
      </div>
    </div>
  );
}