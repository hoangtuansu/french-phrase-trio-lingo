
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Languages } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

  const handleLanguageChange = (value: string) => {
    const languages = value.split(',') as Language[];
    onLanguagesChange(languages);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="p-6 bg-white shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center space-x-2">
            <Languages className="w-5 h-5 text-french-blue" />
            <h2 className="text-xl font-semibold text-french-blue">Add French Phrases</h2>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Translation Languages:</label>
            <Select
              value={selectedLanguages.join(',')}
              onValueChange={handleLanguageChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select languages" />
              </SelectTrigger>
              <SelectContent>
                {AVAILABLE_LANGUAGES.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
                  {Object.entries(result.translations).map(([lang, translation]) => (
                    selectedLanguages.includes(lang as Language) && (
                      <div key={lang} className="ml-4 mb-2">
                        <div className="font-semibold text-gray-600">
                          {AVAILABLE_LANGUAGES.find(l => l.value === lang)?.label}:
                        </div>
                        <div>{translation.text}</div>
                        {translation.examples && (
                          <div className="ml-4 mt-1">
                            <div className="text-sm text-gray-500">Examples:</div>
                            <ul className="list-disc list-inside">
                              {translation.examples.map((example, i) => (
                                <li key={i} className="text-sm">{example}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {translation.idioms && (
                          <div className="ml-4 mt-1">
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
              ))}
            </div>
          </ScrollArea>
        </Card>
      )}
    </div>
  );
};

export default PhraseInput;
