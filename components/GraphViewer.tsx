import React, { useCallback, useRef, useEffect } from 'react';
import ForceGraph3D from 'react-force-graph-3d';
import * as THREE from 'three';
import SpriteText from 'three-spritetext';
import { GraphData, GraphNode } from '../types';
import { GRAPH_CONFIG, CATEGORY_COLORS } from '../constants';

interface GraphViewerProps {
  data: GraphData;
  onNodeClick: (node: GraphNode) => void;
  focusNode?: GraphNode | null;
  maxLinkVal: number;
}

export const GraphViewer: React.FC<GraphViewerProps> = ({ data, onNodeClick, focusNode, maxLinkVal }) => {
  const fgRef = useRef<any>();
  // Таймер для предотвращения конфликтов камеры
  const cameraTimer = useRef<NodeJS.Timeout | null>(null);

  // --- НАСТРОЙКА ФИЗИКИ И КАМЕРЫ ---
  useEffect(() => {
    if (fgRef.current) {
      const nodeCount = data.nodes.length;
      // Режим "Скелет" (если статей нет, узлов мало)
      const isSkeletonMode = nodeCount < 500; 

      // 1. ФИЗИКА (Расталкиваем узлы, если их мало)
      const chargeStrength = isSkeletonMode ? -3000 : -120;
      const linkDistance = isSkeletonMode ? 200 : 60;

      fgRef.current.d3Force('charge').strength(chargeStrength);
      fgRef.current.d3Force('link').distance(linkDistance);
      
      // Перезапускаем "печку" физики
      if (isSkeletonMode) {
          fgRef.current.d3ReheatSimulation();
      }

      // 2. КАМЕРА (С ЗАДЕРЖКОЙ, ЧТОБЫ ПЕРЕБИТЬ AUTO-ZOOM)
      if (isSkeletonMode) {
          if (cameraTimer.current) clearTimeout(cameraTimer.current);
          
          cameraTimer.current = setTimeout(() => {
              // Принудительно отлетаем далеко назад (z: 900)
              fgRef.current.cameraPosition(
                { x: 0, y: 0, z: 1500 }, 
                { x: 0, y: 0, z: 0 },   
                1500 // Плавный отлет за 1.5 сек
              );
          }, 200); // Ждем 200мс, пока библиотека закончит свои дела
      }
    }
  }, [data]); // <-- Срабатывает каждый раз, когда меняются данные (фильтры)

  // --- ФОКУС ПРИ ПОИСКЕ (Игнорируем скелетный режим) ---
  useEffect(() => {
    if (focusNode && fgRef.current) {
      // Если пользователь что-то ищет, отменяем отлет камеры
      if (cameraTimer.current) clearTimeout(cameraTimer.current);

      const distance = 80;
      const distRatio = 1 + distance / Math.hypot(focusNode.x!, focusNode.y!, focusNode.z!);
      fgRef.current.cameraPosition(
        { x: focusNode.x! * distRatio, y: focusNode.y! * distRatio, z: focusNode.z! * distRatio },
        focusNode,
        2000
      );
    }
  }, [focusNode]);

  // --- ЦВЕТА И ОБЪЕКТЫ (ОСТАЛОСЬ БЕЗ ИЗМЕНЕНИЙ) ---
  const getNodeColor = useCallback((node: any) => {
    let prefix = 'other';
    const rawId = node.primary_category || node.id;
    if (rawId) {
        const parts = rawId.split('.');
        if (isNaN(Number(parts[0]))) prefix = parts[0];
    }
    if (prefix.includes('ph')) return CATEGORY_COLORS['physics'];
    return CATEGORY_COLORS[prefix] || CATEGORY_COLORS['other'];
  }, []);

  const nodeThreeObject = useCallback((node: any) => {
    const group = new THREE.Group();
    const color = getNodeColor(node);
    const size = (node.type === 'discipline' || node.type === 'adjacent_discipline') ? 10 : 2;
    
    const geometry = new THREE.SphereGeometry(size, 16, 16);
    const material = new THREE.MeshLambertMaterial({ 
      color: color,
      transparent: true,
      opacity: node.type === 'article' ? 0.6 : 0.95 
    });
    group.add(new THREE.Mesh(geometry, material));

    if (node.type !== 'article') {
      const sprite = new SpriteText(node.label);
      sprite.color = color;
      sprite.textHeight = 12; 
      sprite.position.y = size + 5; 
      group.add(sprite);
    }
    return group;
  }, [getNodeColor]);

  const getLinkColor = useCallback((link: any) => {
    if (link.type === 'CONTAINS') return 'rgba(100, 100, 100, 0.1)';
    
    const intensity = Math.min(Math.sqrt(link.val || 0) / Math.sqrt(maxLinkVal || 1), 1);
    const opacity = 0.15 + (intensity * 0.65);
    const brightness = Math.floor(100 + (155 * intensity));
    
    return `rgba(${brightness}, ${brightness}, ${brightness}, ${opacity})`;
  }, [maxLinkVal]);

  const getLinkWidth = useCallback((link: any) => {
    if (link.type === 'CONTAINS') return 0.2;
    return Math.max(0.5, Math.sqrt(link.val || 1) * 0.3); 
  }, []);

  return (
    <ForceGraph3D
      ref={fgRef}
      graphData={data}
      backgroundColor={GRAPH_CONFIG.backgroundColor}
      showNavInfo={false}
      nodeThreeObject={nodeThreeObject}
      nodeLabel="label"
      onNodeClick={onNodeClick}
      linkColor={getLinkColor}
      linkWidth={getLinkWidth}
      linkLabel={(link: any) => link.type === 'RELATED' ? `Shared Articles: ${link.val}` : ''}
      linkResolution={6}
      // Warmup чуть дольше, чтобы физика успела отработать до рендера
      warmupTicks={50} 
      cooldownTicks={0}
    />
  );
};
