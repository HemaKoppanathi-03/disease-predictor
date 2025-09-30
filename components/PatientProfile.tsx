import React from 'react';
import { Patient, DailyLog } from '../types';

interface PatientProfileProps {
  patient: Patient;
  logs: DailyLog[];
}

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

const StatCard: React.FC<{
    icon: React.ReactNode;
    label: string;
    value: string;
    colorClasses: string;
}> = ({ icon, label, value, colorClasses }) => (
    <div className={`p-4 rounded-xl flex items-center space-x-4 transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-default ${colorClasses}`}>
        <div className="flex-shrink-0 rounded-full h-12 w-12 flex items-center justify-center bg-white bg-opacity-30 dark:bg-black/20">
            {icon}
        </div>
        <div>
            <p className="text-sm font-semibold opacity-80">{label}</p>
            <p className="font-bold text-lg sm:text-xl">{value}</p>
        </div>
    </div>
);

const PatientProfile: React.FC<PatientProfileProps> = ({ patient, logs }) => {
  const age = calculateAge(patient.dob);
  const activityLevelText = {
    sedentary: 'Sedentary',
    low: 'Low',
    moderate: 'Moderate',
    active: 'Active',
  };

  const recentSymptoms = Array.from(new Set(logs.flatMap(log => log.symptoms)));

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg h-full overflow-hidden">
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 text-white flex items-center space-x-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white opacity-75 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
        </svg>
        <div>
            <h2 className="text-2xl font-bold">{patient.name_alias}</h2>
            <p className="text-sm opacity-90">{age} years old &bull; {patient.sex}</p>
        </div>
      </div>
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-2 gap-4">
           <StatCard 
                label="BMI"
                value={patient.baseline_BMI.toString()}
                colorClasses="bg-sky-100 text-sky-900 dark:bg-sky-900/50 dark:text-sky-300"
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>}
           />
           <StatCard 
                label="Activity"
                value={activityLevelText[patient.lifestyle_flags.activity_level]}
                colorClasses="bg-green-100 text-green-900 dark:bg-green-900/50 dark:text-green-300"
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
           />
           <StatCard 
                label="Smoker"
                value={patient.lifestyle_flags.smoker ? 'Yes' : 'No'}
                colorClasses={patient.lifestyle_flags.smoker ? "bg-orange-100 text-orange-900 dark:bg-orange-900/50 dark:text-orange-300" : "bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300"}
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
           />
           <StatCard 
                label="Alcohol"
                value={patient.lifestyle_flags.alcohol ? 'Yes' : 'No'}
                colorClasses={patient.lifestyle_flags.alcohol ? "bg-purple-100 text-purple-900 dark:bg-purple-900/50 dark:text-purple-300" : "bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300"}
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.526a2 2 0 01-1.789-2.894l3.5-7A2 2 0 0114 10zM5 9v11a2 2 0 002 2h2a2 2 0 002-2V9a2 2 0 00-2-2H7a2 2 0 00-2 2z" /></svg>}
           />
        </div>

        <hr className="border-slate-200 dark:border-slate-700" />
        
        <div>
          <h3 className="font-semibold text-slate-600 dark:text-slate-400 mb-2">Known Conditions</h3>
          {patient.known_conditions.length > 0 && patient.known_conditions[0].toLowerCase() !== 'none' ? (
            <div className="flex flex-wrap gap-2">
              {patient.known_conditions.map((condition) => (
                <span key={condition} className="bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {condition}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500 dark:text-slate-400">None</p>
          )}
        </div>
        <div>
          <h3 className="font-semibold text-slate-600 dark:text-slate-400 mb-2">Recent Symptoms</h3>
          {recentSymptoms.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {recentSymptoms.map((symptom) => (
                <span key={symptom} className="bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {symptom}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500 dark:text-slate-400">None reported</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;