import { WelcomeModal } from './components/WelcomeModal';
import React, { useState, useEffect, useMemo } from 'react';
import { GraphViewer } from './components/GraphViewer';
import { UIOverlay } from './components/UIOverlay';
import { getGraphData } from './services/dataService';
import { GraphNode, GraphData, Language, Discipline, NodeKind } from './types';

const App: React.FC = () => {
  const [language, setLanguage] = useState<Language>('en');
  
  const [data, setData] = useState<GraphData>({ nodes: [], links: [] });
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    setIsDataLoaded(false);
    
    const timer = setTimeout(() => {
      const graphData = getGraphData(language);
      setData(graphData);
      setIsDataLoaded(true);
    }, 50);

    return () => clearTimeout(timer);
  }, [language]);

  const handleNodeClick = (node: GraphNode) => {
    setSelectedNode(node);
  };

  const handleBackgroundClick = () => {
    if(selectedNode) setSelectedNode(null);
  };

  // === Состояние фильтрации ===
  const [hiddenGroups, setHiddenGroups] = useState<Set<Discipline>>(new Set());
  const [hiddenKinds, setHiddenKinds] = useState<Set<NodeKind>>(new Set()); // <-- Новое состояние

  const toggleGroup = (group: Discipline) => {
    const newHidden = new Set(hiddenGroups);
    if (newHidden.has(group)) {
      newHidden.delete(group);
    } else {
      newHidden.add(group);
    }
    setHiddenGroups(newHidden);
  };

  // <-- Новая функция переключения Kind
  const toggleKind = (kind: NodeKind) => {
    const newHidden = new Set(hiddenKinds);
    if (newHidden.has(kind)) {
      newHidden.delete(kind);
    } else {
      newHidden.add(kind);
    }
    setHiddenKinds(newHidden);
  };

  const visibleData = useMemo(() => {
    // 1. Фильтруем узлы по Группе И по Типу (Kind)
    const visibleNodes = data.nodes.filter(n => {
      const groupHidden = hiddenGroups.has(n.group);
      // Если у узла нет kind, считаем его видимым по этому критерию, либо скрываем, если логика требует строгости
      // Здесь предполагаем: если kind есть и он в скрытых -> скрыть.
      const kindHidden = n.kind ? hiddenKinds.has(n.kind) : false; 
      
      return !groupHidden && !kindHidden;
    });

    const visibleNodeIds = new Set(visibleNodes.map(n => n.id));

    // 2. Фильтруем связи
    const visibleLinks = data.links.filter(l => {
      const sourceId = typeof l.source === 'object' ? (l.source as any).id : l.source;
      const targetId = typeof l.target === 'object' ? (l.target as any).id : l.target;
      
      return visibleNodeIds.has(sourceId) && visibleNodeIds.has(targetId);
    });

    return { nodes: visibleNodes, links: visibleLinks };
  }, [data, hiddenGroups, hiddenKinds]); // <-- Добавили hiddenKinds в зависимости

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {showWelcome && (
        <WelcomeModal 
          onStart={() => setShowWelcome(false)}
          currentLang={language}
          onToggleLang={setLanguage}
        />
      )}

      <div className="absolute inset-0 z-0" onClick={handleBackgroundClick}>
        <GraphViewer 
          data={visibleData}
          onNodeClick={handleNodeClick} 
          searchQuery={searchQuery}
          activeLanguage={language}
        />
      </div>

      <div className="absolute inset-0 z-10 pointer-events-none">
        <UIOverlay 
          nodes={data.nodes} 
          links={data.links}
          selectedNode={selectedNode} 
          onSearch={(query) => {
            setSearchQuery(query);
            const foundNode = data.nodes.find(n => n.id === query);
            if (foundNode) setSelectedNode(foundNode);
          }}
          
          // Props для групп
          hiddenGroups={hiddenGroups}
          onToggleGroup={toggleGroup}

          // Props для видов (Kind) <-- Передаем новые пропсы
          hiddenKinds={hiddenKinds}
          onToggleKind={toggleKind}

          onCloseSidebar={() => setSelectedNode(null)}
          currentLang={language}
          onToggleLang={(lang) => setLanguage(lang)}
        />
      </div>
    </div>
  );
};

export default App;
