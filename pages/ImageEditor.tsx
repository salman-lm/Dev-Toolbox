
import React, { useState, useRef, useEffect } from 'react';
import BackButton from '../components/BackButton';

interface Filters {
  brightness: number;
  contrast: number;
  saturate: number;
  grayscale: number;
  sepia: number;
  hueRotate: number;
}

interface ImageEditorProps {
    onBack: () => void;
}

const ImageEditor: React.FC<ImageEditorProps> = ({ onBack }) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    brightness: 100,
    contrast: 100,
    saturate: 100,
    grayscale: 0,
    sepia: 0,
    hueRotate: 0,
  });
  const canvasRef = useRef<HTMLCanvasElement>(null);
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

  useEffect(() => {
    if (imageRef.current && canvasRef.current && imageSrc) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        canvas.width = imageRef.current.width;
        canvas.height = imageRef.current.height;

        ctx.filter = `
          brightness(${filters.brightness}%)
          contrast(${filters.contrast}%)
          saturate(${filters.saturate}%)
          grayscale(${filters.grayscale}%)
          sepia(${filters.sepia}%)
          hue-rotate(${filters.hueRotate}deg)
        `;
        ctx.drawImage(imageRef.current, 0, 0);
      }
    }
  }, [imageSrc, filters]);
  
  const handleFilterChange = (filterName: keyof Filters, value: number) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };

  const resetFilters = () => {
    setFilters({ brightness: 100, contrast: 100, saturate: 100, grayscale: 0, sepia: 0, hueRotate: 0 });
  };
  
  const downloadImage = () => {
    if (canvasRef.current) {
      const link = document.createElement('a');
      link.download = 'edited-image.png';
      link.href = canvasRef.current.toDataURL('image/png');
      link.click();
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <BackButton onBack={onBack} />
      <h1 className="text-4xl font-bold mb-8 text-white">Instant Image Editor</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div 
            className={`lg:col-span-2 bg-gray-800 p-4 rounded-lg flex items-center justify-center min-h-[60vh] transition-colors duration-300 ${isDraggingOver ? 'bg-gray-700 border-2 border-dashed border-primary' : 'border-2 border-transparent'}`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
          {imageSrc ? (
            <canvas ref={canvasRef} className="max-w-full max-h-[80vh] object-contain rounded-md" />
          ) : (
            <div className="text-center text-gray-500 pointer-events-none">
              <p className="mb-4">Drag & drop an image here, or</p>
              <label className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-hover transition-colors duration-300 cursor-pointer pointer-events-auto">
                Choose Image
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>
          )}
        </div>

        <div className="lg:col-span-1 bg-gray-800 p-6 rounded-lg self-start">
          <h2 className="text-xl font-semibold mb-4">Controls</h2>
          {!imageSrc && <p className="text-gray-500 text-sm">Upload an image to enable controls.</p>}
          <div className={`space-y-4 ${!imageSrc ? 'opacity-50 pointer-events-none' : ''}`}>
            {Object.keys(filters).map((key) => {
              const filterKey = key as keyof Filters;
              const max = filterKey === 'hueRotate' ? 360 : 200;
              const min = 0;
              const value = filters[filterKey];
              return (
                 <div key={filterKey}>
                    <label className="block text-sm font-medium capitalize text-gray-300 mb-1">{filterKey.replace('Rotate', ' Rotate')}: {value}</label>
                    <input type="range" min={min} max={max} value={value} onChange={(e) => handleFilterChange(filterKey, parseInt(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary" />
                 </div>
              )
            })}
             <div className="flex space-x-2 pt-4">
              <button onClick={resetFilters} className="w-full bg-gray-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-500 transition-colors">Reset</button>
              <button onClick={downloadImage} className="w-full bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-hover transition-colors">Download</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageEditor;
