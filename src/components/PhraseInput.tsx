
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Languages, ChevronDown, X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { Language, TranslationResult } from '../types/language';

interface PhraseInputProps {
  onAddPhrase: (phrase: string, languages: Language[]) => void;
  selectedLanguages: Language[];
  onLanguagesChange: (languages: Language[]) => void;
  translationResults: TranslationResult[] | null;
}

const AVAILABLE_LANGUAGES: { value: Language; label: string }[] = [
  { value: 'english', label: 'English' },
  { value: 'vietnamese', label: 'Vietnamese' },
  { value: 'spanish', label: 'Spanish' },
  { value: 'german', label: 'German' },
  { value: 'italian', label: 'Italian' },
];

const PhraseInput: React.FC<PhraseInputProps> = ({ 
  onAddPhrase, 
  selectedLanguages,
  onLanguagesChange,
  translationResults 
}) => {
  const [phrase, setPhrase] = useState('');
  const [openPhrases, setOpenPhrases] = useState<number[]>([]);
  const [expandedLanguages, setExpandedLanguages] = useState<string[]>([]);

  useEffect(() => {
    // Set the first language as expanded by default
    if (selectedLanguages.length > 0) {
      setExpandedLanguages([selectedLanguages[0]]);
    }
  }, [selectedLanguages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phrase.trim() && selectedLanguages.length > 0) {
      onAddPhrase(phrase.trim(), selectedLanguages);
      // Auto-open the first result when new translations arrive
      setOpenPhrases([0]);
    }
  };

  const clearPhrase = () => {
    setPhrase('');
  };

  const toggleLanguage = (language: Language) => {
    const newSelection = selectedLanguages.includes(language)
      ? selectedLanguages.filter(l => l !== language)
      : [...selectedLanguages, language];
    onLanguagesChange(newSelection);
  };

  const togglePhrase = (index: number) => {
    setOpenPhrases(current => 
      current.includes(index)
        ? current.filter(i => i !== index)
        : [...current, index]
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="p-6 bg-white shadow-lg h-[450px]">
        <form onSubmit={handleSubmit} className="space-y-4 h-full flex flex-col">
          <div className="flex items-center space-x-2">
            <Languages className="w-5 h-5 text-french-blue" />
            <h2 className="text-xl font-semibold text-french-blue">Add French Phrases</h2>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Translation Languages:</label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  {selectedLanguages.length 
                    ? `${selectedLanguages.length} languages selected` 
                    : "Select languages"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                {AVAILABLE_LANGUAGES.map((lang) => (
                  <DropdownMenuCheckboxItem
                    key={lang.value}
                    checked={selectedLanguages.includes(lang.value)}
                    onCheckedChange={() => toggleLanguage(lang.value)}
                  >
                    {lang.label}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="space-y-2 flex-grow">
            <div className="relative h-full flex flex-col">
              <Textarea
                value={phrase}
                onChange={(e) => setPhrase(e.target.value)}
                placeholder="Enter French phrases (one per line)..."
                className="min-h-[150px] pr-10 flex-grow"
              />
              {phrase && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 h-6 w-6 p-0"
                  onClick={clearPhrase}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Clear</span>
                </Button>
              )}
            </div>
          </div>
          
          <Button type="submit" className="w-full bg-french-blue hover:bg-blue-800">
            Translate
          </Button>
        </form>
      </Card>

      {translationResults && translationResults.length > 0 ? (
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
                            .map(([lang, translation], langIndex) => (
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
      ) : (
        <Card className="p-4 bg-white shadow-lg h-[450px] flex items-center justify-center text-gray-500">
          <div className="text-center">
            <p>No translations yet</p>
            <p className="text-sm">Enter a French phrase and click Translate</p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default PhraseInput;
