
import React from 'react';
import { DailyLog } from '../types';

interface DailyLogListProps {
  logs: DailyLog[];
}

const DailyLogList: React.FC<DailyLogListProps> = ({ logs }) => {
  if (!logs || logs.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Recent Daily Logs</h2>
        <p className="text-slate-500">No daily logs have been recorded for this patient.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-xl font-bold text-slate-800 mb-4">Recent Daily Logs</h2>
      <div className="space-y-4">
        {logs.map((log) => (
          <div key={log.log_id} className="border border-slate-200 p-4 rounded-lg hover:bg-slate-50 transition-colors">
            <p className="font-bold text-slate-700">
              {new Date(log.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-slate-500">Blood Pressure</p>
                <p className="font-medium text-slate-800">{log.vitals.bp_systolic}/{log.vitals.bp_diastolic} <span className="text-xs">mmHg</span></p>
              </div>
              <div>
                <p className="text-slate-500">Fasting Glucose</p>
                <p className="font-medium text-slate-800">{log.vitals.fasting_glucose} <span className="text-xs">mg/dL</span></p>
              </div>
              <div>
                <p className="text-slate-500">Heart Rate</p>
                <p className="font-medium text-slate-800">{log.vitals.heart_rate} <span className="text-xs">bpm</span></p>
              </div>
              <div>
                <p className="text-slate-500">Sleep</p>
                <p className="font-medium text-slate-800">{log.sleep_hours} <span className="text-xs">hours</span></p>
              </div>
            </div>
            {log.symptoms.length > 0 && (
                <div className="mt-3">
                    <p className="text-sm text-slate-500">Reported Symptoms:</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                        {log.symptoms.map(symptom => (
                            <span key={symptom} className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">{symptom}</span>
                        ))}
                    </div>
                </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DailyLogList;
