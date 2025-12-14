import React, { useState, useRef, useEffect } from 'react';
import Latex from 'react-latex-next';
import { GraphNode } from '../types';
import { CATEGORY_COLORS } from '../constants';

interface UIOverlayProps {
  selectedNode: GraphNode | null;
  neighbors: GraphNode[];
  onClose: () => void;
  onNodeClick: (node: GraphNode) => void;
}

export const UIOverlay: React.FC<UIOverlayProps> = ({ 
  selectedNode, 
  neighbors, 
  onClose,
  onNodeClick
}) => {
  // Логика перетаскивания
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

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

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStart.current = { x: e.clientX - position.x, y: e.clientY - position.y };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      setPosition({ x: e.clientX - dragStart.current.x, y: e.clientY - dragStart.current.y });
    };
    const handleMouseUp = () => setIsDragging(false);
    
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  if (!selectedNode) return null;

  const headerColor = getNodeColor(selectedNode);
  
  // Показываем в списке только дисциплины!
  const relatedDisciplines = neighbors.filter(
    n => n.type !== 'article'
  );

  return (
    <div 
      className="absolute w-96 max-h-[85vh] flex flex-col bg-gray-900/95 text-white rounded-lg shadow-2xl border border-gray-700 backdrop-blur-md z-40"
      style={{ 
        right: '320px', 
        top: '20px', 
        transform: `translate(${position.x}px, ${position.y}px)`,
        boxShadow: `0 0 20px ${headerColor}20`
      }}
    >
      {/* DRAG HEADER */}
      <div 
        onMouseDown={handleMouseDown}
        className="p-4 border-b border-gray-700 cursor-move bg-gray-800/50 rounded-t-lg flex justify-between items-start select-none"
      >
        <div>
            <h2 
              className="text-lg font-bold leading-tight pointer-events-none"
              style={{ color: headerColor }}
            >
                <Latex>{selectedNode.label}</Latex>
            </h2>
            <div className="text-xs text-gray-500 font-mono mt-1 pointer-events-none">{selectedNode.id}</div>
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-white ml-4 p-1">✕</button>
      </div>

      <div className="p-6 overflow-y-auto custom-scrollbar">
        {selectedNode.description && (
            <div className="text-sm text-gray-300 mb-5 leading-relaxed p-3 bg-black/20 rounded border border-white/5">
            <Latex>{selectedNode.description}</Latex>
            </div>
        )}
        
        {selectedNode.authors && (
            <div className="mb-5 text-sm">
            <span className="text-gray-500 font-bold block mb-1 uppercase text-xs">Authors</span>
            <span className="text-gray-200">{selectedNode.authors.join(', ')}</span>
            </div>
        )}

        {/* СПИСОК СОСЕДЕЙ */}
        {relatedDisciplines.length > 0 && (
            <div className="mt-4 border-t border-gray-800 pt-4">
            <h3 className="text-xs font-bold text-gray-500 uppercase mb-3">
                Related Topics ({relatedDisciplines.length})
            </h3>
            <ul className="space-y-2">
                {relatedDisciplines.map(n => {
                  const nodeColor = getNodeColor(n);
                  return (
                    <li 
                        key={n.id} 
                        onClick={() => onNodeClick(n)}
                        className="text-sm bg-gray-800/40 hover:bg-white/5 border border-transparent p-2 rounded flex items-center gap-3 cursor-pointer transition-all group"
                    >
                        {/* Цветной шарик */}
                        <span 
                          className="w-2 h-2 rounded-full shadow-[0_0_5px_currentColor] flex-shrink-0"
                          style={{ backgroundColor: nodeColor, color: nodeColor }}
                        ></span>
                        
                        {/* Обычный текст */}
                        <span className="truncate font-medium text-gray-300 group-hover:text-white transition-colors">
                          <Latex>{n.label}</Latex>
                        </span>
                    </li>
                  );
                })}
            </ul>
            </div>
        )}

        {selectedNode.url && (
            <a href={selectedNode.url} target="_blank" rel="noopener noreferrer" className="block mt-6 text-center bg-blue-700 hover:bg-blue-600 text-white font-medium py-2 rounded shadow-lg">
            Open on ArXiv
            </a>
        )}
      </div>
    </div>
  );
};
