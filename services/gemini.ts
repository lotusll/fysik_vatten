
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getExplanation = async (temp: number) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Temperaturen är just nu ${temp}°C i en vatten-densitet-simulator. 
      Baserat på texten: "När ett ämne värms får det större volym... Vatten uppför sig inte som andra... vid 4 celsius är volymen minst."
      Ge en kort, engagerande och pedagogisk förklaring (max 3 meningar) om vad som händer med vattenmolekylerna vid just denna temperatur jämfört med andra vätskor. Svara på svenska.`,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API error:", error);
    return "Ett fel uppstod vid hämtning av förklaring.";
  }
};
