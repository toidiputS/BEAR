import { GoogleGenAI, Content, Part } from "@google/genai";
import { Message, Mode, UserProfile } from '../types';
import { PAWS_SYSTEM_PROMPT, CLAWS_SYSTEM_PROMPT } from '../constants';

const API_KEY = process.env.API_KEY || '';

// We create a fresh instance per call or maintain one? 
// For this app, since we switch system prompts dynamically, we will 
// instantiate the chat with the correct system prompt + history on every send 
// to ensure the "personality" is strictly enforced for the *next* response.

export const generateBearResponse = async (
  messages: Message[], 
  currentMode: Mode,
  userMessage: string,
  userProfile?: UserProfile | null
): Promise<string> => {
  if (!API_KEY) {
    throw new Error("API Key missing. System integrity compromised.");
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  const modelId = 'gemini-2.5-flash';
  
  // Select base prompt
  let systemInstruction = currentMode === 'PAWS' ? PAWS_SYSTEM_PROMPT : CLAWS_SYSTEM_PROMPT;

  // Personalize prompt if user name is available
  if (userProfile && userProfile.name) {
    const name = userProfile.name;
    // Replace standard casing "Tabi" with user name
    systemInstruction = systemInstruction.replace(/Tabi/g, name);
    // Replace uppercase "TABI" (used in CLAWS shouting) with uppercase user name
    systemInstruction = systemInstruction.replace(/TABI/g, name.toUpperCase());
  }

  // Convert app messages to Gemini history format
  // We exclude the very last user message (which is the new one) because we send it as the active prompt via sendMessage
  // The 'messages' array passed here includes the new message at the end.
  const historyMessages = messages.slice(0, -1);

  const history: Content[] = historyMessages.map(m => ({
    role: m.role,
    parts: [{ text: m.text } as Part]
  }));

  try {
    const chat = ai.chats.create({
      model: modelId,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.9, // Increased temperature for more variety
      },
      history: history
    });

    const result = await chat.sendMessage({
      message: userMessage
    });

    return result.text || "Subsystem Error: Empty response buffer.";

  } catch (error) {
    console.error("Gemini Error:", error);
    return "Connection to Bear Mainframe severed. Please try again.";
  }
};