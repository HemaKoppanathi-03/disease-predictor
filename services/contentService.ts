import { GoogleGenAI, Type } from "@google/genai";
import { HealthInfo } from "../types";

const healthInfoSchema = {
    type: Type.OBJECT,
    properties: {
        topic: { type: Type.STRING, description: "The main topic title, extracted from the user's query." },
        sections: {
            type: Type.ARRAY,
            description: "An array of content sections related to the topic.",
            items: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING, description: "The subheading for this section (e.g., 'Overview', 'Symptoms')." },
                    content: { type: Type.STRING, description: "The detailed content for this section, formatted in Markdown. Use bullet points and bold text where appropriate." }
                },
                required: ["title", "content"]
            }
        },
        disclaimer: { type: Type.STRING, description: "A standard medical information disclaimer." }
    },
    required: ["topic", "sections", "disclaimer"]
};


export async function getHealthInfo(topic: string): Promise<HealthInfo> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const prompt = `
        System Instruction: You are a helpful AI health assistant. Your role is to provide clear, concise, and easy-to-understand information on health topics for a general audience.
        Structure your response as a JSON object that adheres to the provided schema.
        - The JSON should have a 'topic' string, a 'sections' array, and a 'disclaimer' string.
        - Each item in the 'sections' array should be an object with a 'title' and 'content'.
        - Populate the 'content' for each section with Markdown-formatted text. Use bullet points (*) for lists, and bold key terms using **term**.
        - Aim for 3-5 logical sections, such as 'Overview', 'Symptoms', 'Causes', 'Prevention Tips', etc., depending on the topic.
        - Ensure the language is easy for a non-medical person to understand.
        - The 'disclaimer' field must contain the text: "This information is for educational purposes only and is not a substitute for professional medical advice. Always consult a healthcare professional for medical advice."

        User's Topic: "${topic}"
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: healthInfoSchema,
            }
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Error generating content from AI:", error);
        throw new Error("Failed to fetch information from the AI service.");
    }
}