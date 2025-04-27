
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Languages } from "lucide-react";

interface PhraseInputProps {
  onAddPhrase: (phrase: string) => void;
}

const PhraseInput: React.FC<PhraseInputProps> = ({ onAddPhrase }) => {
  const [phrase, setPhrase] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phrase.trim()) {
      onAddPhrase(phrase.trim());
      setPhrase('');
    }
  };

  return (
    <Card className="p-6 bg-white shadow-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center space-x-2">
          <Languages className="w-5 h-5 text-french-blue" />
          <h2 className="text-xl font-semibold text-french-blue">Add New French Phrase</h2>
        </div>
        <div className="flex space-x-2">
          <Input
            value={phrase}
            onChange={(e) => setPhrase(e.target.value)}
            placeholder="Enter a French phrase..."
            className="flex-1"
          />
          <Button type="submit" className="bg-french-blue hover:bg-blue-800">
            Add
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default PhraseInput;
