
import { GoogleGenAI } from "@google/genai";

export const getDynamicNarration = async (theme: string) => {
  // Always use a named parameter and obtain the key exclusively from process.env.API_KEY as per guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a single, extremely short (max 10 words), poetic and abstract sentence about the concept of "${theme}". It should sound like high-end brand copy. Do not use quotes.`,
    });
    // Use .text property directly (not a method) to extract output.
    return response.text || "The architecture of motion.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Elegance defined by mathematical precision.";
  }
};
