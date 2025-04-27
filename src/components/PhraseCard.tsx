
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface PhraseCardProps {
  french: string;
  english: string;
  vietnamese: string;
  onDelete: () => void;
}

const PhraseCard: React.FC<PhraseCardProps> = ({
  french,
  english,
  vietnamese,
  onDelete,
}) => {
  return (
    <Card className="p-4 relative group hover:shadow-md transition-shadow">
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={onDelete}
      >
        <X className="h-4 w-4 text-french-red" />
      </Button>
      <div className="space-y-2">
        <div className="text-lg font-semibold text-french-blue">{french}</div>
        <div className="text-sm text-gray-600">
          <div className="flex items-center">
            <span className="font-medium mr-2">EN:</span>
            {english}
          </div>
          <div className="flex items-center">
            <span className="font-medium mr-2">VI:</span>
            {vietnamese}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PhraseCard;
