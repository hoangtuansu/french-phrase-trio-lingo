
import React, { useState, useEffect, useRef } from 'react';
import { Card } from "@/components/ui/card";
import { FileText, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { PhraseRecord } from '../utils/supabase';
import type { Language } from '../types/language';

interface HistoryViewProps {
  phrases: PhraseRecord[];
  onDelete: (id: number) => void;
  selectedLanguages: Language[];
}

const AVAILABLE_LANGUAGES = [
  { value: 'english', label: 'English' },
  { value: 'vietnamese', label: 'Vietnamese' },
  { value: 'spanish', label: 'Spanish' },
  { value: 'german', label: 'German' },
  { value: 'italian', label: 'Italian' },
];

const HistoryView: React.FC<HistoryViewProps> = ({ phrases, onDelete, selectedLanguages }) => {
  const [days, setDays] = useState<number>(7);
  const [openPhrases, setOpenPhrases] = useState<string[]>([]);
  const [openLanguages, setOpenLanguages] = useState<string[]>([]);
  const [randomPhrase, setRandomPhrase] = useState<PhraseRecord | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    // Set the first language as expanded by default
    if (selectedLanguages.length > 0) {
      setOpenLanguages([selectedLanguages[0]]);
    }
  }, [selectedLanguages]);
  
  const getRandomPhrase = () => {
    if (phrases.length === 0) return null;
    
    // Filter phrases from the last n days if specified
    let filteredPhrases = phrases;
    if (days > 0) {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      
      filteredPhrases = phrases.filter(phrase => {
        // This assumes phrases have a created_at field. If not, you'll need to adapt this.
        const createdAt = phrase.created_at ? new Date(phrase.created_at) : new Date();
        return createdAt >= cutoffDate;
      });
    }
    
    if (filteredPhrases.length === 0) {
      toast({
        title: "No phrases found",
        description: `No phrases found within the last ${days} days.`,
      });
      return null;
    }
    
    // Select a random phrase from the filtered list
    return filteredPhrases[Math.floor(Math.random() * filteredPhrases.length)];
  };

  const handleShowRandomPhrase = () => {
    const phrase = getRandomPhrase();
    if (phrase) {
      setRandomPhrase(phrase);
      setIsDialogOpen(true);
    }
  };

  const handlePhraseOpenChange = (isOpen: boolean, id: number) => {
    const phraseId = `phrase-${id}`;
    setOpenPhrases(prev => {
      if (isOpen) {
        return [...prev, phraseId];
      } else {
        return prev.filter(item => item !== phraseId);
      }
    });
  };

  return (
    <div className="space-y-6 max-h-[calc(100vh-200px)] overflow-auto">
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <Input
            type="number"
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            min={1}
            className="w-24"
          />
          <span className="text-sm text-gray-500">days</span>
          <Button 
            onClick={handleShowRandomPhrase}
            variant="outline"
          >
            <FileText className="w-4 h-4 mr-2" />
            Show Random Phrase
          </Button>
        </div>
      </Card>
      
      {/* Random Phrase Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Random Phrase</DialogTitle>
            <DialogDescription>
              A randomly selected phrase from your history within the last {days} days.
            </DialogDescription>
          </DialogHeader>
          
          {randomPhrase && (
            <div className="space-y-4 mt-2">
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="font-semibold text-french-blue">{randomPhrase.french}</div>
              </div>
              
              <Accordion type="single" collapsible className="w-full">
                {Object.entries(randomPhrase.translations)
                  .filter(([lang]) => selectedLanguages.includes(lang as Language))
                  .map(([lang, translation]) => (
                    <AccordionItem key={lang} value={lang}>
                      <AccordionTrigger className="hover:no-underline py-2">
                        <span className="font-medium text-gray-600">
                          {AVAILABLE_LANGUAGES.find(l => l.value === lang)?.label}
                        </span>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2 p-2">
                          <div>{translation.text}</div>
                          {translation.examples && translation.examples.length > 0 && (
                            <div className="ml-2">
                              <div className="text-sm text-gray-500">Examples:</div>
                              <ul className="list-disc list-inside">
                                {translation.examples.map((example, i) => (
                                  <li key={i} className="text-sm">{example}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {translation.idioms && translation.idioms.length > 0 && (
                            <div className="ml-2">
                              <div className="text-sm text-gray-500">Idioms:</div>
                              <ul className="list-disc list-inside">
                                {translation.idioms.map((idiom, i) => (
                                  <li key={i} className="text-sm">{idiom}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
              </Accordion>
              
              <div className="flex justify-end">
                <Button onClick={() => setIsDialogOpen(false)} className="mr-2">Close</Button>
                <Button onClick={handleShowRandomPhrase} variant="outline">
                  Show Another
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      <div className="space-y-4">
        {phrases.map((phrase) => (
          <Card key={phrase.id} className="p-4 relative group cursor-pointer" onClick={() => handlePhraseOpenChange(!openPhrases.includes(`phrase-${phrase.id}`), phrase.id)}>
            <Collapsible 
              open={openPhrases.includes(`phrase-${phrase.id}`)}
              onOpenChange={(isOpen) => handlePhraseOpenChange(isOpen, phrase.id)}
            >
              <div className="flex items-center justify-between">
                <div className="font-medium text-french-blue w-full">{phrase.french}</div>
                <div className="flex items-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity h-7 w-7 p-0 mr-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(phrase.id);
                    }}
                  >
                    <span className="sr-only">Delete</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-french-red"
                    >
                      <path d="M3 6h18" />
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                    </svg>
                  </Button>
                  <CollapsibleTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="sm" className="p-0 h-7 w-7">
                      <ChevronDown className={`h-4 w-4 transition-transform ${openPhrases.includes(`phrase-${phrase.id}`) ? 'transform rotate-180' : ''}`} />
                      <span className="sr-only">Toggle</span>
                    </Button>
                  </CollapsibleTrigger>
                </div>
              </div>
              <CollapsibleContent>
                <div className="mt-4">
                  <Accordion 
                    type="multiple" 
                    value={openLanguages}
                    onValueChange={setOpenLanguages}
                    className="w-full"
                  >
                    {Object.entries(phrase.translations)
                      .filter(([lang]) => selectedLanguages.includes(lang as Language))
                      .map(([lang, translation]) => (
                        <AccordionItem key={lang} value={lang}>
                          <AccordionTrigger className="hover:no-underline py-2">
                            <span className="font-semibold text-gray-600">
                              {AVAILABLE_LANGUAGES.find(l => l.value === lang)?.label}
                            </span>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-2 p-2">
                              <div>{translation.text}</div>
                              {translation.examples && (
                                <div className="ml-2">
                                  <div className="text-sm text-gray-500">Examples:</div>
                                  <ul className="list-disc list-inside">
                                    {translation.examples.map((example, i) => (
                                      <li key={i} className="text-sm">{example}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              {translation.idioms && (
                                <div className="ml-2">
                                  <div className="text-sm text-gray-500">Idioms:</div>
                                  <ul className="list-disc list-inside">
                                    {translation.idioms.map((idiom, i) => (
                                      <li key={i} className="text-sm">{idiom}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                  </Accordion>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default HistoryView;
