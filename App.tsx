
import React, { useState } from 'react';
import HomePage from './pages/HomePage';
import PasswordGenerator from './pages/PasswordGenerator';
import ImageEditor from './pages/ImageEditor';
import ResolutionChanger from './pages/ResolutionChanger';
import TextCounter from './pages/TextCounter';
import ImageCropper from './pages/ImageCropper';
import ImageToMotion from './pages/ImageToMotion';
import PassManager2 from './pages/PassManager2';

const App: React.FC = () => {
  const [activeTool, setActiveTool] = useState<string | null>(null);

  const handleGoHome = () => {
    setActiveTool(null);
  };

  const renderTool = () => {
    switch (activeTool) {
      case 'password-generator':
        return <PasswordGenerator onBack={handleGoHome} />;
      case 'pass-manager-2':
        return <PassManager2 onBack={handleGoHome} />;
      case 'image-editor':
        return <ImageEditor onBack={handleGoHome} />;
      case 'resolution-changer':
        return <ResolutionChanger onBack={handleGoHome} />;
      case 'text-counter':
        return <TextCounter onBack={handleGoHome} />;
      case 'image-cropper':
        return <ImageCropper onBack={handleGoHome} />;
      case 'image-to-motion':
        return <ImageToMotion onBack={handleGoHome} />;
      default:
        return <HomePage onSelectTool={setActiveTool} />;
    }
  };

  return (
    <div className="min-h-screen">
      {renderTool()}
    </div>
  );
};

export default App;