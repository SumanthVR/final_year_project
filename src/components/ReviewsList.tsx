import React, { useState, useMemo } from 'react';
import { Review } from '../types/review';
import { ReviewCard } from './ReviewCard';
import { FilterBar } from './FilterBar';

interface ReviewsListProps {
  reviews: Review[];
  onDeleteReview?: (reviewId: string) => void;
}

export function ReviewsList({ reviews, onDeleteReview }: ReviewsListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSentiment, setSelectedSentiment] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const filteredReviews = useMemo(() => {
    return reviews.filter((review) => {
      const matchesSearch = review.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           review.author.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !selectedCategory || review.category === selectedCategory;
      const matchesSentiment = !selectedSentiment || review.sentiment === selectedSentiment;
      
      return matchesSearch && matchesCategory && matchesSentiment;
    });
  }, [reviews, searchTerm, selectedCategory, selectedSentiment]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <FilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedSentiment={selectedSentiment}
        onSentimentChange={setSelectedSentiment}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredReviews.map((review) => (
          <ReviewCard 
            key={review.id} 
            review={review} 
            onDelete={onDeleteReview ? () => onDeleteReview(review.id) : undefined}
          />
        ))}
      </div>

      {filteredReviews.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No reviews found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}