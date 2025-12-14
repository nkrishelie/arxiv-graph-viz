import React, { useState, useEffect, useMemo } from 'react';
import { GraphViewer } from './components/GraphViewer';
import { UIOverlay } from './components/UIOverlay';
import { NavigationControls } from './components/NavigationControls';
import { getGraphData } from './services/dataService';
import { GraphData, GraphNode } from './types';
import { CATEGORY_COLORS } from './constants'; // Импорт ключей для проверки

// Улучшенная функция определения домена
const getDomain = (nodeId: string): string => {
  const parts = nodeId.split('.');
  const prefix = isNaN(Number(parts[0])) ? parts[0] : 'other'; // Если '1805.123' -> other
  
  // Проверяем физику
  if (prefix.includes('ph') || prefix === 'gr' || prefix === 'astro' || prefix === 'cond' || prefix === 'quant') return 'physics';
  
  // Проверяем, есть ли такой ключ в наших цветах
  if (CATEGORY_COLORS[prefix]) return prefix;
  
  // Если ключа нет (например, q-bio, econ) -> отправляем в other
  return 'other';
};

const App: React.FC = () => {
  const [rawData, setRawData] = useState<GraphData | null>(null);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [neighbors, setNeighbors] = useState<GraphNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [focusNode, setFocusNode] = useState<GraphNode | null>(null);

  // ПО УМОЛЧАНИЮ: Только Математика и Статьи
  const [activeFilters, setActiveFilters] = useState<Set<string>>(
    new Set(['math', 'article']) 
  );

  useEffect(() => {
    getGraphData().then((data) => {
      setRawData(data);
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
       // Статьи: проверяем галочку 'article'
       if (n.type === 'article') {
         if (!activeFilters.has('article')) return false;
         // ОПЦИОНАЛЬНО: Показывать статьи, только если их категория включена?
         // Пока оставим просто вкл/выкл всех статей, как просил.
         return true; 
       }

       // Дисциплины: проверяем домен
       const domain = getDomain(n.id);
       
       // Спец-кейсы для физики (так как мы объединили их в physics в фильтре, но в данных они разные)
       if (activeFilters.has('physics')) {
          if (['astro', 'cond', 'gr', 'quant', 'physics'].includes(domain) || domain.includes('ph')) return true;
       }

       return activeFilters.has(domain);
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

  // --- ВЫБОР УЗЛА ---
  const handleNodeSelect = (node: GraphNode) => {
    setSelectedNode(node);
    setFocusNode(node);

    // Подсчет соседей
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

  if (loading) return <div className="text-white text-center mt-20">Loading Universe...</div>;

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
      
      <UIOverlay 
        selectedNode={selectedNode} 
        neighbors={neighbors}
        onClose={() => setSelectedNode(null)} 
        onNodeClick={handleNodeSelect} // Передаем обработчик для переходов
      />
    </div>
  );
};

export default App;
