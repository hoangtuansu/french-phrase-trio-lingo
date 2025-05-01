
import React, { useState, useEffect } from 'react';
import PhraseInput from '../components/PhraseInput';
import Navigation from '../components/Navigation';
import HistoryView from '../components/HistoryView';
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPhrases, savePhraseToDb, deletePhrase } from '../utils/supabase';
import type { Language, Translation, TranslationResult, TranslationMode } from '../types/language';
import { Globe } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const Index = () => {
  const [activeView, setActiveView] = useState<'add' | 'history'>('add');
  const [isTitleCollapsed, setIsTitleCollapsed] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Initialize selectedLanguages from localStorage or default to english and vietnamese
  const [selectedLanguages, setSelectedLanguages] = useState<Language[]>(() => {
    const savedLanguages = localStorage.getItem('selectedLanguages');
    return savedLanguages ? JSON.parse(savedLanguages) : ['english', 'vietnamese'];
  });

  const [translationResults, setTranslationResults] = useState<TranslationResult[] | null>(null);
  const [inputText, setInputText] = useState<string>('');

  // Save selectedLanguages to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('selectedLanguages', JSON.stringify(selectedLanguages));
  }, [selectedLanguages]);

  const { data: phrases = [], isLoading } = useQuery({
    queryKey: ['phrases'],
    queryFn: getPhrases,
  });

  const addPhraseMutation = useMutation({
    mutationFn: (phraseData: { 
      french: string; 
      translations: Record<Language, Translation>;
      mode: TranslationMode;
    }) => {
      // Filter translations to only include selected languages
      const filteredTranslations = Object.fromEntries(
        Object.entries(phraseData.translations)
          .filter(([lang]) => selectedLanguages.includes(lang as Language))
      ) as Record<Language, Translation>;

      return savePhraseToDb({
        french: phraseData.french,
        translations: filteredTranslations,
        mode: phraseData.mode,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['phrases'] });
      toast({
        title: "Phrase added",
        description: "Your phrase has been saved successfully.",
      });
    },
    onError: (error) => {
      console.error("Error saving phrase:", error);
      toast({
        title: "Error",
        description: "Failed to save phrase. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deletePhrase,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['phrases'] });
      toast({
        title: "Phrase deleted",
        description: "The phrase has been removed from your list.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete phrase. Please try again.",
        variant: "destructive",
      });
    },
  });

  const mockTranslate = (text: string, mode: TranslationMode) => {
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

  const handleAddPhrase = (french: string, languages: Language[], mode: TranslationMode) => {
    // Clear previous translations and set the new translations
    const translations = mockTranslate(french, mode);
    setTranslationResults(translations);
    setInputText(french);
    
    translations.forEach(translation => {
      // Filter translations based on selected languages
      const selectedTranslations = Object.entries(translation.translations)
        .filter(([lang]) => languages.includes(lang as Language))
        .reduce((acc, [lang, trans]) => ({
          ...acc,
          [lang]: trans
        }), {} as Record<Language, Translation>);

      addPhraseMutation.mutate({
        french: translation.original,
        translations: selectedTranslations,
        mode: mode
      });
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-4 px-4">
        <Collapsible
          open={!isTitleCollapsed}
          onOpenChange={(isOpen) => setIsTitleCollapsed(!isOpen)}
          className="mb-4"
        >
          <CollapsibleTrigger className="w-full flex items-center justify-center cursor-pointer">
            <div className="flex items-center">
              <Globe className="text-french-blue w-5 h-5 mr-2" />
              <h1 className="text-lg font-bold text-french-blue">
                Translator
              </h1>
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <p className="text-center text-sm text-gray-500 mt-1">
              {selectedLanguages.map(lang => 
                lang.charAt(0).toUpperCase() + lang.slice(1)
              ).join(' • ')}
            </p>
          </CollapsibleContent>
        </Collapsible>

        <div className="max-w-4xl mx-auto">
          <Navigation activeView={activeView} onViewChange={setActiveView} />
          
          {activeView === 'add' ? (
            <PhraseInput 
              onAddPhrase={handleAddPhrase}
              selectedLanguages={selectedLanguages}
              onLanguagesChange={setSelectedLanguages}
              translationResults={translationResults}
              inputText={inputText}
              onInputTextChange={setInputText}
            />
          ) : (
            <HistoryView 
              phrases={phrases} 
              onDelete={(id) => deleteMutation.mutate(id)} 
              selectedLanguages={selectedLanguages}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
