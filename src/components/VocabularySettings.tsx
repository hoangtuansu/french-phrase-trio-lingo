
import React from 'react';
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import VocabularyConfig from './VocabularyConfig';
import { Language } from '../types/language';

interface VocabularySettingsProps {
  sourceLanguage: Language;
  targetLanguage: Language;
  onSourceLanguageChange: (language: Language) => void;
  onTargetLanguageChange: (language: Language) => void;
}

const VocabularySettings: React.FC<VocabularySettingsProps> = ({
  sourceLanguage,
  targetLanguage,
  onSourceLanguageChange,
  onTargetLanguageChange,
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="ml-auto">
          <Settings className="h-5 w-5" />
          <span className="sr-only">Vocabulary Settings</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Vocabulary Settings</DialogTitle>
        </DialogHeader>
        <VocabularyConfig
          sourceLanguage={sourceLanguage}
          targetLanguage={targetLanguage}
          onSourceLanguageChange={onSourceLanguageChange}
          onTargetLanguageChange={onTargetLanguageChange}
        />
      </DialogContent>
    </Dialog>
  );
};

export default VocabularySettings;
