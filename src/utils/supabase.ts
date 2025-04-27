
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface PhraseRecord {
  id: number;
  french: string;
  english: string;
  vietnamese: string;
  created_at: string;
}

export const savePhraseToDb = async (phrase: Omit<PhraseRecord, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('phrases')
    .insert([phrase])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const getPhrases = async () => {
  const { data, error } = await supabase
    .from('phrases')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const deletePhrase = async (id: number) => {
  const { error } = await supabase
    .from('phrases')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

