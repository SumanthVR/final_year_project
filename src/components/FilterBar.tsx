import React from 'react';
import { Filter, Search } from 'lucide-react';

interface FilterBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedSentiment: string;
  onSentimentChange: (sentiment: string) => void;
  showFilters: boolean;
  onToggleFilters: () => void;
}

export function FilterBar({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedSentiment,
  onSentimentChange,
  showFilters,
  onToggleFilters
}: FilterBarProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search reviews..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <button
          onClick={onToggleFilters}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
        >
          <Filter className="w-5 h-5" />
          <span>Show Filters</span>
        </button>
      </div>

      {showFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => onCategoryChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                <option value="hotel">Hotel</option>
                <option value="restaurant">Restaurant</option>
                <option value="product">Product</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sentiment</label>
              <select
                value={selectedSentiment}
                onChange={(e) => onSentimentChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Sentiments</option>
                <option value="positive">Positive</option>
                <option value="negative">Negative</option>
                <option value="neutral">Neutral</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}