export interface Review {
  id: string;
  author: string;
  content: string;
  rating: number;
  date: string;
  category: 'hotel' | 'restaurant' | 'product';
  verified: boolean;
  sentiment: 'positive' | 'negative' | 'neutral';
  sentimentScore: number;
  confidenceScore: number;
  emotions: EmotionScore[];
  pros: string[];
  cons: string[];
  summary: string;
  detailedRatings?: DetailedRatings;
  helpfulVotes?: number;
  responseFromBusiness?: string;
  location?: string;
  businessType?: string;
}

export interface EmotionScore {
  emotion: 'joy' | 'anger' | 'fear' | 'sadness' | 'surprise' | 'disgust';
  score: number;
}

export interface DetailedRatings {
  service: number;
  quality: number;
  value: number;
  cleanliness: number;
  location?: number;
  atmosphere?: number;
}

export interface SentimentStats {
  positive: number;
  negative: number;
  neutral: number;
  averageScore: number;
  totalReviews: number;
  confidenceLevel: number;
  topEmotions: EmotionScore[];
}

export interface CategoryBreakdown {
  category: string;
  positive: number;
  negative: number;
  neutral: number;
  total: number;
  averageRating: number;
  trend: 'up' | 'down' | 'stable';
  detailedAverage: DetailedRatings;
}

export interface BusinessInsight {
  type: 'strength' | 'weakness' | 'opportunity' | 'threat';
  category: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  actionable: boolean;
  priority: number;
}

export interface TrendData {
  date: string;
  positive: number;
  negative: number;
  neutral: number;
  averageRating: number;
  volume: number;
}

export interface HotelMetrics {
  overallRating: number;
  serviceRating: number;
  cleanlinessRating: number;
  locationRating: number;
  valueRating: number;
  amenitiesRating: number;
  totalReviews: number;
  recommendationRate: number;
}

export interface RestaurantMetrics {
  overallRating: number;
  foodQuality: number;
  serviceRating: number;
  atmosphere: number;
  valueRating: number;
  totalReviews: number;
  recommendationRate: number;
  popularDishes: Array<{
    dish: string;
    mentions: number;
    sentiment: number;
  }>;
}