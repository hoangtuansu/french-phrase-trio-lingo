
import React, { useState } from 'react';
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (word.trim() && meaning.trim()) {
      onAddVocabulary(
        word.trim(), 
        meaning.trim(), 
        pastedImage ? extractedText.trim() : context.trim(),
        sourceLanguage,
        targetLanguage
      );
      setWord('');
      setMeaning('');
      setContext('');
      setPastedImage(null);
      setExtractedText('');
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
              setPastedImage(event.target?.result as string);
              // Show the extract confirmation dialog
              setShowExtractDialog(true);
            };
            reader.readAsDataURL(blob);
            // Prevent the image from being pasted into the textarea
            e.preventDefault();
          }
        }
      }
    }
  };

  const handleConfirmExtractedText = () => {
    setShowExtractDialog(false);
    // The extracted text is already stored in the extractedText state
  };

  return (
    <>
      <Card className="w-full">
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2">
              <Label htmlFor="word">Word/Phrase/Idiom</Label>
              <Input 
                id="word" 
                value={word} 
                onChange={(e) => setWord(e.target.value)}
                placeholder="Enter word, phrase or idiom"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="meaning">Meaning</Label>
              <Textarea 
                id="meaning" 
                value={meaning} 
                onChange={(e) => setMeaning(e.target.value)}
                placeholder="Enter the meaning"
                className="min-h-[80px]"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="context">Context</Label>
              {pastedImage ? (
                <div className="space-y-4">
                  <div className="border rounded-md p-4 bg-muted/50">
                    <img src={pastedImage} alt="Pasted" className="max-h-64 mx-auto mb-4" />
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => {
                        setPastedImage(null);
                        setExtractedText('');
                      }}
                      className="w-full"
                    >
                      Remove Image
                    </Button>
                  </div>
                </div>
              ) : (
                <div 
                  className="relative"
                  onPaste={handlePaste}
                >
                  <Textarea 
                    id="context" 
                    value={context} 
                    onChange={(e) => setContext(e.target.value)}
                    placeholder="Enter context such as example sentence or paragraph (or paste an image with Ctrl+V/Cmd+V)"
                    className="min-h-[120px]"
                  />
                </div>
              )}
            </div>
          </CardContent>
          
          <CardFooter>
            <Button type="submit" className="w-full">Add to Vocabulary</Button>
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
              value={extractedText} 
              onChange={(e) => setExtractedText(e.target.value)}
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
