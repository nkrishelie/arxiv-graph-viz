import React, { useCallback, useRef, useEffect, useMemo } from 'react';
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
  const cameraTimer = useRef<NodeJS.Timeout | null>(null);

const getNodeColor = useCallback((node: any) => {
    const rawId = node.primary_category || node.id;
    if (!rawId) return '#718096'; // fallback

    // 1. Статьи - серые (только для компонентов интерфейса, в графе свои правила прозрачности)
    if (node.type === 'article' && !node.primary_category) return '#A0AEC0';

    const lowerId = rawId.toLowerCase();

    // 2. Спец. категории (Приоритет!)
    if (lowerId.includes('quant-ph')) return CATEGORY_COLORS['quant-ph'];
    if (lowerId.includes('astro-ph')) return CATEGORY_COLORS['astro-ph'];
    if (lowerId.includes('gr-qc')) return CATEGORY_COLORS['gr-qc'];
    if (lowerId.includes('cond-mat')) return CATEGORY_COLORS['cond-mat'];
    if (lowerId.includes('hep')) return CATEGORY_COLORS['hep-th'];

    // 3. Префиксы
    const prefix = rawId.split('.')[0];
    if (CATEGORY_COLORS[prefix]) return CATEGORY_COLORS[prefix];

    // 4. Общая физика
    if (lowerId.includes('ph') || prefix === 'physics') return CATEGORY_COLORS['physics'];

    return CATEGORY_COLORS['other'];
  }, []);

  // --- 2. ФИЗИКА И КАМЕРА ---
  useEffect(() => {
    if (fgRef.current) {
      const nodeCount = data.nodes.length;
      const isSkeletonMode = nodeCount < 500; 

      const chargeStrength = isSkeletonMode ? -3000 : -120;
      const linkDistance = isSkeletonMode ? 200 : 60;

      fgRef.current.d3Force('charge').strength(chargeStrength);
      fgRef.current.d3Force('link').distance(linkDistance);
      
      if (isSkeletonMode) {
          fgRef.current.d3ReheatSimulation();
          
          if (cameraTimer.current) clearTimeout(cameraTimer.current);
          cameraTimer.current = setTimeout(() => {
              fgRef.current.cameraPosition(
                { x: 0, y: 0, z: 900 }, 
                { x: 0, y: 0, z: 0 },   
                1500 
              );
          }, 200);
      }
    }
  }, [data]);

  // Фокус
  useEffect(() => {
    if (focusNode && fgRef.current) {
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

  // --- 3. РЕНДЕР ОБЪЕКТОВ ---
  const nodeThreeObject = useCallback((node: any) => {
    const group = new THREE.Group();
    const color = getNodeColor(node); // <-- Используем новую логику
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
      warmupTicks={50} 
      cooldownTicks={0}
    />
  );
};
