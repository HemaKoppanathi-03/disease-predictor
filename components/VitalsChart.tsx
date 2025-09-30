
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DailyLog } from '../types';

interface VitalsChartProps {
  logs: DailyLog[];
}

const VitalsChart: React.FC<VitalsChartProps> = ({ logs }) => {
  const chartData = logs.map(log => ({
    date: new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    'Fasting Glucose': log.vitals.fasting_glucose,
    'Systolic BP': log.vitals.bp_systolic,
    'Diastolic BP': log.vitals.bp_diastolic,
  })).reverse();

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-xl font-bold text-slate-800 mb-4">Vitals Trend</h2>
      {chartData.length > 1 ? (
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend wrapperStyle={{fontSize: "14px"}} />
            <Line yAxisId="left" type="monotone" dataKey="Fasting Glucose" stroke="#8884d8" strokeWidth={2} activeDot={{ r: 8 }} />
            <Line yAxisId="right" type="monotone" dataKey="Systolic BP" stroke="#82ca9d" strokeWidth={2} />
            <Line yAxisId="right" type="monotone" dataKey="Diastolic BP" stroke="#ffc658" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-[250px]">
            <p className="text-slate-500">Not enough data to display a trend.</p>
        </div>
      )}
    </div>
  );
};

export default VitalsChart;
