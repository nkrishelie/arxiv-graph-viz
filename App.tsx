import React, { useState, useEffect, useMemo } from 'react';
import { GraphViewer } from './components/GraphViewer';
import { UIOverlay } from './components/UIOverlay';
import { NavigationControls } from './components/NavigationControls';
import { HelpModal } from './components/HelpModal'; // <-- 1. Импорт нового компонента
import { getGraphData } from './services/dataService';
import { GraphData, GraphNode } from './types';
import { CATEGORY_COLORS } from './constants';

// Функция для определения категории (чтобы работали цвета и фильтры)
const getDomain = (nodeId: string): string => {
  const lowerId = nodeId.toLowerCase();
  
  if (lowerId.includes('quant-ph')) return 'quant-ph';
  if (lowerId.includes('astro-ph')) return 'astro-ph';
  if (lowerId.includes('gr-qc')) return 'gr-qc';
  if (lowerId.includes('cond-mat')) return 'cond-mat';
  if (lowerId.includes('hep')) return 'hep-th';

  const parts = nodeId.split('.');
  const prefix = isNaN(Number(parts[0])) ? parts[0] : 'other';

  if (prefix === 'math') return 'math';
  if (prefix === 'cs') return 'cs';
  if (prefix === 'stat') return 'stat';
  if (prefix === 'eess') return 'eess';

  if (prefix === 'physics' || lowerId.includes('ph')) return 'physics';
  if (CATEGORY_COLORS[prefix]) return prefix;

  return 'other';
};

const App: React.FC = () => {
  const [rawData, setRawData] = useState<GraphData | null>(null);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [loading, setLoading] = useState(true);
  const [focusNode, setFocusNode] = useState<GraphNode | null>(null);
  const [maxLinkVal, setMaxLinkVal] = useState(1);
  
  // <-- 2. Стейт для открытия окна справки
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const [activeFilters, setActiveFilters] = useState<Set<string>>(
    new Set(['math', 'article']) 
  );

  useEffect(() => {
    getGraphData().then((data) => {
      setRawData(data);
      let max = 0;
      data.links.forEach(l => { if ((l.val || 0) > max) max = l.val || 0; });
      setMaxLinkVal(max || 1);
      setLoading(false);
    });
  }, []);

  const toggleFilter = (filter: string) => {
    const newSet = new Set(activeFilters);
    if (newSet.has(filter)) newSet.delete(filter);
    else newSet.add(filter);
    setActiveFilters(newSet);
  };

  const isCategoryVisible = (node: GraphNode, filters: Set<string>) => {
     if (node.type === 'article') return false; 
     const domain = getDomain(node.id);
     return filters.has(domain);
  };

  const filteredData = useMemo(() => {
    if (!rawData) return { nodes: [], links: [] };

    const visibleCategoryNodes = rawData.nodes.filter(n => isCategoryVisible(n, activeFilters));
    const visibleCategoryIds = new Set(visibleCategoryNodes.map(n => n.id));

    const visibleArticleIds = new Set<string>();
    
    if (activeFilters.has('article')) {
        rawData.links.forEach(link => {
            const sId = typeof link.source === 'object' ? (link.source as any).id : link.source;
            const tId = typeof link.target === 'object' ? (link.target as any).id : link.target;
            
            if (visibleCategoryIds.has(sId) && !visibleCategoryIds.has(tId)) {
                 visibleArticleIds.add(tId);
            }
            if (visibleCategoryIds.has(tId) && !visibleCategoryIds.has(sId)) {
                visibleArticleIds.add(sId);
            }
        });
    }

    const activeNodes = rawData.nodes.filter(n => {
        if (n.type !== 'article') return visibleCategoryIds.has(n.id);
        return visibleArticleIds.has(n.id);
    });

    const activeIds = new Set(activeNodes.map(n => n.id));

    const activeLinks = rawData.links.filter(link => {
       const sId = typeof link.source === 'object' ? (link.source as any).id : link.source;
       const tId = typeof link.target === 'object' ? (link.target as any).id : link.target;
       return activeIds.has(sId) && activeIds.has(tId);
    });

    return { nodes: activeNodes, links: activeLinks };
  }, [rawData, activeFilters]);

  // <-- 3. Правильный подсчет статистики
  const visibleCounts = useMemo(() => {
    let disciplines = 0;
    let visibleArticles = 0;
    
    // Считаем то, что на экране (зависит от фильтров)
    filteredData.nodes.forEach(n => {
        if (n.type === 'article') visibleArticles++;
        else disciplines++;
    });

    // Берем "Всего в базе" из файла JSON (посчитано питоном)
    const totalArticles = rawData?.meta?.total_papers || 0;

    return { 
        disciplines, 
        visibleArticles, 
        totalArticles 
    };
  }, [filteredData, rawData]);

  const neighbors = useMemo(() => {
    if (!selectedNode || !rawData) return [];
    const relatedIds = new Set<string>();
    rawData.links.forEach(link => {
        const sId = typeof link.source === 'object' ? (link.source as any).id : link.source;
        const tId = typeof link.target === 'object' ? (link.target as any).id : link.target;
        if (sId === selectedNode.id) relatedIds.add(tId);
        if (tId === selectedNode.id) relatedIds.add(sId);
    });
    
    const activeNodesSet = new Set(filteredData.nodes.map(n => n.id));
    return rawData.nodes.filter(n => relatedIds.has(n.id) && activeNodesSet.has(n.id));
  }, [selectedNode, rawData, filteredData]);

  const handleNodeSelect = (node: GraphNode) => {
    setSelectedNode(node);
    setFocusNode(node);
  };

  if (loading) return <div className="flex justify-center items-center h-screen bg-[#000011] text-white">Loading ArXiv Universe...</div>;

  return (
    <div className="relative w-full h-screen bg-[#000011] overflow-hidden">
      <NavigationControls 
        nodes={rawData ? rawData.nodes : []} 
        onNodeSelect={handleNodeSelect}
        activeFilters={activeFilters}
        toggleFilter={toggleFilter}
        counts={visibleCounts} 
        onOpenHelp={() => setIsHelpOpen(true)} // <-- Передаем команду "Открыть помощь"
      />

      <GraphViewer 
        data={filteredData}
        onNodeClick={handleNodeSelect}
        focusNode={focusNode}
        maxLinkVal={maxLinkVal}
      />
      
      <UIOverlay 
        selectedNode={selectedNode} 
        neighbors={neighbors}
        onClose={() => setSelectedNode(null)} 
        onNodeClick={handleNodeSelect} 
      />

      {/* <-- 4. Рендерим само модальное окно */}
      <HelpModal 
        isOpen={isHelpOpen} 
        onClose={() => setIsHelpOpen(false)} 
      />
    </div>
  );
};

export default App;
