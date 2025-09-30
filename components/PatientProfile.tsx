
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

const PatientProfile: React.FC<PatientProfileProps> = ({ patient, logs }) => {
  const age = calculateAge(patient.dob);
  const activityLevelText = {
    sedentary: 'Sedentary',
    low: 'Low Activity',
    moderate: 'Moderate Activity',
    active: 'Active',
  };

  const recentSymptoms = Array.from(new Set(logs.flatMap(log => log.symptoms)));

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg h-full">
      <h2 className="text-xl font-bold text-slate-800 mb-4">Patient Profile</h2>
      <div className="space-y-4">
        <div className="flex justify-between items-baseline">
          <span className="font-semibold text-slate-600">Name</span>
          <span className="text-lg font-bold text-blue-600">{patient.name_alias}</span>
        </div>
        <div className="flex justify-between items-baseline">
          <span className="font-semibold text-slate-600">Age</span>
          <span className="font-medium text-slate-800">{age}</span>
        </div>
        <div className="flex justify-between items-baseline">
          <span className="font-semibold text-slate-600">Sex</span>
          <span className="font-medium text-slate-800">{patient.sex}</span>
        </div>
        <div className="flex justify-between items-baseline">
          <span className="font-semibold text-slate-600">BMI</span>
          <span className="font-medium text-slate-800">{patient.baseline_BMI}</span>
        </div>
        <div className="flex justify-between items-baseline">
          <span className="font-semibold text-slate-600">Activity Level</span>
          <span className="font-medium text-slate-800">{activityLevelText[patient.lifestyle_flags.activity_level]}</span>
        </div>
        <div>
          <h3 className="font-semibold text-slate-600 mb-1">Known Conditions</h3>
          {patient.known_conditions.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {patient.known_conditions.map((condition) => (
                <span key={condition} className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {condition}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">None</p>
          )}
        </div>
        <div>
          <h3 className="font-semibold text-slate-600 mb-1">Recent Symptoms</h3>
          {recentSymptoms.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {recentSymptoms.map((symptom) => (
                <span key={symptom} className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {symptom}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">None reported</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;
