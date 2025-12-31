
import { GoogleGenAI, Type } from "@google/genai";
import { PlanetStats } from "../types";

// Fix: Always use process.env.API_KEY directly in the initialization object
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const PLANET_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING },
    description: { type: Type.STRING },
    age: { type: Type.STRING },
    mass: { type: Type.STRING },
    temperature: { type: Type.STRING },
    atmosphere: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING } 
    },
    message: { type: Type.STRING, description: "A cosmic greeting or lore snippet" }
  },
  required: ["name", "description", "age", "mass", "temperature", "atmosphere", "message"],
};

export const generateCosmicInfo = async (prompt: string): Promise<any> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are a Galactic Cartographer. Describe this specific planet: ${prompt}. Focus on a blue gas giant with luminous rings. Return data in the specified JSON format.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: PLANET_SCHEMA,
      }
    });
    
    // Fix: Access response.text as a property and implement robust error handling
    if (!response.text) {
      throw new Error("Empty response from Gemini API");
    }
    return JSON.parse(response.text.trim());
  } catch (error) {
    console.error("Gemini API Error:", error);
    // Graceful fallback data
    return {
      name: "Aethelgard-9",
      description: "A colossal blue gas giant located in the outer rim of the Sapphire Nebula. Its rings are composed of ionized silicates and glowing mana crystals.",
      age: "4.2 Billion Years",
      mass: "95.2 Earth Masses",
      temperature: "-178°C",
      atmosphere: ["Hydrogen", "Helium", "Methane", "Exotic Ether"],
      message: "The void whispers of your arrival, traveler."
    };
  }
};