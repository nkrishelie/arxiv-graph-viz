import React, { useState, useEffect, useRef } from 'react';
import { GraphNode } from '../types';

interface NavigationControlsProps {
  nodes: GraphNode[];
  onNodeSelect: (node: GraphNode) => void;
  // Теперь filters - это набор конкретных категорий
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
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Логика поиска (без изменений)
  useEffect(() => {
    if (searchTerm.length < 2) { setSuggestions([]); return; }
    const lower = searchTerm.toLowerCase();
    const matches = nodes
      .filter(n => n.label.toLowerCase().includes(lower))
      .slice(0, 10);
    setSuggestions(matches);
    setShowSuggestions(true);
  }, [searchTerm, nodes]);

  const handleSelect = (node: GraphNode) => {
    onNodeSelect(node);
    setSearchTerm('');
    setShowSuggestions(false);
  };

  // Компонент одной галочки
  const FilterCheckbox = ({ id, label, color }: { id: string, label: string, color: string }) => (
    <label className="flex items-center gap-3 text-sm text-gray-300 cursor-pointer hover:text-white mb-1.5">
      <input 
        type="checkbox" 
        checked={activeFilters.has(id)}
        onChange={() => toggleFilter(id)}
        className="w-4 h-4 rounded bg-gray-700 border-gray-500 checked:bg-blue-500 appearance-none border checked:border-transparent relative checked:after:content-['✓'] checked:after:absolute checked:after:text-white checked:after:text-xs checked:after:left-[2px] checked:after:top-[-1px]"
      />
      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }}></span>
      {label}
    </label>
  );

  return (
    <div className="absolute top-4 left-4 z-50 w-72 flex flex-col gap-3" ref={wrapperRef}>
      
      {/* ПОИСК */}
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search..."
          className="w-full bg-gray-900/90 border border-gray-600 text-white px-3 py-2 rounded text-sm focus:border-blue-500 outline-none"
          onFocus={() => searchTerm.length >= 2 && setShowSuggestions(true)}
        />
        {showSuggestions && suggestions.length > 0 && (
          <ul className="absolute top-full w-full mt-1 bg-gray-800 border border-gray-700 rounded shadow-lg max-h-60 overflow-y-auto">
            {suggestions.map(node => (
              <li key={node.id} onClick={() => handleSelect(node)} className="px-3 py-2 hover:bg-gray-700 cursor-pointer text-xs text-gray-200 border-b border-gray-700/50">
                {node.label}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ФИЛЬТРЫ ПО КАТЕГОРИЯМ */}
      <div className="bg-gray-900/80 backdrop-blur p-3 rounded border border-gray-800">
        <h4 className="text-gray-500 text-[10px] font-bold uppercase mb-2 tracking-wider">Categories</h4>
        
        <FilterCheckbox id="math" label="Mathematics" color="#3182CE" />
        <FilterCheckbox id="cs" label="Computer Science" color="#38A169" />
        <FilterCheckbox id="physics" label="Physics" color="#805AD5" />
        <FilterCheckbox id="other" label="Other Fields" color="#A0AEC0" />
        
        <div className="h-px bg-gray-700 my-2"></div>
        
        <h4 className="text-gray-500 text-[10px] font-bold uppercase mb-2 tracking-wider">Content</h4>
        <FilterCheckbox id="article" label="Articles" color="#FFFFFF" />
      </div>
    </div>
  );
};
