
export type Language = 'english' | 'vietnamese' | 'spanish' | 'german' | 'italian' | 'french';

export type TranslationMode = 'simple' | 'advanced' | 'learning';

export interface Translation {
  text: string;
  examples?: string[];
  idioms?: string[];
  grammarNotes?: string[];
}

export interface TranslationResult {
  original: string;
  translations: Record<Language, Translation>;
}

export interface ContextItem {
  id?: number;
  text: string;
  sourceLanguage: Language;
  created_at?: string;
}

export interface VocabularyItem {
  id?: number;
  word: string;
  meaning: string;
  context: string;
  sourceLanguage: Language;
  targetLanguage: Language;
  created_at?: string;
}
