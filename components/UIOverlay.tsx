import React, { useState, useEffect, useRef } from 'react';
import { GraphNode } from '../types';

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
  // Координаты окна
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  // При открытии нового узла ставим окно справа, но не вплотную
  useEffect(() => {
    if (selectedNode) {
      // Вычисляем позицию: справа с отступом, чтобы не закрывать фильтры сразу
      const initialX = window.innerWidth > 768 ? window.innerWidth - 500 : 20;
      const initialY = 80; // Чуть ниже поиска
      setPosition({ x: initialX, y: initialY });
    }
  }, [selectedNode]);

  // Логика перетаскивания
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      
      const newX = e.clientX - dragStartPos.current.x;
      const newY = e.clientY - dragStartPos.current.y;

      setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const handleMouseDown = (e: React.MouseEvent) => {
    // Начинаем тащить только если кликнули по шапке
    setIsDragging(true);
    // Вычисляем смещение курсора относительно угла окна
    dragStartPos.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };
  };

  if (!selectedNode) return null;

  const isArticle = selectedNode.type === 'article';

  return (
    <div 
      ref={cardRef}
      style={{ 
        left: position.x, 
        top: position.y,
        // На мобилках фиксируем жестко, на десктопе - абсолютное позиционирование
        position: 'fixed' 
      }}
      className="z-[60] w-[90vw] md:w-[450px] flex flex-col max-h-[80vh] shadow-2xl rounded-xl overflow-hidden border border-gray-700 bg-gray-900/95 backdrop-blur-md transition-shadow duration-200"
    >
        
        {/* 1. ШАПКА (HANDLE) - За неё таскаем */}
        <div 
          onMouseDown={handleMouseDown}
          className="shrink-0 px-5 py-3 border-b border-gray-700 flex justify-between items-start bg-gray-800/50 cursor-move select-none"
        >
          <div className="pointer-events-none"> {/* Чтобы текст не выделялся при перетаскивании */}
             <div className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">
               {selectedNode.type === 'article' ? 'Research Paper' : 'Scientific Discipline'}
             </div>
             <h2 className="text-lg font-bold text-white leading-tight line-clamp-1 mr-4">
               {selectedNode.label}
             </h2>
          </div>
          <button 
            onClick={onClose}
            onMouseDown={(e) => e.stopPropagation()} // Чтобы клик по крестику не начинал драг
            className="text-gray-400 hover:text-white transition-colors text-2xl leading-none px-2 hover:bg-white/10 rounded cursor-pointer"
          >
            &times;
          </button>
        </div>

        {/* 2. ТЕЛО (СКРОЛЛИТСЯ) */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-5 cursor-default">
          
          {/* Метаданные */}
          <div className="flex flex-wrap gap-2 text-sm">
              <span className="bg-gray-800 text-yellow-500 px-2 py-0.5 rounded border border-gray-700 font-mono text-[10px]">
                  {selectedNode.id}
              </span>
              {selectedNode.primary_category && (
                  <span className="bg-gray-800 text-blue-400 px-2 py-0.5 rounded border border-gray-700 font-mono text-[10px]">
                      {selectedNode.primary_category}
                  </span>
              )}
              {isArticle && selectedNode.url && (
                  <a 
                      href={selectedNode.url} 
                      target="_blank" 
                      rel="noreferrer"
                      className="bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 px-2 py-0.5 rounded border border-blue-500/30 text-[10px] transition-colors flex items-center gap-1"
                  >
                      arXiv ↗
                  </a>
              )}
          </div>

          {isArticle && selectedNode.authors && (
              <div className="text-sm text-gray-400 border-b border-gray-800 pb-3">
                  <strong className="text-gray-500 uppercase text-[10px] tracking-wide mr-2 block mb-1">Authors</strong>
                  {selectedNode.authors.join(', ')}
              </div>
          )}

          {/* Абстракт */}
          {selectedNode.description && (
            <div className="bg-white/5 p-3 rounded border border-white/10">
              <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Abstract</h3>
              <p className="text-gray-300 text-sm leading-relaxed text-justify">
                {selectedNode.description}
              </p>
            </div>
          )}

          {/* Соседи */}
          {neighbors.length > 0 && (
            <div>
              <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">
                  Connections ({neighbors.length})
              </h3>
              <div className="grid grid-cols-1 gap-1.5">
                {neighbors.map(node => (
                  <div 
                    key={node.id}
                    onClick={() => onNodeClick(node)}
                    className="flex items-center gap-3 p-2 rounded hover:bg-white/10 cursor-pointer transition-colors border border-transparent hover:border-gray-600/50"
                  >
                    <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${node.type === 'article' ? 'bg-gray-500' : 'bg-yellow-500'}`} />
                    <div className="truncate text-xs text-gray-300 font-medium">
                        {node.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
    </div>
  );
};
