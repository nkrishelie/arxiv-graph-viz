import React, { useCallback, useMemo, useRef } from 'react';
import ForceGraph3D from 'react-force-graph-3d';
import * as THREE from 'three';
import SpriteText from 'three-spritetext';
import * as d3 from 'd3';

// Импортируем типы и конфиг
import { GraphData, GraphNode, GraphLink } from '../types';
import { GRAPH_CONFIG } from '../constants';

interface GraphViewerProps {
  data: GraphData;
  onNodeClick: (node: GraphNode) => void;
}

export const GraphViewer: React.FC<GraphViewerProps> = ({ data, onNodeClick }) => {
  const fgRef = useRef<any>();

  // Генератор цветов для математических дисциплин (радуга)
  const colorScale = useMemo(() => d3.scaleOrdinal(d3.schemeCategory10), []);

  // --- ЛОГИКА ЦВЕТОВ (НОВАЯ) ---
  
  const getNodeColor = useCallback((node: any) => {
    // 1. Смежные науки (Физика, CS)
    if (node.cluster === 'ADJACENT') return '#9370DB'; // MediumPurple
    // 2. Заглушка "Other"
    if (node.cluster === 'OTHER') return '#808080';    // Gray

    // 3. Статьи
    if (node.type === 'article') {
       // Если статья привязана к известной дисциплине -> берем её цвет
       if (node.cluster && node.cluster !== 'ADJACENT' && node.cluster !== 'OTHER') {
          return colorScale(node.cluster); 
       }
       return '#A9A9A9'; // DarkGray для остальных
    }

    // 4. Дисциплины (Узлы категорий)
    return colorScale(node.id);
  }, [colorScale]);


  const getLinkColor = useCallback((link: any) => {
    switch (link.type) {
      case 'CONTAINS': return 'rgba(255, 255, 255, 0.2)'; // Белый полупрозрачный
      case 'RELATED':  return 'rgba(255, 165, 0, 0.3)';   // Оранжевый (связи дисциплин)
      case 'DEPENDS':  return 'rgba(255, 0, 0, 0.4)';     // Красный (цитирования/авторы)
      default: return 'rgba(255, 255, 255, 0.1)';
    }
  }, []);

  // --- ОТРИСОВКА УЗЛОВ (ТЕКСТ И СФЕРЫ) ---

  const nodeThreeObject = useCallback((node: any) => {
    const group = new THREE.Group();

    // 1. Сфера (шарик)
    const geometry = new THREE.SphereGeometry(node.val || 5);
    const material = new THREE.MeshLambertMaterial({ 
      color: getNodeColor(node),
      transparent: true,
      opacity: 0.9 
    });
    const sphere = new THREE.Mesh(geometry, material);
    group.add(sphere);

    // 2. Текст (только для Дисциплин или важных узлов)
    // Показываем текст, если это категория (discipline/adjacent) или крупная статья
    if (node.type !== 'article' || (node.val && node.val > 10)) {
      const sprite = new SpriteText(node.label);
      sprite.color = 'white';
      sprite.textHeight = (node.val || 5) * 1.5; // Размер текста зависит от размера узла
      sprite.position.y = (node.val || 5) + 2;   // Чуть выше шарика
      group.add(sprite);
    }

    return group;
  }, [getNodeColor]);

  return (
    <ForceGraph3D
      ref={fgRef}
      graphData={data}
      
      // Внешний вид
      backgroundColor={GRAPH_CONFIG.backgroundColor}
      showNavInfo={false}
      
      // Узлы
      nodeLabel="label"
      nodeRelSize={GRAPH_CONFIG.nodeRelSize}
      nodeThreeObject={nodeThreeObject}
      nodeColor={getNodeColor}
      onNodeClick={(node) => {
        // Камера фокусируется на узле при клике
        const distance = 100;
        const distRatio = 1 + distance / Math.hypot(node.x!, node.y!, node.z!);
        fgRef.current.cameraPosition(
          { x: node.x! * distRatio, y: node.y! * distRatio, z: node.z! * distRatio },
          node, 
          3000 
        );
        onNodeClick(node as GraphNode);
      }}

      // Связи
      linkWidth={GRAPH_CONFIG.linkWidth}
      linkColor={getLinkColor}
      linkDirectionalParticles={2} // Бегущие точки по связям
      linkDirectionalParticleWidth={GRAPH_CONFIG.particleWidth}
    />
  );
};
