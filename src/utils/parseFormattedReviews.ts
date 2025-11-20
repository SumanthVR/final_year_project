import { Review } from '../types/review';
import { analyzeSentiment, extractProsAndCons, generateSummary } from './sentimentAnalysis';

/**
 * Parse reviews in the form format:
 * author,location,content,category,rating
 * OR
 * content,category,rating (minimal)
 */
export function parseFormattedReviews(text: string): Partial<Review>[] {
  const lines = text.trim().split(/\r?\n/).filter(line => line.trim().length > 0);
  
  if (lines.length === 0) return [];
  
  // Check if first line is a header
  const hasHeader = lines[0].toLowerCase().includes('author') || 
                    lines[0].toLowerCase().includes('content') ||
                    lines[0].toLowerCase().includes('review');
  
  const dataLines = hasHeader ? lines.slice(1) : lines;
  
  return dataLines.map((line, index) => {
    // Handle CSV parsing - split by comma but respect quoted strings
    const fields: string[] = [];
    let currentField = '';
    let insideQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        if (insideQuotes && line[i + 1] === '"') {
          // Escaped quote
          currentField += '"';
          i++;
        } else {
          // Toggle quote state
          insideQuotes = !insideQuotes;
        }
      } else if (char === ',' && !insideQuotes) {
        // Field separator
        fields.push(currentField.trim());
        currentField = '';
      } else {
        currentField += char;
      }
    }
    // Add the last field
    fields.push(currentField.trim());
    
    // Parse fields based on count
    let author = '';
    let location = '';
    let content = '';
    let category: 'hotel' | 'restaurant' | 'product' = 'hotel';
    let rating = 3;
    
    if (fields.length >= 5) {
      // Full format: author,location,content,category,rating
      author = fields[0] || `Reviewer ${index + 1}`;
      location = fields[1] || '';
      content = fields[2] || '';
      category = (fields[3]?.toLowerCase() as 'hotel' | 'restaurant' | 'product') || 'hotel';
      rating = parseInt(fields[4]) || 3;
    } else if (fields.length === 3) {
      // Minimal format: content,category,rating
      content = fields[0] || '';
      category = (fields[1]?.toLowerCase() as 'hotel' | 'restaurant' | 'product') || 'hotel';
      rating = parseInt(fields[2]) || 3;
      author = `Reviewer ${index + 1}`;
    } else if (fields.length === 4) {
      // Medium format: author,content,category,rating OR content,category,rating,location
      // Try to detect by checking if first field looks like author name
      if (fields[0].length < 50 && !fields[0].toLowerCase().includes('hotel') && 
          !fields[0].toLowerCase().includes('restaurant') && !fields[0].toLowerCase().includes('product')) {
        // Format: author,content,category,rating
        author = fields[0] || `Reviewer ${index + 1}`;
        content = fields[1] || '';
        category = (fields[2]?.toLowerCase() as 'hotel' | 'restaurant' | 'product') || 'hotel';
        rating = parseInt(fields[3]) || 3;
      } else {
        // Format: content,category,rating,location
        content = fields[0] || '';
        category = (fields[1]?.toLowerCase() as 'hotel' | 'restaurant' | 'product') || 'hotel';
        rating = parseInt(fields[2]) || 3;
        location = fields[3] || '';
        author = `Reviewer ${index + 1}`;
      }
    }
    
    // Validate category
    if (!['hotel', 'restaurant', 'product'].includes(category)) {
      category = 'hotel';
    }
    
    // Validate rating
    rating = Math.max(1, Math.min(5, rating || 3));
    
    if (!content || content.length === 0) {
      return null;
    }
    
    // Generate date
    const date = new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    // Generate location if not provided
    if (!location || location === '') {
      const locations = [
        'New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Houston, TX', 'Phoenix, AZ',
        'Philadelphia, PA', 'San Antonio, TX', 'San Diego, CA', 'Dallas, TX', 'San Jose, CA',
        'Austin, TX', 'Jacksonville, FL', 'San Francisco, CA', 'Columbus, OH', 'Charlotte, NC'
      ];
      location = locations[Math.floor(Math.random() * locations.length)];
    }
    
    // Perform sentiment analysis
    const analysis = analyzeSentiment(content);
    const { pros, cons } = extractProsAndCons(content);
    
    const review: Partial<Review> = {
      id: `bulk-${Date.now()}-${index}`,
      author,
      content,
      rating,
      date,
      category,
      verified: Math.random() > 0.3,
      sentiment: analysis.sentiment,
      sentimentScore: analysis.score,
      confidenceScore: analysis.confidence,
      emotions: analysis.emotions,
      pros,
      cons,
      helpfulVotes: Math.floor(Math.random() * 50),
      location
    };
    
    review.summary = generateSummary(review as Review);
    return review;
  }).filter(Boolean) as Partial<Review>[];
}


