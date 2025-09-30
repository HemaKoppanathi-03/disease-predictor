import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DailyLog } from '../types';
import { Theme } from '../App';

interface VitalsChartProps {
  logs: DailyLog[];
  theme: Theme;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-700 p-3 rounded-lg shadow-lg border border-slate-200 dark:border-slate-600">
        <p className="font-bold text-slate-700 dark:text-slate-200">{label}</p>
        {payload.map((pld: any) => (
          <p key={pld.dataKey} style={{ color: pld.color }}>
            {`${pld.name}: ${pld.value}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};


const VitalsChart: React.FC<VitalsChartProps> = ({ logs, theme }) => {
  const chartData = logs.map(log => ({
    date: new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    'Fasting Glucose': log.vitals.fasting_glucose,
    'Systolic BP': log.vitals.bp_systolic,
    'Diastolic BP': log.vitals.bp_diastolic,
    'Heart Rate': log.vitals.heart_rate,
  })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  if (chartData.length <= 1) {
    return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg h-full flex items-center justify-center">
            <p className="text-slate-500 dark:text-slate-400">Not enough data to display trends.</p>
        </div>
    );
  }

  const tickColor = theme === 'dark' ? '#94a3b8' : '#64748b'; // slate-400 : slate-500
  const gridColor = theme === 'dark' ? '#334155' : '#e0e0e0'; // slate-700 : slate-200

  return (
    <>
      {/* Blood Pressure Chart */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">Blood Pressure Trend (mmHg)</h3>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <defs>
              <linearGradient id="colorSysBP" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorDiaBP" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#fbbf24" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="date" tick={{ fontSize: 12, fill: tickColor }} />
            <YAxis tick={{ fontSize: 12, fill: tickColor }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{fontSize: "14px", paddingTop: "10px"}} />
            <Area type="monotone" dataKey="Systolic BP" stroke="#3b82f6" strokeWidth={2} fill="url(#colorSysBP)" />
            <Area type="monotone" dataKey="Diastolic BP" stroke="#fbbf24" strokeWidth={2} fill="url(#colorDiaBP)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Glucose and Heart Rate Chart */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">Glucose (mg/dL) & Heart Rate (bpm)</h3>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <defs>
              <linearGradient id="colorGlucose" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorHR" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="date" tick={{ fontSize: 12, fill: tickColor }} />
            <YAxis yAxisId="left" tick={{ fontSize: 12, fill: '#8b5cf6' }} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12, fill: '#ef4444' }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{fontSize: "14px", paddingTop: "10px"}} />
            <Area yAxisId="left" type="monotone" dataKey="Fasting Glucose" stroke="#8b5cf6" strokeWidth={2} fill="url(#colorGlucose)" />
            <Area yAxisId="right" type="monotone" dataKey="Heart Rate" stroke="#ef4444" strokeWidth={2} fill="url(#colorHR)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </>
  );
};

export default VitalsChart;