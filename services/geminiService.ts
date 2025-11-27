
import { GoogleGenAI, Type } from "@google/genai";
import { MENU_ITEMS } from "../constants";
import { AiRecommendation } from "../types";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

export const getCoffeeRecommendation = async (userMood: string): Promise<AiRecommendation | null> => {
  try {
    const menuContext = MENU_ITEMS
      .map(item => `${item.id}: ${item.name} (${item.description})`)
      .join("\n");

    const prompt = `
      You are an expert barista at a high-end cafe.
      Here is our menu:
      ${menuContext}

      The customer says: "${userMood}"

      Recommend exactly one item from the menu that best fits their mood or request.
      Explain why in a short, friendly sentence.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            menuItemId: { type: Type.STRING },
            reasoning:   { type: Type.STRING }
          },
          required: ["menuItemId", "reasoning"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as AiRecommendation;
    }

    return null;
  } catch (error) {
    console.error("Error getting AI recommendation:", error);
    return null;
  }
};
