import React, { useCallback, useRef, useEffect } from 'react';
import ForceGraph3D from 'react-force-graph-3d';
import * as THREE from 'three';
import * as d3 from 'd3'; // Убедись, что d3 установлен (npm install d3)
import { GraphData, GraphNode } from '../types';
import { GRAPH_CONFIG, CATEGORY_COLORS } from '../constants';

interface GraphViewerProps {
  data: GraphData;
  onNodeClick: (node: GraphNode) => void;
  focusNode?: GraphNode | null;
}

export const GraphViewer: React.FC<GraphViewerProps> = ({ data, onNodeClick, focusNode }) => {
  const fgRef = useRef<any>();

  // Настройка физики (раздвигаем узлы)
  useEffect(() => {
    if (fgRef.current) {
      // Увеличиваем силу отталкивания (Charge), чтобы шары не слипались
      fgRef.current.d3Force('charge').strength(-120); 
      // Добавляем немного трения, чтобы граф не "дрожал"
      fgRef.current.d3Force('link').distance(50); 
    }
  }, []);

  // Фокус камеры при поиске
  useEffect(() => {
    if (focusNode && fgRef.current) {
      const distance = 100; // Подлетаем ближе
      const distRatio = 1 + distance / Math.hypot(focusNode.x!, focusNode.y!, focusNode.z!);
      fgRef.current.cameraPosition(
        { x: focusNode.x! * distRatio, y: focusNode.y! * distRatio, z: focusNode.z! * distRatio },
        focusNode,
        2000
      );
    }
  }, [focusNode]);

  // --- ЦВЕТА ---
  const getNodeColor = useCallback((node: any) => {
    let prefix = 'other';
    
    // Определяем префикс (math, cs, physics...)
    if (node.primary_category) {
       prefix = node.primary_category.split('.')[0];
    } else if (node.id && typeof node.id === 'string') {
       const parts = node.id.split('.');
       if (isNaN(Number(parts[0]))) prefix = parts[0];
    }

    if (prefix.includes('ph')) return CATEGORY_COLORS['physics'];
    return CATEGORY_COLORS[prefix] || CATEGORY_COLORS['other'];
  }, []);

  // --- ГЕОМЕТРИЯ (УМЕНЬШЕННАЯ) ---
  const nodeThreeObject = useCallback((node: any) => {
    // РАДИКАЛЬНО УМЕНЬШАЕМ РАЗМЕРЫ
    let size = 1; // Базовый размер для статей (был 3)
    
    if (node.type === 'discipline' || node.type === 'adjacent_discipline') {
        size = 4; // Категории (было 12 — это очень много)
    } else {
        // Для статей: если у узла большой вес (val), чуть увеличиваем, но не сильно
        size = Math.min((node.val || 1) * 0.5, 2); 
    }

    // Делаем статьи менее полигональными для скорости (8 сегментов), категории красивыми (32)
    const resolution = (node.type === 'discipline') ? 32 : 8;
    
    const geometry = new THREE.SphereGeometry(size, resolution, resolution);
    const material = new THREE.MeshLambertMaterial({ 
      color: getNodeColor(node),
      transparent: true,
      opacity: node.type === 'article' ? 0.6 : 0.9 // Статьи полупрозрачные
    });

    return new THREE.Mesh(geometry, material);
  }, [getNodeColor]);

  return (
    <ForceGraph3D
      ref={fgRef}
      graphData={data}
      backgroundColor={GRAPH_CONFIG.backgroundColor}
      showNavInfo={false}
      
      // Объекты
      nodeThreeObject={nodeThreeObject}
      nodeLabel="label"
      onNodeClick={onNodeClick}

      // Связи
      linkWidth={0.5} // Тонкие нити
      linkOpacity={0.2}
      linkColor={() => '#4A5568'} // Темно-серые связи, чтобы не рябило
      
      // Параметры движка (Warmup ускоряет начальную стабилизацию)
      warmupTicks={100} 
      cooldownTicks={0}
    />
  );
};
