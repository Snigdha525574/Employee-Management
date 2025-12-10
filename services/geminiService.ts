import { GoogleGenAI } from "@google/genai";

// Initialize the Google GenAI client with the API key from environment variables
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getMotivationalThought = async (): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: 'Provide a single, short, powerful motivational thought for an employee. Maximum 15 words.',
      config: {
        temperature: 0.9,
      }
    });
    return response.text?.trim() || "Work hard and stay focused!";
  } catch (error) {
    console.error("Gemini fetch failed", error);
    return "Keep pushing forward, excellence is a habit.";
  }
};