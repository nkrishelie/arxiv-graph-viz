import React, { useState, useEffect, useMemo } from 'react';
import { GraphViewer } from './components/GraphViewer';
import { UIOverlay } from './components/UIOverlay';
import { NavigationControls } from './components/NavigationControls';
import { getGraphData } from './services/dataService';
import { GraphData, GraphNode } from './types';

// Хелпер для определения домена (цвета)
const getDomain = (nodeId: string): string => {
  const parts = nodeId.split('.');
  const prefix = isNaN(Number(parts[0])) ? parts[0] : 'other';
  if (prefix.includes('ph')) return 'physics';
  return prefix;
};

const App: React.FC = () => {
  const [rawData, setRawData] = useState<GraphData | null>(null);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  
  // Новое состояние: список соседей для выбранного узла
  const [neighbors, setNeighbors] = useState<GraphNode[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [focusNode, setFocusNode] = useState<GraphNode | null>(null);

  // Включаем всё по умолчанию
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set(['article']));

  useEffect(() => {
    getGraphData().then((data) => {
      setRawData(data);
      // Инициализируем фильтры (все категории активны)
      const allCategories = new Set(['article']);
      data.nodes.forEach(n => {
        if (n.type !== 'article') allCategories.add(getDomain(n.id));
      });
      setActiveFilters(allCategories);
      setLoading(false);
    });
  }, []);

  const toggleFilter = (filter: string) => {
    const newSet = new Set(activeFilters);
    if (newSet.has(filter)) newSet.delete(filter);
    else newSet.add(filter);
    setActiveFilters(newSet);
  };

  // --- ФИЛЬТРАЦИЯ ---
  const filteredData = useMemo(() => {
    if (!rawData) return { nodes: [], links: [] };
    
    // 1. Узлы
    const activeNodes = rawData.nodes.filter(n => {
       if (n.type === 'article') return activeFilters.has('article');
       const domain = getDomain(n.id);
       // Упрощаем: если домен есть в списке фильтров (или это спец. категория physics)
       return activeFilters.has(domain) || (domain === 'physics' && activeFilters.has('physics'));
    });
    const activeIds = new Set(activeNodes.map(n => n.id));

    // 2. Связи
    const activeLinks = rawData.links.filter(link => {
       const sourceId = typeof link.source === 'object' ? (link.source as any).id : link.source;
       const targetId = typeof link.target === 'object' ? (link.target as any).id : link.target;
       return activeIds.has(sourceId) && activeIds.has(targetId);
    });

    return { nodes: activeNodes, links: activeLinks };
  }, [rawData, activeFilters]);

  // --- ВЫБОР УЗЛА И ПОИСК СОСЕДЕЙ ---
  const handleNodeSelect = (node: GraphNode) => {
    setSelectedNode(node);
    setFocusNode(node);

    // Ищем соседей (O(Links) - быстро для <100k связей)
    if (rawData) {
      const relatedIds = new Set<string>();
      rawData.links.forEach(link => {
        const sId = typeof link.source === 'object' ? (link.source as any).id : link.source;
        const tId = typeof link.target === 'object' ? (link.target as any).id : link.target;
        
        if (sId === node.id) relatedIds.add(tId);
        if (tId === node.id) relatedIds.add(sId);
      });

      const neighborNodes = rawData.nodes.filter(n => relatedIds.has(n.id));
      setNeighbors(neighborNodes);
    }
  };

  if (loading) return <div className="text-white text-center mt-20">Loading...</div>;

  return (
    <div className="relative w-full h-screen bg-[#000011] overflow-hidden">
      <NavigationControls 
        nodes={rawData ? rawData.nodes : []} 
        onNodeSelect={handleNodeSelect}
        activeFilters={activeFilters}
        toggleFilter={toggleFilter}
      />

      <GraphViewer 
        data={filteredData}
        onNodeClick={handleNodeSelect}
        focusNode={focusNode}
      />
      
      {/* Передаем соседей в оверлей */}
      <UIOverlay 
        selectedNode={selectedNode} 
        neighbors={neighbors}
        onClose={() => setSelectedNode(null)} 
      />
    </div>
  );
};

export default App;
