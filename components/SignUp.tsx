import React, { useState } from 'react';
import { Patient } from '../types';

interface SignUpProps {
    onSignUp: (patient: Patient) => void;
    onNavigateToLogin: () => void;
}

const SignUp: React.FC<SignUpProps> = ({ onSignUp, onNavigateToLogin }) => {
    const [formData, setFormData] = useState({
        username: 'johndoe',
        password: 'password123',
        name_alias: 'John Doe',
        dob: '1990-01-01',
        sex: 'M',
        height_cm: '180',
        weight_kg: '85',
        known_conditions: 'None',
        medications: 'None',
        family_history: 'None',
        smoker: false,
        alcohol: true,
        activity_level: 'moderate',
        food_pattern_summary: 'Balanced diet, occasionally eats out.',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const height = parseFloat(formData.height_cm);
        const weight = parseFloat(formData.weight_kg);
        const bmi = (weight / ((height / 100) ** 2));

        const newPatient: Patient = {
            patient_id: `user_${new Date().getTime()}`,
            username: formData.username,
            password: formData.password,
            name_alias: formData.name_alias,
            dob: formData.dob,
            sex: formData.sex as 'M' | 'F' | 'Other',
            height_cm: height,
            weight_kg: weight,
            baseline_BMI: parseFloat(bmi.toFixed(1)),
            known_conditions: formData.known_conditions.split(',').map(s => s.trim()).filter(Boolean),
            medications: formData.medications.split(',').map(s => s.trim()).filter(Boolean),
            family_history: formData.family_history.split(',').map(s => s.trim()).filter(Boolean),
            lifestyle_flags: {
                smoker: formData.smoker,
                alcohol: formData.alcohol,
                activity_level: formData.activity_level as 'sedentary' | 'low' | 'moderate' | 'active',
            },
            food_pattern_summary: formData.food_pattern_summary,
        };
        onSignUp(newPatient);
    };
    
    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full bg-white p-8 rounded-xl shadow-lg">
                <div className="text-center mb-8">
                     <div className="flex justify-center items-center space-x-3 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                        </svg>
                        <h1 className="text-2xl font-bold text-slate-800">
                            Create Your Account
                        </h1>
                    </div>
                    <p className="text-slate-600 mt-2">Enter your details to personalize your health dashboard.</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-slate-700">Username</label>
                            <input type="text" name="username" id="username" value={formData.username} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" required />
                        </div>
                        <div>
                            <label htmlFor="password"className="block text-sm font-medium text-slate-700">Password</label>
                            <input type="password" name="password" id="password" value={formData.password} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" required />
                        </div>
                    </div>
                     <hr/>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="name_alias" className="block text-sm font-medium text-slate-700">Full Name</label>
                            <input type="text" name="name_alias" id="name_alias" value={formData.name_alias} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" required />
                        </div>
                        <div>
                            <label htmlFor="dob" className="block text-sm font-medium text-slate-700">Date of Birth</label>
                            <input type="date" name="dob" id="dob" value={formData.dob} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" required />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label htmlFor="sex" className="block text-sm font-medium text-slate-700">Sex</label>
                            <select name="sex" id="sex" value={formData.sex} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" required>
                                <option value="M">Male</option>
                                <option value="F">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="height_cm" className="block text-sm font-medium text-slate-700">Height (cm)</label>
                            <input type="number" name="height_cm" id="height_cm" value={formData.height_cm} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" required />
                        </div>
                        <div>
                            <label htmlFor="weight_kg" className="block text-sm font-medium text-slate-700">Weight (kg)</label>
                            <input type="number" name="weight_kg" id="weight_kg" value={formData.weight_kg} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" required />
                        </div>
                    </div>
                    
                    <div className="pt-4 text-center">
                        <button type="submit" className="w-full md:w-auto inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-3 px-8 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                            Create Account
                        </button>
                    </div>
                </form>
                 <p className="mt-6 text-center text-sm text-slate-600">
                    Already have an account?{' '}
                    <button onClick={onNavigateToLogin} className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:underline">
                        Log In
                    </button>
                </p>
            </div>
        </div>
    );
};

export default SignUp;