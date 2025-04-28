
import React, { useState, useEffect, useRef } from 'react';
import { Card } from "@/components/ui/card";
import PhraseCard from './PhraseCard';
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import type { PhraseRecord } from '../utils/supabase';
import type { Language } from '../types/language';

interface HistoryViewProps {
  phrases: PhraseRecord[];
  onDelete: (id: number) => void;
}

const HistoryView: React.FC<HistoryViewProps> = ({ phrases, onDelete }) => {
  const [interval, setInterval] = useState<number>(30);
  const [isNotifying, setIsNotifying] = useState(false);
  const { toast } = useToast();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    if (isNotifying && phrases.length > 0) {
      timerRef.current = global.setInterval(() => {
        const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
        toast({
          title: "Practice Time!",
          description: randomPhrase.french
        });
      }, interval * 60 * 1000);

      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };
    }
  }, [isNotifying, interval, phrases, toast]);

  return (
    <div className="space-y-6">
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
      <div className="grid gap-4">
        {phrases.map((phrase) => (
          <PhraseCard
            key={phrase.id}
            french={phrase.french}
            english={phrase.translations.english?.text || ""}
            vietnamese={phrase.translations.vietnamese?.text || ""}
            onDelete={() => onDelete(phrase.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default HistoryView;
