import React, { useState, useEffect, useCallback } from 'react';
import { GraphViewer } from './components/GraphViewer';
import { UIOverlay } from './components/UIOverlay';
import { WelcomeModal } from './components/WelcomeModal'; // Вернули импорт
import { getGraphData } from './services/dataService';
import { GraphData, GraphNode } from './types';

const App: React.FC = () => {
  const [data, setData] = useState<GraphData | null>(null);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  
  // Состояния загрузки и ошибок
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Состояние Тура (по умолчанию true, чтобы он появлялся при старте)
  const [showTour, setShowTour] = useState(true);

  useEffect(() => {
    getGraphData()
      .then((graphData) => {
        if (!graphData || !graphData.nodes || !Array.isArray(graphData.nodes)) {
          throw new Error("Invalid graph data structure");
        }
        setData(graphData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load graph data:", err);
        setError("Failed to load data.");
        setLoading(false);
      });
  }, []);

  const handleNodeClick = useCallback((node: GraphNode) => {
    setSelectedNode(node);
  }, []);

  const handleCloseOverlay = useCallback(() => {
    setSelectedNode(null);
  }, []);

  // Если ошибка
  if (error) {
    return <div className="flex justify-center items-center h-screen bg-black text-red-500">{error}</div>;
  }

  // Если загрузка
  if (loading || !data) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#000011] text-blue-400">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p>Loading ArXiv Universe...</p>
      </div>
    );
  }

  // Основной рендер
  return (
    <div className="relative w-full h-screen bg-[#000011] overflow-hidden">
      {/* 1. ГРАФ (Рисуем только когда есть данные) */}
      <GraphViewer 
        data={data} 
        onNodeClick={handleNodeClick} 
      />
      
      {/* 2. ИНТЕРФЕЙС (Панель справа) */}
      <UIOverlay 
        selectedNode={selectedNode} 
        onClose={handleCloseOverlay} 
      />

      {/* 3. ТУР (Модальное окно поверх всего) */}
      {showTour && (
        <WelcomeModal 
          onClose={() => setShowTour(false)} 
        />
      )}
    </div>
  );
};

export default App;
