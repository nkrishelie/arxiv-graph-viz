import React from 'react';
import Latex from 'react-latex-next';
import { GraphNode } from '../types';

interface UIOverlayProps {
  selectedNode: GraphNode | null;
  onClose: () => void;
}

export const UIOverlay: React.FC<UIOverlayProps> = ({ selectedNode, onClose }) => {
  if (!selectedNode) return null;

  // Определяем, что это за узел
  const isArticle = selectedNode.type === 'article';
  const categoryLabel = selectedNode.primary_category || selectedNode.id;

  return (
    <div className="absolute top-4 right-4 w-96 max-h-[90vh] overflow-y-auto bg-gray-900/95 text-white p-6 rounded-lg shadow-2xl border border-blue-500/30 backdrop-blur-md transition-all z-50">
      
      {/* Кнопка закрытия */}
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
      >
        ✕
      </button>

      {/* Заголовок (Название статьи или Дисциплины) */}
      <h2 className="text-xl font-bold mb-2 leading-tight text-blue-100">
        <Latex>{selectedNode.label}</Latex>
      </h2>

      {/* Подзаголовок (Категория) */}
      <div className="flex items-center gap-2 mb-4">
        <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-blue-600/20 text-blue-300 border border-blue-500/30">
          {categoryLabel}
        </span>
        {selectedNode.group && (
          <span className="text-xs text-gray-400 uppercase tracking-wider">
            {selectedNode.group}
          </span>
        )}
      </div>

      {/* Авторы (только для статей) */}
      {isArticle && selectedNode.authors && (
        <div className="mb-4 text-sm text-gray-300">
          <span className="font-semibold text-gray-400 block mb-1">Authors:</span>
          {selectedNode.authors.join(', ')}
        </div>
      )}

      {/* Описание / Абстракт */}
      {selectedNode.description && (
        <div className="text-sm text-gray-300 leading-relaxed mb-4 p-3 bg-black/20 rounded border border-white/5">
           <Latex>{selectedNode.description}</Latex>
        </div>
      )}

      {/* Ссылка на ArXiv (только для статей) */}
      {selectedNode.url && (
        <a 
          href={selectedNode.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block w-full text-center bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 rounded transition-colors"
        >
          View on ArXiv
        </a>
      )}
      
      {/* Инфо для категорий */}
      {!isArticle && (
        <div className="text-xs text-gray-500 mt-4 italic">
          Click on surrounding nodes to explore articles in this category.
        </div>
      )}
    </div>
  );
};
