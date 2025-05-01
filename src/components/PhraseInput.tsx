
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Languages, X } from "lucide-react";
import TranslationResults from './TranslationResults';
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
  inputText: string;
  onInputTextChange: (text: string) => void;
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
  translationResults,
  inputText,
  onInputTextChange
}) => {

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim() && selectedLanguages.length > 0) {
      onAddPhrase(inputText.trim(), selectedLanguages);
    }
  };

  const clearPhrase = () => {
    onInputTextChange('');
  };

  const toggleLanguage = (language: Language) => {
    const newSelection = selectedLanguages.includes(language)
      ? selectedLanguages.filter(l => l !== language)
      : [...selectedLanguages, language];
    onLanguagesChange(newSelection);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="p-6 bg-white shadow-lg h-[450px]">
        <form onSubmit={handleSubmit} className="space-y-4 h-full flex flex-col">
          <div className="flex items-center space-x-2">
            <Languages className="w-5 h-5 text-french-blue" />
            <h2 className="text-xl font-semibold text-french-blue">Add Phrases</h2>
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
                value={inputText}
                onChange={(e) => onInputTextChange(e.target.value)}
                placeholder="Enter phrases (one per line)..."
                className="min-h-[150px] pr-10 flex-grow"
              />
              {inputText && (
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

      <TranslationResults 
        translationResults={translationResults}
        selectedLanguages={selectedLanguages}
      />
    </div>
  );
};

export default PhraseInput;
