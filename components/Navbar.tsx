
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { TOOLS } from '../constants';
import { MenuIcon, XIcon, ChevronDownIcon } from './icons';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const location = useLocation();

  const closeMenu = () => {
    setIsOpen(false);
    setIsToolsOpen(false);
  };

  return (
    <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50 backdrop-blur-md bg-opacity-80">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2" onClick={closeMenu}>
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">D</span>
            </div>
            <span className="text-xl font-bold text-white tracking-tight">DevToolbox</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`text-sm font-medium transition-colors hover:text-primary ${location.pathname === '/' ? 'text-primary' : 'text-gray-300'}`}
            >
              Home
            </Link>
            
            <div className="relative group">
              <button 
                className={`flex items-center space-x-1 text-sm font-medium transition-colors hover:text-primary ${location.pathname !== '/' ? 'text-primary' : 'text-gray-300'}`}
                onMouseEnter={() => setIsToolsOpen(true)}
                onClick={() => setIsToolsOpen(!isToolsOpen)}
              >
                <span>Tools</span>
                <ChevronDownIcon className={`w-4 h-4 transition-transform ${isToolsOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {/* Dropdown */}
              <div 
                className={`absolute left-0 mt-2 w-64 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl py-2 transition-all duration-200 origin-top-left ${isToolsOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}`}
                onMouseLeave={() => setIsToolsOpen(false)}
              >
                <div className="grid grid-cols-1 gap-1 px-2">
                  {TOOLS.map((tool) => (
                    <Link
                      key={tool.id}
                      to={tool.path}
                      className={`flex items-center space-x-3 p-2 rounded-lg transition-colors hover:bg-gray-700 ${location.pathname === tool.path ? 'bg-gray-700 text-primary' : 'text-gray-300'}`}
                      onClick={closeMenu}
                    >
                      <div className="w-8 h-8 bg-gray-900 rounded flex items-center justify-center text-primary">
                        {React.cloneElement(tool.icon as React.ReactElement, { className: "w-4 h-4" })}
                      </div>
                      <span className="text-sm font-medium">{tool.title}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <Link to="/about" className="text-sm font-medium text-gray-300 transition-colors hover:text-primary">
              About
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-400 hover:text-white focus:outline-none"
            >
              {isOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden bg-gray-900 border-b border-gray-800 transition-all duration-300 overflow-hidden ${isOpen ? 'max-h-screen' : 'max-h-0'}`}>
        <div className="px-4 pt-2 pb-6 space-y-1">
          <Link 
            to="/" 
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800"
            onClick={closeMenu}
          >
            Home
          </Link>
          <div className="space-y-1">
            <p className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tools</p>
            <div className="grid grid-cols-1 gap-1">
              {TOOLS.map((tool) => (
                <Link
                  key={tool.id}
                  to={tool.path}
                  className="flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800"
                  onClick={closeMenu}
                >
                  <div className="w-6 h-6 text-primary">
                    {React.cloneElement(tool.icon as React.ReactElement, { className: "w-full h-full" })}
                  </div>
                  <span>{tool.title}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
