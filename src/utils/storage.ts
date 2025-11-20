import { Review } from '../types/review';

const STORAGE_KEY = 'sentiment-analysis-reviews';

/**
 * Save reviews to LocalStorage
 */
export function saveReviewsToStorage(reviews: Review[]): void {
  try {
    const serialized = JSON.stringify(reviews);
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch (error) {
    console.error('Error saving reviews to LocalStorage:', error);
    // Handle quota exceeded error
    if (error instanceof Error && error.name === 'QuotaExceededError') {
      console.warn('LocalStorage quota exceeded. Consider cleaning up old data.');
    }
  }
}

/**
 * Load reviews from LocalStorage
 */
export function loadReviewsFromStorage(): Review[] {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    if (!serialized) {
      return [];
    }
    const reviews = JSON.parse(serialized) as Review[];
    // Validate that we got valid reviews
    return reviews.filter(review => 
      review && 
      review.id && 
      review.content && 
      review.category && 
      typeof review.rating === 'number'
    );
  } catch (error) {
    console.error('Error loading reviews from LocalStorage:', error);
    return [];
  }
}

/**
 * Add a single review to storage
 */
export function addReviewToStorage(review: Review): void {
  const existingReviews = loadReviewsFromStorage();
  // Check if review already exists (by ID)
  if (!existingReviews.find(r => r.id === review.id)) {
    const updatedReviews = [review, ...existingReviews];
    saveReviewsToStorage(updatedReviews);
  }
}

/**
 * Add multiple reviews to storage
 */
export function addReviewsToStorage(newReviews: Review[]): void {
  const existingReviews = loadReviewsFromStorage();
  const existingIds = new Set(existingReviews.map(r => r.id));
  
  // Filter out duplicates
  const uniqueNewReviews = newReviews.filter(r => !existingIds.has(r.id));
  
  if (uniqueNewReviews.length > 0) {
    const updatedReviews = [...uniqueNewReviews, ...existingReviews];
    saveReviewsToStorage(updatedReviews);
  }
}

/**
 * Clear all reviews from storage
 */
export function clearReviewsFromStorage(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing reviews from LocalStorage:', error);
  }
}

/**
 * Remove a review by ID from storage
 */
export function removeReviewFromStorage(reviewId: string): boolean {
  const reviews = loadReviewsFromStorage();
  const filtered = reviews.filter(r => r.id !== reviewId);
  
  if (filtered.length < reviews.length) {
    saveReviewsToStorage(filtered);
    return true;
  }
  return false;
}

/**
 * Get storage size info (for debugging)
 */
export function getStorageInfo(): { size: number; itemCount: number } {
  const reviews = loadReviewsFromStorage();
  const serialized = localStorage.getItem(STORAGE_KEY) || '';
  return {
    size: serialized.length,
    itemCount: reviews.length
  };
}

