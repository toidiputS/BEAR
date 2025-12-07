


export type Role = 'user' | 'model';

export type Mode = 'PAWS' | 'CLAWS';

export interface UserProfile {
  name: string;
  email: string;
}

export interface Message {
  id: string;
  role: Role;
  text: string;
  timestamp: number;
  mode?: Mode; // To track which subsystem generated the response
  isError?: boolean;
  reactions?: string[]; // Array of selected emojis
}

export interface JournalEntry {
  id: string;
  content: string;
  timestamp: number;
  mode: Mode;
}

export interface Settings {
  dailyReminders: boolean;
  crisisAlerts: boolean;
  supabaseUrl?: string;
  supabaseKey?: string;
}

export interface AppState {
  hasOnboarded: boolean;
  user?: UserProfile;
  mode: Mode;
  messages: Message[];
  journal: JournalEntry[];
  settings: Settings;
  apiKey: string | null;
}

export type QuickActionType = string;
