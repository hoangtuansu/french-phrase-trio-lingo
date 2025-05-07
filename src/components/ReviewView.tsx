
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VocabularyItem } from '../types/language';
import { ListCheck, Filter, Search, ChevronDown, ChevronRight } from "lucide-react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

interface ReviewViewProps {
  vocabulary: VocabularyItem[];
  onEdit: (item: VocabularyItem) => void;
}

const ReviewView: React.FC<ReviewViewProps> = ({ vocabulary, onEdit }) => {
  const [recentCount, setRecentCount] = useState(5);
  const [randomCount, setRandomCount] = useState(3);
  const [keyword, setKeyword] = useState('');
  const [reviewItems, setReviewItems] = useState<VocabularyItem[]>([]);
  const [reviewMode, setReviewMode] = useState<'recent' | 'random' | 'search'>('recent');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // Function to get recent vocabulary items
  const getRecentVocabulary = () => {
    return [...vocabulary]
      .sort((a, b) => {
        const dateA = new Date(a.created_at || Date.now());
        const dateB = new Date(b.created_at || Date.now());
        return dateB.getTime() - dateA.getTime();
      })
      .slice(0, recentCount);
  };

  // Function to get random vocabulary items
  const getRandomVocabulary = () => {
    if (vocabulary.length <= randomCount) {
      return [...vocabulary];
    }
    
    const shuffled = [...vocabulary].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, randomCount);
  };

  // Function to search vocabulary items by keyword
  const searchVocabulary = () => {
    if (!keyword.trim()) return [];
    
    return vocabulary.filter(item => 
      item.word.toLowerCase().includes(keyword.toLowerCase()) || 
      item.meaning.toLowerCase().includes(keyword.toLowerCase()) ||
      (item.context && item.context.toLowerCase().includes(keyword.toLowerCase()))
    );
  };

  // Update review items when parameters change
  useEffect(() => {
    let items: VocabularyItem[] = [];
    
    switch(reviewMode) {
      case 'recent':
        items = getRecentVocabulary();
        break;
      case 'random':
        items = getRandomVocabulary();
        break;
      case 'search':
        items = searchVocabulary();
        break;
    }
    
    setReviewItems(items);
  }, [vocabulary, recentCount, randomCount, keyword, reviewMode]);

  if (vocabulary.length === 0) {
    return (
      <div className="text-center p-8 bg-muted/20 rounded-lg">
        <h3 className="text-lg font-medium mb-2">No vocabulary items to review</h3>
        <p className="text-muted-foreground">
          Add words, phrases, or idioms to build your vocabulary list
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold flex items-center">
            <ListCheck className="mr-2" /> Vocabulary Review
          </h2>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters {isFiltersOpen ? <ChevronDown className="ml-1 h-4 w-4" /> : <ChevronRight className="ml-1 h-4 w-4" />}
          </Button>
        </div>

        {isFiltersOpen && (
          <Tabs defaultValue="recent" className="mb-6" onValueChange={(value) => setReviewMode(value as 'recent' | 'random' | 'search')}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="recent">Recent</TabsTrigger>
              <TabsTrigger value="random">Random</TabsTrigger>
              <TabsTrigger value="search">Search</TabsTrigger>
            </TabsList>
            <TabsContent value="recent" className="pt-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium">Number of items: {recentCount}</label>
                  </div>
                  <Slider 
                    value={[recentCount]} 
                    min={1} 
                    max={Math.max(20, vocabulary.length)} 
                    step={1} 
                    onValueChange={([value]) => setRecentCount(value)}
                    className="py-4"
                  />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="random" className="pt-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium">Number of items: {randomCount}</label>
                  </div>
                  <Slider 
                    value={[randomCount]} 
                    min={1} 
                    max={Math.max(10, vocabulary.length)} 
                    step={1} 
                    onValueChange={([value]) => setRandomCount(value)}
                    className="py-4"
                  />
                </div>
                <Button onClick={() => setReviewItems(getRandomVocabulary())}>Shuffle</Button>
              </div>
            </TabsContent>
            <TabsContent value="search" className="pt-4">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Input 
                    value={keyword} 
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="Search words, meanings, or context"
                    className="flex-1"
                  />
                  <Button onClick={() => setReviewItems(searchVocabulary())} size="icon">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </Card>

      {reviewItems.length > 0 ? (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">
            {reviewMode === 'recent' ? 'Recent' : reviewMode === 'random' ? 'Random' : 'Search Results'} 
            <span className="text-muted-foreground ml-2">({reviewItems.length} items)</span>
          </h3>
          <Accordion type="multiple" className="space-y-3">
            {reviewItems.map((item) => (
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
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(item);
                      }}
                      className="text-primary hover:text-primary/90 hover:bg-primary/10"
                    >
                      Review
                    </Button>
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
      ) : (
        <div className="text-center p-8 bg-muted/20 rounded-lg">
          <h3 className="text-lg font-medium mb-2">No items match your criteria</h3>
          <p className="text-muted-foreground">
            Try adjusting your filters or search terms
          </p>
        </div>
      )}
    </div>
  );
};

export default ReviewView;
