import React from 'react';
import Latex from 'react-latex-next';
import { GraphNode } from '../types';

interface UIOverlayProps {
  selectedNode: GraphNode | null;
  neighbors: GraphNode[]; // Новый проп
  onClose: () => void;
}

export const UIOverlay: React.FC<UIOverlayProps> = ({ selectedNode, neighbors, onClose }) => {
  if (!selectedNode) return null;

  return (
    // Окно смещено влево от правого края, чтобы не перекрывать фильтры
    <div className="absolute top-4 right-72 w-96 max-h-[90vh] overflow-y-auto bg-gray-900/95 text-white p-6 rounded-lg shadow-2xl border border-gray-700 backdrop-blur-md z-40">
      
      <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white">✕</button>

      {/* Заголовок */}
      <h2 className="text-xl font-bold mb-2 leading-tight text-yellow-400">
        <Latex>{selectedNode.label}</Latex>
      </h2>
      <div className="text-xs text-gray-400 mb-4 font-mono">{selectedNode.id}</div>

      {/* Инфо */}
      {selectedNode.description && (
        <div className="text-sm text-gray-300 mb-4 p-3 bg-black/30 rounded border border-white/5">
           <Latex>{selectedNode.description}</Latex>
        </div>
      )}
      
      {/* Авторы */}
      {selectedNode.authors && (
        <div className="mb-4 text-sm">
          <span className="text-gray-500 font-bold block">Authors:</span>
          <span className="text-gray-300">{selectedNode.authors.join(', ')}</span>
        </div>
      )}

      {/* СМЕЖНЫЕ УЗЛЫ (Connections) */}
      {neighbors.length > 0 && (
        <div className="mt-6 border-t border-gray-800 pt-4">
          <h3 className="text-sm font-bold text-gray-400 uppercase mb-3">
            Connected Nodes ({neighbors.length})
          </h3>
          <ul className="space-y-2">
            {neighbors.slice(0, 10).map(n => (
              <li key={n.id} className="text-sm bg-gray-800/50 p-2 rounded flex items-center gap-2">
                <span 
                  className={`w-2 h-2 rounded-full ${n.type === 'article' ? 'bg-gray-500' : 'bg-yellow-500'}`}
                ></span>
                <span className="truncate flex-1"><Latex>{n.label}</Latex></span>
              </li>
            ))}
            {neighbors.length > 10 && (
              <li className="text-xs text-gray-500 italic text-center pt-1">
                ...and {neighbors.length - 10} more
              </li>
            )}
          </ul>
        </div>
      )}
      
      {/* Кнопка ссылки */}
      {selectedNode.url && (
        <a href={selectedNode.url} target="_blank" rel="noopener noreferrer" className="block mt-6 text-center bg-blue-700 hover:bg-blue-600 text-white py-2 rounded">
          Open on ArXiv
        </a>
      )}
    </div>
  );
};
