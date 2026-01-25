
import React from 'react';
import type { Tool } from '../types';

interface ToolCardProps {
  tool: Tool;
  onSelectTool: (toolId: string) => void;
}

const ToolCard: React.FC<ToolCardProps> = ({ tool, onSelectTool }) => {
  return (
    <div onClick={() => onSelectTool(tool.id)} className="block group cursor-pointer">
      <div className="h-full bg-gray-800 border border-gray-700 rounded-lg p-6 flex flex-col items-start space-y-4 transition-all duration-300 transform hover:scale-105 hover:bg-gray-700 hover:border-primary">
        <div className="bg-gray-900 p-3 rounded-lg border border-gray-700 group-hover:border-primary transition-colors duration-300">
          {React.cloneElement(tool.icon as React.ReactElement, { className: "h-8 w-8 text-primary" })}
        </div>
        <h3 className="text-xl font-bold text-gray-100">{tool.title}</h3>
        <p className="text-gray-400 text-sm flex-grow">{tool.description}</p>
        <div className="text-sm font-semibold text-primary group-hover:underline">
          Open Tool &rarr;
        </div>
      </div>
    </div>
  );
};

export default ToolCard;
