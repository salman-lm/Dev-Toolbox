
import React from 'react';

export const LockIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

export const MagicWandIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.25278C12 6.25278 12 2 15.5 2C19 2 19 6.25278 19 6.25278C19 6.25278 23 6.25278 23 9.75278C23 13.2528 19 13.2528 19 13.2528C19 13.2528 19 17.5056 15.5 17.5056C12 17.5056 12 13.2528 12 13.2528M12 6.25278C12 6.25278 12 10.5056 8.5 10.5056C5 10.5056 5 6.25278 5 6.25278C5 6.25278 1 6.25278 1 9.75278C1 13.2528 5 13.2528 5 13.2528C5 13.2528 5 17.5056 8.5 17.5056C12 17.5056 12 13.2528 12 13.2528M12 6.25278L12 13.2528" />
  </svg>
);

export const AspectRatioIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4h4m12 4V4h-4M4 16v4h4m12-4v4h-4" />
    <rect x="2" y="2" width="20" height="20" rx="2" strokeWidth="2" stroke="currentColor" fill="none" />
  </svg>
);

export const TextIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
  </svg>
);

export const ArrowLeftIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

export const CropIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5v10a1 1 0 001 1h10M5 8h10a1 1 0 011 1v10" />
    </svg>
);

export const FilmIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        <path d="M7 3v18M17 3v18M3 12h18M3 7h4M3 17h4M17 7h4M17 17h4" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);
