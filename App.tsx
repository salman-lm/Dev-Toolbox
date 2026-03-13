
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import PasswordGenerator from './pages/PasswordGenerator';
import ImageEditor from './pages/ImageEditor';
import ResolutionChanger from './pages/ResolutionChanger';
import TextCounter from './pages/TextCounter';
import ImageCropper from './pages/ImageCropper';
import ImageToMotion from './pages/ImageToMotion';
import PassManager2 from './pages/PassManager2';
import ImageSizeChanger from './pages/ImageSizeChanger';
import YoutubeSeoGenerator from './pages/YoutubeSeoGenerator';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/password-generator" element={<PasswordGenerator />} />
          <Route path="/pass-manager-2" element={<PassManager2 />} />
          <Route path="/image-editor" element={<ImageEditor />} />
          <Route path="/resolution-changer" element={<ResolutionChanger />} />
          <Route path="/text-counter" element={<TextCounter />} />
          <Route path="/image-cropper" element={<ImageCropper />} />
          <Route path="/image-to-motion" element={<ImageToMotion />} />
          <Route path="/image-size-changer" element={<ImageSizeChanger />} />
          <Route path="/youtube-seo" element={<YoutubeSeoGenerator />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;
