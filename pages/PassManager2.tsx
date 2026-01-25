
import React, { useState, useEffect, useCallback } from 'react';
import BackButton from '../components/BackButton';

type Complexity = 'low' | 'medium' | 'high';

interface PassManager2Props {
    onBack: () => void;
}

const PassManager2: React.FC<PassManager2Props> = ({ onBack }) => {
    const [length, setLength] = useState<number>(12);
    const [complexity, setComplexity] = useState<Complexity>('low');
    const [passwords, setPasswords] = useState<string[]>([]);
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

    const generatePasswords = useCallback(() => {
        const charSets = {
            low: 'abcdefghijklmnopqrstuvwxyz',
            medium: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
            high: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+'
        };

        const chars = charSets[complexity];
        const newPasswords: string[] = [];
        for (let i = 0; i < 10; i++) {
            let password = '';
            for (let j = 0; j < length; j++) {
                password += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            newPasswords.push(password);
        }
        setPasswords(newPasswords);
        setCopiedIndex(null); // Reset copied state on new generation
    }, [length, complexity]);

    useEffect(() => {
        generatePasswords();
    }, []); // Generate passwords on initial load

    const handleCopy = (password: string, index: number) => {
        navigator.clipboard.writeText(password).then(() => {
            setCopiedIndex(index);
            setTimeout(() => {
                setCopiedIndex(null);
            }, 2000);
        });
    };
    
    const handleLengthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.valueAsNumber;
        if (isNaN(value)) {
            setLength(6);
            return;
        }
        setLength(Math.max(6, Math.min(30, value)));
    };

    return (
        <div className="container mx-auto px-4 py-12 flex flex-col items-center">
            <div className="w-full max-w-4xl">
                <BackButton onBack={onBack} />
            </div>
            <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-2xl">
                <h1 className="text-3xl font-bold text-center mb-6 text-yellow-400">Secure Password Generator</h1>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-8">
                    <div className="flex flex-col items-start w-full sm:w-1/2">
                        <label htmlFor="char-limit" className="text-lg font-medium mb-2 text-gray-400">Character Limit</label>
                        <input 
                            type="number" 
                            id="char-limit" 
                            value={length} 
                            min="6" 
                            max="30"
                            onChange={handleLengthChange}
                            className="w-full bg-gray-700 text-gray-100 px-4 py-2 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        />
                    </div>

                    <div className="flex flex-col items-start w-full sm:w-1/2">
                        <p className="text-lg font-medium mb-2 text-gray-400">Complexity</p>
                        <div className="flex gap-4">
                            {(['low', 'medium', 'high'] as Complexity[]).map(level => (
                                <label key={level} className="inline-flex items-center">
                                    <input 
                                        type="radio" 
                                        name="complexity" 
                                        value={level} 
                                        checked={complexity === level}
                                        onChange={() => setComplexity(level)}
                                        className="form-radio text-yellow-500 focus:ring-yellow-500 bg-gray-700 border-gray-600"
                                    />
                                    <span className="ml-2 text-gray-300 capitalize">{level}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                <button 
                    id="generate-btn"
                    onClick={generatePasswords}
                    className="w-full bg-yellow-500 text-gray-900 font-bold py-3 px-6 rounded-lg shadow-md hover:bg-yellow-600 transition-colors duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50">
                    Generate 10 Passwords
                </button>

                <div id="password-list" className="mt-8 space-y-4">
                    {passwords.map((password, index) => (
                        <div key={index} className="flex items-center bg-gray-700 rounded-lg p-3 shadow-md">
                            <span className="flex-grow text-yellow-300 font-mono break-all">{password}</span>
                            <button 
                                onClick={() => handleCopy(password, index)}
                                className="ml-4 bg-gray-500 text-gray-900 font-bold text-sm py-1 px-3 rounded-lg hover:bg-gray-400 transition-colors duration-300"
                                disabled={copiedIndex === index}
                            >
                                {copiedIndex === index ? 'Copied!' : 'Copy'}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PassManager2;
