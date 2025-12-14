import React, { useState, useEffect, useCallback } from 'react';
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

const getNodeColor = useCallback((node: any) => {
    const rawId = node.primary_category || node.id;
    if (!rawId) return '#718096'; // fallback

    // 1. Статьи - серые (только для компонентов интерфейса, в графе свои правила прозрачности)
    if (node.type === 'article' && !node.primary_category) return '#A0AEC0';

    const lowerId = rawId.toLowerCase();

    // 2. Спец. категории (Приоритет!)
    if (lowerId.includes('quant-ph')) return CATEGORY_COLORS['quant-ph'];
    if (lowerId.includes('astro-ph')) return CATEGORY_COLORS['astro-ph'];
    if (lowerId.includes('gr-qc')) return CATEGORY_COLORS['gr-qc'];
    if (lowerId.includes('cond-mat')) return CATEGORY_COLORS['cond-mat'];
    if (lowerId.includes('hep')) return CATEGORY_COLORS['hep-th'];

    // 3. Префиксы
    const prefix = rawId.split('.')[0];
    if (CATEGORY_COLORS[prefix]) return CATEGORY_COLORS[prefix];

    // 4. Общая физика
    if (lowerId.includes('ph') || prefix === 'physics') return CATEGORY_COLORS['physics'];

    return CATEGORY_COLORS['other'];
  }, []);

  useEffect(() => {
    if (searchTerm.length < 2) { setSuggestions([]); return; }
    const lower = searchTerm.toLowerCase();
    
    // 1. Сначала находим ВСЕ совпадения
    const matches = nodes.filter(n => 
      n.label.toLowerCase().includes(lower) || 
      n.id.toLowerCase().includes(lower) ||
      (n.authors && n.authors.some(a => a.toLowerCase().includes(lower))) ||
      (n.description && n.description.toLowerCase().includes(lower))
    );

    // 2. УМНАЯ СОРТИРОВКА (RANKING)
    matches.sort((a, b) => {
        const aLabel = a.label.toLowerCase();
        const bLabel = b.label.toLowerCase();
        
        // Приоритет 1: Дисциплины всегда выше статей
        const aIsDisc = a.type !== 'article';
        const bIsDisc = b.type !== 'article';
        if (aIsDisc && !bIsDisc) return -1;
        if (!aIsDisc && bIsDisc) return 1;

        // Приоритет 2: ТОЧНОЕ совпадение названия
        if (aLabel === lower && bLabel !== lower) return -1;
        if (bLabel === lower && aLabel !== lower) return 1;

        // Приоритет 3: Название НАЧИНАЕТСЯ с запроса ("Logic" > "Biological")
        const aStarts = aLabel.startsWith(lower);
        const bStarts = bLabel.startsWith(lower);
        if (aStarts && !bStarts) return -1;
        if (!aStarts && bStarts) return 1;

        // Приоритет 4: Совпадение в названии важнее, чем в описании/авторах
        const aInLabel = aLabel.includes(lower);
        const bInLabel = bLabel.includes(lower);
        if (aInLabel && !bInLabel) return -1;
        if (!aInLabel && bInLabel) return 1;

        return 0; // Иначе оставляем как есть
    });

    // Отрезаем топ-10 уже ПОСЛЕ умной сортировки
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
                placeholder="Search Logic, set theory..."
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
                <span 
                    className="w-3 h-3 rounded-full flex-shrink-0 shadow-[0_0_5px_currentColor]" 
                    style={{ backgroundColor: getNodeColor(node), color: getNodeColor(node) }}
                ></span>
                
                <div className="flex-1 overflow-hidden">
                    <div className="text-sm text-gray-200 font-medium truncate">{node.label}</div>
                    <div className="text-xs text-gray-500 flex justify-between mt-0.5">
                        <span className="truncate max-w-[70%]">
                            {/* Если совпадение в авторах - показываем автора, иначе ID */}
                            {node.authors && node.authors.some(a => a.toLowerCase().includes(searchTerm.toLowerCase())) 
                                ? `Author: ${node.authors.find(a => a.toLowerCase().includes(searchTerm.toLowerCase()))}`
                                : (node.type === 'article' ? node.id : 'Discipline')}
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
