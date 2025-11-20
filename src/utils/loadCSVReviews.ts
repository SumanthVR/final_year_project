import { Review } from '../types/review';
import { parseCSVReviews } from './sentimentAnalysis';

/**
 * Load reviews from a CSV file in the data directory
 * Note: In a Vite/React app, you need to import CSV files as text
 * For static CSV files, you can use: import csvContent from '../data/reviews.csv?raw'
 */
export async function loadCSVFromFile(csvContent: string): Promise<Review[]> {
  try {
    const parsed = parseCSVReviews(csvContent);
    const validReviews = parsed.filter(r => r.content && r.category) as Review[];
    return validReviews;
  } catch (error) {
    console.error('Error loading CSV reviews:', error);
    return [];
  }
}

/**
 * Load reviews from multiple CSV files
 */
export async function loadCSVFromFiles(csvContents: string[]): Promise<Review[]> {
  const allReviews: Review[] = [];
  
  for (const csvContent of csvContents) {
    const reviews = await loadCSVFromFile(csvContent);
    allReviews.push(...reviews);
  }
  
  return allReviews;
}

