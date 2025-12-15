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
    <div className="fixed top-0 right-0 w-full md:w-[480px] h-full bg-gray-900/95 backdrop-blur-md border-l border-gray-700 shadow-2xl z-[100] transform transition-transform duration-300 overflow-y-auto custom-scrollbar">
      
      {/* 1. ХЕДЕР (Липкий, чтобы крестик всегда был под рукой) */}
      <div className="sticky top-0 bg-gray-900/95 backdrop-blur z-10 px-6 py-5 border-b border-gray-700/50 flex justify-between items-start gap-4">
        <div>
           <div className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">
             {selectedNode.type === 'article' ? 'Research Paper' : 'Scientific Discipline'}
           </div>
           <h2 className="text-xl md:text-2xl font-bold text-white leading-tight">
             {selectedNode.label}
           </h2>
        </div>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors text-2xl leading-none px-2 py-1 hover:bg-white/10 rounded"
        >
          &times;
        </button>
      </div>

      <div className="p-6 space-y-6">
        
        {/* МЕТАДАННЫЕ (Авторы, Категория, Ссылка) */}
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
                    className="bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 px-3 py-1 rounded border border-blue-500/30 text-xs transition-colors flex items-center gap-1"
                >
                    View on arXiv ↗
                </a>
            )}
        </div>

        {isArticle && selectedNode.authors && (
            <div className="text-sm text-gray-400">
                <strong className="text-gray-500 uppercase text-xs tracking-wide mr-2">Authors:</strong>
                {selectedNode.authors.join(', ')}
            </div>
        )}

        {/* 2. ОПИСАНИЕ (АБСТРАКТ) 
            Убрали max-h и overflow. Теперь текст течет свободно. 
            Скроллится только вся панель целиком.
        */}
        {selectedNode.description && (
          <div className="bg-black/20 p-4 rounded-lg border border-gray-800">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Abstract</h3>
            <p className="text-gray-300 text-sm leading-relaxed text-justify">
              {selectedNode.description}
            </p>
          </div>
        )}

        {/* СПИСОК СВЯЗЕЙ (Соседи) */}
        {neighbors.length > 0 && (
          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 sticky top-[85px] bg-gray-900/95 py-2 z-0">
                Related Connections ({neighbors.length})
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {neighbors.map(node => (
                <div 
                  key={node.id}
                  onClick={() => onNodeClick(node)}
                  className="group flex items-center gap-3 p-3 rounded-lg bg-gray-800/40 hover:bg-gray-700 cursor-pointer border border-transparent hover:border-gray-600 transition-all"
                >
                  <div 
                    className={`w-2 h-2 rounded-full shrink-0 ${node.type === 'article' ? 'bg-gray-400' : 'bg-yellow-500 shadow-[0_0_5px_orange]'}`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-200 group-hover:text-white truncate">
                        {node.label}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                        {node.type === 'article' ? node.authors?.slice(0, 2).join(', ') + '...' : 'Discipline'}
                    </div>
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
