
import React from 'react';
import { ArrowLeftIcon } from './icons';

interface BackButtonProps {
    onBack: () => void;
}

const BackButton: React.FC<BackButtonProps> = ({ onBack }) => {
  return (
    <button 
      onClick={onBack}
      className="inline-flex items-center space-x-2 text-primary hover:text-primary-hover transition-colors duration-200 mb-8"
    >
      <ArrowLeftIcon className="w-5 h-5" />
      <span>Back to All Tools</span>
    </button>
  );
};

export default BackButton;
