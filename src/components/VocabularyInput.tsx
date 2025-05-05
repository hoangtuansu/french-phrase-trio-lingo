
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  onSourceLanguageChange: (language: Language) => void;
  onTargetLanguageChange: (language: Language) => void;
  pastedImage: string | null;
  setPastedImage: (image: string | null) => void;
  extractedText: string;
  setExtractedText: (text: string) => void;
}

const VocabularyInput: React.FC<VocabularyInputProps> = ({
  onAddVocabulary,
  sourceLanguage,
  targetLanguage,
  onSourceLanguageChange,
  onTargetLanguageChange,
  pastedImage,
  setPastedImage,
  extractedText,
  setExtractedText,
}) => {
  const [word, setWord] = useState('');
  const [meaning, setMeaning] = useState('');
  const [context, setContext] = useState('');
  const [activeTab, setActiveTab] = useState<'text' | 'image'>('text');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (word.trim() && meaning.trim()) {
      onAddVocabulary(
        word.trim(), 
        meaning.trim(), 
        activeTab === 'text' ? context.trim() : extractedText.trim(),
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
            };
            reader.readAsDataURL(blob);
            // Prevent the image from being pasted into the textarea
            e.preventDefault();
            setActiveTab('image');
          }
        }
      }
    }
  };

  const languageOptions: Language[] = ['english', 'french', 'vietnamese', 'spanish', 'german', 'italian'];

  return (
    <Card className="w-full">
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 pt-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sourceLanguage">Source Language</Label>
              <select
                id="sourceLanguage"
                value={sourceLanguage}
                onChange={(e) => onSourceLanguageChange(e.target.value as Language)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                {languageOptions.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang.charAt(0).toUpperCase() + lang.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="targetLanguage">Target Language</Label>
              <select
                id="targetLanguage"
                value={targetLanguage}
                onChange={(e) => onTargetLanguageChange(e.target.value as Language)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                {languageOptions.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang.charAt(0).toUpperCase() + lang.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
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
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'text' | 'image')}>
              <TabsList className="mb-2">
                <TabsTrigger value="text">Text</TabsTrigger>
                <TabsTrigger value="image">Image</TabsTrigger>
              </TabsList>
              
              <TabsContent value="text">
                <Textarea 
                  id="context" 
                  value={context} 
                  onChange={(e) => setContext(e.target.value)}
                  placeholder="Enter context such as example sentence or paragraph"
                  className="min-h-[120px]"
                />
              </TabsContent>
              
              <TabsContent value="image" className="space-y-4">
                <div 
                  className="border-2 border-dashed rounded-md p-6 text-center cursor-pointer bg-muted/50"
                  onPaste={handlePaste}
                  tabIndex={0}
                  onClick={() => document.getElementById('imageUploadArea')?.focus()}
                  id="imageUploadArea"
                >
                  {pastedImage ? (
                    <div className="space-y-4">
                      <img src={pastedImage} alt="Pasted" className="max-h-64 mx-auto" />
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={(e) => { 
                          e.stopPropagation();
                          setPastedImage(null);
                        }}
                      >
                        Remove Image
                      </Button>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Paste an image with text (Ctrl+V/Cmd+V)
                    </p>
                  )}
                </div>
                {pastedImage && (
                  <Textarea 
                    value={extractedText} 
                    onChange={(e) => setExtractedText(e.target.value)}
                    placeholder="Extracted text will appear here (you can edit it)"
                    className="min-h-[120px]"
                  />
                )}
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
        
        <CardFooter>
          <Button type="submit" className="w-full">Add to Vocabulary</Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default VocabularyInput;
