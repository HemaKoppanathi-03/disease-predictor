import { GoogleGenAI } from "@google/genai";

export async function getHealthInfo(topic: string): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const prompt = `
        System Instruction: You are a helpful AI health assistant. Your role is to provide clear, concise, and easy-to-understand information on health topics for a general audience. 
        Your response should be well-structured. Start with a general overview, then use bullet points or numbered lists for key points, symptoms, or tips. 
        Do not provide direct medical advice or diagnosis. Always include a disclaimer at the end, such as "This information is for educational purposes only. Please consult a healthcare professional for medical advice."
        Format the response in simple HTML or plain text with newlines for structure.

        Topic: "${topic}"
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error generating content from AI:", error);
        throw new Error("Failed to fetch information from the AI service.");
    }
}
