
import React from 'react';
import { Link } from 'react-router-dom';
import { TOOLS } from '../constants';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">D</span>
              </div>
              <span className="text-xl font-bold text-white tracking-tight">DevToolbox</span>
            </Link>
            <p className="text-gray-400 text-sm max-w-xs leading-relaxed">
              A comprehensive collection of free, client-side tools for developers and creators. 
              No data ever leaves your browser.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4 uppercase text-xs tracking-widest">Tools</h4>
            <ul className="space-y-2">
              {TOOLS.slice(0, 5).map(tool => (
                <li key={tool.id}>
                  <Link to={tool.path} className="text-gray-400 hover:text-primary text-sm transition-colors">
                    {tool.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4 uppercase text-xs tracking-widest">More Tools</h4>
            <ul className="space-y-2">
              {TOOLS.slice(5).map(tool => (
                <li key={tool.id}>
                  <Link to={tool.path} className="text-gray-400 hover:text-primary text-sm transition-colors">
                    {tool.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-gray-500 text-xs">
            &copy; {new Date().getFullYear()} DevToolbox. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-500 hover:text-white text-xs transition-colors">Privacy Policy</a>
            <a href="#" className="text-gray-500 hover:text-white text-xs transition-colors">Terms of Service</a>
            <a href="#" className="text-gray-500 hover:text-white text-xs transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
