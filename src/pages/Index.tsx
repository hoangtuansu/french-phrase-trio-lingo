import React, { useState } from 'react';
import PhraseInput from '../components/PhraseInput';
import Navigation from '../components/Navigation';
import HistoryView from '../components/HistoryView';
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPhrases, savePhraseToDb, deletePhrase } from '../utils/supabase';
import type { Language, Translation, TranslationResult } from '../types/language';

const Index = () => {
  const [activeView, setActiveView] = useState<'add' | 'history'>('add');
  const [selectedLanguages, setSelectedLanguages] = useState<Language[]>(['english', 'vietnamese']);
  const [translationResults, setTranslationResults] = useState<TranslationResult[] | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: phrases = [], isLoading } = useQuery({
    queryKey: ['phrases'],
    queryFn: getPhrases,
  });

  const mockTranslate = (text: string) => {
    const lines = text.split('\n').filter(line => line.trim());
    
    const results = lines.map(line => {
      const isWord = !line.includes(' ');
      const mockData: Record<Language, Translation> = {
        english: {
          text: `[English for: ${line}]`,
          ...(isWord && {
            examples: [
              `Example 1 for ${line}`,
              `Example 2 for ${line}`,
            ],
            idioms: [`Idiom using ${line}`]
          })
        },
        vietnamese: {
          text: `[Vietnamese for: ${line}]`
        },
        spanish: {
          text: `[Spanish for: ${line}]`
        },
        german: {
          text: `[German for: ${line}]`
        },
        italian: {
          text: `[Italian for: ${line}]`
        }
      };
      
      return {
        original: line,
        translations: mockData
      };
    });

    return results;
  };

  const addPhraseMutation = useMutation({
    mutationFn: (phraseData: { french: string; translations: Record<Language, Translation> }) => {
      return savePhraseToDb({
        french: phraseData.french,
        translations: phraseData.translations,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['phrases'] });
      toast({
        title: "Phrase added",
        description: "Your phrase has been saved successfully.",
      });
    },
    onError: () => {
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

  const handleAddPhrase = (french: string, languages: Language[]) => {
    const translations = mockTranslate(french);
    setTranslationResults(translations);
    
    translations.forEach(translation => {
      const selectedTranslations = Object.entries(translation.translations)
        .filter(([lang]) => languages.includes(lang as Language))
        .reduce((acc, [lang, trans]) => ({
          ...acc,
          [lang]: trans
        }), {} as Record<Language, Translation>);

      addPhraseMutation.mutate({
        french: translation.original,
        translations: selectedTranslations,
      });
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-french-blue mb-2">
            French Phrase Translator
          </h1>
          <p className="text-gray-600">
            Save French phrases and get instant translations
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Navigation activeView={activeView} onViewChange={setActiveView} />
          
          {activeView === 'add' ? (
            <PhraseInput 
              onAddPhrase={handleAddPhrase}
              selectedLanguages={selectedLanguages}
              onLanguagesChange={setSelectedLanguages}
              translationResults={translationResults}
            />
          ) : (
            <HistoryView 
              phrases={phrases} 
              onDelete={(id) => deleteMutation.mutate(id)} 
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
