
import React from 'react';
import { Globe } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Language } from '../types/language';

interface HeaderProps {
  isTitleCollapsed: boolean;
  setIsTitleCollapsed: (collapsed: boolean) => void;
  selectedLanguages: Language[];
}

const Header: React.FC<HeaderProps> = ({ 
  isTitleCollapsed, 
  setIsTitleCollapsed, 
  selectedLanguages 
}) => {
  return (
    <Collapsible
      open={!isTitleCollapsed}
      onOpenChange={(isOpen) => setIsTitleCollapsed(!isOpen)}
      className="mb-4"
    >
      <CollapsibleTrigger className="w-full flex items-center justify-center cursor-pointer">
        <div className="flex items-center">
          <Globe className="text-french-blue w-5 h-5 mr-2" />
          <h1 className="text-lg font-bold text-french-blue">
            Translator
          </h1>
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <p className="text-center text-sm text-gray-500 mt-1">
          {selectedLanguages.map(lang => 
            lang.charAt(0).toUpperCase() + lang.slice(1)
          ).join(' • ')}
        </p>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default Header;
