
import React, { useState, useRef } from 'react';
import BackButton from '../components/BackButton';

const resolutions = [
  { name: '1080p (Full HD)', w: 1920, h: 1080 },
  { name: '720p (HD)', w: 1280, h: 720 },
  { name: '4K (UHD)', w: 3840, h: 2160 },
  { name: 'Square (1:1)', w: 1080, h: 1080 },
  { name: 'Portrait (4:5)', w: 1080, h: 1350 },
];

interface ResolutionChangerProps {
    onBack: () => void;
}

const ResolutionChanger: React.FC<ResolutionChangerProps> = ({ onBack }) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [selectedRes, setSelectedRes] = useState<string>(resolutions[0].name);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const processImageFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                imageRef.current = img;
                setImageSrc(event.target?.result as string);
            };
            img.src = event.target?.result as string;
        };
        reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processImageFile(e.target.files[0]);
    }
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleDownload = () => {
    if (!imageRef.current) return;
    setIsProcessing(true);
    
    const targetRes = resolutions.find(r => r.name === selectedRes);
    if (!targetRes) {
        setIsProcessing(false);
        return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = targetRes.w;
    canvas.height = targetRes.h;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
        ctx.drawImage(imageRef.current, 0, 0, targetRes.w, targetRes.h);
        const link = document.createElement('a');
        link.download = `resized-${targetRes.w}x${targetRes.h}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    }
    
    setIsProcessing(false);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <BackButton onBack={onBack} />
      <h1 className="text-4xl font-bold mb-8 text-white">Image Resolution Changer</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div 
            className={`lg:col-span-2 bg-gray-800 p-4 rounded-lg flex items-center justify-center min-h-[50vh] transition-colors duration-300 ${isDraggingOver ? 'bg-gray-700 border-2 border-dashed border-primary' : 'border-2 border-transparent'}`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
          {imageSrc ? (
            <img src={imageSrc} alt="Preview" className="max-w-full max-h-[70vh] object-contain rounded-md pointer-events-none" />
          ) : (
            <div className="text-center text-gray-500 pointer-events-none">
              <p className="mb-4">Drag & drop an image here, or</p>
              <label className="bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-primary-hover transition-colors duration-300 cursor-pointer pointer-events-auto">
                Choose Image
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>
          )}
        </div>

        <div className="lg:col-span-1 bg-gray-800 p-6 rounded-lg self-start">
          <h2 className="text-xl font-semibold mb-4">Options</h2>
          <div className={`space-y-4 ${!imageSrc ? 'opacity-50 pointer-events-none' : ''}`}>
            <div>
              <label htmlFor="resolution" className="block text-sm font-medium text-gray-300 mb-2">Target Resolution</label>
              <select
                id="resolution"
                value={selectedRes}
                onChange={(e) => setSelectedRes(e.target.value)}
                className="w-full bg-gray-700 text-white p-3 rounded-md border border-gray-600 focus:ring-primary focus:border-primary"
              >
                {resolutions.map(r => (
                  <option key={r.name} value={r.name}>{r.name} - {r.w}x{r.h}</option>
                ))}
              </select>
            </div>
            <button
              onClick={handleDownload}
              disabled={isProcessing}
              className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-hover transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
            >
              {isProcessing ? 'Processing...' : 'Change & Download'}
            </button>
          </div>
          {!imageSrc && <p className="text-gray-500 text-sm mt-4">Upload an image to get started.</p>}
        </div>
      </div>
    </div>
  );
};

export default ResolutionChanger;
