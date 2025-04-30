
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronDown } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
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
  const [openPhrases, setOpenPhrases] = useState<number[]>([]);
  const [expandedLanguages, setExpandedLanguages] = useState<string[]>([]);

  // Ensure first language translation is expanded by default
  useEffect(() => {
    if (selectedLanguages.length > 0) {
      setExpandedLanguages([selectedLanguages[0]]);
    }
    
    // Auto-open the first result
    if (translationResults && translationResults.length > 0) {
      setOpenPhrases([0]);
    }
  }, [selectedLanguages, translationResults]);

  const togglePhrase = (index: number) => {
    setOpenPhrases(current => 
      current.includes(index)
        ? current.filter(i => i !== index)
        : [...current, index]
    );
  };

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
          {translationResults.map((result, index) => (
            <Card key={index} className="p-4">
              <Collapsible
                open={openPhrases.includes(index)}
                onOpenChange={() => togglePhrase(index)}
              >
                <div className="flex items-center justify-between">
                  <CollapsibleTrigger className="flex-1 text-left font-medium text-french-blue cursor-pointer">
                    {result.original}
                  </CollapsibleTrigger>
                  <ChevronDown className={`h-4 w-4 transition-transform ${openPhrases.includes(index) ? 'transform rotate-180' : ''}`} />
                </div>
                <CollapsibleContent>
                  <div className="pt-2">
                    <Accordion 
                      type="multiple" 
                      value={expandedLanguages}
                      onValueChange={setExpandedLanguages}
                      className="w-full"
                    >
                      {Object.entries(result.translations)
                        .filter(([lang]) => selectedLanguages.includes(lang as Language))
                        .map(([lang, translation]) => (
                          <AccordionItem key={lang} value={lang}>
                            <AccordionTrigger className="hover:no-underline py-2 w-full">
                              <span className="font-semibold text-gray-700">
                                {AVAILABLE_LANGUAGES.find(l => l.value === lang)?.label}
                              </span>
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="space-y-2 p-2">
                                <div>{translation.text}</div>
                                {translation.examples && (
                                  <div className="ml-2">
                                    <div className="text-sm text-gray-500">Examples:</div>
                                    <ul className="list-disc list-inside">
                                      {translation.examples.map((example, i) => (
                                        <li key={i} className="text-sm">{example}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                                {translation.idioms && (
                                  <div className="ml-2">
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
                        ))}
                    </Accordion>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};

export default TranslationResults;
