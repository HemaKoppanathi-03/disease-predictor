
import React from 'react';
import { PredictionResult } from '../types';

interface PredictionCardProps {
  prediction: PredictionResult;
}

const RiskGauge: React.FC<{ probability: number, label: string }> = ({ probability, label }) => {
  const percentage = probability * 100;
  const rotation = -90 + (percentage * 1.8);

  const colorClasses = {
    Low: { bg: 'bg-green-500', text: 'text-green-600 dark:text-green-400' },
    Medium: { bg: 'bg-yellow-500', text: 'text-yellow-600 dark:text-yellow-400' },
    High: { bg: 'bg-red-500', text: 'text-red-600 dark:text-red-400' },
  };
  const color = colorClasses[label as keyof typeof colorClasses] || colorClasses.Medium;

  return (
    <div className="relative w-48 h-24 overflow-hidden mx-auto">
      <div className="absolute w-48 h-48 rounded-full border-[24px] border-slate-200 dark:border-slate-700 top-0"></div>
      <div
        className={`absolute w-48 h-48 rounded-full border-[24px] border-transparent ${color.bg} top-0`}
        style={{
          clipPath: `polygon(50% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%)`,
          transform: `rotate(${rotation}deg)`,
          transition: 'transform 1s ease-out'
        }}
      ></div>
      <div className="absolute w-48 h-48 rounded-full border-t-[24px] border-transparent border-slate-200 dark:border-slate-700 top-0 transform rotate-[-90deg]"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/3 text-center">
        <div className={`text-4xl font-bold ${color.text}`}>{label}</div>
        <div className="text-sm text-slate-500 dark:text-slate-400">Risk Level</div>
      </div>
    </div>
  );
};


const PredictionCard: React.FC<PredictionCardProps> = ({ prediction }) => {
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div className="text-center md:text-left">
          <h2 className="text-sm font-semibold uppercase text-blue-600 dark:text-blue-400 tracking-wide">Primary Risk Assessment</h2>
          <p className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 my-2">{prediction.disease}</p>
          <p className="text-slate-600 dark:text-slate-400">
            Based on the provided health data, the AI has identified the primary area of health risk.
          </p>
        </div>
        <div className="flex flex-col items-center">
          <RiskGauge probability={prediction.riskProbability} label={prediction.riskLabel} />
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Risk Probability: <span className="font-bold">{(prediction.riskProbability * 100).toFixed(0)}%</span></p>
        </div>
      </div>
      <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-3">Key Contributing Factors</h3>
        <ul className="space-y-2">
          {prediction.topContributors.map((factor, index) => (
            <li key={index} className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.21 3.03-1.742 3.03H4.42c-1.532 0-2.492-1.696-1.742-3.03l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="text-slate-700 dark:text-slate-300">{factor}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PredictionCard;