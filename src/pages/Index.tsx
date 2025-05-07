
import React, { useState } from 'react';
import PhraseInput from '../components/PhraseInput';
import Navigation from '../components/Navigation';
import HistoryView from '../components/HistoryView';
import VocabularyInput from '../components/VocabularyInput';
import VocabularyView from '../components/VocabularyView';
import Header from '../components/Header';
import { useTranslator } from '../hooks/useTranslator';
import { VocabularyItem } from '../types/language';

const Index = () => {
  const {
    activeView,
    setActiveView,
    isTitleCollapsed,
    setIsTitleCollapsed,
    selectedLanguages,
    setSelectedLanguages,
    sourceLanguage,
    setSourceLanguage,
    targetLanguage,
    setTargetLanguage,
    translationMode,
    setTranslationMode,
    translationResults,
    phrases,
    vocabulary,
    inputText,
    setInputText,
    pastedImage,
    setPastedImage,
    extractedText,
    setExtractedText,
    handleAddPhrase,
    handleAddVocabulary,
    onDelete,
    onDeleteVocabulary
  } = useTranslator();
  
  const [editingItem, setEditingItem] = useState<VocabularyItem | null>(null);

  const handleEditVocabulary = (item: VocabularyItem) => {
    setEditingItem(item);
    // Switch to vocabulary view if not already there
    if (activeView !== 'vocabulary') {
      setActiveView('vocabulary');
    }
    // Scroll to the top of the page to show the edit form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-4 px-4">
        <Header 
          isTitleCollapsed={isTitleCollapsed} 
          setIsTitleCollapsed={setIsTitleCollapsed} 
          selectedLanguages={selectedLanguages} 
          sourceLanguage={sourceLanguage} 
          targetLanguage={targetLanguage} 
          onSourceLanguageChange={setSourceLanguage} 
          onTargetLanguageChange={setTargetLanguage} 
        />

        <div className="max-w-4xl mx-auto">
          <Navigation activeView={activeView} onViewChange={setActiveView} />
          
          {activeView === 'add' ? (
            <PhraseInput 
              onAddPhrase={handleAddPhrase} 
              selectedLanguages={selectedLanguages} 
              onLanguagesChange={setSelectedLanguages} 
              translationResults={translationResults} 
              inputText={inputText} 
              onInputTextChange={setInputText} 
              pastedImage={pastedImage} 
              setPastedImage={setPastedImage} 
              extractedText={extractedText} 
              setExtractedText={setExtractedText} 
              sourceLanguage={sourceLanguage} 
              onSourceLanguageChange={setSourceLanguage} 
              translationMode={translationMode} 
              onTranslationModeChange={setTranslationMode} 
            />
          ) : activeView === 'history' ? (
            <HistoryView 
              phrases={phrases} 
              onDelete={onDelete} 
              selectedLanguages={selectedLanguages} 
            />
          ) : (
            <div className="space-y-8">
              <VocabularyInput 
                onAddVocabulary={handleAddVocabulary} 
                sourceLanguage={sourceLanguage} 
                targetLanguage={targetLanguage} 
                extractedText={extractedText} 
                setExtractedText={setExtractedText}
                editingItem={editingItem}
                setEditingItem={setEditingItem}
              />
              <VocabularyView 
                vocabulary={vocabulary} 
                onDelete={onDeleteVocabulary}
                onEdit={handleEditVocabulary}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
