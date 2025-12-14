import React, { useCallback, useMemo, useRef, useEffect } from 'react';
import ForceGraph3D from 'react-force-graph-3d';
import * as THREE from 'three';
import { GraphData, GraphNode } from '../types';
import { GRAPH_CONFIG, CATEGORY_COLORS } from '../constants';

interface GraphViewerProps {
  data: GraphData;
  onNodeClick: (node: GraphNode) => void;
  focusNode?: GraphNode | null; // Для фокусировки из поиска
}

export const GraphViewer: React.FC<GraphViewerProps> = ({ data, onNodeClick, focusNode }) => {
  const fgRef = useRef<any>();

  // Если из поиска выбрали узел -> летим к нему
  useEffect(() => {
    if (focusNode && fgRef.current) {
      const distance = 150;
      const distRatio = 1 + distance / Math.hypot(focusNode.x!, focusNode.y!, focusNode.z!);
      fgRef.current.cameraPosition(
        { x: focusNode.x! * distRatio, y: focusNode.y! * distRatio, z: focusNode.z! * distRatio },
        focusNode,
        2000
      );
    }
  }, [focusNode]);

  // --- ЛОГИКА ЦВЕТОВ (ПО ПРЕФИКСУ ID) ---
  const getNodeColor = useCallback((node: any) => {
    // 1. Получаем префикс (math, cs, physics)
    // ID обычно выглядят как "math.AT" или "1805.12345" (старые статьи без категорий -> other)
    
    let prefix = 'other';
    
    if (node.primary_category) {
       prefix = node.primary_category.split('.')[0];
    } else if (node.id && typeof node.id === 'string') {
       // Пытаемся угадать из ID
       if (node.id.includes('/')) return '#718096'; // Старые форматы
       const parts = node.id.split('.');
       if (isNaN(Number(parts[0]))) { 
         prefix = parts[0]; // Если это буквы (math.AG)
       }
    }

    // Нормализация для физики (astro-ph -> astro, etc)
    if (prefix.includes('ph')) return CATEGORY_COLORS['physics'];
    
    return CATEGORY_COLORS[prefix] || CATEGORY_COLORS['other'];
  }, []);

  // --- ОБЪЕКТ УЗЛА (БЕЗ ТЕКСТА) ---
  const nodeThreeObject = useCallback((node: any) => {
    // 1. Размер зависит от типа
    let size = 3;
    if (node.type === 'discipline') size = 12;
    else if (node.val) size = node.val;

    // 2. Геометрия
    const resolution = node.type === 'article' ? 8 : 16;
    const geometry = new THREE.SphereGeometry(size, resolution, resolution);
    
    // 3. Материал
    const material = new THREE.MeshLambertMaterial({ 
      color: getNodeColor(node),
      transparent: true,
      opacity: node.type === 'article' ? 0.7 : 0.95
    });

    return new THREE.Mesh(geometry, material);
  }, [getNodeColor]);

  return (
    <ForceGraph3D
      ref={fgRef}
      graphData={data}
      
      backgroundColor={GRAPH_CONFIG.backgroundColor}
      showNavInfo={false}
      
      // Узлы
      nodeThreeObject={nodeThreeObject}
      nodeLabel="label" // Показываем название только при наведении мышки (тултип)
      onNodeClick={onNodeClick}

      // Связи (Без анимации частиц!)
      linkWidth={GRAPH_CONFIG.linkWidth}
      linkColor={() => 'rgba(255,255,255,0.08)'} // Едва заметные связи
      linkDirectionalParticles={0} // ОТКЛЮЧЕНА АНИМАЦИЯ
    />
  );
};
