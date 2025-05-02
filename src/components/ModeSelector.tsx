
import React from 'react';
import { TranslationMode } from '../types/language';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

interface ModeSelectorProps {
  translationMode: TranslationMode;
  onModeChange: (mode: TranslationMode) => void;
}

const TRANSLATION_MODES = [
  { value: 'simple', label: 'Simple', description: 'Basic translation only' },
  { value: 'advanced', label: 'Advanced', description: 'Includes examples and idioms' },
  { value: 'learning', label: 'Learning', description: 'Adds grammar explanations' },
];

const ModeSelector: React.FC<ModeSelectorProps> = ({ translationMode, onModeChange }) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Translation Mode:</label>
      <Tabs 
        value={translationMode}
        onValueChange={(value) => onModeChange(value as TranslationMode)}
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
  );
};

export default ModeSelector;
