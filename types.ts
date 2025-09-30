export interface Patient {
  patient_id: string;
  name_alias: string;
  username?: string; // Optional for login
  password?: string; // Optional for login
  dob: string;
  sex: 'M' | 'F' | 'Other';
  height_cm: number;
  weight_kg: number;
  baseline_BMI: number;
  known_conditions: string[];
  medications: string[];
  family_history: string[];
  lifestyle_flags: {
    smoker: boolean;
    alcohol: boolean;
    activity_level: 'sedentary' | 'low' | 'moderate' | 'active';
  };
  food_pattern_summary: string;
}

export interface Meal {
  meal_type: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
  items: { food_name: string; qty: number; unit: string }[];
  timestamp: string;
}

export interface Vitals {
  bp_systolic: number;
  bp_diastolic: number;
  fasting_glucose: number;
  heart_rate: number;
}

export interface DailyLog {
  log_id: string;
  patient_id: string;
  date: string;
  meals: Meal[];
  vitals: Vitals;
  symptoms: string[];
  sleep_hours: number;
}

export interface Recommendation {
  title: string;
  description: string;
  category: 'Diet' | 'Lifestyle' | 'Monitoring';
}

export interface PredictionResult {
  disease: string;
  riskProbability: number;
  riskLabel: 'Low' | 'Medium' | 'High';
  topContributors: string[];
  recommendations: Recommendation[];
}

export interface AdHocPredictionData {
  age: string;
  sex: 'M' | 'F' | 'Other';
  height_cm: string;
  weight_kg: string;
  bp_systolic: string;
  bp_diastolic: string;
  fasting_glucose: string;
  known_conditions: string;
  family_history: string;
  symptoms: string;
  activity_level: 'sedentary' | 'low' | 'moderate' | 'active';
  smoker: boolean;
  alcohol: boolean;
  food_pattern_summary: string;
}

export interface HealthInfoSection {
  title: string;
  content: string;
}

export interface HealthInfo {
  topic: string;
  sections: HealthInfoSection[];
  disclaimer: string;
}