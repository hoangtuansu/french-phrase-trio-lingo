
export type Language = 'english' | 'vietnamese' | 'spanish' | 'german' | 'italian';

export interface Translation {
  text: string;
  examples?: string[];
  idioms?: string[];
}

export interface TranslationResult {
  original: string;
  translations: Record<Language, Translation>;
}
