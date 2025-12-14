import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { GraphViewer } from './components/GraphViewer';
import { UIOverlay } from './components/UIOverlay';
import { WelcomeModal } from './components/WelcomeModal';
import { NavigationControls } from './components/NavigationControls'; // Добавили
import { getGraphData } from './services/dataService';
import { GraphData, GraphNode } from './types';

const App: React.FC = () => {
  const [rawData, setRawData] = useState<GraphData | null>(null); // Исходные полные данные
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [loading, setLoading] = useState(true);
  const [showTour, setShowTour] = useState(true);
  
  // Состояние поиска
  const [searchTerm, setSearchTerm] = useState('');

  // Загрузка данных
  useEffect(() => {
    getGraphData().then((data) => {
      setRawData(data);
      setLoading(false);
    });
  }, []);

  // --- ЛОГИКА ФИЛЬТРАЦИИ (Умный поиск) ---
  const visibleData = useMemo(() => {
    if (!rawData) return { nodes: [], links: [] };
    
    // Если поиска нет - показываем всё (но будь осторожен, если узлов > 2000)
    if (!searchTerm.trim()) return rawData;

    const lowerTerm = searchTerm.toLowerCase();

    // 1. Находим узлы, которые совпадают с поиском
    const matchedNodes = rawData.nodes.filter(node => 
      node.label.toLowerCase().includes(lowerTerm) || 
      (node.description && node.description.toLowerCase().includes(lowerTerm)) ||
      (node.authors && node.authors.some(a => a.toLowerCase().includes(lowerTerm)))
    );

    // 2. Создаем Set ID найденных узлов для быстрого поиска
    const activeIds = new Set(matchedNodes.map(n => n.id));

    // 3. (Опционально) Добавляем соседей, чтобы граф не распадался на точки
    // Если нужно строгое совпадение - закомментируй этот блок
    rawData.links.forEach(link => {
       // link.source и link.target могут быть объектами или строками, приводим к ID
       const sourceId = typeof link.source === 'object' ? (link.source as any).id : link.source;
       const targetId = typeof link.target === 'object' ? (link.target as any).id : link.target;

       if (activeIds.has(sourceId)) activeIds.add(targetId);
       if (activeIds.has(targetId)) activeIds.add(sourceId);
    });

    // 4. Фильтруем узлы
    const filteredNodes = rawData.nodes.filter(n => activeIds.has(n.id));

    // 5. Фильтруем связи (показываем только те, где оба конца активны)
    const filteredLinks = rawData.links.filter(link => {
       const sourceId = typeof link.source === 'object' ? (link.source as any).id : link.source;
       const targetId = typeof link.target === 'object' ? (link.target as any).id : link.target;
       return activeIds.has(sourceId) && activeIds.has(targetId);
    });

    return { nodes: filteredNodes, links: filteredLinks };
  }, [rawData, searchTerm]);

  // Обработчики
  const handleNodeClick = useCallback((node: GraphNode) => setSelectedNode(node), []);
  const handleCloseOverlay = useCallback(() => setSelectedNode(null), []);

  if (loading) return <div className="text-white text-center mt-20">Loading Universe...</div>;

  return (
    <div className="relative w-full h-screen bg-[#000011] overflow-hidden">
      
      {/* 1. Навигация и Поиск */}
      <NavigationControls 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        nodeCount={visibleData.nodes.length}
      />

      {/* 2. Граф */}
      <GraphViewer 
        data={visibleData} // Передаем отфильтрованные данные
        onNodeClick={handleNodeClick} 
      />
      
      {/* 3. Инфо-панель */}
      <UIOverlay selectedNode={selectedNode} onClose={handleCloseOverlay} />

      {/* 4. Тур */}
      {showTour && <WelcomeModal onClose={() => setShowTour(false)} />}
    </div>
  );
};

export default App;
