import React, { useMemo, useState } from 'react';
import { Review } from '../types/review';
import { CategoryAnalytics } from './CategoryAnalytics';
import { generateBusinessInsights, analyzeEmotionTrends, generateRecommendations } from '../utils/sentimentAnalysis';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
  ComposedChart
} from 'recharts';
import { 
  TrendingUp, 
  MessageSquare, 
  Star, 
  BarChart3, 
  Hotel, 
  Utensils, 
  Package,
  Brain,
  Target,
  Lightbulb,
  AlertTriangle
} from 'lucide-react';

interface AdvancedAnalyticsProps {
  reviews: Review[];
}

export function AdvancedAnalytics({ reviews }: AdvancedAnalyticsProps) {
  const [selectedCategory, setSelectedCategory] = useState<'overview' | 'hotel' | 'restaurant' | 'product'>('overview');

  const overallStats = useMemo(() => {
    const total = reviews.length;
    const positive = reviews.filter(r => r.sentiment === 'positive').length;
    const negative = reviews.filter(r => r.sentiment === 'negative').length;
    const neutral = reviews.filter(r => r.sentiment === 'neutral').length;
    const avgScore = reviews.reduce((sum, r) => sum + r.sentimentScore, 0) / total;
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / total;
    const avgConfidence = reviews.reduce((sum, r) => sum + r.confidenceScore, 0) / total;
    
    return {
      total,
      positive: (positive / total) * 100,
      negative: (negative / total) * 100,
      neutral: (neutral / total) * 100,
      avgScore,
      avgRating,
      avgConfidence
    };
  }, [reviews]);

  const categoryBreakdown = useMemo(() => {
    const categories = ['hotel', 'restaurant', 'product'];
    
    return categories.map(category => {
      const categoryReviews = reviews.filter(r => r.category === category);
      const total = categoryReviews.length;
      
      if (total === 0) return null;
      
      const positive = categoryReviews.filter(r => r.sentiment === 'positive').length;
      const negative = categoryReviews.filter(r => r.sentiment === 'negative').length;
      const neutral = categoryReviews.filter(r => r.sentiment === 'neutral').length;
      const avgRating = categoryReviews.reduce((sum, r) => sum + r.rating, 0) / total;
      const avgSentiment = categoryReviews.reduce((sum, r) => sum + r.sentimentScore, 0) / total;
      
      return {
        category: category.charAt(0).toUpperCase() + category.slice(1),
        positive,
        negative,
        neutral,
        total,
        avgRating,
        avgSentiment,
        positiveRate: (positive / total) * 100
      };
    }).filter(Boolean);
  }, [reviews]);

  const emotionTrends = useMemo(() => analyzeEmotionTrends(reviews), [reviews]);
  const businessInsights = useMemo(() => generateBusinessInsights(reviews), [reviews]);
  const recommendations = useMemo(() => generateRecommendations(reviews), [reviews]);

  const sentimentCorrelation = useMemo(() => {
    return reviews.map(review => ({
      rating: review.rating,
      sentimentScore: review.sentimentScore,
      confidence: review.confidenceScore,
      category: review.category
    }));
  }, [reviews]);

  const pieChartData = [
    { name: 'Positive', value: overallStats.positive, color: '#10B981' },
    { name: 'Negative', value: overallStats.negative, color: '#EF4444' },
    { name: 'Neutral', value: overallStats.neutral, color: '#6B7280' }
  ];

  if (selectedCategory !== 'overview') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <button
            onClick={() => setSelectedCategory('overview')}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Back to Overview
          </button>
        </div>
        <CategoryAnalytics 
          reviews={reviews} 
          selectedCategory={selectedCategory as 'hotel' | 'restaurant' | 'product'} 
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-lg p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700">Total Reviews</p>
              <p className="text-3xl font-bold text-blue-900">{overallStats.total}</p>
            </div>
            <MessageSquare className="w-12 h-12 text-blue-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-lg p-6 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700">Positive Rate</p>
              <p className="text-3xl font-bold text-green-900">{overallStats.positive.toFixed(0)}%</p>
            </div>
            <TrendingUp className="w-12 h-12 text-green-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-lg p-6 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-700">Avg Sentiment</p>
              <p className="text-3xl font-bold text-purple-900">{overallStats.avgScore.toFixed(2)}</p>
            </div>
            <Brain className="w-12 h-12 text-purple-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl shadow-lg p-6 border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-700">Avg Rating</p>
              <p className="text-3xl font-bold text-yellow-900">{overallStats.avgRating.toFixed(1)}</p>
            </div>
            <Star className="w-12 h-12 text-yellow-600" />
          </div>
        </div>
      </div>

      {/* Category Selection */}
      <div className="mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Category Deep Dive</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {categoryBreakdown.map((category) => category && (
              <button
                key={category.category}
                onClick={() => setSelectedCategory(category.category.toLowerCase() as any)}
                className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200 text-left group"
              >
                <div className="flex items-center space-x-3 mb-3">
                  {category.category === 'Hotel' && <Hotel className="w-6 h-6 text-blue-600" />}
                  {category.category === 'Restaurant' && <Utensils className="w-6 h-6 text-orange-600" />}
                  {category.category === 'Product' && <Package className="w-6 h-6 text-purple-600" />}
                  <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {category.category}
                  </h4>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Reviews:</span>
                    <span className="font-medium">{category.total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Avg Rating:</span>
                    <span className="font-medium">{category.avgRating.toFixed(1)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Positive:</span>
                    <span className="font-medium text-green-600">{category.positiveRate.toFixed(0)}%</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Enhanced Sentiment Distribution */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Sentiment Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value.toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: any) => [`${value.toFixed(1)}%`, 'Percentage']} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Rating vs Sentiment Correlation */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Rating vs Sentiment Correlation</h3>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart data={sentimentCorrelation}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="rating" domain={[0, 5]} name="Rating" />
              <YAxis dataKey="sentimentScore" domain={[-1, 1]} name="Sentiment Score" />
              <Tooltip 
                formatter={(value: any, name: string) => [
                  typeof value === 'number' ? value.toFixed(2) : value,
                  name === 'sentimentScore' ? 'Sentiment Score' : 'Rating'
                ]}
              />
              <Scatter 
                dataKey="sentimentScore" 
                fill="#3B82F6"
                fillOpacity={0.6}
                r={4}
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Emotion Analysis */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Emotion Trends Over Time</h3>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={emotionTrends}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area
              type="monotone"
              dataKey="joy"
              stackId="1"
              stroke="#10B981"
              fill="#10B981"
              fillOpacity={0.7}
              name="Joy"
            />
            <Area
              type="monotone"
              dataKey="anger"
              stackId="1"
              stroke="#EF4444"
              fill="#EF4444"
              fillOpacity={0.7}
              name="Anger"
            />
            <Area
              type="monotone"
              dataKey="surprise"
              stackId="1"
              stroke="#3B82F6"
              fill="#3B82F6"
              fillOpacity={0.7}
              name="Surprise"
            />
            <Area
              type="monotone"
              dataKey="sadness"
              stackId="1"
              stroke="#6B7280"
              fill="#6B7280"
              fillOpacity={0.7}
              name="Sadness"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Business Insights & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center space-x-2 mb-4">
            <Target className="w-6 h-6 text-blue-600" />
            <h3 className="text-xl font-semibold text-gray-900">Business Insights</h3>
          </div>
          <div className="space-y-4">
            {businessInsights.slice(0, 6).map((insight, index) => (
              <div 
                key={index}
                className={`p-4 rounded-lg border-l-4 ${
                  insight.type === 'strength' ? 'bg-green-50 border-green-400' :
                  insight.type === 'weakness' ? 'bg-red-50 border-red-400' :
                  insight.type === 'opportunity' ? 'bg-blue-50 border-blue-400' :
                  'bg-yellow-50 border-yellow-400'
                }`}
              >
                <div className="flex items-start space-x-2">
                  {insight.type === 'strength' && <TrendingUp className="w-5 h-5 text-green-600 mt-0.5" />}
                  {insight.type === 'weakness' && <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />}
                  {insight.type === 'opportunity' && <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5" />}
                  {insight.type === 'threat' && <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />}
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                        insight.impact === 'high' ? 'bg-red-100 text-red-800' :
                        insight.impact === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {insight.impact.toUpperCase()} IMPACT
                      </span>
                      <span className="text-xs text-gray-500 capitalize">{insight.category}</span>
                    </div>
                    <p className="text-sm text-gray-700">{insight.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center space-x-2 mb-4">
            <Lightbulb className="w-6 h-6 text-orange-600" />
            <h3 className="text-xl font-semibold text-gray-900">Recommendations</h3>
          </div>
          <div className="space-y-3">
            {recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                <div className="w-6 h-6 bg-orange-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {index + 1}
                </div>
                <p className="text-sm text-orange-800 font-medium">{recommendation}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category Performance Comparison */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Category Performance Comparison</h3>
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={categoryBreakdown}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" domain={[0, 100]} />
            <Tooltip />
            <Legend />
            <Bar yAxisId="left" dataKey="positive" fill="#10B981" name="Positive Reviews" />
            <Bar yAxisId="left" dataKey="negative" fill="#EF4444" name="Negative Reviews" />
            <Bar yAxisId="left" dataKey="neutral" fill="#6B7280" name="Neutral Reviews" />
            <Line 
              yAxisId="right" 
              type="monotone" 
              dataKey="positiveRate" 
              stroke="#059669" 
              strokeWidth={3}
              name="Positive Rate (%)"
            />
            <Line 
              yAxisId="left" 
              type="monotone" 
              dataKey="avgRating" 
              stroke="#DC2626" 
              strokeWidth={3}
              name="Average Rating"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Confidence Analysis */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Analysis Confidence Distribution</h3>
        <div className="mb-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>Average Confidence:</span>
            <span className="font-semibold text-blue-600">{(overallStats.avgConfidence * 100).toFixed(1)}%</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={reviews.map(r => ({ 
            confidence: (r.confidenceScore * 100).toFixed(0),
            sentiment: r.sentiment,
            rating: r.rating 
          })).reduce((acc, item) => {
            const key = item.confidence;
            const existing = acc.find(a => a.confidence === key);
            if (existing) {
              existing.count++;
            } else {
              acc.push({ confidence: key, count: 1 });
            }
            return acc;
          }, [] as Array<{ confidence: string; count: number }>)}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="confidence" />
            <YAxis />
            <Tooltip formatter={(value: any) => [`${value} reviews`, 'Count']} />
            <Bar dataKey="count" fill="#8B5CF6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}