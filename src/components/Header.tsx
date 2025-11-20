import React from 'react';
import { BarChart3, MessageSquare, TrendingUp, Plus, Brain } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Header({ activeTab, onTabChange }: HeaderProps) {
  const tabs = [
    { id: 'reviews', label: 'Reviews', icon: MessageSquare },
    { id: 'add-review', label: 'Add Review', icon: Plus },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'advanced', label: 'Advanced Analytics', icon: Brain }
  ];

  return (
    <div className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col">
          <div className="py-8">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                  Advanced Sentiment Analytics
                </h1>
                <p className="text-gray-600 mt-2 text-lg">AI-Powered Opinion Mining & Business Intelligence for Customer Reviews</p>
              </div>
            </div>
          </div>
          
          <nav className="flex space-x-8 -mb-px overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-all duration-200 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 bg-blue-50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}