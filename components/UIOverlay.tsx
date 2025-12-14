import React, { useState, useRef, useEffect } from 'react';
import Latex from 'react-latex-next';
import { GraphNode } from '../types';

interface UIOverlayProps {
  selectedNode: GraphNode | null;
  neighbors: GraphNode[];
  onClose: () => void;
  onNodeClick: (node: GraphNode) => void; // Добавили обработчик клика
}

export const UIOverlay: React.FC<UIOverlayProps> = ({ 
  selectedNode, 
  neighbors, 
  onClose,
  onNodeClick
}) => {
  // --- ЛОГИКА ПЕРЕТАСКИВАНИЯ (DRAG) ---
  const [position, setPosition] = useState({ x: 0, y: 0 }); // Смещение от центра/угла
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const panelRef = useRef<HTMLDivElement>(null);

  // Сбрасываем позицию при открытии нового узла (опционально, можно и не сбрасывать)
  useEffect(() => {
    // Если нужно чтобы окно запоминало позицию - убери этот useEffect
    // setPosition({ x: 0, y: 0 }); 
  }, [selectedNode]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStart.current = { x: e.clientX - position.x, y: e.clientY - position.y };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      setPosition({
        x: e.clientX - dragStart.current.x,
        y: e.clientY - dragStart.current.y
      });
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

  // --- ФИЛЬТРАЦИЯ СОСЕДЕЙ (ТОЛЬКО ДИСЦИПЛИНЫ) ---
  const relatedDisciplines = neighbors.filter(
    n => n.type === 'discipline' || n.type === 'adjacent_discipline'
  );

  return (
    <div 
      ref={panelRef}
      className="absolute w-96 max-h-[85vh] flex flex-col bg-gray-900/95 text-white rounded-lg shadow-2xl border border-gray-700 backdrop-blur-md z-40"
      style={{ 
        // Начальная позиция справа, плюс смещение от Drag
        right: '320px', 
        top: '20px', 
        transform: `translate(${position.x}px, ${position.y}px)`,
        boxShadow: '0 0 40px rgba(0,0,0,0.5)'
      }}
    >
      {/* ЗАГОЛОВОК (ЗОНА ПЕРЕТАСКИВАНИЯ) */}
      <div 
        onMouseDown={handleMouseDown}
        className="p-4 border-b border-gray-700 cursor-move bg-gray-800/50 rounded-t-lg flex justify-between items-start"
      >
        <div>
            <h2 className="text-lg font-bold leading-tight text-yellow-400 select-none pointer-events-none">
                <Latex>{selectedNode.label}</Latex>
            </h2>
            <div className="text-xs text-gray-500 font-mono mt-1 select-none pointer-events-none">{selectedNode.id}</div>
        </div>
        <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-white transition-colors ml-4 p-1"
        >
            ✕
        </button>
      </div>

      {/* КОНТЕНТ (SCROLLABLE) */}
      <div className="p-6 overflow-y-auto custom-scrollbar">
        
        {/* Описание */}
        {selectedNode.description && (
            <div className="text-sm text-gray-300 mb-5 leading-relaxed p-3 bg-black/20 rounded border border-white/5">
            <Latex>{selectedNode.description}</Latex>
            </div>
        )}
        
        {/* Авторы */}
        {selectedNode.authors && (
            <div className="mb-5 text-sm">
            <span className="text-gray-500 font-bold block mb-1 uppercase text-xs">Authors</span>
            <span className="text-gray-200">{selectedNode.authors.join(', ')}</span>
            </div>
        )}

        {/* СМЕЖНЫЕ ДИСЦИПЛИНЫ (Кликабельные) */}
        {relatedDisciplines.length > 0 && (
            <div className="mt-4 border-t border-gray-800 pt-4">
            <h3 className="text-xs font-bold text-gray-500 uppercase mb-3">
                Related Topics ({relatedDisciplines.length})
            </h3>
            <ul className="space-y-2">
                {relatedDisciplines.map(n => (
                <li 
                    key={n.id} 
                    onClick={() => onNodeClick(n)} // Клик работает!
                    className="text-sm bg-gray-800/40 hover:bg-yellow-900/30 border border-transparent hover:border-yellow-500/30 p-2 rounded flex items-center gap-3 cursor-pointer transition-all"
                >
                    <span className="w-2 h-2 rounded-full bg-yellow-500 shadow-[0_0_5px_currentColor]"></span>
                    <span className="truncate font-medium text-yellow-100"><Latex>{n.label}</Latex></span>
                </li>
                ))}
            </ul>
            </div>
        )}

        {/* Ссылка */}
        {selectedNode.url && (
            <a href={selectedNode.url} target="_blank" rel="noopener noreferrer" className="block mt-6 text-center bg-blue-700 hover:bg-blue-600 text-white font-medium py-2 rounded transition-colors shadow-lg shadow-blue-900/20">
            Open on ArXiv
            </a>
        )}
      </div>
    </div>
  );
};
