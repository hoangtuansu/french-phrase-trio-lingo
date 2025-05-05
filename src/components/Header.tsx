
import React from 'react';
import { Globe, Settings } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Language } from '../types/language';
import VocabularySettings from './VocabularySettings';

interface HeaderProps {
  isTitleCollapsed: boolean;
  setIsTitleCollapsed: (collapsed: boolean) => void;
  selectedLanguages: Language[];
  sourceLanguage: Language;
  targetLanguage: Language;
  onSourceLanguageChange: (language: Language) => void;
  onTargetLanguageChange: (language: Language) => void;
}

const Header: React.FC<HeaderProps> = ({ 
  isTitleCollapsed, 
  setIsTitleCollapsed, 
  selectedLanguages,
  sourceLanguage,
  targetLanguage,
  onSourceLanguageChange,
  onTargetLanguageChange
}) => {
  return (
    <div className="relative mb-4">
      <Collapsible
        open={!isTitleCollapsed}
        onOpenChange={(isOpen) => setIsTitleCollapsed(!isOpen)}
      >
        <CollapsibleTrigger className="w-full flex items-center justify-center cursor-pointer">
          <div className="flex items-center">
            <Globe className="text-french-blue w-5 h-5 mr-2" />
            <h1 className="text-lg font-bold text-french-blue">
              Translator
            </h1>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <p className="text-center text-sm text-gray-500 mt-1">
            {selectedLanguages.map(lang => 
              lang.charAt(0).toUpperCase() + lang.slice(1)
            ).join(' • ')}
          </p>
        </CollapsibleContent>
      </Collapsible>
      
      {/* Settings button positioned absolutely in the top right */}
      <div className="absolute top-0 right-0">
        <VocabularySettings
          sourceLanguage={sourceLanguage}
          targetLanguage={targetLanguage}
          onSourceLanguageChange={onSourceLanguageChange}
          onTargetLanguageChange={onTargetLanguageChange}
        />
      </div>
    </div>
  );
};

export default Header;
