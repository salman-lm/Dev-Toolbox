
import React, { useState, useRef } from 'react';
import BackButton from '../components/BackButton';

declare var GIF: any;

type MotionEffect = 'none' | 'float' | 'squeeze' | 'pulse' | 'spin';

const effects: { id: MotionEffect; name: string }[] = [
  { id: 'none', name: 'None' },
  { id: 'float', name: 'Float' },
  { id: 'squeeze', name: 'Squeeze' },
  { id: 'pulse', name: 'Pulse' },
  { id: 'spin', name: 'Spin' },
];

interface ImageToMotionProps {
    onBack: () => void;
}

const ImageToMotion: React.FC<ImageToMotionProps> = ({ onBack }) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [effect, setEffect] = useState<MotionEffect>('float');
  const [duration, setDuration] = useState<number>(5);
  const [isExporting, setIsExporting] = useState(false);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          imageRef.current = img;
          setImageSrc(event.target?.result as string);
        }
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleExport = () => {
    if (!imageRef.current || isExporting || effect === 'none') return;

    setIsExporting(true);
    const img = imageRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        setIsExporting(false);
        alert('Failed to create canvas context for exporting.');
        return;
    }

    const gif = new GIF({
        workers: 2,
        quality: 10,
        workerScript: 'https://cdnjs.cloudflare.com/ajax/libs/gif.js/0.2.0/gif.worker.js',
    });

    const frameRate = 30;
    const frameDelay = 1000 / frameRate;
    const totalFrames = Math.round(duration * frameRate);

    for (let i = 0; i < totalFrames; i++) {
        const progress = i / totalFrames;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);

        switch (effect) {
            case 'float': {
                const translationY = -20 * Math.sin(progress * Math.PI); // Simulates the up-and-down of the float effect
                ctx.translate(0, translationY);
                break;
            }
            case 'squeeze': {
                const progress_sin = Math.sin(progress * Math.PI);
                const scaleX = 1 + 0.1 * progress_sin;
                const scaleY = 1 - 0.1 * progress_sin;
                ctx.scale(scaleX, scaleY);
                break;
            }
            case 'pulse': {
                const progress_sin = Math.sin(progress * Math.PI);
                const scale = 1 + 0.05 * progress_sin;
                ctx.scale(scale, scale);
                break;
            }
            case 'spin': {
                const rotationRad = progress * 2 * Math.PI;
                ctx.rotate(rotationRad);
                break;
            }
        }
        
        ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);
        ctx.restore();
        gif.addFrame(ctx, { copy: true, delay: frameDelay });
    }

    gif.on('finished', (blob: Blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `motion-${effect}.gif`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        setIsExporting(false);
    });

    gif.render();
};

  const animationStyle: React.CSSProperties = effect !== 'none' ? {
    animationName: effect,
    animationDuration: `${duration}s`,
    animationIterationCount: 'infinite',
    animationTimingFunction: 'ease-in-out',
  } : {};

  return (
    <div className="container mx-auto px-4 py-12">
      <BackButton onBack={onBack} />
      <h1 className="text-4xl font-bold mb-8 text-white">Image to Motion</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-gray-900/50 backdrop-blur-sm p-4 rounded-lg flex items-center justify-center min-h-[60vh] overflow-hidden">
          {imageSrc ? (
            <img 
              src={imageSrc} 
              alt="Motion Preview" 
              className="max-w-full max-h-[70vh] object-contain rounded-md"
              style={animationStyle}
            />
          ) : (
            <div className="text-center text-gray-500">
              <label className="bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-primary-hover transition-colors duration-300 cursor-pointer">
                Choose Image
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>
          )}
        </div>

        <div className="lg:col-span-1 bg-gray-800 p-6 rounded-lg self-start">
          <h2 className="text-xl font-semibold mb-4">Controls</h2>
          <div className={`space-y-6 ${!imageSrc ? 'opacity-50 pointer-events-none' : ''}`}>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Motion Effect</label>
              <div className="grid grid-cols-2 gap-2">
                {effects.map(e => (
                  <button
                    key={e.id}
                    onClick={() => setEffect(e.id)}
                    className={`py-2 px-3 rounded-md text-sm font-semibold transition-colors ${effect === e.id ? 'bg-primary text-white' : 'bg-gray-700 hover:bg-gray-600'}`}
                  >
                    {e.name}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-300 mb-2">
                Animation Duration: <span className="font-bold text-primary">{duration}s</span>
              </label>
              <input
                id="duration"
                type="range"
                min="1"
                max="20"
                step="0.5"
                value={duration}
                onChange={(e) => setDuration(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>

            <div className="pt-6 border-t border-gray-700">
                <button 
                    onClick={handleExport}
                    disabled={isExporting || effect === 'none'}
                    className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-hover transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
                >
                    {isExporting ? 'Exporting...' : 'Export as GIF'}
                </button>
                 <p className="text-xs text-gray-500 mt-3 text-center">Exporting can take a few moments. Please be patient.</p>
            </div>

          </div>
          {!imageSrc && <p className="text-gray-500 text-sm mt-4">Upload an image to get started.</p>}
        </div>
      </div>
    </div>
  );
};

export default ImageToMotion;
