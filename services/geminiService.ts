
import { GoogleGenAI, Type } from "@google/genai";

// Use process.env.API_KEY directly in the service functions as per guidelines
export const getCareerAdvice = async (userProfile: any, query: string) => {
  // Check for API key availability as part of robust error handling
  if (!process.env.API_KEY) return "API Key not configured. AI features are unavailable.";

  try {
    // Initialize GoogleGenAI with the named parameter apiKey and use the latest recommended model
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `User Profile: ${JSON.stringify(userProfile)}
      User Question: ${query}
      
      You are Sebenza AI, a helpful career assistant specifically for the South African job market. 
      Provide actionable, empathetic, and culturally relevant career advice.
      Mention specific sectors (like the "peace job" economy, digital gigs, or formal sectors) where relevant.
      Keep it encouraging and brief.`,
    });

    // Access the text property directly from the response
    return response.text || "I couldn't generate a response. Please try again.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Sorry, I'm having trouble connecting to the Sebenza network right now.";
  }
};

export const getJobMatchScore = async (jobDescription: string, userSkills: string[]) => {
  if (!process.env.API_KEY) return null;

  try {
    // Initialize GoogleGenAI with the named parameter apiKey
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Job Description: ${jobDescription}
      User Skills: ${userSkills.join(", ")}
      Rate the match from 0 to 100.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            reasoning: { type: Type.STRING }
          },
          required: ["score", "reasoning"]
        }
      }
    });

    const text = response.text;
    if (!text) return null;
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Match Score Error:", error);
    return null;
  }
};
