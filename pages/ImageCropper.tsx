
import React, { useState, useRef, useEffect } from 'react';
import ReactCrop, { type Crop, type PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import BackButton from '../components/BackButton';

const aspectRatios = [
  { name: 'Freeform', value: undefined },
  { name: '1:1 (Square)', value: 1 / 1 },
  { name: '4:3 (Standard)', value: 4 / 3 },
  { name: '16:9 (Widescreen)', value: 16 / 9 },
  { name: '4:5 (Portrait)', value: 4 / 5 },
  { name: '3:4 (Portrait)', value: 3 / 4 },
  { name: '9:16 (Story)', value: 9 / 16 },
];

function useDebounceEffect(
  fn: () => void,
  waitTime: number,
  deps: React.DependencyList,
) {
  useEffect(() => {
    const t = setTimeout(() => {
      fn();
    }, waitTime);

    return () => {
      clearTimeout(t);
    };
  }, deps);
}

interface ImageCropperProps {
    onBack: () => void;
}

const ImageCropper: React.FC<ImageCropperProps> = ({ onBack }) => {
  const [imgSrc, setImgSrc] = useState('');
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [aspect, setAspect] = useState<number | undefined>(16 / 9);

  const imgRef = useRef<HTMLImageElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  function onSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      setCrop(undefined); // Makes crop preview update between images.
      const reader = new FileReader();
      reader.addEventListener('load', () =>
        setImgSrc(reader.result?.toString() || ''),
      );
      reader.readAsDataURL(e.target.files[0]);
    }
  }

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    if (aspect) {
      const { width, height } = e.currentTarget;
      setCrop(centerCrop(
        makeAspectCrop({ unit: '%', width: 90 }, aspect, width, height),
        width,
        height,
      ));
    }
  }
  
  function handleDownload() {
    if (!previewCanvasRef.current) {
        return;
    }
    const link = document.createElement('a');
    link.download = 'cropped-image.png';
    link.href = previewCanvasRef.current.toDataURL('image/png');
    link.click();
  }

  useDebounceEffect(
    () => {
      if (
        completedCrop?.width &&
        completedCrop?.height &&
        imgRef.current &&
        previewCanvasRef.current
      ) {
        const image = imgRef.current;
        const canvas = previewCanvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        const pixelRatio = window.devicePixelRatio;

        canvas.width = Math.floor(completedCrop.width * scaleX * pixelRatio);
        canvas.height = Math.floor(completedCrop.height * scaleY * pixelRatio);

        ctx.scale(pixelRatio, pixelRatio);
        ctx.imageSmoothingQuality = 'high';

        const cropX = completedCrop.x * scaleX;
        const cropY = completedCrop.y * scaleY;
        const cropWidth = completedCrop.width * scaleX;
        const cropHeight = completedCrop.height * scaleY;

        ctx.drawImage(
          image,
          cropX,
          cropY,
          cropWidth,
          cropHeight,
          0,
          0,
          completedCrop.width,
          completedCrop.height
        );
      }
    },
    100,
    [completedCrop],
  );

  return (
    <div className="container mx-auto px-4 py-12">
      <BackButton onBack={onBack} />
      <h1 className="text-4xl font-bold mb-8 text-white">Image Cropper</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-gray-800 p-4 rounded-lg flex items-center justify-center min-h-[60vh]">
          {imgSrc ? (
            <ReactCrop
              crop={crop}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={aspect}
            >
              <img
                ref={imgRef}
                alt="Crop me"
                src={imgSrc}
                onLoad={onImageLoad}
                className="max-w-full max-h-[70vh] object-contain"
              />
            </ReactCrop>
          ) : (
             <div className="text-center text-gray-500">
                <label className="bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-primary-hover transition-colors duration-300 cursor-pointer">
                    Choose Image
                    <input type="file" accept="image/*" onChange={onSelectFile} className="hidden" />
                </label>
             </div>
          )}
        </div>

        <div className="lg:col-span-1 bg-gray-800 p-6 rounded-lg self-start">
          <h2 className="text-xl font-semibold mb-4">Options</h2>
          <div className={`space-y-4 ${!imgSrc ? 'opacity-50 pointer-events-none' : ''}`}>
              <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Aspect Ratio</label>
                  <div className="grid grid-cols-2 gap-2">
                      {aspectRatios.map(ratio => (
                          <button
                              key={ratio.name}
                              onClick={() => setAspect(ratio.value)}
                              className={`py-2 px-3 rounded-md text-sm font-semibold transition-colors ${aspect === ratio.value ? 'bg-primary text-white' : 'bg-gray-700 hover:bg-gray-600'}`}
                          >
                              {ratio.name}
                          </button>
                      ))}
                  </div>
              </div>
              
              {!!completedCrop && (
                <div className="space-y-4 pt-4 border-t border-gray-700">
                    <h3 className="text-lg font-semibold">Preview</h3>
                    <div className="bg-gray-900 p-2 rounded-md">
                        <canvas
                            ref={previewCanvasRef}
                            style={{
                                objectFit: 'contain',
                                width: '100%',
                                height: 'auto',
                            }}
                        />
                    </div>
                    <button onClick={handleDownload} className="w-full bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-hover transition-colors">
                        Download Cropped Image
                    </button>
                </div>
              )}
          </div>
          {!imgSrc && <p className="text-gray-500 text-sm mt-4">Upload an image to start cropping.</p>}
        </div>
      </div>
    </div>
  );
};

export default ImageCropper;
