
import React from 'react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Language } from '../types/language';

interface VocabularyConfigProps {
  sourceLanguage: Language;
  targetLanguage: Language;
  onSourceLanguageChange: (language: Language) => void;
  onTargetLanguageChange: (language: Language) => void;
}

const VocabularyConfig: React.FC<VocabularyConfigProps> = ({
  sourceLanguage,
  targetLanguage,
  onSourceLanguageChange,
  onTargetLanguageChange,
}) => {
  const languageOptions: Language[] = ['english', 'french', 'vietnamese', 'spanish', 'german', 'italian'];

  return (
    <div className="space-y-4 py-2 px-1">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="sourceLanguage" className="text-sm font-medium">Source Language</label>
          <Select value={sourceLanguage} onValueChange={(value) => onSourceLanguageChange(value as Language)}>
            <SelectTrigger>
              <SelectValue placeholder="Select source language" />
            </SelectTrigger>
            <SelectContent>
              {languageOptions.map((lang) => (
                <SelectItem key={lang} value={lang}>
                  {lang.charAt(0).toUpperCase() + lang.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label htmlFor="targetLanguage" className="text-sm font-medium">Target Language</label>
          <Select value={targetLanguage} onValueChange={(value) => onTargetLanguageChange(value as Language)}>
            <SelectTrigger>
              <SelectValue placeholder="Select target language" />
            </SelectTrigger>
            <SelectContent>
              {languageOptions.map((lang) => (
                <SelectItem key={lang} value={lang}>
                  {lang.charAt(0).toUpperCase() + lang.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default VocabularyConfig;
