import React, { useState } from 'react';
import { Patient, PredictionResult, DailyLog } from '../types';
import { getAnalysisFromDocument } from '../services/predictionService';
import PatientProfile from './PatientProfile';
import VitalsChart from './VitalsChart';
import PredictionCard from './PredictionCard';
import Recommendations from './Recommendations';
import DailyLogList from './DailyLogList';
import Spinner from './Spinner';

interface DashboardProps {
    patient: Patient;
    dailyLogs: DailyLog[];
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

const Dashboard: React.FC<DashboardProps> = ({ patient, dailyLogs }) => {
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
    } catch (err) {
      console.error('Error fetching analysis:', err);
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
      {/* Analysis Section */}
      <div className="lg:col-span-2 space-y-6 lg:space-y-8">
        {isLoading ? (
          <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center justify-center h-96">
            <Spinner />
            <p className="mt-4 text-lg text-slate-600">Analyzing your health data...</p>
          </div>
        ) : error ? (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-md" role="alert">
                <p className="font-bold">Error</p>
                <p>{error}</p>
                 <button onClick={resetAnalysis} className="mt-2 px-3 py-1 text-sm font-semibold rounded-md bg-red-200 text-red-800 hover:bg-red-300">
                    Try Again
                </button>
            </div>
        ) : analysisResult ? (
          <>
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-800">Analysis Result</h2>
                <button onClick={resetAnalysis} className="px-4 py-2 text-sm font-semibold rounded-md bg-slate-200 text-slate-700 hover:bg-slate-300">
                    Start New Analysis
                </button>
            </div>
            <PredictionCard prediction={analysisResult} />
            <Recommendations recommendations={analysisResult.recommendations} />
          </>
        ) : (
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Get a Deeper Health Analysis</h2>
            <p className="text-slate-600 mb-6">Describe your symptoms or upload a medical report (PDF, JPG, PNG) for an AI-powered analysis.</p>
            <form onSubmit={handleAnalysisSubmit} className="space-y-4">
              <div>
                <label htmlFor="manualInput" className="block text-sm font-medium text-slate-700">Describe your concerns</label>
                <textarea
                  id="manualInput"
                  rows={4}
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="e.g., I've been feeling tired and thirsty, and my latest lab report is attached."
                />
              </div>
              <div>
                <label htmlFor="file-upload" className="block text-sm font-medium text-slate-700">Upload a report (optional)</label>
                <div className="mt-1 flex items-center space-x-4">
                    <label htmlFor="file-upload" className="cursor-pointer rounded-md bg-white font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 px-3 py-2 border border-gray-300 shadow-sm">
                        <span>{selectedFile ? 'Change file' : 'Select a file'}</span>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" />
                    </label>
                    {selectedFile && (
                        <div className="flex items-center space-x-2 text-sm text-slate-600">
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

      {/* Patient Context Section */}
      <div className="space-y-6 lg:space-y-8">
        <PatientProfile patient={patient} logs={dailyLogs} />
        <VitalsChart logs={dailyLogs} />
      </div>

      {/* Daily Logs Section */}
      <div className="lg:col-span-3">
        <DailyLogList logs={dailyLogs} />
      </div>
    </div>
  );
};

export default Dashboard;