
import React from 'react';
import { Recommendation } from '../types';

interface RecommendationsProps {
  recommendations: Recommendation[];
}

const CategoryIcon: React.FC<{ category: Recommendation['category'] }> = ({ category }) => {
  const icons = {
    Diet: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M19 3v4M3 10h18M9 16h6" />
      </svg>
    ),
    Lifestyle: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    Monitoring: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  };
  return icons[category] || null;
};

const categoryColors = {
    Diet: { bg: 'bg-green-100 dark:bg-green-900/50', text: 'text-green-800 dark:text-green-300' },
    Lifestyle: { bg: 'bg-sky-100 dark:bg-sky-900/50', text: 'text-sky-800 dark:text-sky-300' },
    Monitoring: { bg: 'bg-purple-100 dark:bg-purple-900/50', text: 'text-purple-800 dark:text-purple-300' },
}

const Recommendations: React.FC<RecommendationsProps> = ({ recommendations }) => {
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
      <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Personalized Recommendations</h2>
      <div className="space-y-4">
        {recommendations.map((rec, index) => {
          const colors = categoryColors[rec.category] || { bg: 'bg-gray-100 dark:bg-slate-700', text: 'text-gray-800 dark:text-slate-300' };
          return (
            <div key={index} className={`p-4 rounded-lg flex items-start space-x-4 ${colors.bg}`}>
              <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${colors.text}`}>
                <CategoryIcon category={rec.category} />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                    <h3 className={`font-bold ${colors.text}`}>{rec.title}</h3>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${colors.bg} ${colors.text} border border-current`}>{rec.category}</span>
                </div>
                <p className={`text-sm ${colors.text} opacity-90 mt-1`}>{rec.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Recommendations;