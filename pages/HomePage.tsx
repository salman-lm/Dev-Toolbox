
import React from 'react';
import type { Tool } from '../types';
import ToolCard from '../components/ToolCard';
import { LockIcon, MagicWandIcon, AspectRatioIcon, TextIcon, CropIcon, FilmIcon } from '../components/icons';

const tools: Tool[] = [
  {
    id: 'password-generator',
    path: '/password-generator',
    title: 'Password Generator',
    description: 'Create strong, random passwords with customizable length and complexity. Generates 10 passwords at once.',
    icon: <LockIcon />,
  },
  {
    id: 'pass-manager-2',
    path: '/pass-manager-2',
    title: 'Pass Manager 2',
    description: 'A second password generator with a unique theme, customizable length, and complexity options.',
    icon: <LockIcon />,
  },
  {
    id: 'image-editor',
    path: '/image-editor',
    title: 'Instant Image Editor',
    description: 'Apply adjustments like brightness, contrast, and saturation to your images and download the result in high resolution.',
    icon: <MagicWandIcon />,
  },
  {
    id: 'resolution-changer',
    path: '/resolution-changer',
    title: 'Image Resolution Changer',
    description: 'Resize your images to popular resolutions without cropping. Perfect for social media and web assets.',
    icon: <AspectRatioIcon />,
  },
  {
    id: 'image-cropper',
    path: '/image-cropper',
    title: 'Image Cropper',
    description: 'Crop images to popular aspect ratios. Select a region and download the high-quality cropped output.',
    icon: <CropIcon />,
  },
    {
    id: 'image-to-motion',
    path: '/image-to-motion',
    title: 'Image to Motion',
    description: 'Apply simple motion effects like floating or pulsing to your static images and see them come to life.',
    icon: <FilmIcon />,
  },
  {
    id: 'text-counter',
    path: '/text-counter',
    title: 'Word & Character Counter',
    description: 'Analyze your text to get instant counts of words, characters, sentences, and paragraphs. Great for writers and editors.',
    icon: <TextIcon />,
  },
];

interface HomePageProps {
  onSelectTool: (toolId: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onSelectTool }) => {
  return (
    <div className="container mx-auto px-4 py-12">
      <header className="text-center mb-12">
        <h1 className="text-5xl font-extrabold text-white mb-2">Dev Toolbox</h1>
        <p className="text-lg text-gray-400">A collection of useful client-side utilities.</p>
      </header>
      <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {tools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} onSelectTool={onSelectTool} />
        ))}
      </main>
    </div>
  );
};

export default HomePage;