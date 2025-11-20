import { Review } from '../types/review';
import { loadReviewsFromStorage, saveReviewsToStorage } from './storage';

/**
 * Remove reviews by matching criteria
 */
export function removeReviewsByCriteria(
  criteria: (review: Review) => boolean
): number {
  const reviews = loadReviewsFromStorage();
  const originalLength = reviews.length;
  const filtered = reviews.filter(review => !criteria(review));
  const removed = originalLength - filtered.length;
  
  if (removed > 0) {
    saveReviewsToStorage(filtered);
  }
  
  return removed;
}

/**
 * Remove reviews by content (exact match or contains)
 */
export function removeReviewsByContent(searchText: string, exactMatch: boolean = false): number {
  const lowerSearch = searchText.toLowerCase();
  
  return removeReviewsByCriteria((review) => {
    const content = review.content.toLowerCase();
    return exactMatch ? content === lowerSearch : content.includes(lowerSearch);
  });
}

/**
 * Remove reviews by ID
 */
export function removeReviewById(id: string): boolean {
  const reviews = loadReviewsFromStorage();
  const filtered = reviews.filter(r => r.id !== id);
  
  if (filtered.length < reviews.length) {
    saveReviewsToStorage(filtered);
    return true;
  }
  return false;
}

/**
 * Remove reviews that are incorrectly classified (neutral with low/high ratings)
 */
export function removeMisclassifiedReviews(): number {
  return removeReviewsByCriteria((review) => {
    // Remove neutral reviews that should be positive or negative based on rating
    if (review.sentiment === 'neutral') {
      // Rating 5 but neutral = should be positive
      if (review.rating >= 4 && Math.abs(review.sentimentScore) < 0.1) {
        return true;
      }
      // Rating 1-2 but neutral = should be negative  
      if (review.rating <= 2 && Math.abs(review.sentimentScore) < 0.1) {
        return true;
      }
    }
    return false;
  });
}

/**
 * Re-analyze and update reviews (remove and let user re-upload)
 * This actually just marks them for removal
 */
export function removeAndReanalyzeReviews(criteria: (review: Review) => boolean): Review[] {
  const reviews = loadReviewsFromStorage();
  const toReanalyze = reviews.filter(criteria);
  const toKeep = reviews.filter(review => !criteria(review));
  
  saveReviewsToStorage(toKeep);
  return toReanalyze; // Return removed reviews in case you want to re-process them
}


