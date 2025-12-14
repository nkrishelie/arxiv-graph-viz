import React, { useState, useEffect, useMemo } from 'react';
import { GraphViewer } from './components/GraphViewer';
import { UIOverlay } from './components/UIOverlay';
import { NavigationControls } from './components/NavigationControls';
import { WelcomeModal } from './components/WelcomeModal';
import { getGraphData } from './services/dataService';
import { GraphData, GraphNode } from './types';

// Вспомогательная функция: определяет категорию узла
const getDomain = (node: GraphNode): string => {
  // 1. Статьи фильтруем отдельно по типу
  if (node.type === 'article') return 'article';

  // 2. Дисциплины смотрим по префиксу
  let id = node.id;
  if (node.primary_category) id = node.primary_category;

  if (id.startsWith('math')) return 'math';
  if (id.startsWith('cs')) return 'cs';
  if (id.includes('ph') || id.startsWith('gr') || id.startsWith('astro') || id.startsWith('cond') || id.startsWith('quant')) return 'physics';
  
  return 'other'; // Все остальное (stat, eess...)
};

const App: React.FC = () => {
  const [rawData, setRawData] = useState<GraphData | null>(null);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [loading, setLoading] = useState(true);
  const [showTour, setShowTour] = useState(true);
  const [focusNode, setFocusNode] = useState<GraphNode | null>(null);

  // ПО УМОЛЧАНИЮ ВКЛЮЧАЕМ ТОЛЬКО МАТЕМАТИКУ (как ты хотел)
  const [activeFilters, setActiveFilters] = useState<Set<string>>(
    new Set(['math', 'article']) // Math categories + Articles
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

  // --- УМНАЯ ФИЛЬТРАЦИЯ ---
  const filteredData = useMemo(() => {
    if (!rawData) return { nodes: [], links: [] };

    // 1. Фильтруем узлы
    const activeNodes = rawData.nodes.filter(n => {
       const domain = getDomain(n);
       // Если это статья, мы проверяем, включен ли фильтр 'article'.
       // (Можно усложнить: показывать статью только если её родительская категория тоже включена, 
       // но пока сделаем просто вкл/выкл всех статей, чтобы не усложнять вычисления).
       if (domain === 'article') return activeFilters.has('article');
       
       // Если это категория (math, cs...)
       return activeFilters.has(domain);
    });

    const activeIds = new Set(activeNodes.map(n => n.id));

    // 2. Фильтруем связи
    const activeLinks = rawData.links.filter(link => {
       const sourceId = typeof link.source === 'object' ? (link.source as any).id : link.source;
       const targetId = typeof link.target === 'object' ? (link.target as any).id : link.target;
       return activeIds.has(sourceId) && activeIds.has(targetId);
    });

    return { nodes: activeNodes, links: activeLinks };
  }, [rawData, activeFilters]);

  const handleNodeSelect = (node: GraphNode) => {
    setSelectedNode(node);
    setFocusNode(node);
    
    // Если выбрали узел из скрытой категории - включаем её
    const domain = getDomain(node);
    if (!activeFilters.has(domain)) toggleFilter(domain);
  };

  if (loading) return <div className="flex justify-center items-center h-screen bg-[#000011] text-blue-500">Loading...</div>;

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
      
      <UIOverlay selectedNode={selectedNode} onClose={() => setSelectedNode(null)} />
      {showTour && <WelcomeModal onClose={() => setShowTour(false)} />}
    </div>
  );
};

export default App;
