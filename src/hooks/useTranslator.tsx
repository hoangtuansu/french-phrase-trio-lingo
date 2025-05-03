
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from "@/hooks/use-toast";
import { getPhrases, savePhraseToDb, deletePhrase } from '../utils/supabase';
import type { Language, TranslationResult, TranslationMode, Translation } from '../types/language';
import { mockTranslate } from '../utils/translationUtils';

export const useTranslator = () => {
  const [activeView, setActiveView] = useState<'add' | 'history'>('add');
  const [isTitleCollapsed, setIsTitleCollapsed] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Initialize selectedLanguages from localStorage or default to english and vietnamese
  const [selectedLanguages, setSelectedLanguages] = useState<Language[]>(() => {
    const savedLanguages = localStorage.getItem('selectedLanguages');
    return savedLanguages ? JSON.parse(savedLanguages) : ['english', 'vietnamese'];
  });

  // Initialize sourceLanguage from localStorage or default to english
  const [sourceLanguage, setSourceLanguage] = useState<Language>(() => {
    const savedSourceLanguage = localStorage.getItem('sourceLanguage');
    return savedSourceLanguage ? JSON.parse(savedSourceLanguage) : 'english';
  });

  const [translationResults, setTranslationResults] = useState<TranslationResult[] | null>(null);
  const [inputText, setInputText] = useState<string>('');
  const [pastedImage, setPastedImage] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<string>('');

  // Save selectedLanguages to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('selectedLanguages', JSON.stringify(selectedLanguages));
  }, [selectedLanguages]);

  // Save sourceLanguage to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('sourceLanguage', JSON.stringify(sourceLanguage));
  }, [sourceLanguage]);

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

  const handleAddPhrase = (french: string, languages: Language[], mode: TranslationMode, source: Language) => {
    // Clear previous translations and set the new translations
    const translations = mockTranslate(french, mode, source);
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

  return {
    activeView,
    setActiveView,
    isTitleCollapsed,
    setIsTitleCollapsed,
    selectedLanguages,
    setSelectedLanguages,
    sourceLanguage,
    setSourceLanguage,
    translationResults,
    phrases,
    isLoading,
    inputText,
    setInputText,
    pastedImage,
    setPastedImage,
    extractedText,
    setExtractedText,
    handleAddPhrase,
    onDelete: (id: number) => deleteMutation.mutate(id)
  };
};
