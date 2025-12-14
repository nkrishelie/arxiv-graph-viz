import React, { useState, useEffect, useMemo } from 'react';
import { GraphViewer } from './components/GraphViewer';
import { UIOverlay } from './components/UIOverlay';
import { NavigationControls } from './components/NavigationControls';
import { WelcomeModal } from './components/WelcomeModal';
import { getGraphData } from './services/dataService';
import { GraphData, GraphNode } from './types';

const App: React.FC = () => {
  const [rawData, setRawData] = useState<GraphData | null>(null);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [loading, setLoading] = useState(true);
  const [showTour, setShowTour] = useState(true);
  
  // Для фокуса камеры
  const [focusNode, setFocusNode] = useState<GraphNode | null>(null);

  // Состояние фильтров (по умолчанию включено всё)
  const [visibleTypes, setVisibleTypes] = useState<Set<string>>(new Set(['discipline', 'article']));

  useEffect(() => {
    getGraphData().then((data) => {
      setRawData(data);
      setLoading(false);
    });
  }, []);

  // Переключатель чекбоксов
  const toggleType = (type: string) => {
    const newSet = new Set(visibleTypes);
    if (newSet.has(type)) newSet.delete(type);
    else newSet.add(type);
    setVisibleTypes(newSet);
  };

  // ФИЛЬТРАЦИЯ ДАННЫХ ДЛЯ ГРАФА
  const filteredData = useMemo(() => {
    if (!rawData) return { nodes: [], links: [] };

    // 1. Фильтруем узлы по чекбоксам
    const activeNodes = rawData.nodes.filter(n => {
       // discipline и adjacent_discipline считаем одной группой 'discipline' для упрощения
       const typeKey = (n.type === 'adjacent_discipline') ? 'discipline' : n.type;
       return visibleTypes.has(typeKey);
    });

    const activeIds = new Set(activeNodes.map(n => n.id));

    // 2. Оставляем связи только между видимыми узлами
    const activeLinks = rawData.links.filter(link => {
       const sourceId = typeof link.source === 'object' ? (link.source as any).id : link.source;
       const targetId = typeof link.target === 'object' ? (link.target as any).id : link.target;
       return activeIds.has(sourceId) && activeIds.has(targetId);
    });

    return { nodes: activeNodes, links: activeLinks };
  }, [rawData, visibleTypes]);

  // Обработчик выбора из поиска
  const handleNodeSelect = (node: GraphNode) => {
    setSelectedNode(node); // Открываем панель
    setFocusNode(node);    // Летим камерой
    
    // Если выбрали узел скрытого типа - включаем этот тип принудительно
    const typeKey = (node.type === 'adjacent_discipline') ? 'discipline' : node.type;
    if (!visibleTypes.has(typeKey)) {
        toggleType(typeKey);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen bg-[#000011] text-white">Loading...</div>;

  return (
    <div className="relative w-full h-screen bg-[#000011] overflow-hidden">
      
      {/* 1. Меню (Поиск + Фильтры) */}
      <NavigationControls 
        nodes={rawData ? rawData.nodes : []} 
        onNodeSelect={handleNodeSelect}
        visibleTypes={visibleTypes}
        toggleType={toggleType}
      />

      {/* 2. Граф (Передаем очищенные данные и фокус) */}
      <GraphViewer 
        data={filteredData}
        onNodeClick={handleNodeSelect}
        focusNode={focusNode}
      />
      
      {/* 3. Инфо */}
      <UIOverlay selectedNode={selectedNode} onClose={() => setSelectedNode(null)} />

      {/* 4. Тур */}
      {showTour && <WelcomeModal onClose={() => setShowTour(false)} />}
    </div>
  );
};

export default App;
