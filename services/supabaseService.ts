
import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabase: SupabaseClient | null = null;

export const initSupabase = (url: string, key: string) => {
  if (url && key) {
    try {
      supabase = createClient(url, key);
      console.log('Supabase client initialized');
    } catch (error) {
      console.error('Failed to initialize Supabase:', error);
    }
  }
};

export const getSupabase = () => supabase;

export const signInWithEmail = async (email: string) => {
  if (!supabase) {
    return { error: { message: 'Database Connection Not Configured. Please check Settings.' } };
  }
  
  // Since this is a simple "Sign In", we use Magic Link or OTP if enabled.
  // For this demo, we assume OTP/Magic Link is the standard flow.
  const { data, error } = await supabase.auth.signInWithOtp({
    email: email,
  });
  
  return { data, error };
};

// Mock function to check connection validity (by trying to get a session or config)
export const checkConnection = async (url: string, key: string): Promise<boolean> => {
    try {
        const client = createClient(url, key);
        // Just a lightweight check - e.g. getting health or auth config
        // Since we can't easily ping without a table, we assume if createClient works, it's structurally valid.
        // A real check might involve: await client.from('some_table').select('count', { count: 'exact', head: true });
        return !!client;
    } catch (e) {
        return false;
    }
};
