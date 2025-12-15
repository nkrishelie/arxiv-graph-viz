import React from 'react';
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
  if (!selectedNode) return null;

  const isArticle = selectedNode.type === 'article';

  return (
    // 1. КОНТЕЙНЕР:
    // fixed top-20 right-4: отступ сверху (чтобы не закрывать поиск/хедер если есть) и справа
    // w-full md:w-[450px]: фиксированная ширина
    // max-h-[calc(100vh-6rem)]: высота не больше экрана (минус отступы), чтобы не улетать вниз
    // flex flex-col: чтобы выстроить шапку и тело в колонку
    <div className="fixed top-4 right-4 bottom-4 w-full md:w-[480px] z-[60] flex flex-col pointer-events-none">
      
      {/* Сама карточка (с pointer-events-auto, чтобы кликать можно было) */}
      <div className="flex flex-col w-full h-full bg-gray-900/95 backdrop-blur-md border border-gray-700 shadow-2xl rounded-xl pointer-events-auto overflow-hidden">
        
        {/* 2. ШАПКА (shrink-0 -> не сжимается и не скроллится) */}
        <div className="shrink-0 px-6 py-4 border-b border-gray-700 flex justify-between items-start bg-gray-900/50">
          <div>
             <div className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">
               {selectedNode.type === 'article' ? 'Research Paper' : 'Scientific Discipline'}
             </div>
             <h2 className="text-xl font-bold text-white leading-tight line-clamp-2">
               {selectedNode.label}
             </h2>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors text-2xl leading-none px-2 rounded hover:bg-white/10"
          >
            &times;
          </button>
        </div>

        {/* 3. ТЕЛО (flex-1 overflow-y-auto -> занимает все место и скроллится ТОЛЬКО ОНО) */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
          
          {/* Метаданные */}
          <div className="flex flex-wrap gap-2 text-sm">
              <span className="bg-gray-800 text-yellow-500 px-2 py-1 rounded border border-gray-700 font-mono text-xs">
                  {selectedNode.id}
              </span>
              {selectedNode.primary_category && (
                  <span className="bg-gray-800 text-blue-400 px-2 py-1 rounded border border-gray-700 font-mono text-xs">
                      {selectedNode.primary_category}
                  </span>
              )}
              {isArticle && selectedNode.url && (
                  <a 
                      href={selectedNode.url} 
                      target="_blank" 
                      rel="noreferrer"
                      className="bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 px-3 py-1 rounded border border-blue-500/30 text-xs transition-colors"
                  >
                      arXiv ↗
                  </a>
              )}
          </div>

          {isArticle && selectedNode.authors && (
              <div className="text-sm text-gray-400 border-b border-gray-800 pb-4">
                  <strong className="text-gray-500 uppercase text-xs tracking-wide mr-2 block mb-1">Authors</strong>
                  {selectedNode.authors.join(', ')}
              </div>
          )}

          {/* 4. АБСТРАКТ (Просто текст, БЕЗ scrollbar и max-h) */}
          {selectedNode.description && (
            <div className="bg-white/5 p-4 rounded-lg border border-white/10">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Abstract</h3>
              <p className="text-gray-300 text-sm leading-relaxed text-justify">
                {selectedNode.description}
              </p>
            </div>
          )}

          {/* Соседи */}
          {neighbors.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
                  Connections ({neighbors.length})
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {neighbors.map(node => (
                  <div 
                    key={node.id}
                    onClick={() => onNodeClick(node)}
                    className="flex items-center gap-3 p-2 rounded hover:bg-white/10 cursor-pointer transition-colors border border-transparent hover:border-gray-600"
                  >
                    <div className={`w-2 h-2 rounded-full shrink-0 ${node.type === 'article' ? 'bg-gray-500' : 'bg-yellow-500'}`} />
                    <div className="truncate text-sm text-gray-300">
                        {node.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
};
