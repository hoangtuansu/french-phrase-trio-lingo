
import React, { useState, useEffect, useRef } from 'react';
import { Card } from "@/components/ui/card";
import { Bell } from "lucide-react";
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
  const [interval, setInterval] = useState<number>(30);
  const [isNotifying, setIsNotifying] = useState(false);
  const [openPhrases, setOpenPhrases] = useState<string[]>([]);
  const [openLanguages, setOpenLanguages] = useState<string[]>([]);
  const { toast } = useToast();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  useEffect(() => {
    // Set the first language as expanded by default
    if (selectedLanguages.length > 0) {
      setOpenLanguages([selectedLanguages[0]]);
    }
  }, [selectedLanguages]);
  
  useEffect(() => {
    if (isNotifying && phrases.length > 0) {
      timerRef.current = setTimeout(() => {
        const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
        toast({
          title: "Practice Time!",
          description: randomPhrase.french
        });
      }, interval * 60 * 1000);

      return () => {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
      };
    }
  }, [isNotifying, interval, phrases, toast]);

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
            value={interval}
            onChange={(e) => setInterval(Number(e.target.value))}
            min={1}
            className="w-24"
          />
          <span className="text-sm text-gray-500">minutes</span>
          <Button 
            onClick={() => setIsNotifying(!isNotifying)}
            variant={isNotifying ? "default" : "outline"}
          >
            <Bell className="w-4 h-4 mr-2" />
            {isNotifying ? "Stop Notifications" : "Start Notifications"}
          </Button>
        </div>
      </Card>
      <div className="space-y-4">
        {phrases.map((phrase) => (
          <Card key={phrase.id} className="p-4 relative group">
            <Collapsible 
              open={openPhrases.includes(`phrase-${phrase.id}`)}
              onOpenChange={(isOpen) => handlePhraseOpenChange(isOpen, phrase.id)}
            >
              <div className="flex items-center justify-between">
                <div className="font-medium text-french-blue">{phrase.french}</div>
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
                  <CollapsibleTrigger asChild>
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
