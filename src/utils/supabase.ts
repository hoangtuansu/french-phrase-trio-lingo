
import { createClient } from '@supabase/supabase-js';

// Default to empty strings if environment variables are not defined
// This prevents the immediate error, but the client won't work without proper values
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create the Supabase client with error handling
export const supabase = createClient(supabaseUrl, supabaseKey);

// Check if Supabase configuration is missing and log a helpful error
if (!supabaseUrl || !supabaseKey) {
  console.error('⚠️ Supabase configuration missing! Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.');
}

export interface PhraseRecord {
  id: number;
  french: string;
  english: string;
  vietnamese: string;
  created_at: string;
}

export const savePhraseToDb = async (phrase: Omit<PhraseRecord, 'id' | 'created_at'>) => {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase configuration is missing. Please set the required environment variables.');
  }

  const { data, error } = await supabase
    .from('phrases')
    .insert([phrase])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const getPhrases = async () => {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase configuration is missing. Please set the required environment variables.');
  }

  const { data, error } = await supabase
    .from('phrases')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const deletePhrase = async (id: number) => {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase configuration is missing. Please set the required environment variables.');
  }

  const { error } = await supabase
    .from('phrases')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};
