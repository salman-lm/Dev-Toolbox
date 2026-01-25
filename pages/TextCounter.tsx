
import React, { useState, useMemo } from 'react';
import BackButton from '../components/BackButton';

interface TextCounterProps {
    onBack: () => void;
}

const TextCounter: React.FC<TextCounterProps> = ({ onBack }) => {
  const [text, setText] = useState<string>('');

  const stats = useMemo(() => {
    const trimmedText = text.trim();

    const characters = text.length;
    const words = trimmedText ? trimmedText.split(/\s+/).filter(Boolean).length : 0;
    const sentences = trimmedText ? (trimmedText.match(/[.!?]+(?=\s|$)/g) || []).length + (trimmedText.endsWith('.') || trimmedText.endsWith('!') || trimmedText.endsWith('?') ? 0 : (trimmedText ? 1 : 0)) - (trimmedText.match(/[.!?]+(?=\s|$)/g)?.length === 0 && !trimmedText ? 1 : 0) : 0;
    const paragraphs = trimmedText ? trimmedText.split(/\n+/).filter(p => p.trim().length > 0).length : 0;
    
    // Ensure sentences is not negative for single non-ending-punctuation word
    const finalSentences = (words > 0 && sentences === 0) ? 1 : sentences;


    return { characters, words, sentences: finalSentences, paragraphs };
  }, [text]);

  const StatBox: React.FC<{ title: string; value: number }> = ({ title, value }) => (
    <div className="bg-gray-900 p-4 rounded-lg text-center">
        <p className="text-sm text-gray-400">{title}</p>
        <p className="text-3xl font-bold text-primary">{value}</p>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-12">
      <BackButton onBack={onBack} />
      <h1 className="text-4xl font-bold mb-2 text-white">Word & Character Counter</h1>
      <p className="text-gray-400 mb-8">Get instant text analysis as you type.</p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatBox title="Words" value={stats.words} />
        <StatBox title="Characters" value={stats.characters} />
        <StatBox title="Sentences" value={stats.sentences} />
        <StatBox title="Paragraphs" value={stats.paragraphs} />
      </div>

      <div className="bg-gray-800 p-2 rounded-lg shadow-lg">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Start typing or paste your text here..."
          className="w-full h-96 bg-gray-800 text-gray-200 p-4 rounded-md border-none focus:ring-2 focus:ring-primary resize-none"
        />
      </div>
    </div>
  );
};

export default TextCounter;
