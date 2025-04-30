
import React, { useState } from 'react';
import PhraseInput from '../components/PhraseInput';
import Navigation from '../components/Navigation';
import HistoryView from '../components/HistoryView';
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPhrases, savePhraseToDb, deletePhrase } from '../utils/supabase';
import type { Language, Translation, TranslationResult } from '../types/language';
import { Globe } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const Index = () => {
  const [activeView, setActiveView] = useState<'add' | 'history'>('add');
  const [selectedLanguages, setSelectedLanguages] = useState<Language[]>(['english', 'vietnamese']);
  const [translationResults, setTranslationResults] = useState<TranslationResult[] | null>(null);
  const [isTitleCollapsed, setIsTitleCollapsed] = useState(false);
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
      // Filter translations to only include selected languages
      const filteredTranslations = Object.fromEntries(
        Object.entries(phraseData.translations)
          .filter(([lang]) => selectedLanguages.includes(lang as Language))
      ) as Record<Language, Translation>;

      return savePhraseToDb({
        french: phraseData.french,
        translations: filteredTranslations,
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

  const handleAddPhrase = (french: string, languages: Language[]) => {
    const translations = mockTranslate(french);
    setTranslationResults(translations);
    
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
                French Phrase Translator
              </h1>
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <p className="text-center text-sm text-gray-500 mt-1">
              Save French phrases and get instant translations
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
