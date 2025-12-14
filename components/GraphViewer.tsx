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
  maxLinkVal: number; // Максимум для расчета цвета
}

export const GraphViewer: React.FC<GraphViewerProps> = ({ data, onNodeClick, focusNode, maxLinkVal }) => {
  const fgRef = useRef<any>();

  useEffect(() => {
    if (fgRef.current) {
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

  const getNodeColor = useCallback((node: any) => {
    let prefix = 'other';
    if (node.primary_category) prefix = node.primary_category.split('.')[0];
    else if (node.id && typeof node.id === 'string') {
       const parts = node.id.split('.');
       if (isNaN(Number(parts[0]))) prefix = parts[0];
    }
    if (prefix.includes('ph')) return CATEGORY_COLORS['physics'];
    return CATEGORY_COLORS[prefix] || CATEGORY_COLORS['other'];
  }, []);

  // --- ЛОГИКА ЦВЕТА СВЯЗЕЙ ---
  const getLinkColor = useCallback((link: any) => {
    const val = link.val || 1;
    // Нормализуем значение от 0 до 1 относительно максимума в данных
    // (используем Math.log для сглаживания, если разброс огромный, но пока линейно)
    const intensity = Math.min(val / maxLinkVal, 1);
    
    // Чем сильнее связь, тем она белее и непрозрачнее.
    // Слабая связь = 0.1 opacity, Сильная = 0.8 opacity
    const opacity = 0.1 + (intensity * 0.7); 
    
    // Цвет: Слабая = серый (#555), Сильная = Белый (#FFF)
    // Интерполяция RGB не обязательна, достаточно opacity, но для красоты:
    const gray = Math.floor(80 + (175 * intensity)); // от 80 до 255
    
    return `rgba(${gray}, ${gray}, ${gray}, ${opacity})`;
  }, [maxLinkVal]);

  const nodeThreeObject = useCallback((node: any) => {
    const group = new THREE.Group();
    const color = getNodeColor(node);
    let size = 1.5; 
    if (node.type === 'discipline' || node.type === 'adjacent_discipline') size = 6;
    
    const geometry = new THREE.SphereGeometry(size, 16, 16);
    const material = new THREE.MeshLambertMaterial({ 
      color: color,
      transparent: true,
      opacity: node.type === 'article' ? 0.6 : 1.0 
    });
    group.add(new THREE.Mesh(geometry, material));

    if (node.type === 'discipline' || node.type === 'adjacent_discipline') {
      const sprite = new SpriteText(node.label);
      sprite.color = color; 
      sprite.textHeight = 8; 
      sprite.position.y = size + 4; 
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
      nodeThreeObject={nodeThreeObject}
      nodeLabel="label"
      onNodeClick={onNodeClick}

      // СВЯЗИ
      linkWidth={(link: any) => Math.max(0.5, (link.val || 1) * 0.5)} 
      linkColor={getLinkColor} // Динамический цвет
      linkLabel={(link: any) => `Papers together: ${Math.round(link.val || 1)}`} // Округляем до целого
    />
  );
};
