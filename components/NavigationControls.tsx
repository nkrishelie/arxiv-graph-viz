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

  // Определяем цвет для шарика в поиске
  const getNodeColor = (node: GraphNode) => {
    if (node.type === 'discipline' || node.type === 'adjacent_discipline') {
        const prefix = node.id.split('.')[0];
        if (prefix.includes('ph')) return CATEGORY_COLORS['physics'];
        return CATEGORY_COLORS[prefix] || CATEGORY_COLORS['other'];
    }
    return '#A0AEC0'; // Серый для статей
  };

  useEffect(() => {
    if (searchTerm.length < 2) { setSuggestions([]); return; }
    const lower = searchTerm.toLowerCase();
    
    // 1. Поиск: Ищем в Label, ID, Authors и DESCRIPTION
    const matches = nodes.filter(n => 
      n.label.toLowerCase().includes(lower) || 
      n.id.toLowerCase().includes(lower) ||
      (n.authors && n.authors.some(a => a.toLowerCase().includes(lower))) ||
      (n.description && n.description.toLowerCase().includes(lower))
    );

    // 2. Сортировка: Дисциплины всегда выше статей
    matches.sort((a, b) => {
        const aIsDisc = a.type !== 'article';
        const bIsDisc = b.type !== 'article';
        if (aIsDisc && !bIsDisc) return -1;
        if (!aIsDisc && bIsDisc) return 1;
        return 0;
    });

    setSuggestions(matches.slice(0, 10));
  }, [searchTerm, nodes]);

  return (
    <>
      {/* ЛЕВАЯ ПАНЕЛЬ: ПОИСК */}
      <div className="absolute top-4 left-4 z-50 w-80 font-sans">
        <div className="relative">
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search set theory, authors..."
                className="w-full bg-gray-900/90 border border-yellow-500/30 text-white px-4 py-3 rounded shadow-xl focus:outline-none focus:border-yellow-400 focus:bg-gray-900 transition-colors"
            />
            <span className="absolute right-3 top-3.5 text-gray-500">🔍</span>
        </div>

        {suggestions.length > 0 && (
          <ul className="mt-2 bg-gray-900 border border-gray-700 rounded shadow-2xl overflow-hidden max-h-[70vh] overflow-y-auto">
            {suggestions.map(node => (
              <li 
                key={node.id} 
                onClick={() => { onNodeSelect(node); setSearchTerm(''); setSuggestions([]); }}
                className="px-4 py-3 hover:bg-gray-800 cursor-pointer border-b border-gray-800 last:border-0 transition-colors flex items-center gap-3"
              >
                {/* Цветной индикатор */}
                <span 
                    className="w-3 h-3 rounded-full flex-shrink-0 shadow-[0_0_5px_currentColor]" 
                    style={{ backgroundColor: getNodeColor(node), color: getNodeColor(node) }}
                ></span>
                
                <div className="flex-1 overflow-hidden">
                    <div className="text-sm text-gray-200 font-medium truncate">{node.label}</div>
                    <div className="text-xs text-gray-500 flex justify-between mt-0.5">
                        <span className="truncate max-w-[70%]">
                            {node.authors ? node.authors[0] + (node.authors.length > 1 ? ' et al.' : '') : node.id}
                        </span>
                        <span className="uppercase tracking-wider text-[10px] opacity-70 border border-gray-700 px-1 rounded">
                            {node.type !== 'article' ? 'Category' : 'Paper'}
                        </span>
                    </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ПРАВАЯ ПАНЕЛЬ: ФИЛЬТРЫ */}
      <div className="absolute top-4 right-4 z-50 w-64 bg-gray-900/80 backdrop-blur p-4 rounded-lg border border-gray-700 shadow-2xl max-h-[80vh] overflow-y-auto select-none">
        <h4 className="text-yellow-500 text-xs font-bold uppercase mb-4 tracking-widest border-b border-gray-700 pb-2">
          Filters
        </h4>
        
        <label className="flex items-center gap-3 text-sm text-white mb-4 cursor-pointer hover:bg-white/5 p-1 rounded transition-colors">
          <input 
            type="checkbox" 
            checked={activeFilters.has('article')}
            onChange={() => toggleFilter('article')}
            className="w-4 h-4 accent-white cursor-pointer"
          />
          <span className="w-2 h-2 rounded-full bg-white"></span>
          Show Articles
        </label>

        {Object.entries(CATEGORY_COLORS).map(([key, color]) => (
          <label key={key} className="flex items-center gap-3 text-sm text-gray-300 mb-2 cursor-pointer hover:text-white hover:bg-white/5 p-1 rounded transition-colors">
            <input 
              type="checkbox" 
              checked={activeFilters.has(key)}
              onChange={() => toggleFilter(key)}
              className="w-4 h-4 rounded border-gray-500 cursor-pointer"
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
