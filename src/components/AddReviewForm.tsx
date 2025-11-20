import React, { useState } from 'react';
import { Review } from '../types/review';
import { analyzeSentiment, extractProsAndCons, generateSummary } from '../utils/sentimentAnalysis';
import { BulkReviewProcessor } from './BulkReviewProcessor';
import { Star, Send, Upload, FileText } from 'lucide-react';

interface AddReviewFormProps {
  onAddReview: (review: Review) => void;
  onBulkAdd: (reviews: Review[]) => void;
}

export function AddReviewForm({ onAddReview, onBulkAdd }: AddReviewFormProps) {
  const [formData, setFormData] = useState({
    author: '',
    content: '',
    category: 'hotel' as 'hotel' | 'restaurant' | 'product',
    rating: 5,
    verified: false,
    location: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mode, setMode] = useState<'single' | 'bulk'>('single');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Enhanced processing with detailed analysis
    await new Promise(resolve => setTimeout(resolve, 1500));

    const sentimentAnalysis = analyzeSentiment(formData.content);
    const { pros, cons } = extractProsAndCons(formData.content);

    const newReview: Review = {
      id: Date.now().toString(),
      author: formData.author,
      content: formData.content,
      rating: formData.rating,
      date: new Date().toISOString().split('T')[0],
      category: formData.category,
      verified: formData.verified,
      sentiment: sentimentAnalysis.sentiment,
      sentimentScore: sentimentAnalysis.score,
      confidenceScore: sentimentAnalysis.confidence,
      emotions: sentimentAnalysis.emotions,
      pros,
      cons,
      summary: '',
      location: formData.location || 'Not specified',
      helpfulVotes: 0,
      detailedRatings: {
        service: formData.rating,
        quality: formData.rating,
        value: Math.max(1, formData.rating - Math.floor(Math.random() * 2)),
        cleanliness: formData.rating,
        location: formData.rating,
        atmosphere: formData.rating
      }
    };

    newReview.summary = generateSummary(newReview);
    
    onAddReview(newReview);
    
    // Reset form
    setFormData({
      author: '',
      content: '',
      category: 'hotel',
      rating: 5,
      verified: false,
      location: ''
    });

    setIsSubmitting(false);
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, i) => (
      <button
        key={i}
        type="button"
        onClick={() => setFormData({ ...formData, rating: i + 1 })}
        className="focus:outline-none transition-transform duration-200 hover:scale-110"
      >
        <Star
          className={`w-7 h-7 transition-colors duration-200 ${
            i < formData.rating ? 'text-yellow-400 fill-current' : 'text-gray-300 hover:text-yellow-200'
          }`}
        />
      </button>
    ));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Mode Selection */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
        <div className="flex items-center space-x-4 mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Add Reviews</h2>
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setMode('single')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                mode === 'single'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <FileText className="w-4 h-4 inline mr-2" />
              Single Review
            </button>
            <button
              onClick={() => setMode('bulk')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                mode === 'bulk'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Upload className="w-4 h-4 inline mr-2" />
              Bulk Import
            </button>
          </div>
        </div>
      </div>

      {mode === 'bulk' ? (
        <BulkReviewProcessor onBulkAdd={onBulkAdd} />
      ) : (
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Submit New Review</h3>
            <p className="text-gray-600">Add a single review for detailed sentiment analysis</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Author Name
                </label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  placeholder="Enter reviewer name"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location (Optional)
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g., New York, NY"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Review Content
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Share your detailed experience..."
                required
                rows={8}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                Tip: Include specific details about your experience for better sentiment analysis
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                >
                  <option value="hotel">🏨 Hotel</option>
                  <option value="restaurant">🍽️ Restaurant</option>
                  <option value="product">📦 Product</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Overall Rating
                </label>
                <div className="flex items-center space-x-2 py-2">
                  {renderStars()}
                  <span className="ml-3 text-sm font-medium text-gray-600">
                    {formData.rating} Star{formData.rating !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="verified"
                  checked={formData.verified}
                  onChange={(e) => setFormData({ ...formData, verified: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="verified" className="ml-2 text-sm text-gray-700">
                  Verified Review
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-4 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Analyzing Sentiment...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Submit for AI Analysis</span>
                </>
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}