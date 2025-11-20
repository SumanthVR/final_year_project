import { Review, EmotionScore, BusinessInsight } from '../types/review';

// Enhanced sentiment lexicon with weighted scoring
const sentimentLexicon = {
  positive: {
    strong: ['amazing', 'fantastic', 'excellent', 'outstanding', 'perfect', 'exceptional', 'superb', 'magnificent', 'brilliant', 'divine', 'incredible', 'wonderful', 'spectacular', 'flawless', 'phenomenal', 'luxury', 'luxurious', 'loved', 'love', 'adore', 'favorite'],
    moderate: ['good', 'great', 'nice', 'pleasant', 'enjoyable', 'solid', 'decent', 'satisfactory', 'adequate', 'fine', 'helpful', 'friendly', 'clean', 'comfortable', 'impressive', 'delicious', 'enjoyed', 'liked', 'satisfied', 'pleased'],
    weak: ['okay', 'acceptable', 'reasonable', 'fair', 'tolerable', 'alright']
  },
  negative: {
    strong: ['terrible', 'awful', 'horrible', 'disgusting', 'appalling', 'atrocious', 'dreadful', 'abysmal', 'catastrophic', 'unacceptable', 'deplorable', 'horrendous', 'disastrous', 'defective', 'broken', 'damaged', 'faulty'],
    moderate: ['bad', 'poor', 'disappointing', 'unsatisfactory', 'mediocre', 'subpar', 'inadequate', 'inferior', 'deficient', 'lacking', 'slow', 'cold', 'overpriced', 'late', 'delayed', 'wrong', 'missing', 'incorrect', 'failed', 'problem', 'issue', 'complaint', 'waste', 'useless'],
    weak: ['meh', 'bland', 'boring', 'ordinary', 'unremarkable', 'dated', 'okay']
  }
};

const emotionKeywords = {
  joy: ['love', 'amazing', 'wonderful', 'fantastic', 'delighted', 'thrilled', 'excited', 'happy', 'pleased', 'satisfied', 'divine', 'magical', 'heavenly', 'brilliant', 'exceeded'],
  anger: ['terrible', 'awful', 'frustrated', 'annoyed', 'furious', 'outraged', 'disgusted', 'unacceptable', 'ridiculous', 'infuriating', 'rude', 'dismissive'],
  fear: ['worried', 'concerned', 'anxious', 'nervous', 'hesitant', 'uncertain', 'doubtful', 'skeptical', 'unsafe'],
  sadness: ['disappointed', 'upset', 'sad', 'depressed', 'unfortunate', 'regrettable', 'heartbroken', 'let down', 'ruined', 'late', 'delayed'],
  surprise: ['unexpected', 'surprising', 'shocked', 'amazed', 'astonished', 'stunned', 'blown away', 'impressed', 'exceeded expectations'],
  disgust: ['gross', 'disgusting', 'revolting', 'appalling', 'repulsive', 'nauseating', 'vile', 'filthy', 'contaminated']
};

const businessTerms = {
  hotel: {
    positive: ['spacious', 'luxurious', 'luxury', 'view', 'skyline view', 'amenities', 'location', 'concierge', 'spa', 'spa service', 'pool', 'breakfast', 'comfortable bed', 'loved', 'enjoyed'],
    negative: ['noise', 'dirty', 'small', 'outdated', 'broken', 'maintenance', 'overbooked', 'rude staff']
  },
  restaurant: {
    positive: ['delicious', 'fresh', 'flavorful', 'authentic', 'creative', 'presentation', 'atmosphere', 'wine selection'],
    negative: ['cold food', 'slow service', 'overcooked', 'bland', 'stale', 'waiting time', 'rude waiter']
  },
  product: {
    positive: ['durable', 'reliable', 'fast', 'precise', 'accurate', 'efficient', 'sturdy', 'well-made', 'quality', 'worth it'],
    negative: ['arrived late', 'late delivery', 'damaged', 'defective', 'does not work', 'broken', 'missing', 'wrong item', 'poor quality', 'cheap', 'flimsy', 'delayed', 'never arrived']
  }
};

export function analyzeSentiment(text: string): { 
  sentiment: 'positive' | 'negative' | 'neutral'; 
  score: number; 
  confidence: number;
  emotions: EmotionScore[];
} {
  const lowerText = text.toLowerCase();
  const words = lowerText.split(/\s+/);
  let sentimentScore = 0;
  let totalWords = 0;
  let sentimentWords = 0;

  // Check for multi-word phrases first (especially from businessTerms)
  // Check all business category phrases
  Object.values(businessTerms).forEach(categoryTerms => {
    categoryTerms.negative.forEach(phrase => {
      if (lowerText.includes(phrase)) {
        sentimentScore -= 3; // Strong negative for business-specific issues
        sentimentWords++;
      }
    });
    categoryTerms.positive.forEach(phrase => {
      if (lowerText.includes(phrase)) {
        sentimentScore += 2; // Moderate positive for business-specific positives
        sentimentWords++;
      }
    });
  });

  // Check for common negative phrases
  const negativePhrases = [
    'arrived late', 'late delivery', 'delayed delivery', 'never arrived', 
    'does not work', 'doesn\'t work', 'stopped working', 'broke down',
    'wrong item', 'wrong product', 'not as described', 'different from',
    'despite being', 'even though'
  ];
  negativePhrases.forEach(phrase => {
    if (lowerText.includes(phrase)) {
      sentimentScore -= 2.5;
      sentimentWords++;
    }
  });

  // Check for common positive phrases
  const positivePhrases = [
    'loved the', 'love the', 'enjoyed the', 'enjoyed my', 'luxury stay', 'luxury experience',
    'highly recommend', 'strongly recommend', 'would recommend', 'great experience',
    'amazing experience', 'excellent service', 'outstanding service'
  ];
  positivePhrases.forEach(phrase => {
    if (lowerText.includes(phrase)) {
      sentimentScore += 2.5;
      sentimentWords++;
    }
  });

  // Enhanced sentiment calculation with context awareness
  words.forEach((word, index) => {
    const cleanWord = word.replace(/[^\w]/g, '');
    let multiplier = 1;

    // Check for negation words before sentiment words
    const prevWord = index > 0 ? words[index - 1].replace(/[^\w]/g, '') : '';
    if (['not', 'never', 'no', 'barely', 'hardly', 'without', 'despite'].includes(prevWord)) {
      multiplier = -1;
    }
    
    // "Despite" often indicates disappointment even if followed by positive words
    if (prevWord === 'despite') {
      sentimentScore -= 1; // Additional negative boost for "despite" context
    }

    // Check for intensifiers
    if (['very', 'extremely', 'incredibly', 'absolutely', 'completely', 'totally'].includes(prevWord)) {
      multiplier = multiplier * 1.5;
    }

    // Calculate sentiment with weighted scoring
    if (sentimentLexicon.positive.strong.some(w => cleanWord.includes(w))) {
      sentimentScore += 3 * multiplier;
      sentimentWords++;
    } else if (sentimentLexicon.positive.moderate.some(w => cleanWord.includes(w))) {
      sentimentScore += 2 * multiplier;
      sentimentWords++;
    } else if (sentimentLexicon.positive.weak.some(w => cleanWord.includes(w))) {
      sentimentScore += 1 * multiplier;
      sentimentWords++;
    }

    if (sentimentLexicon.negative.strong.some(w => cleanWord.includes(w))) {
      sentimentScore -= 3 * Math.abs(multiplier);
      sentimentWords++;
    } else if (sentimentLexicon.negative.moderate.some(w => cleanWord.includes(w))) {
      sentimentScore -= 2 * Math.abs(multiplier);
      sentimentWords++;
    } else if (sentimentLexicon.negative.weak.some(w => cleanWord.includes(w))) {
      sentimentScore -= 1 * Math.abs(multiplier);
      sentimentWords++;
    }

    totalWords++;
  });

  // Normalize score with better scaling
  const maxPossibleScore = sentimentWords * 3;
  const normalizedScore = maxPossibleScore > 0 ? sentimentScore / maxPossibleScore : 0;
  
  // Enhanced confidence calculation
  const sentimentDensity = sentimentWords / totalWords;
  const confidence = Math.min(0.98, Math.max(0.2, 0.4 + sentimentDensity * 1.5 + Math.abs(normalizedScore) * 0.3));

  // Determine sentiment with more nuanced thresholds
  let sentiment: 'positive' | 'negative' | 'neutral';
  if (normalizedScore > 0.1) {
    sentiment = 'positive';
  } else if (normalizedScore < -0.1) {
    sentiment = 'negative';
  } else {
    sentiment = 'neutral';
  }

  // Enhanced emotion analysis
  const emotions: EmotionScore[] = Object.entries(emotionKeywords).map(([emotion, keywords]) => {
    let emotionScore = 0;
    let matches = 0;
    
    words.forEach(word => {
      const cleanWord = word.replace(/[^\w]/g, '');
      keywords.forEach(keyword => {
        if (cleanWord.includes(keyword)) {
          emotionScore += 1;
          matches++;
        }
      });
    });
    
    const normalizedEmotion = matches > 0 ? Math.min(1, emotionScore / Math.sqrt(words.length)) : 0;
    
    return {
      emotion: emotion as EmotionScore['emotion'],
      score: normalizedEmotion
    };
  }).sort((a, b) => b.score - a.score);

  return {
    sentiment,
    score: normalizedScore,
    confidence,
    emotions
  };
}

export function extractProsAndCons(text: string): { pros: string[]; cons: string[] } {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20);
  const pros: string[] = [];
  const cons: string[] = [];

  sentences.forEach(sentence => {
    const trimmed = sentence.trim();
    if (trimmed.length < 10) return;

    const analysis = analyzeSentiment(trimmed);
    
    // More sophisticated extraction based on sentiment strength and confidence
    if (analysis.sentiment === 'positive' && analysis.score > 0.25 && analysis.confidence > 0.5) {
      pros.push(trimmed);
    } else if (analysis.sentiment === 'negative' && analysis.score < -0.25 && analysis.confidence > 0.5) {
      cons.push(trimmed);
    }
  });

  return { 
    pros: pros.slice(0, 8),
    cons: cons.slice(0, 8)
  };
}

export function generateSummary(review: Review): string {
  const { sentiment, pros, cons, confidenceScore, category, rating } = review;
  
  const ratingText = rating >= 4 ? 'high rating' : rating <= 2 ? 'low rating' : 'moderate rating';
  
  if (sentiment === 'positive' && pros.length > 0) {
    const keyStrength = pros[0].toLowerCase().substring(0, 50);
    if (confidenceScore > 0.9) {
      return `Exceptional ${category} experience with ${ratingText}, highlighting ${keyStrength}...`;
    } else {
      return `Positive ${category} experience with ${ratingText} and ${keyStrength}...`;
    }
  } else if (sentiment === 'negative' && cons.length > 0) {
    const keyConcern = cons[0].toLowerCase().substring(0, 50);
    if (confidenceScore > 0.9) {
      return `Significant ${category} concerns with ${ratingText}, particularly ${keyConcern}...`;
    } else {
      return `${category.charAt(0).toUpperCase() + category.slice(1)} issues noted with ${ratingText}, including ${keyConcern}...`;
    }
  } else if (sentiment === 'positive') {
    return confidenceScore > 0.8 
      ? `Highly positive ${category} review with ${ratingText} and strong satisfaction indicators.`
      : `Generally positive ${category} review with ${ratingText} and good overall sentiment.`;
  } else if (sentiment === 'negative') {
    return confidenceScore > 0.8
      ? `Strongly negative ${category} review with ${ratingText} and clear dissatisfaction.`
      : `Negative ${category} review with ${ratingText} and concerning feedback.`;
  }
  
  return `Balanced ${category} review with ${ratingText} and mixed positive and negative aspects.`;
}

export function processBulkReviews(bulkText: string): Partial<Review>[] {
  const lines = bulkText.trim().split('\n').filter(line => line.trim().length > 0);
  
  return lines.map((line, index) => {
    // Support multiple formats
    let match = line.match(/"([^"]+)"\s*-\s*(\w+)\s*-\s*(\d+)\s*stars?/i);
    if (!match) {
      match = line.match(/([^,]+),\s*(\w+),\s*(\d+)/i);
    }
    if (!match && line.includes('-')) {
      const parts = line.split('-').map(p => p.trim());
      if (parts.length >= 3) {
        match = [line, parts[0].replace(/"/g, ''), parts[1], parts[2].replace(/\D/g, '')];
      }
    }
    
    if (match) {
      const [, content, category, rating] = match;
      const analysis = analyzeSentiment(content);
      const { pros, cons } = extractProsAndCons(content);
      
      const review: Partial<Review> = {
        id: `bulk-${Date.now()}-${index}`,
        author: `Reviewer ${index + 1}`,
        content: content.replace(/"/g, ''),
        rating: Math.max(1, Math.min(5, parseInt(rating) || 3)),
        date: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        category: category.toLowerCase() as 'hotel' | 'restaurant' | 'product',
        verified: Math.random() > 0.3,
        sentiment: analysis.sentiment,
        sentimentScore: analysis.score,
        confidenceScore: analysis.confidence,
        emotions: analysis.emotions,
        pros,
        cons,
        helpfulVotes: Math.floor(Math.random() * 50),
        location: generateLocation()
      };
      
      review.summary = generateSummary(review as Review);
      return review;
    }
    return null;
  }).filter(Boolean) as Partial<Review>[];
}

function generateLocation(): string {
  const locations = [
    'New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Houston, TX', 'Phoenix, AZ',
    'Philadelphia, PA', 'San Antonio, TX', 'San Diego, CA', 'Dallas, TX', 'San Jose, CA',
    'Austin, TX', 'Jacksonville, FL', 'San Francisco, CA', 'Columbus, OH', 'Charlotte, NC'
  ];
  return locations[Math.floor(Math.random() * locations.length)];
}

/**
 * Parse CSV content and convert it to Review objects
 * Expected CSV format (with or without header):
 * author,content,rating,category,date,location,verified
 * OR
 * content,category,rating (minimal format)
 */
export function parseCSVReviews(csvContent: string): Partial<Review>[] {
  const lines = csvContent.trim().split(/\r?\n/).filter(line => line.trim().length > 0);
  
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
          i++; // Skip next quote
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
    
    // Try to determine CSV format
    // Format 1: author,content,rating,category,date,location,verified
    // Format 2: content,category,rating (minimal)
    // Format 3: content,rating,category,author,location,date,verified
    
    let author = '';
    let content = '';
    let rating = 3;
    let category: 'hotel' | 'restaurant' | 'product' = 'hotel';
    let date = new Date().toISOString().split('T')[0];
    let location = '';
    let verified = false;
    
    if (fields.length >= 3) {
      // Try to auto-detect format based on content
      // Check if first field looks like author name (short, no rating numbers)
      const firstField = fields[0].toLowerCase();
      const containsRating = /[1-5]/.test(firstField);
      
      if (fields.length >= 7 || fields.length === 6) {
        // Full format: author,content,rating,category,date,location,verified
        author = fields[0] || `Reviewer ${index + 1}`;
        content = fields[1] || '';
        rating = parseInt(fields[2]) || 3;
        category = (fields[3]?.toLowerCase() as 'hotel' | 'restaurant' | 'product') || 'hotel';
        date = fields[4] || new Date().toISOString().split('T')[0];
        location = fields[5] || '';
        verified = fields[6]?.toLowerCase() === 'true' || fields[6]?.toLowerCase() === 'yes' || false;
      } else if (fields.length === 5) {
        // Medium format: content,category,rating,author,location
        content = fields[0] || '';
        category = (fields[1]?.toLowerCase() as 'hotel' | 'restaurant' | 'product') || 'hotel';
        rating = parseInt(fields[2]) || 3;
        author = fields[3] || `Reviewer ${index + 1}`;
        location = fields[4] || '';
      } else if (fields.length >= 3) {
        // Minimal format: content,category,rating
        if (containsRating && !fields[1]?.toLowerCase().match(/hotel|restaurant|product/)) {
          // Format: content,rating,category
          content = fields[0] || '';
          rating = parseInt(fields[1]) || 3;
          category = (fields[2]?.toLowerCase() as 'hotel' | 'restaurant' | 'product') || 'hotel';
        } else {
          // Format: content,category,rating
          content = fields[0] || '';
          category = (fields[1]?.toLowerCase() as 'hotel' | 'restaurant' | 'product') || 'hotel';
          rating = parseInt(fields[2]) || 3;
        }
      }
      
      // Validate category
      if (!['hotel', 'restaurant', 'product'].includes(category)) {
        category = 'hotel';
      }
      
      // Validate rating
      rating = Math.max(1, Math.min(5, rating || 3));
      
      // Generate date if not provided
      if (!date || date === '') {
        date = new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      }
      
      // Generate location if not provided
      if (!location || location === '') {
        location = generateLocation();
      }
      
      // Generate author if not provided
      if (!author || author === '') {
        author = `Reviewer ${index + 1}`;
      }
      
      // Perform sentiment analysis
      const analysis = analyzeSentiment(content);
      const { pros, cons } = extractProsAndCons(content);
      
      const review: Partial<Review> = {
        id: `csv-${Date.now()}-${index}`,
        author,
        content,
        rating,
        date,
        category,
        verified,
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
    }
    
    return null;
  }).filter(Boolean) as Partial<Review>[];
}

export function generateBusinessInsights(reviews: Review[]): BusinessInsight[] {
  const insights: BusinessInsight[] = [];
  
  // Analyze by category
  const categories = ['hotel', 'restaurant', 'product'];
  
  categories.forEach(category => {
    const categoryReviews = reviews.filter(r => r.category === category);
    if (categoryReviews.length === 0) return;

    const positiveRate = categoryReviews.filter(r => r.sentiment === 'positive').length / categoryReviews.length;
    const avgRating = categoryReviews.reduce((sum, r) => sum + r.rating, 0) / categoryReviews.length;
    const avgConfidence = categoryReviews.reduce((sum, r) => sum + r.confidenceScore, 0) / categoryReviews.length;

    // Identify strengths
    if (positiveRate > 0.7 && avgRating > 4) {
      insights.push({
        type: 'strength',
        category,
        description: `${category.charAt(0).toUpperCase() + category.slice(1)} category shows excellent performance with ${(positiveRate * 100).toFixed(1)}% positive sentiment and ${avgRating.toFixed(1)} average rating.`,
        impact: 'high',
        actionable: false,
        priority: positiveRate > 0.8 ? 1 : 2
      });
    }

    // Identify weaknesses
    if (positiveRate < 0.5 || avgRating < 3) {
      insights.push({
        type: 'weakness',
        category,
        description: `${category.charAt(0).toUpperCase() + category.slice(1)} category requires immediate attention with only ${(positiveRate * 100).toFixed(1)}% positive sentiment.`,
        impact: 'high',
        actionable: true,
        priority: 1
      });
    }

    // Most mentioned concerns
    const allCons = categoryReviews.flatMap(r => r.cons);
    const conCounts = allCons.reduce((acc, con) => {
      const key = con.toLowerCase().substring(0, 30);
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topConcern = Object.entries(conCounts).sort(([,a], [,b]) => b - a)[0];
    if (topConcern && topConcern[1] > 2) {
      insights.push({
        type: 'opportunity',
        category,
        description: `Address recurring concern: "${topConcern[0]}" mentioned in ${topConcern[1]} reviews.`,
        impact: 'medium',
        actionable: true,
        priority: 2
      });
    }
  });

  // Analyze sentiment trends
  const recentReviews = reviews.filter(r => {
    const reviewDate = new Date(r.date);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return reviewDate >= thirtyDaysAgo;
  });

  const olderReviews = reviews.filter(r => {
    const reviewDate = new Date(r.date);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return reviewDate < thirtyDaysAgo;
  });

  if (recentReviews.length > 0 && olderReviews.length > 0) {
    const recentPositiveRate = recentReviews.filter(r => r.sentiment === 'positive').length / recentReviews.length;
    const olderPositiveRate = olderReviews.filter(r => r.sentiment === 'positive').length / olderReviews.length;
    
    if (recentPositiveRate - olderPositiveRate > 0.2) {
      insights.push({
        type: 'strength',
        category: 'overall',
        description: `Sentiment trending upward with ${((recentPositiveRate - olderPositiveRate) * 100).toFixed(1)}% improvement in recent reviews.`,
        impact: 'medium',
        actionable: false,
        priority: 2
      });
    } else if (olderPositiveRate - recentPositiveRate > 0.2) {
      insights.push({
        type: 'threat',
        category: 'overall',
        description: `Sentiment declining with ${((olderPositiveRate - recentPositiveRate) * 100).toFixed(1)}% drop in positive reviews recently.`,
        impact: 'high',
        actionable: true,
        priority: 1
      });
    }
  }

  return insights.sort((a, b) => a.priority - b.priority);
}

export function analyzeEmotionTrends(reviews: Review[]) {
  const monthlyEmotions = reviews.reduce((acc, review) => {
    const month = new Date(review.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    if (!acc[month]) {
      acc[month] = { month, joy: 0, anger: 0, sadness: 0, fear: 0, surprise: 0, disgust: 0, total: 0 };
    }
    
    review.emotions.forEach(emotion => {
      acc[month][emotion.emotion] += emotion.score;
    });
    acc[month].total++;
    return acc;
  }, {} as Record<string, any>);

  return Object.values(monthlyEmotions)
    .map((month: any) => ({
      ...month,
      joy: month.total > 0 ? month.joy / month.total : 0,
      anger: month.total > 0 ? month.anger / month.total : 0,
      sadness: month.total > 0 ? month.sadness / month.total : 0,
      fear: month.total > 0 ? month.fear / month.total : 0,
      surprise: month.total > 0 ? month.surprise / month.total : 0,
      disgust: month.total > 0 ? month.disgust / month.total : 0
    }))
    .sort((a: any, b: any) => new Date(a.month).getTime() - new Date(b.month).getTime());
}

export function calculateDetailedMetrics(reviews: Review[], category: 'hotel' | 'restaurant') {
  const categoryReviews = reviews.filter(r => r.category === category);
  
  if (categoryReviews.length === 0) {
    return null;
  }

  const metrics = {
    totalReviews: categoryReviews.length,
    averageRating: categoryReviews.reduce((sum, r) => sum + r.rating, 0) / categoryReviews.length,
    sentimentDistribution: {
      positive: categoryReviews.filter(r => r.sentiment === 'positive').length,
      negative: categoryReviews.filter(r => r.sentiment === 'negative').length,
      neutral: categoryReviews.filter(r => r.sentiment === 'neutral').length
    },
    ratingDistribution: [1, 2, 3, 4, 5].map(rating => ({
      rating,
      count: categoryReviews.filter(r => r.rating === rating).length
    })),
    topPros: getTopMentions(categoryReviews.flatMap(r => r.pros)),
    topCons: getTopMentions(categoryReviews.flatMap(r => r.cons)),
    averageConfidence: categoryReviews.reduce((sum, r) => sum + r.confidenceScore, 0) / categoryReviews.length
  };

  return metrics;
}

function getTopMentions(mentions: string[]) {
  const counts = mentions.reduce((acc, mention) => {
    const key = mention.toLowerCase().substring(0, 40);
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(counts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 8)
    .map(([mention, count]) => ({ mention, count }));
}

export function generateRecommendations(reviews: Review[]): string[] {
  const insights = generateBusinessInsights(reviews);
  const recommendations: string[] = [];

  insights.filter(i => i.actionable && i.priority <= 2).forEach(insight => {
    switch (insight.type) {
      case 'weakness':
        recommendations.push(`Priority: Address ${insight.category} service issues to improve customer satisfaction`);
        break;
      case 'opportunity':
        recommendations.push(`Opportunity: ${insight.description}`);
        break;
      case 'threat':
        recommendations.push(`Urgent: ${insight.description}`);
        break;
    }
  });

  // Add data-driven recommendations
  const negativeReviews = reviews.filter(r => r.sentiment === 'negative');
  const commonIssues = negativeReviews.flatMap(r => r.cons);
  
  if (commonIssues.length > 0) {
    const issueMap = commonIssues.reduce((acc, issue) => {
      const key = issue.toLowerCase().includes('service') ? 'service' :
                 issue.toLowerCase().includes('clean') ? 'cleanliness' :
                 issue.toLowerCase().includes('wait') ? 'wait time' :
                 issue.toLowerCase().includes('food') ? 'food quality' :
                 issue.toLowerCase().includes('price') ? 'pricing' : 'general';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topIssue = Object.entries(issueMap).sort(([,a], [,b]) => b - a)[0];
    if (topIssue && topIssue[1] > 1) {
      recommendations.push(`Focus on improving ${topIssue[0]} - mentioned in ${topIssue[1]} negative reviews`);
    }
  }

  return recommendations.slice(0, 6);
}