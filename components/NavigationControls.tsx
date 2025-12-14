import React from 'react';

interface NavigationControlsProps {
  searchTerm: string;
  onSearchChange: (val: string) => void;
  nodeCount: number;
}

export const NavigationControls: React.FC<NavigationControlsProps> = ({ 
  searchTerm, 
  onSearchChange,
  nodeCount
}) => {
  return (
    <div className="absolute top-4 left-4 z-50 flex flex-col gap-4 w-80">
      {/* Панель поиска */}
      <div className="bg-gray-900/90 p-4 rounded-lg border border-blue-500/30 backdrop-blur shadow-xl">
        <h3 className="text-blue-400 text-sm font-bold uppercase mb-2 flex justify-between">
          <span>ArXiv Explorer</span>
          <span className="text-gray-500">{nodeCount} nodes</span>
        </h3>
        
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search articles, authors..."
          className="w-full bg-black/50 border border-gray-700 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
        />
        
        <div className="mt-2 text-xs text-gray-500">
          Try: "Neural Networks", "Topology", "Black Hole"
        </div>
      </div>

      {/* Легенда (Подсказка цветов) */}
      <div className="bg-gray-900/80 p-3 rounded-lg border border-gray-800 text-xs text-gray-300">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-3 h-3 rounded-full bg-purple-500"></span> Adjacent Fields
        </div>
        <div className="flex items-center gap-2 mb-1">
          <span className="w-3 h-3 rounded-full bg-blue-500"></span> Math Categories
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-gray-500"></span> Articles
        </div>
      </div>
    </div>
  );
};
