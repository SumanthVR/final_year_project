import React, { useMemo } from 'react';
import { Review, SentimentStats, CategoryBreakdown } from '../types/review';
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
  Area
} from 'recharts';
import { TrendingUp, MessageSquare, Star, BarChart3 } from 'lucide-react';

interface AnalyticsProps {
  reviews: Review[];
}

export function Analytics({ reviews }: AnalyticsProps) {
  const sentimentStats: SentimentStats = useMemo(() => {
    const positive = reviews.filter(r => r.sentiment === 'positive').length;
    const negative = reviews.filter(r => r.sentiment === 'negative').length;
    const neutral = reviews.filter(r => r.sentiment === 'neutral').length;
    const total = reviews.length;
    
    const averageScore = reviews.reduce((sum, r) => sum + r.sentimentScore, 0) / total;
    
    return {
      positive: total > 0 ? (positive / total) * 100 : 0,
      negative: total > 0 ? (negative / total) * 100 : 0,
      neutral: total > 0 ? (neutral / total) * 100 : 0,
      averageScore,
      totalReviews: total
    };
  }, [reviews]);

  const categoryBreakdown: CategoryBreakdown[] = useMemo(() => {
    const categories = ['hotel', 'restaurant', 'product'];
    
    return categories.map(category => {
      const categoryReviews = reviews.filter(r => r.category === category);
      const positive = categoryReviews.filter(r => r.sentiment === 'positive').length;
      const negative = categoryReviews.filter(r => r.sentiment === 'negative').length;
      const neutral = categoryReviews.filter(r => r.sentiment === 'neutral').length;
      const total = categoryReviews.length;
      const averageRating = total > 0 ? categoryReviews.reduce((sum, r) => sum + r.rating, 0) / total : 0;
      
      return {
        category: category.charAt(0).toUpperCase() + category.slice(1),
        positive,
        negative,
        neutral,
        total,
        averageRating
      };
    }).filter(cat => cat.total > 0);
  }, [reviews]);

  const sentimentTrendData = useMemo(() => {
    const monthlyData = reviews.reduce((acc, review) => {
      const month = new Date(review.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      if (!acc[month]) {
        acc[month] = { month, positive: 0, negative: 0, neutral: 0, total: 0 };
      }
      acc[month][review.sentiment]++;
      acc[month].total++;
      return acc;
    }, {} as Record<string, any>);

    return Object.values(monthlyData).sort((a: any, b: any) => 
      new Date(a.month).getTime() - new Date(b.month).getTime()
    );
  }, [reviews]);

  const pieChartData = [
    { name: 'Positive', value: sentimentStats.positive, color: '#10B981' },
    { name: 'Negative', value: sentimentStats.negative, color: '#EF4444' },
    { name: 'Neutral', value: sentimentStats.neutral, color: '#6B7280' }
  ];

  const topPros = useMemo(() => {
    const prosCount = reviews.reduce((acc, review) => {
      review.pros.forEach(pro => {
        const truncated = pro.length > 30 ? pro.substring(0, 30) + '...' : pro;
        acc[truncated] = (acc[truncated] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(prosCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([aspect, count]) => ({ aspect, count }));
  }, [reviews]);

  const topCons = useMemo(() => {
    const consCount = reviews.reduce((acc, review) => {
      review.cons.forEach(con => {
        const truncated = con.length > 30 ? con.substring(0, 30) + '...' : con;
        acc[truncated] = (acc[truncated] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(consCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([aspect, count]) => ({ aspect, count }));
  }, [reviews]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Reviews</p>
              <p className="text-3xl font-bold text-gray-900">{sentimentStats.totalReviews}</p>
            </div>
            <MessageSquare className="w-12 h-12 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Positive</p>
              <p className="text-3xl font-bold text-green-600">{sentimentStats.positive.toFixed(0)}%</p>
            </div>
            <TrendingUp className="w-12 h-12 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Score</p>
              <p className="text-3xl font-bold text-purple-600">{sentimentStats.averageScore.toFixed(2)}</p>
            </div>
            <BarChart3 className="w-12 h-12 text-purple-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Rating</p>
              <p className="text-3xl font-bold text-yellow-600">
                {(reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)}
              </p>
            </div>
            <Star className="w-12 h-12 text-yellow-500" />
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Sentiment Distribution Pie Chart */}
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
                outerRadius={80}
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

        {/* Category Breakdown */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Category Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryBreakdown}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="positive" fill="#10B981" name="Positive" />
              <Bar dataKey="negative" fill="#EF4444" name="Negative" />
              <Bar dataKey="neutral" fill="#6B7280" name="Neutral" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Sentiment Trend */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Sentiment Trend Over Time</h3>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={sentimentTrendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area
              type="monotone"
              dataKey="positive"
              stackId="1"
              stroke="#10B981"
              fill="#10B981"
              fillOpacity={0.6}
              name="Positive"
            />
            <Area
              type="monotone"
              dataKey="neutral"
              stackId="1"
              stroke="#6B7280"
              fill="#6B7280"
              fillOpacity={0.6}
              name="Neutral"
            />
            <Area
              type="monotone"
              dataKey="negative"
              stackId="1"
              stroke="#EF4444"
              fill="#EF4444"
              fillOpacity={0.6}
              name="Negative"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Top Feedback Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Positive Aspects */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Top Positive Aspects</h3>
          {topPros.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topPros} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="aspect" type="category" width={100} />
                <Tooltip />
                <Bar dataKey="count" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center py-12">No positive aspects identified yet.</p>
          )}
        </div>

        {/* Top Areas for Improvement */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Top Areas for Improvement</h3>
          {topCons.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topCons} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="aspect" type="category" width={100} />
                <Tooltip />
                <Bar dataKey="count" fill="#EF4444" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center py-12">No areas for improvement identified yet.</p>
          )}
        </div>
      </div>

      {/* Category Performance */}
      <div className="mt-8 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Category Performance</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={categoryBreakdown}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="averageRating"
              stroke="#3B82F6"
              strokeWidth={3}
              dot={{ fill: '#3B82F6', strokeWidth: 2, r: 6 }}
              name="Average Rating"
            />
            <Line
              type="monotone"
              dataKey="total"
              stroke="#8B5CF6"
              strokeWidth={3}
              dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 6 }}
              name="Total Reviews"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}