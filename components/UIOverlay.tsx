import React, { useState, useRef, useEffect, useCallback } from 'react';
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
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  const getNodeColor = useCallback((node: GraphNode) => {
    let prefix = 'other';
    const rawId = node.primary_category || node.id;
    if (rawId) {
       const parts = rawId.split('.');
       if (isNaN(Number(parts[0]))) prefix = parts[0];
    }

    const lowerId = rawId.toLowerCase();
    if (lowerId.includes('quant-ph')) return CATEGORY_COLORS['quant-ph'];
    if (lowerId.includes('astro-ph')) return CATEGORY_COLORS['astro-ph'];
    if (lowerId.includes('gr-qc')) return CATEGORY_COLORS['gr-qc'];
    if (lowerId.includes('cond-mat')) return CATEGORY_COLORS['cond-mat'];
    if (lowerId.includes('hep')) return CATEGORY_COLORS['hep-th'];

    if (prefix.includes('ph')) return CATEGORY_COLORS['physics'];
    return CATEGORY_COLORS[prefix] || CATEGORY_COLORS['other'];
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    // На мобильных отключаем перетаскивание, чтобы не мешать скроллу
    if (window.innerWidth < 768) return;
    
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

  // Сбрасываем позицию при закрытии/открытии
  useEffect(() => {
    setPosition({ x: 0, y: 0 });
  }, [selectedNode]);

  if (!selectedNode) return null;

  const headerColor = getNodeColor(selectedNode);
  
  const relatedDisciplines = neighbors.filter(
    n => n.type !== 'article'
  );
  const articlesFromCategory = neighbors.filter(
    n => n.type === 'article'
  );

  return (
    <div 
      className={`
        absolute z-40 flex flex-col bg-gray-900/95 text-white rounded-lg shadow-2xl border border-gray-700 backdrop-blur-md
        
        /* МОБИЛЬНАЯ ВЕРСИЯ: */
        top-24 left-4 right-4 w-auto max-h-[60vh]
        
        /* ДЕСКТОП ВЕРСИЯ (md:): */
        md:top-5 md:left-auto md:right-80 md:w-96 md:max-h-[85vh]
      `}
      style={{ 
        // Применяем transform только для перетаскивания (оно работает поверх CSS позиционирования)
        transform: `translate(${position.x}px, ${position.y}px)`,
        boxShadow: `0 0 20px ${headerColor}20`
      }}
    >
      {/* HEADER */}
      <div 
        onMouseDown={handleMouseDown}
        className="p-4 border-b border-gray-700 cursor-move bg-gray-800/50 rounded-t-lg flex justify-between items-start select-none touch-none"
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
        <button onClick={onClose} className="text-gray-500 hover:text-white ml-4 p-1 text-xl leading-none">✕</button>
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
                        <span 
                          className="w-2 h-2 rounded-full shadow-[0_0_5px_currentColor] flex-shrink-0"
                          style={{ backgroundColor: nodeColor, color: nodeColor }}
                        ></span>
                        <span className="truncate font-medium text-gray-300 group-hover:text-white transition-colors">
                          <Latex>{n.label}</Latex>
                        </span>
                    </li>
                  );
                })}
            </ul>
            </div>
        )}

        {articlesFromCategory.length > 0 && selectedNode.type !== 'article' && (
            <div className="mt-4 border-t border-gray-800 pt-4">
            <h3 className="text-xs font-bold text-gray-500 uppercase mb-3">
                Papers in {selectedNode.label} ({articlesFromCategory.length})
            </h3>
            <ul className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                {articlesFromCategory.map(n => (
                    <li
                        key={n.id}
                        onClick={() => onNodeClick(n)}
                        className="text-sm bg-gray-800/40 hover:bg-white/5 border border-transparent p-2 rounded cursor-pointer transition-all group"
                    >
                        <div className="truncate font-medium text-gray-300 group-hover:text-white transition-colors">
                            <Latex>{n.label}</Latex>
                        </div>
                        {n.url && (
                            <a
                                href={n.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={e => e.stopPropagation()}
                                className="text-xs text-blue-400 hover:text-blue-300 mt-1 block truncate"
                            >
                                Open on ArXiv →
                            </a>
                        )}
                    </li>
                ))}
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
