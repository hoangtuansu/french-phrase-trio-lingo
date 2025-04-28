
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Languages } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phrase.trim() && selectedLanguages.length > 0) {
      onAddPhrase(phrase.trim(), selectedLanguages);
      setPhrase('');
    }
  };

  const toggleLanguage = (language: Language) => {
    const newSelection = selectedLanguages.includes(language)
      ? selectedLanguages.filter(l => l !== language)
      : [...selectedLanguages, language];
    onLanguagesChange(newSelection);
  };

  return (
    <div className="grid grid-cols-1 gap-4">
      <Card className="p-6 bg-white shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
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

          <div className="space-y-2">
            <Textarea
              value={phrase}
              onChange={(e) => setPhrase(e.target.value)}
              placeholder="Enter French phrases (one per line)..."
              className="min-h-[100px]"
            />
            <Button type="submit" className="w-full bg-french-blue hover:bg-blue-800">
              Translate
            </Button>
          </div>
        </form>
      </Card>

      {translationResults && translationResults.length > 0 && (
        <Card className="p-6">
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {translationResults.map((result, index) => (
                <div key={index} className="border-b pb-4 last:border-b-0">
                  <div className="font-medium mb-2">{result.original}</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(result.translations).map(([lang, translation]) => (
                      selectedLanguages.includes(lang as Language) && (
                        <div key={lang} className="space-y-2">
                          <div className="font-semibold text-gray-600">
                            {AVAILABLE_LANGUAGES.find(l => l.value === lang)?.label}:
                          </div>
                          <div>{translation.text}</div>
                          {translation.examples && (
                            <div className="ml-4">
                              <div className="text-sm text-gray-500">Examples:</div>
                              <ul className="list-disc list-inside">
                                {translation.examples.map((example, i) => (
                                  <li key={i} className="text-sm">{example}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {translation.idioms && (
                            <div className="ml-4">
                              <div className="text-sm text-gray-500">Idioms:</div>
                              <ul className="list-disc list-inside">
                                {translation.idioms.map((idiom, i) => (
                                  <li key={i} className="text-sm">{idiom}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </Card>
      )}
    </div>
  );
};

export default PhraseInput;
