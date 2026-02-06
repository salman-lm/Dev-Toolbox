
import React, { useState, useRef } from 'react';
import BackButton from '../components/BackButton';

interface OriginalImageInfo {
  name: string;
  size: number;
  width: number;
  height: number;
}

const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

async function compressImage(
  image: HTMLImageElement,
  targetSizeKB: number,
): Promise<Blob> {
  const targetSizeBytes = targetSizeKB * 1024;
  const canvas = document.createElement('canvas');
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');
  ctx.drawImage(image, 0, 0);

  const getBlob = (quality: number): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Canvas toBlob returned null.'));
        },
        'image/jpeg',
        quality
      );
    });
  };

  const initialBlob = await getBlob(1.0);
  if (initialBlob.size <= targetSizeBytes) {
    return initialBlob;
  }

  let minQuality = 0;
  let maxQuality = 1;
  let bestBlob: Blob = initialBlob;

  for (let i = 0; i < 10; i++) {
    const quality = (minQuality + maxQuality) / 2;
    const blob = await getBlob(quality);
    if (blob.size > targetSizeBytes) {
      maxQuality = quality;
    } else {
      bestBlob = blob;
      minQuality = quality;
    }
  }

  return bestBlob;
}


const ImageSizeChanger: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [originalInfo, setOriginalInfo] = useState<OriginalImageInfo | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [targetSizeKB, setTargetSizeKB] = useState(100);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const processImageFile = (file: File) => {
    if (!file || !file.type.startsWith('image/')) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        imageRef.current = img;
        const info = {
          name: file.name,
          size: file.size,
          width: img.naturalWidth,
          height: img.naturalHeight,
        };
        setOriginalInfo(info);
        setTargetSizeKB(Math.min(100, Math.floor(file.size / 1024)));
        setImageSrc(event.target?.result as string);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
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
    if (e.dataTransfer.files?.[0]) {
      processImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleCompressAndDownload = async () => {
    if (!imageRef.current || !originalInfo) return;
    
    setIsProcessing(true);
    try {
      const compressedBlob = await compressImage(imageRef.current, targetSizeKB);
      const link = document.createElement('a');
      link.href = URL.createObjectURL(compressedBlob);
      const nameWithoutExt = originalInfo.name.split('.').slice(0, -1).join('.');
      link.download = `${nameWithoutExt}-${targetSizeKB}kb.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error("Compression failed:", error);
      alert("An error occurred during image compression.");
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-12">
      <BackButton onBack={onBack} />
      <h1 className="text-4xl font-bold mb-8 text-white">Image Size Changer (MB to KB)</h1>

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
          <h2 className="text-xl font-semibold mb-4">Compression Settings</h2>
          {!imageSrc && <p className="text-gray-500 text-sm">Upload an image to get started.</p>}
          <div className={`space-y-6 ${!imageSrc ? 'opacity-50 pointer-events-none' : ''}`}>
            {originalInfo && (
                <div className="bg-gray-900 p-4 rounded-lg space-y-2 text-sm">
                    <h3 className="font-bold text-base mb-2">Original Image</h3>
                    <p className="text-gray-400 break-all"><strong>Name:</strong> {originalInfo.name}</p>
                    <p className="text-gray-400"><strong>Dimensions:</strong> {originalInfo.width} x {originalInfo.height}</p>
                    <p className="text-gray-400"><strong>Size:</strong> {formatBytes(originalInfo.size)}</p>
                </div>
            )}
            <div>
              <label htmlFor="targetSize" className="block text-sm font-medium text-gray-300 mb-2">
                Target Size: <span className="font-bold text-primary">{targetSizeKB} KB</span>
              </label>
              <input
                id="targetSize"
                type="range"
                min="10"
                max={originalInfo ? Math.max(10, Math.floor(originalInfo.size / 1024)) : 2000}
                step="10"
                value={targetSizeKB}
                onChange={(e) => setTargetSizeKB(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>
            <button
              onClick={handleCompressAndDownload}
              disabled={isProcessing}
              className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-hover transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
            >
              {isProcessing ? 'Compressing...' : 'Compress & Download'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageSizeChanger;
