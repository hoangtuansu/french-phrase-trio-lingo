
import React from 'react';
import { Button } from "@/components/ui/button";
import { Language } from '../types/language';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface LanguageSelectorProps {
  selectedLanguages: Language[];
  onLanguagesChange: (languages: Language[]) => void;
}

const AVAILABLE_LANGUAGES: { value: Language; label: string }[] = [
  { value: 'english', label: 'English' },
  { value: 'vietnamese', label: 'Vietnamese' },
  { value: 'spanish', label: 'Spanish' },
  { value: 'german', label: 'German' },
  { value: 'italian', label: 'Italian' },
];

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ 
  selectedLanguages, 
  onLanguagesChange 
}) => {
  const toggleLanguage = (language: Language) => {
    const newSelection = selectedLanguages.includes(language)
      ? selectedLanguages.filter(l => l !== language)
      : [...selectedLanguages, language];
    onLanguagesChange(newSelection);
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Translation Languages:</label>
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
  );
};

export default LanguageSelector;
