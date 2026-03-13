
import React from 'react';
import type { Tool } from './types';
import { LockIcon, MagicWandIcon, AspectRatioIcon, TextIcon, CropIcon, FilmIcon, CompressIcon, YoutubeIcon } from './components/icons';

export const TOOLS: Tool[] = [
  {
    id: 'password-generator',
    path: '/password-generator',
    title: 'Password Generator',
    description: 'Create strong, random passwords with customizable length and complexity.',
    icon: <LockIcon />,
  },
  {
    id: 'pass-manager-2',
    path: '/pass-manager-2',
    title: 'Pass Manager 2',
    description: 'A second password generator with a unique theme and complexity options.',
    icon: <LockIcon />,
  },
  {
    id: 'image-editor',
    path: '/image-editor',
    title: 'Instant Image Editor',
    description: 'Apply adjustments like brightness, contrast, and saturation to your images.',
    icon: <MagicWandIcon />,
  },
  {
    id: 'resolution-changer',
    path: '/resolution-changer',
    title: 'Resolution Changer',
    description: 'Resize your images to popular resolutions without cropping.',
    icon: <AspectRatioIcon />,
  },
  {
    id: 'image-cropper',
    path: '/image-cropper',
    title: 'Image Cropper',
    description: 'Crop images to popular aspect ratios with high-quality output.',
    icon: <CropIcon />,
  },
  {
    id: 'image-to-motion',
    path: '/image-to-motion',
    title: 'Image to Motion',
    description: 'Apply simple motion effects like floating or pulsing to static images.',
    icon: <FilmIcon />,
  },
  {
    id: 'image-size-changer',
    path: '/image-size-changer',
    title: 'Image Size Changer',
    description: 'Compress images to a specific file size (KB/MB) with best quality.',
    icon: <CompressIcon />,
  },
  {
    id: 'youtube-seo',
    path: '/youtube-seo',
    title: 'YouTube SEO',
    description: 'Generate optimized titles, descriptions, and tags using AI.',
    icon: <YoutubeIcon />,
  },
  {
    id: 'text-counter',
    path: '/text-counter',
    title: 'Text Counter',
    description: 'Analyze text to get instant counts of words, characters, and more.',
    icon: <TextIcon />,
  },
];
