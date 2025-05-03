
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Languages, X, Image as ImageIcon } from "lucide-react";
import TranslationResults from './TranslationResults';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Language, TranslationResult, TranslationMode } from '../types/language';
import { useToast } from "@/hooks/use-toast";
import Tesseract from 'tesseract.js';

interface PhraseInputProps {
  onAddPhrase: (phrase: string, languages: Language[], mode: TranslationMode, sourceLanguage: Language) => void;
  selectedLanguages: Language[];
  onLanguagesChange: (languages: Language[]) => void;
  translationResults: TranslationResult[] | null;
  inputText: string;
  onInputTextChange: (text: string) => void;
  pastedImage: string | null;
  setPastedImage: (image: string | null) => void;
  extractedText: string;
  setExtractedText: (text: string) => void;
  sourceLanguage: Language;
  onSourceLanguageChange: (language: Language) => void;
}

const AVAILABLE_LANGUAGES: { value: Language; label: string }[] = [
  { value: 'english', label: 'English' },
  { value: 'vietnamese', label: 'Vietnamese' },
  { value: 'spanish', label: 'Spanish' },
  { value: 'german', label: 'German' },
  { value: 'italian', label: 'Italian' },
];

const TRANSLATION_MODES = [
  { value: 'simple', label: 'Simple', description: 'Basic translation only' },
  { value: 'advanced', label: 'Advanced', description: 'Includes examples and idioms' },
  { value: 'learning', label: 'Learning', description: 'Adds grammar explanations' },
];

const PhraseInput: React.FC<PhraseInputProps> = ({ 
  onAddPhrase, 
  selectedLanguages,
  onLanguagesChange,
  translationResults,
  inputText,
  onInputTextChange,
  pastedImage,
  setPastedImage,
  extractedText,
  setExtractedText,
  sourceLanguage,
  onSourceLanguageChange
}) => {
  const [translationMode, setTranslationMode] = useState<TranslationMode>('simple');
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [isTextDialogOpen, setIsTextDialogOpen] = useState(false);
  const [editedExtractedText, setEditedExtractedText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim() && selectedLanguages.length > 0) {
      onAddPhrase(inputText.trim(), selectedLanguages, translationMode, sourceLanguage);
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

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };
  
  const clearPastedImage = () => {
    setPastedImage(null);
    setExtractedText('');
    onInputTextChange('');
  };

  const mockExtractTextFromImage = async (file: File): Promise<string> => {
    setIsProcessingImage(true);
    try {
      const { data: { text } } = await Tesseract.recognize(
        file,
        'eng', // language code
        { logger: m => console.log(m) }
      );
      return text;
    } finally {
      setIsProcessingImage(false);
    }
  };

  // New function to send text to external translation service
  const sendTextToTranslationService = async (text: string, targetLanguages: Language[]): Promise<Record<Language, string>> => {
    try {
      const response = await fetch('http://192.168.1.123:2345/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          sourceLanguage,
          targetLanguages: targetLanguages,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error sending text to translation service:', error);
      toast({
        title: 'Translation Service Error',
        description: 'Could not connect to the translation service.',
        variant: 'destructive',
      });
      
      // Return a mock response in case of error
      return targetLanguages.reduce((acc, lang) => ({
        ...acc,
        [lang]: `Translation to ${lang} failed`
      }), {} as Record<Language, string>);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    
    // Check if it's an image
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      toast({
        title: "Processing image",
        description: "Extracting text from the image...",
      });
      
      // Create an image preview
      const imageUrl = URL.createObjectURL(file);
      setPastedImage(imageUrl);
      
      const extractedText = await mockExtractTextFromImage(file);
      setExtractedText(extractedText);
      setEditedExtractedText(extractedText); // Initialize edited text with extracted text
      setIsTextDialogOpen(true);
      
      toast({
        title: "Text extracted",
        description: "Text has been extracted from the image.",
      });
    } catch (error) {
      console.error("Error processing image:", error);
      toast({
        title: "Error",
        description: "Failed to extract text from the image.",
        variant: "destructive",
      });
    }
    
    // Clear the file input for future uploads
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handlePaste = async (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        e.preventDefault();
        const blob = items[i].getAsFile();
        if (blob) {
          try {
            toast({
              title: "Processing image",
              description: "Extracting text from the pasted image...",
            });
            
            // Create an image preview
            const imageUrl = URL.createObjectURL(blob);
            setPastedImage(imageUrl);
            
            const extractedText = await mockExtractTextFromImage(blob);
            setExtractedText(extractedText);
            setEditedExtractedText(extractedText); // Initialize edited text with extracted text
            setIsTextDialogOpen(true);
            
            toast({
              title: "Text extracted",
              description: "Text has been extracted from the image.",
            });
          } catch (error) {
            console.error("Error processing pasted image:", error);
            toast({
              title: "Error",
              description: "Failed to extract text from the pasted image.",
              variant: "destructive",
            });
          }
        }
        break;
      }
    }
  };

  const confirmExtractedText = () => {
    onInputTextChange(editedExtractedText);
    setExtractedText(editedExtractedText);
    setIsTextDialogOpen(false);
  };

  const cancelExtractedText = () => {
    setIsTextDialogOpen(false);
    // We don't clear the pastedImage as we want to keep it visible
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
            <div className="space-y-2">
              <label className="text-sm font-medium">Source Language:</label>
              <Select value={sourceLanguage} onValueChange={(value) => onSourceLanguageChange(value as Language)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select source language" />
                </SelectTrigger>
                <SelectContent>
                  {AVAILABLE_LANGUAGES.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Translation Mode:</label>
              <Tabs 
                defaultValue="simple" 
                value={translationMode}
                onValueChange={(value) => setTranslationMode(value as TranslationMode)}
                className="w-full"
              >
                <TabsList className="w-full grid grid-cols-3">
                  {TRANSLATION_MODES.map((mode) => (
                    <TabsTrigger 
                      key={mode.value} 
                      value={mode.value}
                      title={mode.description}
                      className="text-xs"
                    >
                      {mode.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Target Languages:</label>
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
              {pastedImage ? (
                <div className="relative h-full flex flex-col">
                  <div className="flex-grow relative overflow-hidden border rounded-md p-2">
                    <img 
                      src={pastedImage} 
                      alt="Pasted content" 
                      className="max-w-full max-h-full object-contain mx-auto"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 h-6 w-6 p-0 bg-white/70 hover:bg-white/90"
                      onClick={clearPastedImage}
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Clear image</span>
                    </Button>
                  </div>
                </div>
              ) : (
                <Textarea
                  value={inputText}
                  onChange={(e) => onInputTextChange(e.target.value)}
                  onPaste={handlePaste}
                  placeholder="Enter phrases or paste an image..."
                  className="min-h-[150px] pr-10 flex-grow"
                />
              )}
              
              {inputText && !pastedImage && (
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
            <Button 
              type="button" 
              variant="outline" 
              className="flex-1"
              onClick={handleImageClick}
              disabled={isProcessingImage}
            >
              <ImageIcon className="h-4 w-4 mr-2" />
              {isProcessingImage ? "Processing..." : "Upload Image"}
            </Button>
            <Button 
              type="submit" 
              className="flex-1 bg-french-blue hover:bg-blue-800"
              disabled={isProcessingImage}
            >
              Translate
            </Button>
          </div>
          
          <input 
            type="file" 
            ref={fileInputRef} 
            accept="image/*" 
            className="hidden" 
            onChange={handleImageUpload}
          />
        </form>
      </Card>

      <TranslationResults 
        translationResults={translationResults}
        selectedLanguages={selectedLanguages}
        translationMode={translationMode}
      />
      
      {/* Dialog for confirming extracted text */}
      <Dialog open={isTextDialogOpen} onOpenChange={setIsTextDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Extracted Text</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">Edit the extracted text if needed:</p>
            <Textarea 
              value={editedExtractedText} 
              onChange={(e) => setEditedExtractedText(e.target.value)} 
              className="min-h-[150px]"
            />
            <div className="flex space-x-2 justify-end">
              <Button variant="outline" onClick={cancelExtractedText}>
                Cancel
              </Button>
              <Button onClick={confirmExtractedText}>
                Use this text
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PhraseInput;
