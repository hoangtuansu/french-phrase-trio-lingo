
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import type { Language, TranslationResult, TranslationMode } from '../types/language';

interface TranslationResultsProps {
  translationResults: TranslationResult[] | null;
  selectedLanguages: Language[];
  translationMode: TranslationMode;
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
  selectedLanguages,
  translationMode
}) => {
  const [openLanguages, setOpenLanguages] = useState<string[]>(
    selectedLanguages.length > 0 ? [selectedLanguages[0]] : []
  );

  // Format by language instead of by phrase
  const getTranslationsByLanguage = () => {
    if (!translationResults || translationResults.length === 0) return {};
    
    const byLanguage: Record<Language, { text: string, examples?: string[], idioms?: string[], grammarNotes?: string[] }> = {} as any;
    
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
        
        // Combine examples, idioms, and grammar notes
        const examples = allTranslations.flatMap(t => t?.examples || []);
        const idioms = allTranslations.flatMap(t => t?.idioms || []);
        const grammarNotes = allTranslations.flatMap(t => t?.grammarNotes || []);
        
        byLanguage[lang] = {
          text: combinedText,
          ...(examples.length > 0 && { examples }),
          ...(idioms.length > 0 && { idioms }),
          ...(grammarNotes.length > 0 && { grammarNotes })
        };
      }
    });
    
    return byLanguage;
  };

  const handleValueChange = (value: string[]) => {
    setOpenLanguages(value);
  };

  const translationsByLanguage = getTranslationsByLanguage();

  if (!translationResults || translationResults.length === 0) {
    return (
      <Card className="p-4 bg-white shadow-lg h-[450px] flex items-center justify-center text-gray-500">
        <div className="text-center">
          <p>No translations yet</p>
          <p className="text-sm">Enter a phrase or upload an image and click Translate</p>
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
            value={openLanguages}
            onValueChange={handleValueChange}
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
                      
                      {translationMode === 'advanced' || translationMode === 'learning' ? (
                        <div className="space-y-4">
                          {translation.examples && translation.examples.length > 0 && (
                            <div className="mt-2">
                              <div className="text-sm font-medium text-gray-500">Examples:</div>
                              <ul className="list-disc list-inside">
                                {translation.examples.map((example, i) => (
                                  <li key={i} className="text-sm">{example}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          {translation.idioms && translation.idioms.length > 0 && (
                            <div className="mt-2">
                              <div className="text-sm font-medium text-gray-500">Idioms:</div>
                              <ul className="list-disc list-inside">
                                {translation.idioms.map((idiom, i) => (
                                  <li key={i} className="text-sm">{idiom}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      ) : null}

                      {translationMode === 'learning' && translation.grammarNotes && translation.grammarNotes.length > 0 && (
                        <div className="mt-4 p-3 bg-blue-50 rounded-md">
                          <div className="text-sm font-medium text-blue-700">Grammar Notes:</div>
                          <ul className="list-disc list-inside">
                            {translation.grammarNotes.map((note, i) => (
                              <li key={i} className="text-sm text-blue-600">{note}</li>
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
