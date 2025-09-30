import { GoogleGenAI } from "@google/genai";

export async function getChatbotResponse(message: string): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const prompt = `
        System Instruction: You are a friendly and helpful AI assistant for the 'AI Disease Risk Predictor' app. Your role is to answer general questions about health, wellness, and how to use the application. You are NOT a medical professional. 
        
        **CRITICAL RULE: DO NOT provide medical advice, diagnoses, or treatment plans under any circumstances.** 
        
        If a user asks for any form of medical advice (e.g., "Should I take this medicine?", "What does my lab result mean?", "Do I have [disease]?"), you MUST politely decline and strongly advise them to consult a qualified healthcare professional.
        
        Keep your answers concise, helpful, and easy to understand.
        
        Examples of appropriate questions you can answer:
        - "What is hypertension?"
        - "What are the benefits of a balanced diet?"
        - "How does the 'Predictor' page work?"
        - "What is BMI?"

        User's question: "${message}"
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error generating chatbot response from AI:", error);
        throw new Error("Failed to get a response from the AI assistant.");
    }
}
