
import React from 'react';
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronDown } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { Language, TranslationResult } from '../types/language';

interface TranslationResultsProps {
  translationResults: TranslationResult[] | null;
  selectedLanguages: Language[];
}

// Translation language labels
const AVAILABLE_LANGUAGES: { value: Language; label: string }[] = [
  { value: 'english', label: 'English' },
  { value: 'vietnamese', label: 'Vietnamese' },
  { value: 'spanish', label: 'Spanish' },
  { value: 'german', label: 'German' },
  { value: 'italian', label: 'Italian' },
];

const TranslationResults: React.FC<TranslationResultsProps> = ({ 
  translationResults, 
  selectedLanguages 
}) => {
  // Format by language instead of by phrase
  const getTranslationsByLanguage = () => {
    if (!translationResults || translationResults.length === 0) return {};
    
    const byLanguage: Record<Language, { text: string, examples?: string[], idioms?: string[] }> = {} as any;
    
    selectedLanguages.forEach(lang => {
      // Combine all translations for this language
      const allTranslations = translationResults.map(result => {
        if (result.translations[lang]) {
          return result.translations[lang];
        }
        return null;
      }).filter(Boolean);
      
      if (allTranslations.length > 0) {
        // Join all translation texts
        const combinedText = allTranslations.map(t => t?.text).join('\n');
        
        // Combine examples and idioms
        const examples = allTranslations.flatMap(t => t?.examples || []);
        const idioms = allTranslations.flatMap(t => t?.idioms || []);
        
        byLanguage[lang] = {
          text: combinedText,
          ...(examples.length > 0 && { examples }),
          ...(idioms.length > 0 && { idioms })
        };
      }
    });
    
    return byLanguage;
  };

  const translationsByLanguage = getTranslationsByLanguage();
  const expandedLanguages = selectedLanguages.length > 0 ? [selectedLanguages[0]] : [];

  if (!translationResults || translationResults.length === 0) {
    return (
      <Card className="p-4 bg-white shadow-lg h-[450px] flex items-center justify-center text-gray-500">
        <div className="text-center">
          <p>No translations yet</p>
          <p className="text-sm">Enter a phrase and click Translate</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 bg-white shadow-lg h-[450px]">
      <ScrollArea className="h-full pr-4">
        <div className="space-y-2">
          <Accordion 
            type="multiple" 
            value={expandedLanguages}
            defaultValue={expandedLanguages}
            className="w-full"
          >
            {selectedLanguages.map(lang => {
              const translation = translationsByLanguage[lang];
              if (!translation) return null;

              return (
                <AccordionItem key={lang} value={lang}>
                  <AccordionTrigger className="hover:no-underline py-2">
                    <div className="font-semibold text-gray-700">
                      {AVAILABLE_LANGUAGES.find(l => l.value === lang)?.label}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 p-2">
                      <div className="whitespace-pre-line">{translation.text}</div>
                      
                      {translation.examples && translation.examples.length > 0 && (
                        <div className="mt-2">
                          <div className="text-sm text-gray-500">Examples:</div>
                          <ul className="list-disc list-inside">
                            {translation.examples.map((example, i) => (
                              <li key={i} className="text-sm">{example}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {translation.idioms && translation.idioms.length > 0 && (
                        <div className="mt-2">
                          <div className="text-sm text-gray-500">Idioms:</div>
                          <ul className="list-disc list-inside">
                            {translation.idioms.map((idiom, i) => (
                              <li key={i} className="text-sm">{idiom}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>
      </ScrollArea>
    </Card>
  );
};

export default TranslationResults;
