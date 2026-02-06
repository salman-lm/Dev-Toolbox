
import React, { useState, useCallback } from 'react';
import BackButton from '../components/BackButton';

type Strength = 'low' | 'medium' | 'high';

interface PasswordGeneratorProps {
    onBack: () => void;
}

const PasswordGenerator: React.FC<PasswordGeneratorProps> = ({ onBack }) => {
  const [length, setLength] = useState<number>(16);
  const [strength, setStrength] = useState<Strength>('medium');
  const [passwords, setPasswords] = useState<string[]>([]);

  const availableLengths = Array.from({ length: 40 - 15 + 1 }, (_, i) => 15 + i);

  const generatePasswords = useCallback(() => {
    const charSets = {
      lowercase: 'abcdefghijklmnopqrstuvwxyz',
      uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      numbers: '0123456789',
      symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
    };

    let chars = '';
    switch (strength) {
      case 'low':
        chars = charSets.lowercase + charSets.numbers;
        break;
      case 'medium':
        chars = charSets.lowercase + charSets.uppercase + charSets.numbers;
        break;
      case 'high':
        chars = charSets.lowercase + charSets.uppercase + charSets.numbers + charSets.symbols;
        break;
    }

    const newPasswords: string[] = [];
    for (let i = 0; i < 5; i++) {
      let password = '';
      for (let j = 0; j < length; j++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      newPasswords.push(password);
    }
    setPasswords(newPasswords);
  }, [length, strength]);

  const handleCopy = (password: string, index: number) => {
    navigator.clipboard.writeText(password);
    setPasswords(prevPasswords => prevPasswords.filter((_, i) => i !== index));
  };
  
  return (
    <div className="container mx-auto px-4 py-12">
      <BackButton onBack={onBack} />
      <h1 className="text-4xl font-bold mb-8 text-white">Random Password Generator</h1>
      
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Controls */}
        <div className="md:col-span-1 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">Password Length: <span className="font-bold text-primary">{length}</span></label>
            <div className="flex flex-wrap gap-2">
              {availableLengths.map(len => (
                <button
                  key={len}
                  onClick={() => setLength(len)}
                  className={`w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200 text-sm font-semibold ${
                    length === len
                      ? 'bg-primary text-white scale-110 shadow-lg'
                      : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                  aria-pressed={length === len}
                >
                  {len}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Strength</label>
            <div className="flex space-x-2">
              {(['low', 'medium', 'high'] as Strength[]).map(s => (
                <button
                  key={s}
                  onClick={() => setStrength(s)}
                  className={`capitalize w-full py-2 px-4 rounded-md transition-colors text-sm font-semibold ${strength === s ? 'bg-primary text-white' : 'bg-gray-700 hover:bg-gray-600'}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          
          <button
            onClick={generatePasswords}
            className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-hover transition-colors duration-300"
          >
            Generate
          </button>
        </div>

        {/* Results */}
        <div className="md:col-span-2 bg-gray-900 p-6 rounded-lg flex flex-col min-h-[420px]">
          <h2 className="text-xl font-semibold mb-4 text-gray-200">Generated Passwords</h2>
          {passwords.length > 0 ? (
            <div className="space-y-3">
              {passwords.map((p, i) => (
                <div key={i} className="flex items-center justify-between bg-gray-800 p-3 rounded-md">
                  <span className="font-mono text-gray-300 break-all">{p}</span>
                  <button onClick={() => handleCopy(p, i)} className="text-sm font-semibold text-primary hover:underline ml-4 whitespace-nowrap">
                    Copy
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex-grow flex items-center justify-center">
                <p className="text-gray-500">Click "Generate" to create new passwords.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PasswordGenerator;
