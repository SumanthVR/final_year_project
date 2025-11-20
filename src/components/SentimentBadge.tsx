import React from 'react';
import { clsx } from 'clsx';

interface SentimentBadgeProps {
  sentiment: 'positive' | 'negative' | 'neutral';
  score?: number;
  size?: 'sm' | 'md' | 'lg';
}

export function SentimentBadge({ sentiment, score, size = 'md' }: SentimentBadgeProps) {
  const baseClasses = 'inline-flex items-center font-medium rounded-full';
  
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  const sentimentClasses = {
    positive: 'bg-green-100 text-green-800 border border-green-200',
    negative: 'bg-red-100 text-red-800 border border-red-200',
    neutral: 'bg-gray-100 text-gray-800 border border-gray-200'
  };

  return (
    <span className={clsx(baseClasses, sizeClasses[size], sentimentClasses[sentiment])}>
      {sentiment.charAt(0).toUpperCase() + sentiment.slice(1)}
      {score !== undefined && (
        <span className="ml-1 opacity-75">
          ({score > 0 ? '+' : ''}{score.toFixed(2)})
        </span>
      )}
    </span>
  );
}