
import React, { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { History, Bell, BookOpen, ListCheck, List } from "lucide-react";

interface NavigationProps {
  activeView: 'add' | 'history' | 'vocabulary' | 'review';
  onViewChange: (view: 'add' | 'history' | 'vocabulary' | 'review') => void;
}

const Navigation: React.FC<NavigationProps> = ({
  activeView,
  onViewChange
}) => {
  // Save the active view to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('activeView', activeView);
  }, [activeView]);

  const handleViewChange = (view: 'add' | 'history' | 'vocabulary' | 'review') => {
    onViewChange(view);
  };

  return <div className="flex gap-2 mb-6 flex-wrap">
      <Button variant={activeView === 'add' ? "default" : "outline"} onClick={() => handleViewChange('add')}>Dictionary</Button>
      <Button variant={activeView === 'history' ? "default" : "outline"} onClick={() => handleViewChange('history')}>
        <History className="w-4 h-4 mr-2" />
        History
      </Button>
      <Button variant={activeView === 'vocabulary' ? "default" : "outline"} onClick={() => handleViewChange('vocabulary')}>
        <BookOpen className="w-4 h-4 mr-2" />
        Vocabulary
      </Button>
      <Button variant={activeView === 'review' ? "default" : "outline"} onClick={() => handleViewChange('review')}>
        <ListCheck className="w-4 h-4 mr-2" />
        Review
      </Button>
    </div>;
};

export default Navigation;
