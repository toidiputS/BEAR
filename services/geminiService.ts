import { GoogleGenerativeAI, Content, Part } from "@google/generative-ai";
import { Message, Mode, UserProfile } from '../types';
import { PAWS_SYSTEM_PROMPT, CLAWS_SYSTEM_PROMPT } from '../constants';

// Access the key defined in vite.config.ts
const API_KEY = process.env.API_KEY || '';

export const generateBearResponse = async (
  messages: Message[],
  currentMode: Mode,
  userMessage: string,
  userProfile?: UserProfile | null
): Promise<string> => {
  if (!API_KEY) {
    console.error("CRITICAL ERROR: API Key is missing. Please check your .env.local file and ensure GEMINI_API_KEY is set.");
    console.debug("Current process.env state:", process.env); // Debugging aid
    return "Error: Neural Link Offline (Missing API Key - Check Console).";
  }

  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Select base prompt
    let systemInstruction = currentMode === 'PAWS' ? PAWS_SYSTEM_PROMPT : CLAWS_SYSTEM_PROMPT;

    // Personalize prompt if user name is available
    if (userProfile && userProfile.name) {
      const name = userProfile.name;
      systemInstruction = systemInstruction.replace(/Tabi/g, name);
      systemInstruction = systemInstruction.replace(/TABI/g, name.toUpperCase());
    }

    // Convert app messages to Gemini history format
    const historyMessages = messages.slice(0, -1);

    const history: Content[] = historyMessages.map(m => ({
      role: m.role,
      parts: [{ text: m.text } as Part]
    }));

    const chat = model.startChat({
      history: history,
      systemInstruction: { role: 'system', parts: [{ text: systemInstruction }] },
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.9,
      }
    });

    const result = await chat.sendMessage(userMessage);
    const response = await result.response;
    const text = response.text();

    return text || "Subsystem Error: Empty response buffer.";

  } catch (error: any) {
    console.error("Gemini Error Details:", {
      message: error?.message,
      status: error?.status,
      statusText: error?.statusText,
      errorDetails: error?.errorDetails,
      apiKeyPresent: !!API_KEY,
      apiKeyLength: API_KEY?.length || 0,
      apiKeyPrefix: API_KEY?.substring(0, 6) || 'NONE'
    });

    const errorMessage = error?.message || 'Unknown error';
    const statusCode = error?.status || '';

    if (errorMessage.includes('API_KEY') || statusCode === 401 || statusCode === 403 || errorMessage.includes('401') || errorMessage.includes('403')) {
      return `Error: Invalid API Key (${statusCode || 'auth failed'}). Check console for details.`;
    }
    if (statusCode === 429 || errorMessage.includes('429') || errorMessage.includes('quota') || errorMessage.includes('RESOURCE_EXHAUSTED')) {
      return `Error: Rate limit reached (${statusCode}). Free tier: 15 req/min. Wait 60 seconds.`;
    }
    return `Connection to Bear Mainframe severed (${errorMessage}). Please try again.`;
  }
};