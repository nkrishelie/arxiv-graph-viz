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
}

export const GraphViewer: React.FC<GraphViewerProps> = ({ data, onNodeClick, focusNode }) => {
  const fgRef = useRef<any>();

  useEffect(() => {
    if (fgRef.current) {
      // Физика: сильное отталкивание, чтобы текст не слипался
      fgRef.current.d3Force('charge').strength(-150);
      fgRef.current.d3Force('link').distance(60);
    }
  }, []);

  useEffect(() => {
    if (focusNode && fgRef.current) {
      const distance = 80;
      const distRatio = 1 + distance / Math.hypot(focusNode.x!, focusNode.y!, focusNode.z!);
      fgRef.current.cameraPosition(
        { x: focusNode.x! * distRatio, y: focusNode.y! * distRatio, z: focusNode.z! * distRatio },
        focusNode,
        2000
      );
    }
  }, [focusNode]);

  // --- ПОЛУЧЕНИЕ ЦВЕТА ---
  const getNodeColor = useCallback((node: any) => {
    let prefix = 'other';
    // Логика определения префикса из ID или категории
    if (node.primary_category) prefix = node.primary_category.split('.')[0];
    else if (node.id && typeof node.id === 'string') {
       const parts = node.id.split('.');
       if (isNaN(Number(parts[0]))) prefix = parts[0];
    }
    
    // Группировка всей физики, если нет конкретного цвета
    if (prefix.includes('ph') && !CATEGORY_COLORS[prefix]) return CATEGORY_COLORS['physics'];
    
    return CATEGORY_COLORS[prefix] || CATEGORY_COLORS['other'];
  }, []);

  // --- 3D ОБЪЕКТЫ ---
  const nodeThreeObject = useCallback((node: any) => {
    const group = new THREE.Group();
    const color = getNodeColor(node);

    // 1. Сфера
    let size = 1.5; // Статьи маленькие
    if (node.type === 'discipline' || node.type === 'adjacent_discipline') size = 6;
    
    const geometry = new THREE.SphereGeometry(size, 16, 16);
    const material = new THREE.MeshLambertMaterial({ 
      color: color,
      transparent: true,
      opacity: node.type === 'article' ? 0.6 : 1.0 
    });
    group.add(new THREE.Mesh(geometry, material));

    // 2. Текст (ТОЛЬКО для Дисциплин)
    if (node.type === 'discipline' || node.type === 'adjacent_discipline') {
      const sprite = new SpriteText(node.label);
      sprite.color = color; // Цвет текста совпадает с узлом
      sprite.textHeight = 8; // Размер шрифта
      sprite.position.y = size + 4; // Сдвиг вверх
      group.add(sprite);
    }

    return group;
  }, [getNodeColor]);

  return (
    <ForceGraph3D
      ref={fgRef}
      graphData={data}
      backgroundColor={GRAPH_CONFIG.backgroundColor}
      showNavInfo={false}
      
      // Узлы
      nodeThreeObject={nodeThreeObject}
      nodeLabel="label" // Тултип при наведении
      onNodeClick={onNodeClick}

      // СВЯЗИ (ГЛАВНОЕ ИЗМЕНЕНИЕ)
      // Толщина зависит от val (веса связи), который мы считали в BigQuery
      linkWidth={(link: any) => Math.max(0.5, (link.val || 1) * 0.5)} 
      
      // Прозрачность тоже можно привязать к весу (чем толще, тем заметнее)
      linkOpacity={0.3}
      
      // Тултип на связи (показывает вес или тип)
      linkLabel={(link: any) => `Connection Weight: ${link.val || 1}`}
      
      linkColor={() => '#555'} // Нейтральный серый цвет связей
    />
  );
};
