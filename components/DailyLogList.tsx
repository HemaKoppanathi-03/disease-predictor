import React from 'react';
import { DailyLog } from '../types';

interface DailyLogListProps {
  logs: DailyLog[];
}

const VitalStat: React.FC<{ icon: React.ReactNode; label: string; value: string; unit: string }> = ({ icon, label, value, unit }) => (
  <div className="flex items-center space-x-2">
    <div className="text-slate-500 dark:text-slate-400">{icon}</div>
    <div>
      <p className="text-slate-500 dark:text-slate-400 text-sm">{label}</p>
      <p className="font-medium text-slate-800 dark:text-slate-100">
        {value} <span className="text-xs">{unit}</span>
      </p>
    </div>
  </div>
);

const DailyLogList: React.FC<DailyLogListProps> = ({ logs }) => {
  if (!logs || logs.length === 0) {
    return (
      <p className="text-slate-500 dark:text-slate-400 py-4 text-center">No daily logs have been recorded for this patient.</p>
    );
  }

  const sortedLogs = [...logs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-4">
      {sortedLogs.map((log) => (
        <div key={log.log_id} className="border border-slate-200 dark:border-slate-700 p-4 rounded-lg hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md dark:hover:shadow-lg dark:hover:shadow-slate-900/50 transition-all duration-200">
          <p className="font-bold text-slate-700 dark:text-slate-200">
            {new Date(log.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <VitalStat 
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>}
              label="Blood Pressure"
              value={`${log.vitals.bp_systolic}/${log.vitals.bp_diastolic}`}
              unit="mmHg"
            />
            <VitalStat 
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
              label="Fasting Glucose"
              value={log.vitals.fasting_glucose.toString()}
              unit="mg/dL"
            />
            <VitalStat 
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}
              label="Heart Rate"
              value={log.vitals.heart_rate.toString()}
              unit="bpm"
            />
            <VitalStat 
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>}
              label="Sleep"
              value={log.sleep_hours.toString()}
              unit="hours"
            />
          </div>
          {log.symptoms.length > 0 && (
              <div className="mt-3">
                  <p className="text-sm text-slate-500 dark:text-slate-400">Reported Symptoms:</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                      {log.symptoms.map(symptom => (
                          <span key={symptom} className="bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300 text-xs font-medium px-2.5 py-0.5 rounded-full">{symptom}</span>
                      ))}
                  </div>
              </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default DailyLogList;