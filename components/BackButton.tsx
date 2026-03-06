
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from './icons';

const BackButton: React.FC = () => {
  return (
    <Link 
      to="/"
      className="inline-flex items-center space-x-2 text-primary hover:text-primary-hover transition-colors duration-200 mb-8"
    >
      <ArrowLeftIcon className="w-5 h-5" />
      <span>Back to All Tools</span>
    </Link>
  );
};

export default BackButton;
