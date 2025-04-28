
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Languages } from "lucide-react";
import type { Language } from '../types/language';

interface PhraseInputProps {
  onAddPhrase: (phrase: string, languages: Language[]) => void;
}

const AVAILABLE_LANGUAGES: { value: Language; label: string }[] = [
  { value: 'english', label: 'English' },
  { value: 'vietnamese', label: 'Vietnamese' },
  { value: 'spanish', label: 'Spanish' },
  { value: 'german', label: 'German' },
  { value: 'italian', label: 'Italian' },
];

const PhraseInput: React.FC<PhraseInputProps> = ({ onAddPhrase }) => {
  const [phrase, setPhrase] = useState('');
  const [selectedLanguages, setSelectedLanguages] = useState<Language[]>(['english', 'vietnamese']);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phrase.trim() && selectedLanguages.length > 0) {
      onAddPhrase(phrase.trim(), selectedLanguages);
      setPhrase('');
    }
  };

  return (
    <Card className="p-6 bg-white shadow-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center space-x-2">
          <Languages className="w-5 h-5 text-french-blue" />
          <h2 className="text-xl font-semibold text-french-blue">Add French Phrases</h2>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Select Translation Languages:</label>
          <div className="flex flex-wrap gap-4">
            {AVAILABLE_LANGUAGES.map((lang) => (
              <div key={lang.value} className="flex items-center space-x-2">
                <Checkbox
                  id={lang.value}
                  checked={selectedLanguages.includes(lang.value)}
                  onCheckedChange={(checked) => {
                    setSelectedLanguages(
                      checked
                        ? [...selectedLanguages, lang.value]
                        : selectedLanguages.filter((l) => l !== lang.value)
                    );
                  }}
                />
                <label htmlFor={lang.value} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  {lang.label}
                </label>
              </div>
            ))}
          </div>
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
  );
};

export default PhraseInput;
