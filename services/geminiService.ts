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
    console.error("API Key is missing.");
    return "Error: Neural Link Offline (Missing API Key).";
  }

  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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

  } catch (error) {
    console.error("Gemini Error:", error);
    return "Connection to Bear Mainframe severed. Please try again.";
  }
};