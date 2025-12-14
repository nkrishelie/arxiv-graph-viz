import React, { useState, useEffect, useRef } from 'react';
import { GraphNode } from '../types';

interface NavigationControlsProps {
  nodes: GraphNode[];
  onNodeSelect: (node: GraphNode) => void;
  // Фильтры
  visibleTypes: Set<string>;
  toggleType: (type: string) => void;
}

export const NavigationControls: React.FC<NavigationControlsProps> = ({ 
  nodes, 
  onNodeSelect,
  visibleTypes,
  toggleType
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<GraphNode[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // Ref для клика вне компонента
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Логика поиска (Dropdown)
  useEffect(() => {
    if (searchTerm.length < 2) {
      setSuggestions([]);
      return;
    }
    const lower = searchTerm.toLowerCase();
    
    // Ищем совпадения (максимум 10 штук для скорости)
    const matches = nodes
      .filter(n => 
        n.label.toLowerCase().includes(lower) || 
        (n.authors && n.authors.some(a => a.toLowerCase().includes(lower)))
      )
      .slice(0, 10);
      
    setSuggestions(matches);
    setShowSuggestions(true);
  }, [searchTerm, nodes]);

  // Выбор из списка
  const handleSelect = (node: GraphNode) => {
    onNodeSelect(node);
    setSearchTerm(''); // Очистить или оставить node.label - на выбор
    setShowSuggestions(false);
  };

  return (
    <div className="absolute top-4 left-4 z-50 w-80 flex flex-col gap-4" ref={wrapperRef}>
      
      {/* 1. ПОИСК */}
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search ArXiv (papers, categories)..."
          className="w-full bg-gray-900/90 border border-blue-500/50 text-white px-4 py-3 rounded shadow-xl focus:outline-none focus:border-blue-400"
          onFocus={() => searchTerm.length >= 2 && setShowSuggestions(true)}
        />
        
        {/* Выпадающий список */}
        {showSuggestions && suggestions.length > 0 && (
          <ul className="absolute top-full left-0 right-0 mt-2 bg-gray-900 border border-gray-700 rounded shadow-2xl max-h-80 overflow-y-auto">
            {suggestions.map(node => (
              <li 
                key={node.id}
                onClick={() => handleSelect(node)}
                className="px-4 py-3 hover:bg-blue-900/50 cursor-pointer border-b border-gray-800 last:border-0"
              >
                <div className="text-sm text-gray-200 font-medium">{node.label}</div>
                <div className="text-xs text-gray-500 mt-1 flex justify-between">
                  <span>[{node.type}]</span>
                  <span className="opacity-50">{node.id}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 2. ФИЛЬТРЫ (Чекбоксы) */}
      <div className="bg-gray-900/80 backdrop-blur p-4 rounded border border-gray-800">
        <h4 className="text-gray-400 text-xs font-bold uppercase mb-3">Visible Layers</h4>
        
        <label className="flex items-center gap-3 text-sm text-gray-300 mb-2 cursor-pointer hover:text-white">
          <input 
            type="checkbox" 
            checked={visibleTypes.has('discipline')}
            onChange={() => toggleType('discipline')}
            className="w-4 h-4 rounded bg-gray-700 border-gray-500 checked:bg-blue-500"
          />
          Categories (Math, CS...)
        </label>

        <label className="flex items-center gap-3 text-sm text-gray-300 cursor-pointer hover:text-white">
          <input 
            type="checkbox" 
            checked={visibleTypes.has('article')}
            onChange={() => toggleType('article')}
            className="w-4 h-4 rounded bg-gray-700 border-gray-500 checked:bg-blue-500"
          />
          Articles
        </label>
      </div>
    </div>
  );
};
