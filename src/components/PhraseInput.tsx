
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Languages, X } from "lucide-react";
import TranslationResults from './TranslationResults';
import type { Language, TranslationResult, TranslationMode } from '../types/language';
import { useToast } from "@/hooks/use-toast";
import LanguageSelector from './LanguageSelector';
import ModeSelector from './ModeSelector';
import ImageUploader from './ImageUploader';
import ExtractedTextDialog from './ExtractedTextDialog';

interface PhraseInputProps {
  onAddPhrase: (phrase: string, languages: Language[], mode: TranslationMode) => void;
  selectedLanguages: Language[];
  onLanguagesChange: (languages: Language[]) => void;
  translationResults: TranslationResult[] | null;
  inputText: string;
  onInputTextChange: (text: string) => void;
}

const PhraseInput: React.FC<PhraseInputProps> = ({ 
  onAddPhrase, 
  selectedLanguages,
  onLanguagesChange,
  translationResults,
  inputText,
  onInputTextChange
}) => {
  const [translationMode, setTranslationMode] = useState<TranslationMode>('simple');
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [extractedText, setExtractedText] = useState<string>('');
  const [isTextDialogOpen, setIsTextDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim() && selectedLanguages.length > 0) {
      onAddPhrase(inputText.trim(), selectedLanguages, translationMode);
    }
  };

  const clearPhrase = () => {
    onInputTextChange('');
  };

  const handleTextExtracted = (text: string) => {
    setExtractedText(text);
    setIsTextDialogOpen(true);
  };

  const confirmExtractedText = () => {
    onInputTextChange(extractedText);
    setIsTextDialogOpen(false);
  };

  const cancelExtractedText = () => {
    setIsTextDialogOpen(false);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="p-6 bg-white shadow-lg h-[450px]">
        <form onSubmit={handleSubmit} className="space-y-4 h-full flex flex-col">
          <div className="flex items-center space-x-2">
            <Languages className="w-5 h-5 text-french-blue" />
            <h2 className="text-xl font-semibold text-french-blue">Add Phrases</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <LanguageSelector 
              selectedLanguages={selectedLanguages}
              onLanguagesChange={onLanguagesChange}
            />

            <ModeSelector 
              translationMode={translationMode}
              onModeChange={setTranslationMode}
            />
          </div>

          <div className="space-y-2 flex-grow">
            <div className="relative h-full flex flex-col">
              <Textarea
                value={inputText}
                onChange={(e) => onInputTextChange(e.target.value)}
                placeholder="Enter phrases or paste an image..."
                className="min-h-[150px] pr-10 flex-grow"
                onPaste={(e) => {
                  const items = e.clipboardData?.items;
                  if (!items) return;
                  
                  for (let i = 0; i < items.length; i++) {
                    if (items[i].type.indexOf('image') !== -1) {
                      // Let the ImageUploader handle the image paste
                      break;
                    }
                  }
                }}
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
          
          <div className="flex gap-2">
            <ImageUploader
              onTextExtracted={handleTextExtracted}
              isProcessingImage={isProcessingImage}
              setIsProcessingImage={setIsProcessingImage}
            />
            <Button 
              type="submit" 
              className="flex-1 bg-french-blue hover:bg-blue-800"
              disabled={isProcessingImage}
            >
              Translate
            </Button>
          </div>
        </form>
      </Card>

      <TranslationResults 
        translationResults={translationResults}
        selectedLanguages={selectedLanguages}
        translationMode={translationMode}
      />
      
      <ExtractedTextDialog
        isOpen={isTextDialogOpen}
        onOpenChange={setIsTextDialogOpen}
        extractedText={extractedText}
        onConfirm={confirmExtractedText}
        onCancel={cancelExtractedText}
      />
    </div>
  );
};

export default PhraseInput;
