import { GoogleGenAI, Type } from "@google/genai";
import { Patient, DailyLog, PredictionResult, AdHocPredictionData } from '../types';

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

const predictionSchema = {
  type: Type.OBJECT,
  properties: {
    disease: { type: Type.STRING, description: "The primary disease or health concern identified from the analysis." },
    riskProbability: { type: Type.NUMBER, description: "A numerical probability/confidence score from 0.0 to 1.0." },
    riskLabel: { type: Type.STRING, description: "A label: 'Low', 'Medium', or 'High' risk/concern." },
    topContributors: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "An array of the top 3-4 factors contributing to the finding, based on the provided documents and data."
    },
    recommendations: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          category: { type: Type.STRING, description: "'Diet', 'Lifestyle', or 'Monitoring'" }
        },
        required: ["title", "description", "category"]
      },
      description: "An array of exactly three personalized, actionable recommendations."
    }
  },
  required: ["disease", "riskProbability", "riskLabel", "topContributors", "recommendations"]
};

async function generatePrediction(promptParts: any[]): Promise<PredictionResult> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: { parts: promptParts },
    config: {
      responseMimeType: "application/json",
      responseSchema: predictionSchema,
    },
  });

  try {
    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);
    if (!result.disease || !result.riskLabel || !result.recommendations) {
        throw new Error("Invalid JSON structure from API");
    }
    return result as PredictionResult;
  } catch (e) {
    console.error("Failed to parse JSON response:", e);
    console.error("Raw response text:", response.text);
    throw new Error("Could not parse the prediction response from the AI.");
  }
}

export async function getAnalysisFromDocument(patient: Patient, manualInput: string, file: { mimeType: string; data: string } | null): Promise<PredictionResult> {
  const age = calculateAge(patient.dob);
  
  const textPrompt = `
    System Instruction: You are an AI medical report analyst. Your task is to analyze the provided patient profile, user query, and any attached medical document (like a lab report or imaging summary). Extract key findings from the document in the context of the user's query and patient history. Identify the primary health concern discussed or implied. Provide a risk assessment (Low, Medium, High), list the key contributing factors based on the document, and generate three actionable recommendations. ALWAYS respond in the specified JSON format.

    Patient Data:
    - Age: ${age}
    - Sex: ${patient.sex}
    - BMI: ${patient.baseline_BMI}
    - Known Conditions: ${patient.known_conditions.join(', ') || 'None'}

    User's Query/Manual Input:
    "${manualInput || 'No specific query, please summarize the attached document.'}"

    Analyze the attached document and/or the user query and provide your findings in the required JSON format.
  `;

  // FIX: Explicitly type promptParts as any[] to allow for mixed content types (text and inlineData) as required by the Gemini API.
  const promptParts: any[] = [{ text: textPrompt }];
  if (file) {
    promptParts.push({
      inlineData: {
        mimeType: file.mimeType,
        data: file.data,
      },
    });
  }

  return generatePrediction(promptParts);
}


export async function getAdHocPrediction(data: AdHocPredictionData): Promise<PredictionResult> {
    const heightM = parseFloat(data.height_cm) / 100;
    const weightKg = parseFloat(data.weight_kg);
    const bmi = (heightM > 0 && weightKg > 0) ? (weightKg / (heightM * heightM)).toFixed(1) : 'N/A';

    const prompt = `
    System Instruction: You are an advanced AI health analyst. Your task is to predict the primary disease risk for a person based on self-reported data including symptoms. You must provide a risk score, a risk level (Low, Medium, or High), the key contributing factors, and three personalized, actionable recommendations categorized as 'Diet', 'Lifestyle', or 'Monitoring'. ALWAYS respond in the specified JSON format.

    Patient Data:
    - Age: ${data.age}
    - Sex: ${data.sex}
    - BMI: ${bmi}
    - Reported Symptoms: ${data.symptoms || 'None'}
    - Known Conditions: ${data.known_conditions || 'None'}
    - Family History: ${data.family_history || 'None'}
    - Vitals: Fasting Glucose ${data.fasting_glucose} mg/dL, BP ${data.bp_systolic}/${data.bp_diastolic} mmHg
    - Food & Lifestyle Patterns: ${data.food_pattern_summary}. Activity level is ${data.activity_level}.
    - Smoker: ${data.smoker}, Alcohol: ${data.alcohol}

    Based on all this data, especially the reported symptoms, analyze the risk for diseases like Type 2 Diabetes, Hypertension, Heart Disease, or other relevant conditions. Focus on the single most prominent risk and provide your analysis in the JSON format defined by the schema.
    `;
    
    // getAdHocPrediction uses a single text prompt, so we wrap it for generatePrediction
    return generatePrediction([{ text: prompt }]);
}