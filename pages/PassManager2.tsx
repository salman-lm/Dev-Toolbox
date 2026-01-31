
import React, { useState, useCallback } from 'react';
import BackButton from '../components/BackButton';

type Strength = 'low' | 'medium' | 'high';
const lengths = [10, 15, 20, 30, 35];
const strengths: Strength[] = ['low', 'medium', 'high'];

const PassManager2: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [selectedLength, setSelectedLength] = useState<number>(10);
    const [selectedStrength, setSelectedStrength] = useState<Strength>('low');
    const [password, setPassword] = useState('');
    const [showResult, setShowResult] = useState(false);
    const [copied, setCopied] = useState(false);

    const generatePassword = useCallback((length: number, strength: Strength) => {
        const lowercase = 'abcdefghijklmnopqrstuvwxyz';
        const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const numbers = '0123456789';
        const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

        let chars = lowercase;
        if (strength === 'medium') {
            chars += uppercase + numbers;
        } else if (strength === 'high') {
            chars += uppercase + numbers + symbols;
        }

        let newPassword = '';
        for (let i = 0; i < length; i++) {
            newPassword += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return newPassword;
    }, []);

    const handleGenerate = () => {
        const newPassword = generatePassword(selectedLength, selectedStrength);
        setPassword(newPassword);
        setShowResult(true);
        setCopied(false);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(password).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };
    
    const getStrengthBarClasses = (barIndex: number): string => {
        let classes = 'strength-bar';
        if (!showResult) return classes;

        switch (selectedStrength) {
            case 'low':
                if (barIndex === 0) classes += ' active low';
                break;
            case 'medium':
                if (barIndex <= 2) classes += ' active medium';
                break;
            case 'high':
                classes += ' active high';
                break;
        }
        return classes;
    };


    const pageStyles = `
        .pm2-body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }
        .pm2-container {
            background: white;
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            max-width: 500px;
            width: 100%;
            color: #333;
        }
        .pm2-container h1 {
            text-align: center;
            color: #667eea;
            margin-bottom: 10px;
            font-size: 2rem;
        }
        .pm2-subtitle { text-align: center; color: #666; margin-bottom: 30px; font-size: 0.9rem; }
        .pm2-section { margin-bottom: 25px; }
        .pm2-section-title { color: #333; font-size: 0.9rem; font-weight: 600; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
        .pm2-button-group { display: flex; gap: 10px; flex-wrap: wrap; }
        .pm2-option-btn { flex: 1; min-width: 70px; padding: 12px 20px; border: 2px solid #e0e0e0; background: white; border-radius: 10px; cursor: pointer; transition: all 0.3s ease; font-size: 0.95rem; font-weight: 500; color: #666; }
        .pm2-option-btn:hover { border-color: #667eea; color: #667eea; transform: translateY(-2px); }
        .pm2-option-btn.active { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-color: #667eea; color: white; transform: translateY(-2px); box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4); }
        .pm2-generate-btn { width: 100%; padding: 16px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 12px; font-size: 1.1rem; font-weight: 600; cursor: pointer; transition: all 0.3s ease; margin-top: 10px; text-transform: uppercase; letter-spacing: 1px; }
        .pm2-generate-btn:hover { transform: translateY(-3px); box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4); }
        .pm2-generate-btn:active { transform: translateY(-1px); }
        .pm2-result-container { margin-top: 30px; display: none; }
        .pm2-result-container.show { display: block; animation: pm2-slideIn 0.4s ease; }
        @keyframes pm2-slideIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .pm2-password-display { background: #f8f9fa; border: 2px solid #e0e0e0; border-radius: 12px; padding: 20px; display: flex; align-items: center; gap: 15px; margin-bottom: 15px; }
        .pm2-password-text { flex: 1; font-family: 'Courier New', monospace; font-size: 1.1rem; color: #333; word-break: break-all; font-weight: 600; }
        .pm2-copy-btn { padding: 10px 20px; background: #667eea; color: white; border: none; border-radius: 8px; cursor: pointer; transition: all 0.3s ease; font-weight: 600; white-space: nowrap; }
        .pm2-copy-btn:hover { background: #5568d3; transform: scale(1.05); }
        .pm2-copy-btn.copied { background: #10b981; }
        .pm2-strength-indicator { display: flex; gap: 5px; margin-top: 10px; }
        .strength-bar { flex: 1; height: 6px; background: #e0e0e0; border-radius: 3px; transition: all 0.3s ease; }
        .strength-bar.active.low { background: #ef4444; }
        .strength-bar.active.medium { background: #f59e0b; }
        .strength-bar.active.high { background: #10b981; }
        @media (max-width: 480px) { .pm2-container { padding: 25px; } h1 { font-size: 1.5rem; } .pm2-option-btn { min-width: 60px; padding: 10px 15px; font-size: 0.85rem; } }
    `;

    return (
        <>
            <style>{pageStyles}</style>
            <div className="pm2-body">
                 <div className="absolute top-0 left-0 p-4">
                     <BackButton onBack={onBack} />
                 </div>
                <div className="pm2-container">
                    <h1>🔐 Password Generator</h1>
                    <p className="pm2-subtitle">Create strong, secure passwords instantly</p>

                    <div className="pm2-section">
                        <div className="pm2-section-title">Password Length</div>
                        <div className="pm2-button-group">
                            {lengths.map(len => (
                                <button key={len} onClick={() => setSelectedLength(len)} className={`pm2-option-btn ${selectedLength === len ? 'active' : ''}`}>
                                    {len}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="pm2-section">
                        <div className="pm2-section-title">Strength Level</div>
                        <div className="pm2-button-group">
                            {strengths.map(str => (
                               <button key={str} onClick={() => setSelectedStrength(str)} className={`pm2-option-btn capitalize ${selectedStrength === str ? 'active' : ''}`}>
                                    {str}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button className="pm2-generate-btn" onClick={handleGenerate}>Generate Password</button>

                    <div className={`pm2-result-container ${showResult ? 'show' : ''}`}>
                        <div className="pm2-password-display">
                            <div className="pm2-password-text">{password}</div>
                            <button onClick={handleCopy} className={`pm2-copy-btn ${copied ? 'copied' : ''}`}>
                                {copied ? 'Copied!' : 'Copy'}
                            </button>
                        </div>
                        <div className="pm2-strength-indicator">
                            {[0, 1, 2, 3].map(i => <div key={i} className={getStrengthBarClasses(i)}></div>)}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PassManager2;
