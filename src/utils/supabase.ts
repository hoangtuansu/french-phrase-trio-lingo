
import { createClient } from '@supabase/supabase-js';
import type { Language, Translation, TranslationMode, VocabularyItem } from '../types/language';

// Default to empty strings if environment variables are not defined
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create a mock client when credentials are missing to prevent runtime errors
const isMissingCredentials = !supabaseUrl || !supabaseKey;

// Log warning about missing configuration
if (isMissingCredentials) {
  console.error('⚠️ Supabase configuration missing! Operating in demo mode with mock data. To enable persistent storage, please connect Supabase from the top-right integration button.');
}

// Create the Supabase client only if we have valid credentials
export const supabase = isMissingCredentials
  ? createMockClient()
  : createClient(supabaseUrl, supabaseKey);

// Mock client factory with more helpful debugging
function createMockClient() {
  const mockResponse = { 
    data: null, 
    error: new Error('Supabase configuration is missing. Operating in demo mode.') 
  };
  
  return {
    from: () => ({
      insert: () => ({ 
        select: () => ({ 
          single: () => {
            console.log('Mock insert operation called - data will not be persisted');
            return Promise.resolve(mockResponse);
          }
        }) 
      }),
      select: () => ({ 
        order: () => {
          console.log('Mock select operation called - returning empty data array');
          return Promise.resolve({ data: [], error: null });
        } 
      }),
      delete: () => ({ 
        eq: () => {
          console.log('Mock delete operation called - no data will be deleted');
          return Promise.resolve(mockResponse);
        } 
      }),
    }),
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
    console.warn('Supabase configuration is missing. Data will not persist beyond this session.');
    return {
      ...phrase,
      id: Math.floor(Math.random() * 10000),
      created_at: new Date().toISOString()
    };
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
    console.warn('Supabase configuration missing. Delete operation simulated.');
    return;
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
    console.warn('Supabase configuration missing. Creating mock vocabulary item instead.');
    return {
      ...vocabulary,
      id: Math.floor(Math.random() * 10000),
      created_at: new Date().toISOString()
    };
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
    console.warn('Supabase configuration missing. Delete operation simulated.');
    return;
  }

  const { error } = await supabase
    .from('vocabulary')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};
