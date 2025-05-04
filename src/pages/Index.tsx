
import React from 'react';
import PhraseInput from '../components/PhraseInput';
import Navigation from '../components/Navigation';
import HistoryView from '../components/HistoryView';
import Header from '../components/Header';
import { useTranslator } from '../hooks/useTranslator';

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
    translationMode,
    setTranslationMode,
    translationResults,
    phrases,
    inputText,
    setInputText,
    pastedImage,
    setPastedImage,
    extractedText,
    setExtractedText,
    handleAddPhrase,
    onDelete
  } = useTranslator();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-4 px-4">
        <Header 
          isTitleCollapsed={isTitleCollapsed} 
          setIsTitleCollapsed={setIsTitleCollapsed} 
          selectedLanguages={selectedLanguages} 
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
          ) : (
            <HistoryView 
              phrases={phrases} 
              onDelete={onDelete} 
              selectedLanguages={selectedLanguages}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
