import React from 'react';
import PhraseInput from '../components/PhraseInput';
import PhraseCard from '../components/PhraseCard';
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPhrases, savePhraseToDb, deletePhrase, PhraseRecord } from '../utils/supabase';

const Index = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: phrases = [], isLoading } = useQuery({
    queryKey: ['phrases'],
    queryFn: getPhrases,
  });

  // Mock translation function (in a real app, this would call a translation API)
  const mockTranslate = (text: string) => {
    // This is just for demonstration. In a real app, you'd use a translation API
    const mockTranslations: Record<string, { en: string; vi: string }> = {
      "bonjour": { en: "hello", vi: "xin chào" },
      "merci": { en: "thank you", vi: "cảm ơn" },
      "au revoir": { en: "goodbye", vi: "tạm biệt" },
    };

    return mockTranslations[text.toLowerCase()] || { 
      en: `[English translation for: ${text}]`, 
      vi: `[Vietnamese translation for: ${text}]` 
    };
  };

  const addPhraseMutation = useMutation({
    mutationFn: (french: string) => {
      const translations = mockTranslate(french);
      return savePhraseToDb({
        french,
        english: translations.en,
        vietnamese: translations.vi,
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

  const handleAddPhrase = (french: string) => {
    addPhraseMutation.mutate(french);
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
          <PhraseInput onAddPhrase={handleAddPhrase} />
          
          <div className="mt-8 space-y-4">
            {isLoading ? (
              <div className="text-center text-gray-500 py-8">Loading phrases...</div>
            ) : phrases.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                No phrases added yet. Start by adding a French phrase above!
              </div>
            ) : (
              phrases.map((phrase: PhraseRecord) => (
                <PhraseCard
                  key={phrase.id}
                  french={phrase.french}
                  english={phrase.english}
                  vietnamese={phrase.vietnamese}
                  onDelete={() => deleteMutation.mutate(phrase.id)}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
