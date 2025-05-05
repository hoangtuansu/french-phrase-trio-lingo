
import React from 'react';
import { Button } from "@/components/ui/button";
import { History, Bell, BookOpen } from "lucide-react";

interface NavigationProps {
  activeView: 'add' | 'history' | 'vocabulary';
  onViewChange: (view: 'add' | 'history' | 'vocabulary') => void;
}

const Navigation: React.FC<NavigationProps> = ({
  activeView,
  onViewChange
}) => {
  return <div className="flex gap-2 mb-6">
      <Button variant={activeView === 'add' ? "default" : "outline"} onClick={() => onViewChange('add')}>Dictionary</Button>
      <Button variant={activeView === 'history' ? "default" : "outline"} onClick={() => onViewChange('history')}>
        <History className="w-4 h-4 mr-2" />
        History
      </Button>
      <Button variant={activeView === 'vocabulary' ? "default" : "outline"} onClick={() => onViewChange('vocabulary')}>
        <BookOpen className="w-4 h-4 mr-2" />
        Vocabulary
      </Button>
    </div>;
};

export default Navigation;
