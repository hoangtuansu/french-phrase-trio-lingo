
import { createClient } from '@supabase/supabase-js';
import type { Language, Translation, TranslationMode, VocabularyItem } from '../types/language';

// Default to empty strings if environment variables are not defined
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create a mock client when credentials are missing to prevent runtime errors
const isMissingCredentials = !supabaseUrl || !supabaseKey;

// Log warning about missing configuration
if (isMissingCredentials) {
  console.error('⚠️ Supabase configuration missing! Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.');
}

// Create the Supabase client only if we have valid credentials
export const supabase = isMissingCredentials
  ? createMockClient()
  : createClient(supabaseUrl, supabaseKey);

// Mock client factory to prevent runtime errors
function createMockClient() {
  const mockResponse = { data: null, error: new Error('Supabase configuration is missing') };
  
  return {
    from: () => ({
      insert: () => ({ select: () => ({ single: () => Promise.resolve(mockResponse) }) }),
      select: () => ({ order: () => Promise.resolve(mockResponse) }),
      delete: () => ({ eq: () => Promise.resolve(mockResponse) }),
    }),
    // Add other methods as needed to prevent runtime errors
  };
}

export interface PhraseRecord {
  id: number;
  french: string;
  translations: Record<Language, Translation>;
  mode: TranslationMode;
  created_at: string;
}

export const savePhraseToDb = async (phrase: Omit<PhraseRecord, 'id' | 'created_at'>) => {
  if (isMissingCredentials) {
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
  if (isMissingCredentials) {
    console.warn('Supabase configuration missing. Returning mock data.');
    return [];
  }

  const { data, error } = await supabase
    .from('phrases')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const deletePhrase = async (id: number) => {
  if (isMissingCredentials) {
    throw new Error('Supabase configuration is missing. Please set the required environment variables.');
  }

  const { error } = await supabase
    .from('phrases')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

// Vocabulary functions
export const saveVocabularyToDb = async (vocabulary: Omit<VocabularyItem, 'id' | 'created_at'>) => {
  if (isMissingCredentials) {
    throw new Error('Supabase configuration is missing. Please set the required environment variables.');
  }

  const { data, error } = await supabase
    .from('vocabulary')
    .insert([vocabulary])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const getVocabulary = async () => {
  if (isMissingCredentials) {
    console.warn('Supabase configuration missing. Returning mock data for vocabulary.');
    return [];
  }

  const { data, error } = await supabase
    .from('vocabulary')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const deleteVocabularyItem = async (id: number) => {
  if (isMissingCredentials) {
    throw new Error('Supabase configuration is missing. Please set the required environment variables.');
  }

  const { error } = await supabase
    .from('vocabulary')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};
