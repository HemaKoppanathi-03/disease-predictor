import React, { useState, useEffect } from 'react';
import { AdHocPredictionData, PredictionResult } from '../types';
import { getAdHocPrediction } from '../services/predictionService';
import Spinner from './Spinner';
import PredictionCard from './PredictionCard';
import Recommendations from './Recommendations';

const initialState: AdHocPredictionData = {
    age: '45',
    sex: 'M',
    height_cm: '170',
    weight_kg: '82',
    bp_systolic: '130',
    bp_diastolic: '85',
    fasting_glucose: '115',
    known_conditions: 'Prediabetes',
    family_history: 'Diabetes',
    symptoms: 'Occasional fatigue, frequent thirst',
    activity_level: 'low',
    smoker: false,
    alcohol: true,
    food_pattern_summary: 'Heavy rice-based dinners, frequent sweets',
};

const Predictor: React.FC = () => {
    const [formData, setFormData] = useState<AdHocPredictionData>(initialState);
    const [prediction, setPrediction] = useState<PredictionResult | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [bmi, setBmi] = useState<string | null>(null);

    useEffect(() => {
        const h = parseFloat(formData.height_cm);
        const w = parseFloat(formData.weight_kg);
        if (h > 0 && w > 0) {
            const bmiValue = (w / ((h / 100) ** 2)).toFixed(1);
            setBmi(bmiValue);
        } else {
            setBmi(null);
        }
    }, [formData.height_cm, formData.weight_kg]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setPrediction(null);
        try {
            const result = await getAdHocPrediction(formData);
            setPrediction(result);
        } catch (err) {
            console.error('Error fetching prediction:', err);
            setError('Failed to get a prediction from the AI. Please check your API key and try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="mb-6 text-center">
                    <h2 className="text-2xl font-bold text-slate-800">Disease Risk Predictor</h2>
                    <p className="text-slate-600 mt-1">Enter the details below to get an AI-powered risk assessment.</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Form Sections */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-1">
                            <label htmlFor="age" className="block text-sm font-medium text-slate-700">Age</label>
                            <input type="number" name="age" id="age" value={formData.age} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" required />
                        </div>
                        <div className="md:col-span-1">
                            <label htmlFor="sex" className="block text-sm font-medium text-slate-700">Sex</label>
                            <select name="sex" id="sex" value={formData.sex} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" required>
                                <option value="M">Male</option>
                                <option value="F">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                         <div className="md:col-span-1">
                            <label className="block text-sm font-medium text-slate-700">Calculated BMI</label>
                            <div className="mt-1 px-3 py-2 block w-full rounded-md bg-slate-100 border-gray-300">
                                {bmi ? <span className="font-bold text-slate-800">{bmi}</span> : <span className="text-slate-500">Enter Height/Weight</span>}
                            </div>
                        </div>
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="height_cm" className="block text-sm font-medium text-slate-700">Height (cm)</label>
                            <input type="number" name="height_cm" id="height_cm" value={formData.height_cm} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" required />
                        </div>
                        <div>
                            <label htmlFor="weight_kg" className="block text-sm font-medium text-slate-700">Weight (kg)</label>
                            <input type="number" name="weight_kg" id="weight_kg" value={formData.weight_kg} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" required />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                         <div>
                            <label htmlFor="bp_systolic" className="block text-sm font-medium text-slate-700">Systolic BP (mmHg)</label>
                            <input type="number" name="bp_systolic" id="bp_systolic" value={formData.bp_systolic} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" required />
                        </div>
                        <div>
                            <label htmlFor="bp_diastolic" className="block text-sm font-medium text-slate-700">Diastolic BP (mmHg)</label>
                            <input type="number" name="bp_diastolic" id="bp_diastolic" value={formData.bp_diastolic} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" required />
                        </div>
                        <div>
                            <label htmlFor="fasting_glucose" className="block text-sm font-medium text-slate-700">Fasting Glucose (mg/dL)</label>
                            <input type="number" name="fasting_glucose" id="fasting_glucose" value={formData.fasting_glucose} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" required />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div>
                            <label htmlFor="known_conditions" className="block text-sm font-medium text-slate-700">Known Conditions (comma-separated)</label>
                            <input type="text" name="known_conditions" id="known_conditions" value={formData.known_conditions} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label htmlFor="family_history" className="block text-sm font-medium text-slate-700">Family History (comma-separated)</label>
                            <input type="text" name="family_history" id="family_history" value={formData.family_history} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="symptoms" className="block text-sm font-medium text-slate-700">Reported Symptoms (comma-separated)</label>
                        <textarea name="symptoms" id="symptoms" value={formData.symptoms} onChange={handleChange} rows={2} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" placeholder="e.g., frequent headaches, dizziness, fatigue"></textarea>
                    </div>
                     <div>
                        <label htmlFor="food_pattern_summary" className="block text-sm font-medium text-slate-700">Food Pattern Summary</label>
                        <textarea name="food_pattern_summary" id="food_pattern_summary" value={formData.food_pattern_summary} onChange={handleChange} rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"></textarea>
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                        <div>
                            <label htmlFor="activity_level" className="block text-sm font-medium text-slate-700">Activity Level</label>
                            <select name="activity_level" id="activity_level" value={formData.activity_level} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" required>
                                <option value="sedentary">Sedentary</option>
                                <option value="low">Low</option>
                                <option value="moderate">Moderate</option>
                                <option value="active">Active</option>
                            </select>
                        </div>
                        <div className="flex items-start">
                            <div className="flex h-5 items-center">
                                <input id="smoker" name="smoker" type="checkbox" checked={formData.smoker} onChange={handleChange} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                            </div>
                            <div className="ml-3 text-sm">
                                <label htmlFor="smoker" className="font-medium text-slate-700">Smoker</label>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <div className="flex h-5 items-center">
                                <input id="alcohol" name="alcohol" type="checkbox" checked={formData.alcohol} onChange={handleChange} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                            </div>
                            <div className="ml-3 text-sm">
                                <label htmlFor="alcohol" className="font-medium text-slate-700">Consumes Alcohol</label>
                            </div>
                        </div>
                    </div>

                    <div className="text-right">
                        <button type="submit" disabled={isLoading} className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-6 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300 disabled:cursor-not-allowed">
                            {isLoading ? 'Analyzing...' : 'Get Prediction'}
                        </button>
                    </div>
                </form>
            </div>

            {isLoading && (
                <div className="flex flex-col items-center justify-center py-10">
                    <Spinner />
                    <p className="mt-4 text-lg text-slate-600">Generating AI prediction...</p>
                </div>
            )}

            {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-md" role="alert">
                    <p className="font-bold">Error</p>
                    <p>{error}</p>
                </div>
            )}

            {prediction && (
                <div className="space-y-6 lg:space-y-8">
                    <PredictionCard prediction={prediction} />
                    <Recommendations recommendations={prediction.recommendations} />
                </div>
            )}
        </div>
    );
};

export default Predictor;