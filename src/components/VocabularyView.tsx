
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { VocabularyItem, Language } from '../types/language';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { ChevronDown, Edit } from "lucide-react";

interface VocabularyViewProps {
  vocabulary: VocabularyItem[];
  onDelete: (id: number) => void;
  onEdit: (item: VocabularyItem) => void;
}

const VocabularyView: React.FC<VocabularyViewProps> = ({ vocabulary, onDelete, onEdit }) => {
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
      <h2 className="text-xl font-semibold mb-4">Recent Vocabulary</h2>
      <Accordion type="multiple" className="space-y-4">
        {recentVocabulary.map((item) => (
          <AccordionItem 
            key={item.id} 
            value={`item-${item.id}`} 
            className="border rounded-lg overflow-hidden"
          >
            <div className="bg-card">
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex-1">
                  <AccordionTrigger className="hover:no-underline py-0">
                    <div className="flex flex-col items-start text-left">
                      <h3 className="text-lg font-medium">{item.word}</h3>
                      <p className="text-sm text-muted-foreground">
                        {item.sourceLanguage} → {item.targetLanguage}
                      </p>
                    </div>
                  </AccordionTrigger>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(item);
                    }}
                    className="text-primary hover:text-primary/90 hover:bg-primary/10"
                  >
                    <Edit size={16} className="mr-1" />
                    Edit
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={(e) => {
                      e.stopPropagation();
                      item.id && onDelete(item.id);
                    }}
                    className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
            <AccordionContent className="pt-0">
              <div className="px-4 py-3 space-y-4">
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
                
                <div className="text-xs text-muted-foreground">
                  Added on {new Date(item.created_at || Date.now()).toLocaleDateString()}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default VocabularyView;
