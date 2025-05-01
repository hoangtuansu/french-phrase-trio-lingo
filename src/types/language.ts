
export type Language = 'english' | 'vietnamese' | 'spanish' | 'german' | 'italian';

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

