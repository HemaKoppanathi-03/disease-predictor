import React, { useState } from 'react';
import { Patient, PredictionResult, DailyLog } from '../types';
import { getAnalysisFromDocument } from '../services/predictionService';
import PatientProfile from './PatientProfile';
import VitalsChart from './VitalsChart';
import PredictionCard from './PredictionCard';
import Recommendations from './Recommendations';
import DailyLogList from './DailyLogList';
import Spinner from './Spinner';
import { Theme } from '../App';

interface DashboardProps {
    patient: Patient;
    dailyLogs: DailyLog[];
    theme: Theme;
}

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // remove the "data:mime/type;base64," prefix
      resolve(result.split(',')[1]);
    };
    reader.onerror = (error) => reject(error);
  });
};

const calculateAge = (dob: string): number => {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

const Dashboard: React.FC<DashboardProps> = ({ patient, dailyLogs, theme }) => {
  const [analysisResult, setAnalysisResult] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [manualInput, setManualInput] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleAnalysisSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualInput && !selectedFile) {
      setError("Please provide some input or upload a file to analyze.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      let fileData: { mimeType: string; data: string } | null = null;
      if (selectedFile) {
        const base64Data = await fileToBase64(selectedFile);
        fileData = {
          mimeType: selectedFile.type,
          data: base64Data,
        };
      }
      const result = await getAnalysisFromDocument(patient, manualInput, fileData);
      setAnalysisResult(result);
      // FIX: The try-catch-finally block had a syntax error. Braces were missing from the catch block.
    } catch (err) {
      setError('Failed to get an analysis from the AI. Please check your API key and try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const resetAnalysis = () => {
    setAnalysisResult(null);
    setManualInput('');
    setSelectedFile(null);
    setError(null);
  }

  const handleExportCSV = () => {
    if (!patient || dailyLogs.length === 0) {
      return;
    }

    const age = calculateAge(patient.dob);
    
    const headers = [
      'patient_id', 'name_alias', 'age', 'sex', 'baseline_BMI',
      'log_id', 'date', 'bp_systolic', 'bp_diastolic', 
      'fasting_glucose', 'heart_rate', 'sleep_hours', 'symptoms'
    ];

    const escapeCsvCell = (cellData: any) => {
      const stringData = String(cellData);
      if (stringData.includes(',') || stringData.includes('"') || stringData.includes('\n')) {
        return `"${stringData.replace(/"/g, '""')}"`;
      }
      return stringData;
    };

    const rows = dailyLogs.map(log => {
      const patientData = [
        patient.patient_id,
        patient.name_alias,
        age,
        patient.sex,
        patient.baseline_BMI,
      ];
      const logData = [
        log.log_id,
        log.date,
        log.vitals.bp_systolic,
        log.vitals.bp_diastolic,
        log.vitals.fasting_glucose,
        log.vitals.heart_rate,
        log.sleep_hours,
        log.symptoms.join(', '),
      ];
      return [...patientData, ...logData].map(escapeCsvCell).join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    const patientName = patient.name_alias.replace(/\s+/g, '_');
    const today = new Date().toISOString().slice(0, 10);
    link.setAttribute('download', `${patientName}_health_data_${today}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
      {/* Analysis Section - spans all 3 columns */}
      <div className="lg:col-span-3 space-y-6 lg:space-y-8">
        {isLoading ? (
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg flex flex-col items-center justify-center h-96">
            <Spinner />
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">Analyzing your health data...</p>
          </div>
        ) : error ? (
            <div className="bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-300 p-4 rounded-md shadow-md" role="alert">
                <p className="font-bold">Error</p>
                <p>{error}</p>
                 <button onClick={resetAnalysis} className="mt-2 px-3 py-1 text-sm font-semibold rounded-md bg-red-200 dark:bg-red-500/30 text-red-800 dark:text-red-200 hover:bg-red-300 dark:hover:bg-red-500/40">
                    Try Again
                </button>
            </div>
        ) : analysisResult ? (
          <>
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Analysis Result</h2>
                <button onClick={resetAnalysis} className="px-4 py-2 text-sm font-semibold rounded-md bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600">
                    Start New Analysis
                </button>
            </div>
            <PredictionCard prediction={analysisResult} />
            <Recommendations recommendations={analysisResult.recommendations} />
          </>
        ) : (
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">Get a Deeper Health Analysis</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">Describe your symptoms or upload a medical report (PDF, JPG, PNG) for an AI-powered analysis.</p>
            <form onSubmit={handleAnalysisSubmit} className="space-y-4">
              <div>
                <label htmlFor="manualInput" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Describe your concerns</label>
                <textarea
                  id="manualInput"
                  rows={4}
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-slate-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-700 dark:text-slate-200"
                  placeholder="e.g., I've been feeling tired and thirsty, and my latest lab report is attached."
                />
              </div>
              <div>
                <label htmlFor="file-upload" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Upload a report (optional)</label>
                <div className="mt-1 flex items-center space-x-4">
                    <label htmlFor="file-upload" className="cursor-pointer rounded-md bg-white dark:bg-slate-700 font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 dark:focus-within:ring-offset-slate-800 px-3 py-2 border border-gray-300 dark:border-slate-600 shadow-sm">
                        <span>{selectedFile ? 'Change file' : 'Select a file'}</span>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" />
                    </label>
                    {selectedFile && (
                        <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                            <span>{selectedFile.name}</span>
                            <button type="button" onClick={() => setSelectedFile(null)} className="font-bold text-red-500 hover:text-red-700">&times;</button>
                        </div>
                    )}
                </div>
              </div>
              <div className="text-right">
                <button type="submit" disabled={!manualInput && !selectedFile} className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-6 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300 disabled:cursor-not-allowed">
                  Analyze Now
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Patient Profile - spans 1 column on large screens */}
      <div className="lg:col-span-1">
        <PatientProfile patient={patient} logs={dailyLogs} />
      </div>

      {/* Vitals Charts - spans 2 columns on large screens */}
      <div className="lg:col-span-2 space-y-6 lg:space-y-8">
        <VitalsChart logs={dailyLogs} theme={theme} />
      </div>

      {/* Daily Logs Section - spans all 3 columns */}
      <div className="lg:col-span-3 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Recent Daily Logs</h2>
            <button 
                onClick={handleExportCSV} 
                disabled={dailyLogs.length === 0}
                className="inline-flex items-center space-x-2 px-4 py-2 text-sm font-semibold rounded-md bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>Export to CSV</span>
            </button>
        </div>
        <DailyLogList logs={dailyLogs} />
      </div>
    </div>
  );
};

export default Dashboard;