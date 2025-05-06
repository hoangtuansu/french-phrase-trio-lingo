
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Language } from '../types/language';
import { X } from 'lucide-react';
import Tesseract from 'tesseract.js';

// Map of language to Tesseract language code
const TESSERACT_LANG_CODES: Record<Language, string> = {
  english: 'eng',
  vietnamese: 'vie',
  spanish: 'spa',
  german: 'deu',
  italian: 'ita',
  french: 'fra'
};

interface VocabularyInputProps {
  onAddVocabulary: (
    word: string, 
    meaning: string, 
    context: string,
    sourceLanguage: Language,
    targetLanguage: Language
  ) => void;
  sourceLanguage: Language;
  targetLanguage: Language;
  pastedImage: string | null;
  setPastedImage: (image: string | null) => void;
  extractedText: string;
  setExtractedText: (text: string) => void;
}

const VocabularyInput: React.FC<VocabularyInputProps> = ({
  onAddVocabulary,
  sourceLanguage,
  targetLanguage,
  pastedImage,
  setPastedImage,
  extractedText,
  setExtractedText,
}) => {
  const [word, setWord] = useState('');
  const [meaning, setMeaning] = useState('');
  const [context, setContext] = useState('');
  const [showExtractDialog, setShowExtractDialog] = useState(false);
  const [tempPastedImage, setTempPastedImage] = useState<string | null>(null);
  // Local state for managing images and text
  const [localPastedImage, setLocalPastedImage] = useState<string | null>(null);
  const [localExtractedText, setLocalExtractedText] = useState('');
  const [isProcessingImage, setIsProcessingImage] = useState(false);

  // Effect to maintain state when switching views
  useEffect(() => {
    // If there's already a pasted image from parent state, use it
    if (pastedImage && !localPastedImage) {
      setLocalPastedImage(pastedImage);
    }
    if (extractedText && !localExtractedText) {
      setLocalExtractedText(extractedText);
    }
  }, [pastedImage, extractedText, localPastedImage, localExtractedText]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // If there's a temporary pasted image but no dialog shown yet, show the dialog
    if (tempPastedImage && !showExtractDialog) {
      setLocalPastedImage(tempPastedImage);
      startImageProcessing(tempPastedImage);
      return;
    }
    
    if (word.trim() && meaning.trim()) {
      onAddVocabulary(
        word.trim(), 
        meaning.trim(), 
        localPastedImage ? localExtractedText.trim() : context.trim(),
        sourceLanguage,
        targetLanguage
      );
      setWord('');
      setMeaning('');
      setContext('');
      setLocalPastedImage(null);
      setLocalExtractedText('');
      setTempPastedImage(null);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (items) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const blob = items[i].getAsFile();
          if (blob) {
            const reader = new FileReader();
            reader.onload = (event) => {
              // Show the image immediately when pasted
              setTempPastedImage(event.target?.result as string);
            };
            reader.readAsDataURL(blob);
            // Prevent the image from being pasted into the textarea
            e.preventDefault();
          }
        }
      }
    }
  };

  const mockExtractTextFromImage = async (imageUrl: string): Promise<string> => {
    setIsProcessingImage(true);
    try {
      // Convert data URL to Blob
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      
      // Use the source language to determine the Tesseract language code
      const langCode = TESSERACT_LANG_CODES[sourceLanguage] || 'eng'; // default to English if not found

      const { data: { text } } = await Tesseract.recognize(
        blob,
        langCode,
        {
          logger: m => console.log(m)
        }
      );
      return text;
    } catch (error) {
      console.error("Error extracting text:", error);
      return "Error extracting text. Please try again.";
    } finally {
      setIsProcessingImage(false);
    }
  };

  const startImageProcessing = async (imageUrl: string) => {
    try {
      const text = await mockExtractTextFromImage(imageUrl);
      setLocalExtractedText(text);
      setShowExtractDialog(true);
    } catch (error) {
      console.error("Error processing image:", error);
    }
  };

  const handleConfirmExtractedText = () => {
    setShowExtractDialog(false);
    // Only update local state, not parent state
  };

  const clearWord = () => {
    setWord('');
  };

  const clearMeaning = () => {
    setMeaning('');
  };

  const clearContext = () => {
    setContext('');
  };

  const clearImage = () => {
    setLocalPastedImage(null);
    setLocalExtractedText('');
    setTempPastedImage(null);
    // Don't clear the parent's image state
  };

  return (
    <>
      <Card className="w-full">
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2">
              <Label htmlFor="word">Word/Phrase/Idiom</Label>
              <div className="relative">
                <Input 
                  id="word" 
                  value={word} 
                  onChange={(e) => setWord(e.target.value)}
                  placeholder="Enter word, phrase or idiom"
                />
                {word && (
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0" 
                    onClick={clearWord}
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Clear</span>
                  </Button>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="meaning">Meaning</Label>
              <div className="relative">
                <Textarea 
                  id="meaning" 
                  value={meaning} 
                  onChange={(e) => setMeaning(e.target.value)}
                  placeholder="Enter the meaning"
                  className="min-h-[80px] pr-10"
                />
                {meaning && (
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    className="absolute right-2 top-3 h-6 w-6 p-0" 
                    onClick={clearMeaning}
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Clear</span>
                  </Button>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="context">Context</Label>
              {tempPastedImage || localPastedImage ? (
                <div className="space-y-4">
                  <div className="border rounded-md p-4 bg-muted/50 relative">
                    <img 
                      src={tempPastedImage || localPastedImage} 
                      alt="Pasted" 
                      className="max-h-64 mx-auto mb-4" 
                    />
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      className="absolute top-2 right-2 h-6 w-6 p-0 bg-white/70 hover:bg-white/90" 
                      onClick={clearImage}
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Remove Image</span>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <Textarea 
                    id="context" 
                    value={context} 
                    onChange={(e) => setContext(e.target.value)}
                    placeholder="Enter context such as example sentence or paragraph (or paste an image with Ctrl+V/Cmd+V)"
                    className="min-h-[120px] pr-10"
                    onPaste={handlePaste}
                  />
                  {context && (
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      className="absolute right-2 top-3 h-6 w-6 p-0" 
                      onClick={clearContext}
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Clear</span>
                    </Button>
                  )}
                </div>
              )}
            </div>
          </CardContent>
          
          <CardFooter>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isProcessingImage}
            >
              {isProcessingImage 
                ? "Processing Image..." 
                : (tempPastedImage && !localPastedImage 
                  ? "Process Image & Extract Text" 
                  : "Add to Vocabulary")}
            </Button>
          </CardFooter>
        </form>
      </Card>

      <Dialog open={showExtractDialog} onOpenChange={setShowExtractDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Extracted Text</DialogTitle>
            <DialogDescription>
              Please review and edit the extracted text if needed.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea 
              value={localExtractedText} 
              onChange={(e) => setLocalExtractedText(e.target.value)}
              placeholder="Extracted text will appear here (you can edit it)"
              className="min-h-[120px]"
            />
          </div>
          <DialogFooter>
            <Button onClick={handleConfirmExtractedText}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default VocabularyInput;
