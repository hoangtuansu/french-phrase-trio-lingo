
import type { Language, Translation, TranslationMode, TranslationResult } from '../types/language';

export const mockTranslate = (text: string, mode: TranslationMode): TranslationResult[] => {
  // Instead of splitting by line, treat the whole text as one unit
  const results: TranslationResult[] = [{
    original: text,
    translations: {
      english: {
        text: `[English for: ${text}]`,
        examples: mode !== 'simple' ? [
          `Example 1 for the text`,
          `Example 2 for the text`,
        ] : [],
        idioms: mode !== 'simple' ? [`Idiom related to the text`] : [],
        grammarNotes: mode === 'learning' ? [
          `In English, this sentence uses the present tense.`,
          `Note the adjective placement in English comes before the noun.`
        ] : []
      },
      vietnamese: {
        text: `[Vietnamese for: ${text}]`,
        examples: mode !== 'simple' ? [
          `Vietnamese example 1`,
          `Vietnamese example 2`,
        ] : [],
        idioms: mode !== 'simple' ? [`Vietnamese idiom`] : [],
        grammarNotes: mode === 'learning' ? [
          `Vietnamese grammar typically follows Subject-Verb-Object order.`,
          `Vietnamese nouns don't change form for plural.`
        ] : []
      },
      spanish: {
        text: `[Spanish for: ${text}]`,
        examples: mode !== 'simple' ? [
          `Spanish example`
        ] : [],
        idioms: mode !== 'simple' ? [`Spanish idiom for daily use`] : [],
        grammarNotes: mode === 'learning' ? [
          `In Spanish, adjectives typically follow the noun.`,
          `Spanish verbs are conjugated based on the subject.`
        ] : []
      },
      german: {
        text: `[German for: ${text}]`,
        examples: mode !== 'simple' ? [
          `German example sentence`
        ] : [],
        idioms: mode !== 'simple' ? [`Common German expression`] : [],
        grammarNotes: mode === 'learning' ? [
          `German nouns always start with a capital letter.`,
          `German has three grammatical genders: masculine, feminine, and neuter.`
        ] : []
      },
      italian: {
        text: `[Italian for: ${text}]`,
        examples: mode !== 'simple' ? [
          `Italian example for context`
        ] : [],
        idioms: mode !== 'simple' ? [`Popular Italian saying`] : [],
        grammarNotes: mode === 'learning' ? [
          `Italian adjectives usually agree in gender and number with the noun.`,
          `In Italian, the subject pronoun is often omitted.`
        ] : []
      }
    }
  }];
  
  return results;
};
