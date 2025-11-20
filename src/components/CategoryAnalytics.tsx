import React, { useMemo } from 'react';
import { Review, HotelMetrics, RestaurantMetrics } from '../types/review';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ComposedChart,
  Line,
  Area
} from 'recharts';
import { Hotel, Utensils, Package, Star, TrendingUp, Award } from 'lucide-react';

interface CategoryAnalyticsProps {
  reviews: Review[];
  selectedCategory: 'hotel' | 'restaurant' | 'product';
}

export function CategoryAnalytics({ reviews, selectedCategory }: CategoryAnalyticsProps) {
  const categoryReviews = reviews.filter(r => r.category === selectedCategory);

  const metrics = useMemo(() => {
    if (categoryReviews.length === 0) return null;

    const totalReviews = categoryReviews.length;
    const avgRating = categoryReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews;
    const recommendationRate = (categoryReviews.filter(r => r.rating >= 4).length / totalReviews) * 100;

    if (selectedCategory === 'hotel') {
      const hotelMetrics: HotelMetrics = {
        overallRating: avgRating,
        serviceRating: categoryReviews.reduce((sum, r) => sum + (r.detailedRatings?.service || r.rating), 0) / totalReviews,
        cleanlinessRating: categoryReviews.reduce((sum, r) => sum + (r.detailedRatings?.cleanliness || r.rating), 0) / totalReviews,
        locationRating: categoryReviews.reduce((sum, r) => sum + (r.detailedRatings?.location || r.rating), 0) / totalReviews,
        valueRating: categoryReviews.reduce((sum, r) => sum + (r.detailedRatings?.value || r.rating), 0) / totalReviews,
        amenitiesRating: categoryReviews.reduce((sum, r) => sum + (r.detailedRatings?.atmosphere || r.rating), 0) / totalReviews,
        totalReviews,
        recommendationRate
      };
      return hotelMetrics;
    } else if (selectedCategory === 'restaurant') {
      const restaurantMetrics: RestaurantMetrics = {
        overallRating: avgRating,
        foodQuality: categoryReviews.reduce((sum, r) => sum + (r.detailedRatings?.quality || r.rating), 0) / totalReviews,
        serviceRating: categoryReviews.reduce((sum, r) => sum + (r.detailedRatings?.service || r.rating), 0) / totalReviews,
        atmosphere: categoryReviews.reduce((sum, r) => sum + (r.detailedRatings?.atmosphere || r.rating), 0) / totalReviews,
        valueRating: categoryReviews.reduce((sum, r) => sum + (r.detailedRatings?.value || r.rating), 0) / totalReviews,
        totalReviews,
        recommendationRate,
        popularDishes: extractPopularDishes(categoryReviews)
      };
      return restaurantMetrics;
    }

    return {
      overallRating: avgRating,
      totalReviews,
      recommendationRate,
      qualityRating: categoryReviews.reduce((sum, r) => sum + (r.detailedRatings?.quality || r.rating), 0) / totalReviews,
      valueRating: categoryReviews.reduce((sum, r) => sum + (r.detailedRatings?.value || r.rating), 0) / totalReviews
    };
  }, [categoryReviews, selectedCategory]);

  const ratingDistribution = useMemo(() => {
    return [1, 2, 3, 4, 5].map(rating => ({
      rating: `${rating} Star${rating > 1 ? 's' : ''}`,
      count: categoryReviews.filter(r => r.rating === rating).length,
      percentage: (categoryReviews.filter(r => r.rating === rating).length / categoryReviews.length) * 100
    }));
  }, [categoryReviews]);

  const sentimentOverTime = useMemo(() => {
    const monthlyData = categoryReviews.reduce((acc, review) => {
      const month = new Date(review.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      if (!acc[month]) {
        acc[month] = { month, positive: 0, negative: 0, neutral: 0, avgRating: 0, total: 0 };
      }
      acc[month][review.sentiment]++;
      acc[month].avgRating += review.rating;
      acc[month].total++;
      return acc;
    }, {} as Record<string, any>);

    return Object.values(monthlyData)
      .map((month: any) => ({
        ...month,
        avgRating: month.total > 0 ? month.avgRating / month.total : 0,
        positiveRate: month.total > 0 ? (month.positive / month.total) * 100 : 0
      }))
      .sort((a: any, b: any) => new Date(a.month).getTime() - new Date(b.month).getTime());
  }, [categoryReviews]);

  if (!metrics || categoryReviews.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500 text-lg">No {selectedCategory} reviews available</p>
      </div>
    );
  }

  const getCategoryIcon = () => {
    switch (selectedCategory) {
      case 'hotel': return <Hotel className="w-8 h-8 text-blue-600" />;
      case 'restaurant': return <Utensils className="w-8 h-8 text-orange-600" />;
      default: return <Package className="w-8 h-8 text-purple-600" />;
    }
  };

  const getRadarData = () => {
    if (selectedCategory === 'hotel') {
      const hotelMetrics = metrics as HotelMetrics;
      return [
        { aspect: 'Service', rating: hotelMetrics.serviceRating, fullMark: 5 },
        { aspect: 'Cleanliness', rating: hotelMetrics.cleanlinessRating, fullMark: 5 },
        { aspect: 'Location', rating: hotelMetrics.locationRating, fullMark: 5 },
        { aspect: 'Value', rating: hotelMetrics.valueRating, fullMark: 5 },
        { aspect: 'Amenities', rating: hotelMetrics.amenitiesRating, fullMark: 5 }
      ];
    } else if (selectedCategory === 'restaurant') {
      const restaurantMetrics = metrics as RestaurantMetrics;
      return [
        { aspect: 'Food Quality', rating: restaurantMetrics.foodQuality, fullMark: 5 },
        { aspect: 'Service', rating: restaurantMetrics.serviceRating, fullMark: 5 },
        { aspect: 'Atmosphere', rating: restaurantMetrics.atmosphere, fullMark: 5 },
        { aspect: 'Value', rating: restaurantMetrics.valueRating, fullMark: 5 }
      ];
    }
    return [];
  };

  return (
    <div className="space-y-8">
      {/* Category Header */}
      <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            {getCategoryIcon()}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 capitalize">{selectedCategory} Analytics</h2>
              <p className="text-gray-600 mt-1">Detailed insights for {metrics.totalReviews} reviews</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-blue-600">{metrics.overallRating?.toFixed(1)}</div>
            <div className="text-sm text-gray-500">Overall Rating</div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">Recommendation Rate</p>
                <p className="text-3xl font-bold text-green-800">{metrics.recommendationRate?.toFixed(0)}%</p>
              </div>
              <Award className="w-12 h-12 text-green-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">Total Reviews</p>
                <p className="text-3xl font-bold text-blue-800">{metrics.totalReviews}</p>
              </div>
              <Star className="w-12 h-12 text-blue-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700">Growth Trend</p>
                <p className="text-3xl font-bold text-purple-800">+12%</p>
              </div>
              <TrendingUp className="w-12 h-12 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Rating Distribution */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Rating Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ratingDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="rating" />
              <YAxis />
              <Tooltip 
                formatter={(value: any, name: string) => [
                  name === 'count' ? `${value} reviews` : `${value.toFixed(1)}%`, 
                  name === 'count' ? 'Reviews' : 'Percentage'
                ]}
              />
              <Bar dataKey="count" fill="#3B82F6" name="count" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Performance Radar */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Performance Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={getRadarData()}>
              <PolarGrid />
              <PolarAngleAxis dataKey="aspect" />
              <PolarRadiusAxis domain={[0, 5]} />
              <Radar
                name="Rating"
                dataKey="rating"
                stroke="#3B82F6"
                fill="#3B82F6"
                fillOpacity={0.3}
                strokeWidth={2}
              />
              <Tooltip formatter={(value: any) => [`${value.toFixed(1)}/5`, 'Rating']} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Sentiment Trend Over Time */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Sentiment & Rating Trends</h3>
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={sentimentOverTime}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
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

      {/* Category-Specific Insights */}
      {selectedCategory === 'restaurant' && 'popularDishes' in metrics && (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Popular Menu Items</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(metrics as RestaurantMetrics).popularDishes.map((dish, index) => (
              <div key={index} className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-4 border border-orange-200">
                <h4 className="font-semibold text-orange-900">{dish.dish}</h4>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm text-orange-700">{dish.mentions} mentions</span>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    dish.sentiment > 0.3 ? 'bg-green-100 text-green-800' :
                    dish.sentiment < -0.3 ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {dish.sentiment > 0.3 ? 'Loved' : dish.sentiment < -0.3 ? 'Disliked' : 'Mixed'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function extractPopularDishes(reviews: Review[]): Array<{ dish: string; mentions: number; sentiment: number }> {
  const dishKeywords = ['pasta', 'pizza', 'steak', 'salad', 'soup', 'burger', 'fish', 'chicken', 'risotto', 'tiramisu', 'dessert'];
  const dishMentions: Record<string, { count: number; totalSentiment: number }> = {};

  reviews.forEach(review => {
    const content = review.content.toLowerCase();
    dishKeywords.forEach(dish => {
      if (content.includes(dish)) {
        if (!dishMentions[dish]) {
          dishMentions[dish] = { count: 0, totalSentiment: 0 };
        }
        dishMentions[dish].count++;
        dishMentions[dish].totalSentiment += review.sentimentScore;
      }
    });
  });

  return Object.entries(dishMentions)
    .map(([dish, data]) => ({
      dish: dish.charAt(0).toUpperCase() + dish.slice(1),
      mentions: data.count,
      sentiment: data.count > 0 ? data.totalSentiment / data.count : 0
    }))
    .filter(dish => dish.mentions > 0)
    .sort((a, b) => b.mentions - a.mentions)
    .slice(0, 6);
}