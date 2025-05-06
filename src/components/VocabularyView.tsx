
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { VocabularyItem, Language } from '../types/language';

interface VocabularyViewProps {
  vocabulary: VocabularyItem[];
  onDelete: (id: number) => void;
}

const VocabularyView: React.FC<VocabularyViewProps> = ({ vocabulary, onDelete }) => {
  // Sort vocabulary by creation date (newest first) and get only the 5 most recent items
  const recentVocabulary = [...vocabulary]
    .sort((a, b) => {
      const dateA = new Date(a.created_at || Date.now());
      const dateB = new Date(b.created_at || Date.now());
      return dateB.getTime() - dateA.getTime();
    })
    .slice(0, 5);

  if (recentVocabulary.length === 0) {
    return (
      <div className="text-center p-8 bg-muted/20 rounded-lg">
        <h3 className="text-lg font-medium mb-2">No vocabulary items yet</h3>
        <p className="text-muted-foreground">
          Add words, phrases, or idioms to build your vocabulary list
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {recentVocabulary.map((item) => (
        <Card key={item.id} className="overflow-hidden">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl">{item.word}</CardTitle>
                <CardDescription className="mt-1">
                  {item.sourceLanguage} → {item.targetLanguage}
                </CardDescription>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => item.id && onDelete(item.id)}
                className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
              >
                Delete
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold mb-1">Meaning:</h4>
              <p className="text-sm text-muted-foreground">{item.meaning}</p>
            </div>
            
            {item.context && (
              <div>
                <h4 className="text-sm font-semibold mb-1">Context:</h4>
                <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-md">{item.context}</p>
              </div>
            )}
          </CardContent>
          
          <CardFooter className="text-xs text-muted-foreground">
            Added on {new Date(item.created_at || Date.now()).toLocaleDateString()}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default VocabularyView;
