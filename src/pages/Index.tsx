import React from 'react';
import PhraseInput from '../components/PhraseInput';
import Navigation from '../components/Navigation';
import HistoryView from '../components/HistoryView';
import VocabularyInput from '../components/VocabularyInput';
import VocabularyView from '../components/VocabularyView';
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
  return <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-4 px-4">
        <Header isTitleCollapsed={isTitleCollapsed} setIsTitleCollapsed={setIsTitleCollapsed} selectedLanguages={selectedLanguages} sourceLanguage={sourceLanguage} targetLanguage={targetLanguage} onSourceLanguageChange={setSourceLanguage} onTargetLanguageChange={setTargetLanguage} />

        <div className="max-w-4xl mx-auto">
          <Navigation activeView={activeView} onViewChange={setActiveView} />
          
          {activeView === 'add' ? <PhraseInput onAddPhrase={handleAddPhrase} selectedLanguages={selectedLanguages} onLanguagesChange={setSelectedLanguages} translationResults={translationResults} inputText={inputText} onInputTextChange={setInputText} pastedImage={pastedImage} setPastedImage={setPastedImage} extractedText={extractedText} setExtractedText={setExtractedText} sourceLanguage={sourceLanguage} onSourceLanguageChange={setSourceLanguage} translationMode={translationMode} onTranslationModeChange={setTranslationMode} /> : activeView === 'history' ? <HistoryView phrases={phrases} onDelete={onDelete} selectedLanguages={selectedLanguages} /> : <div className="space-y-8">
              
              <VocabularyInput onAddVocabulary={handleAddVocabulary} sourceLanguage={sourceLanguage} targetLanguage={targetLanguage} pastedImage={pastedImage} setPastedImage={setPastedImage} extractedText={extractedText} setExtractedText={setExtractedText} />
              <VocabularyView vocabulary={vocabulary} onDelete={onDeleteVocabulary} />
            </div>}
        </div>
      </div>
    </div>;
};
export default Index;