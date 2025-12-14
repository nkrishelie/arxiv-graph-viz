import React, { useState, useEffect } from 'react';
import { GraphNode } from '../types';
import { CATEGORY_COLORS, CATEGORY_LABELS } from '../constants';

interface NavigationControlsProps {
  nodes: GraphNode[];
  onNodeSelect: (node: GraphNode) => void;
  activeFilters: Set<string>;
  toggleFilter: (filter: string) => void;
}

export const NavigationControls: React.FC<NavigationControlsProps> = ({ 
  nodes, 
  onNodeSelect,
  activeFilters,
  toggleFilter
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<GraphNode[]>([]);

  // Логика поиска
  useEffect(() => {
    if (searchTerm.length < 2) { setSuggestions([]); return; }
    const lower = searchTerm.toLowerCase();
    const matches = nodes
      .filter(n => n.label.toLowerCase().includes(lower))
      .slice(0, 8);
    setSuggestions(matches);
  }, [searchTerm, nodes]);

  return (
    <>
      {/* 1. ПОИСК (СЛЕВА) */}
      <div className="absolute top-4 left-4 z-50 w-80">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search discipline or article..."
          className="w-full bg-gray-900/90 border border-yellow-500/50 text-white px-4 py-3 rounded shadow-xl focus:outline-none focus:border-yellow-400"
        />
        {suggestions.length > 0 && (
          <ul className="mt-2 bg-gray-900 border border-gray-700 rounded shadow-2xl overflow-hidden">
            {suggestions.map(node => (
              <li 
                key={node.id} 
                onClick={() => { onNodeSelect(node); setSearchTerm(''); setSuggestions([]); }}
                className="px-4 py-2 hover:bg-gray-800 cursor-pointer text-sm text-gray-200 border-b border-gray-800 last:border-0"
              >
                {node.label}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 2. ФИЛЬТРЫ (СПРАВА) */}
      <div className="absolute top-4 right-4 z-50 w-64 bg-gray-900/80 backdrop-blur p-4 rounded-lg border border-gray-700 shadow-2xl max-h-[80vh] overflow-y-auto">
        <h4 className="text-yellow-500 text-xs font-bold uppercase mb-4 tracking-widest border-b border-gray-700 pb-2">
          Discipline Filters
        </h4>
        
        {/* Фильтр статей */}
        <label className="flex items-center gap-3 text-sm text-white mb-4 cursor-pointer hover:bg-white/5 p-1 rounded transition-colors">
          <input 
            type="checkbox" 
            checked={activeFilters.has('article')}
            onChange={() => toggleFilter('article')}
            className="w-4 h-4 accent-white"
          />
          <span className="w-2 h-2 rounded-full bg-white"></span>
          Show Articles
        </label>

        {/* Генерация категорий из constants.ts */}
        {Object.entries(CATEGORY_COLORS).map(([key, color]) => (
          <label key={key} className="flex items-center gap-3 text-sm text-gray-300 mb-2 cursor-pointer hover:text-white hover:bg-white/5 p-1 rounded transition-colors">
            <input 
              type="checkbox" 
              checked={activeFilters.has(key)}
              onChange={() => toggleFilter(key)}
              className="w-4 h-4 rounded border-gray-500"
              style={{ accentColor: color }}
            />
            <span className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: color }}></span>
            {CATEGORY_LABELS[key] || key.toUpperCase()}
          </label>
        ))}
      </div>
    </>
  );
};
