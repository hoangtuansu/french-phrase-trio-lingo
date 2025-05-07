
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
import { Language, VocabularyItem } from '../types/language';
import { Plus, X, Trash2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import Tesseract from 'tesseract.js';

const TESSERACT_LANG_CODES: Record<Language, string> = {
  english: 'eng',
  vietnamese: 'vie',
  spanish: 'spa',
  german: 'deu',
  italian: 'ita',
  french: 'fra'
};

interface WordMeaningPair {
  id: string;
  word: string;
  meaning: string;
}

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
  extractedText: string;
  setExtractedText: (text: string) => void;
  editingItem?: VocabularyItem | null;
  setEditingItem?: (item: VocabularyItem | null) => void;
}

const VocabularyInput: React.FC<VocabularyInputProps> = ({
  onAddVocabulary,
  sourceLanguage,
  targetLanguage,
  extractedText,
  setExtractedText,
  editingItem = null,
  setEditingItem = () => {},
}) => {
  const [context, setContext] = useState('');
  const [showExtractDialog, setShowExtractDialog] = useState(false);
  const [tempPastedImage, setTempPastedImage] = useState<string | null>(null);
  const [localPastedImage, setLocalPastedImage] = useState<string | null>(null);
  const [localExtractedText, setLocalExtractedText] = useState('');
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const { toast } = useToast();
  
  // State for dynamic word-meaning pairs
  const [wordMeaningPairs, setWordMeaningPairs] = useState<WordMeaningPair[]>([
    { id: Date.now().toString(), word: '', meaning: '' }
  ]);

  // Effect to handle editing mode
  useEffect(() => {
    if (editingItem) {
      setContext(editingItem.context || '');
      setWordMeaningPairs([{ 
        id: Date.now().toString(), 
        word: editingItem.word, 
        meaning: editingItem.meaning 
      }]);
    }
  }, [editingItem]);

  const handleAddWordMeaningPair = () => {
    setWordMeaningPairs([
      ...wordMeaningPairs,
      { id: Date.now().toString(), word: '', meaning: '' }
    ]);
  };

  const handleRemoveWordMeaningPair = (id: string) => {
    if (wordMeaningPairs.length > 1) {
      setWordMeaningPairs(wordMeaningPairs.filter(pair => pair.id !== id));
    } else {
      toast({
        title: "Cannot remove",
        description: "You need at least one word-meaning pair.",
        variant: "destructive"
      });
    }
  };

  const handleUpdateWordMeaningPair = (id: string, field: 'word' | 'meaning', value: string) => {
    setWordMeaningPairs(
      wordMeaningPairs.map(pair => 
        pair.id === id ? { ...pair, [field]: value } : pair
      )
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // If there's a temporary pasted image but no dialog shown yet, show the dialog
    if (tempPastedImage && !showExtractDialog) {
      setLocalPastedImage(tempPastedImage);
      setShowExtractDialog(true);
      return;
    }
    
    // Validate all pairs
    const invalidPairs = wordMeaningPairs.filter(pair => !pair.word.trim() || !pair.meaning.trim());
    if (invalidPairs.length > 0) {
      toast({
        title: "Incomplete entries",
        description: "Please fill in all word and meaning fields before adding.",
        variant: "destructive"
      });
      return;
    }
    
    // Add all valid word-meaning pairs
    wordMeaningPairs.forEach(pair => {
      onAddVocabulary(
        pair.word.trim(), 
        pair.meaning.trim(), 
        localPastedImage ? localExtractedText.trim() : context.trim(),
        sourceLanguage,
        targetLanguage
      );
    });

    // Reset the form
    if (!editingItem) {
      setWordMeaningPairs([{ id: Date.now().toString(), word: '', meaning: '' }]);
      setContext('');
      setLocalPastedImage(null);
      setLocalExtractedText('');
      setTempPastedImage(null);
    } else {
      // If we were in edit mode, exit edit mode
      setEditingItem(null);
    }
  };

  const extractTextFromImage = async (file: File): Promise<string> => {
    setIsProcessingImage(true);
    try {
      // Use the source language to determine the Tesseract language code
      const langCode = TESSERACT_LANG_CODES[sourceLanguage] || 'eng'; // default to English if not found

      const {
        data: {
          text
        }
      } = await Tesseract.recognize(file, langCode,
      // language code based on selected source language
      {
        logger: m => console.log(m)
      });
      return text;
    } finally {
      setIsProcessingImage(false);
    }
  };

  const handlePaste = async (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (items) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          e.preventDefault();
          const blob = items[i].getAsFile();
          if (blob) {
            try {
              toast({
                title: "Processing image",
                description: "Extracting text from the pasted image..."
              });
  
              // Create an image preview
              const reader = new FileReader();
              reader.onload = (event) => {
                // Show the image immediately when pasted
                setTempPastedImage(event.target?.result as string);
              };
              reader.readAsDataURL(blob);
              
              const extractedText = await extractTextFromImage(blob);
              setExtractedText(extractedText);
              setLocalExtractedText(extractedText); // Initialize edited text with extracted text
              setShowExtractDialog(true);

              toast({
                title: "Text extracted",
                description: "Text has been extracted from the image."
              });
            } catch (error) {
              console.error("Error processing pasted image:", error);
              toast({
                title: "Error",
                description: "Failed to extract text from the pasted image.",
                variant: "destructive"
              });
            }
          }
        }
      }
    }
  };

  const handleConfirmExtractedText = () => {
    setShowExtractDialog(false);
    setLocalExtractedText(extractedText);
  };

  const clearContext = () => {
    setContext('');
  };

  const clearImage = () => {
    setLocalPastedImage(null);
    setLocalExtractedText('');
    setTempPastedImage(null);
  };

  return (
    <>
      <Card className="w-full">
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6 pt-6">
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
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className="text-base">Words & Meanings</Label>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={handleAddWordMeaningPair}
                  className="flex items-center gap-1"
                >
                  <Plus size={16} />
                  Add Pair
                </Button>
              </div>
              
              <div className="space-y-4">
                {wordMeaningPairs.map((pair, index) => (
                  <div 
                    key={pair.id} 
                    className="grid grid-cols-[1fr,1fr,auto] gap-3 items-start bg-muted/20 p-3 rounded-lg"
                  >
                    <div className="space-y-2">
                      <Label htmlFor={`word-${pair.id}`} className="text-sm">
                        Word/Phrase/Idiom
                      </Label>
                      <div className="relative">
                        <Input 
                          id={`word-${pair.id}`} 
                          value={pair.word} 
                          onChange={(e) => handleUpdateWordMeaningPair(pair.id, 'word', e.target.value)}
                          placeholder="Enter word, phrase or idiom"
                        />
                        {pair.word && (
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm" 
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0" 
                            onClick={() => handleUpdateWordMeaningPair(pair.id, 'word', '')}
                          >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Clear</span>
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`meaning-${pair.id}`} className="text-sm">
                        Meaning
                      </Label>
                      <div className="relative">
                        <Input 
                          id={`meaning-${pair.id}`} 
                          value={pair.meaning} 
                          onChange={(e) => handleUpdateWordMeaningPair(pair.id, 'meaning', e.target.value)}
                          placeholder="Enter the meaning"
                        />
                        {pair.meaning && (
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm" 
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0" 
                            onClick={() => handleUpdateWordMeaningPair(pair.id, 'meaning', '')}
                          >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Clear</span>
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className="pt-8">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveWordMeaningPair(pair.id)}
                        className="h-9 w-9 p-0 text-destructive hover:bg-destructive/10"
                        disabled={wordMeaningPairs.length === 1}
                      >
                        <Trash2 size={16} />
                        <span className="sr-only">Remove pair</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
          
          <CardFooter>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isProcessingImage}
            >
              {tempPastedImage && !localPastedImage 
                ? "Process Image & Extract Text" 
                : editingItem 
                  ? "Update Vocabulary" 
                  : "Add to Vocabulary"}
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
