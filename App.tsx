import React, { useState, useEffect, useMemo } from 'react';
import { GraphViewer } from './components/GraphViewer';
import { UIOverlay } from './components/UIOverlay';
import { NavigationControls } from './components/NavigationControls';
import { getGraphData } from './services/dataService';
import { GraphData, GraphNode } from './types';
import { CATEGORY_COLORS } from './constants';

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

  // Проверка видимости только для КАТЕГОРИЙ (не статей)
  const isCategoryVisible = (node: GraphNode, filters: Set<string>) => {
     if (node.type === 'article') return false; 
     const domain = getDomain(node.id);
     return filters.has(domain);
  };

  // --- УМНАЯ ФИЛЬТРАЦИЯ ---
  const filteredData = useMemo(() => {
    if (!rawData) return { nodes: [], links: [] };

    // 1. Сначала определяем видимые КАТЕГОРИИ (Дисциплины)
    const visibleCategoryNodes = rawData.nodes.filter(n => isCategoryVisible(n, activeFilters));
    const visibleCategoryIds = new Set(visibleCategoryNodes.map(n => n.id));

    // 2. Теперь определяем видимые СТАТЬИ
    // Статья видима, если включен фильтр 'article' И она связана с ЛЮБОЙ видимой категорией
    const visibleArticleIds = new Set<string>();
    
    if (activeFilters.has('article')) {
        rawData.links.forEach(link => {
            // В библиотеке source/target могут стать объектами после рендера, поэтому проверяем id
            const sId = typeof link.source === 'object' ? (link.source as any).id : link.source;
            const tId = typeof link.target === 'object' ? (link.target as any).id : link.target;
            
            // Если связь типа CONTAINS (Категория -> Статья)
            // И Категория видима -> Статья становится видимой
            if (visibleCategoryIds.has(sId) && !visibleCategoryIds.has(tId)) {
                 // sId - категория, tId - статья (предположительно)
                 // Дополнительно проверим, что tId это не другая категория
                 // Но у нас связь CONTAINS идет от Категории к Статье
                 visibleArticleIds.add(tId);
            }
            // На случай обратной связи (редко, но бывает)
            if (visibleCategoryIds.has(tId) && !visibleCategoryIds.has(sId)) {
                visibleArticleIds.add(sId);
            }
        });
    }

    // 3. Собираем итоговый список узлов
    const activeNodes = rawData.nodes.filter(n => {
        if (n.type !== 'article') return visibleCategoryIds.has(n.id);
        return visibleArticleIds.has(n.id);
    });

    const activeIds = new Set(activeNodes.map(n => n.id));

    // 4. Фильтруем связи (оба конца должны быть активны)
    const activeLinks = rawData.links.filter(link => {
       const sId = typeof link.source === 'object' ? (link.source as any).id : link.source;
       const tId = typeof link.target === 'object' ? (link.target as any).id : link.target;
       return activeIds.has(sId) && activeIds.has(tId);
    });

    return { nodes: activeNodes, links: activeLinks };
  }, [rawData, activeFilters]);

  // Статистика
  const visibleCounts = useMemo(() => {
    let disciplines = 0;
    let articles = 0;
    filteredData.nodes.forEach(n => {
        if (n.type === 'article') articles++;
        else disciplines++;
    });
    return { disciplines, articles };
  }, [filteredData]);

  // Соседи
  const neighbors = useMemo(() => {
    if (!selectedNode || !rawData) return [];
    const relatedIds = new Set<string>();
    rawData.links.forEach(link => {
        const sId = typeof link.source === 'object' ? (link.source as any).id : link.source;
        const tId = typeof link.target === 'object' ? (link.target as any).id : link.target;
        if (sId === selectedNode.id) relatedIds.add(tId);
        if (tId === selectedNode.id) relatedIds.add(sId);
    });
    
    // Соседей тоже фильтруем по той же логике видимости!
    // Для этого используем activeIds из filteredData, чтобы не дублировать логику
    // (Но filteredData недоступна здесь напрямую оптимально, поэтому повторим простую проверку)
    // Или проще: просто вернем тех соседей, которые есть в filteredData.nodes
    
    const activeNodesSet = new Set(filteredData.nodes.map(n => n.id));
    return rawData.nodes.filter(n => relatedIds.has(n.id) && activeNodesSet.has(n.id));
    
  }, [selectedNode, rawData, filteredData]);

  const handleNodeSelect = (node: GraphNode) => {
    setSelectedNode(node);
    setFocusNode(node);
  };

  if (loading) return <div className="flex justify-center items-center h-screen bg-[#000011] text-white">Loading...</div>;

  return (
    <div className="relative w-full h-screen bg-[#000011] overflow-hidden">
      <NavigationControls 
        nodes={rawData ? rawData.nodes : []} 
        onNodeSelect={handleNodeSelect}
        activeFilters={activeFilters}
        toggleFilter={toggleFilter}
        counts={visibleCounts} 
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
    </div>
  );
};

export default App;
