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
  maxLinkVal: number; // Максимальный вес связи в графе
}

export const GraphViewer: React.FC<GraphViewerProps> = ({ data, onNodeClick, focusNode, maxLinkVal }) => {
  const fgRef = useRef<any>();

  // Настройки физики (чтобы граф не взрывался)
  useEffect(() => {
    if (fgRef.current) {
      fgRef.current.d3Force('charge').strength(-120);
      fgRef.current.d3Force('link').distance((link: any) => {
        // Дисциплины держим подальше друг от друга, статьи поближе
        return link.type === 'RELATED' ? 100 : 30;
      });
    }
  }, []);

  // Камера летит к узлу
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

  // --- ЦВЕТА УЗЛОВ ---
  const getNodeColor = useCallback((node: any) => {
    let prefix = 'other';
    // Пытаемся понять категорию по ID или primary_category
    const rawId = node.primary_category || node.id;
    
    if (rawId) {
        const parts = rawId.split('.');
        if (isNaN(Number(parts[0]))) prefix = parts[0]; // math, cs, physics...
    }
    
    if (prefix.includes('ph')) return CATEGORY_COLORS['physics'];
    return CATEGORY_COLORS[prefix] || CATEGORY_COLORS['other'];
  }, []);

  // --- ОБЪЕКТЫ (СФЕРЫ + ТЕКСТ) ---
  const nodeThreeObject = useCallback((node: any) => {
    const group = new THREE.Group();
    const color = getNodeColor(node);
    
    // Размер: Дисциплины большие (10), Статьи маленькие (2)
    const size = (node.type === 'discipline' || node.type === 'adjacent_discipline') ? 10 : 2;
    
    // Сфера
    const geometry = new THREE.SphereGeometry(size, 16, 16);
    const material = new THREE.MeshLambertMaterial({ 
      color: color,
      transparent: true,
      opacity: node.type === 'article' ? 0.6 : 0.95 
    });
    group.add(new THREE.Mesh(geometry, material));

    // Текст (ТОЛЬКО для Дисциплин)
    if (node.type !== 'article') {
      const sprite = new SpriteText(node.label);
      sprite.color = color; // Цвет текста = цвет категории
      sprite.textHeight = 12; 
      sprite.position.y = size + 5; 
      group.add(sprite);
    }

    return group;
  }, [getNodeColor]);

  // --- ВИЗУАЛИЗАЦИЯ СВЯЗЕЙ (САМОЕ ВАЖНОЕ) ---
  
  // 1. Цвет связи
  const getLinkColor = useCallback((link: any) => {
    // Если это связь Статья-Дисциплина -> очень тусклая серая
    if (link.type === 'CONTAINS') return 'rgba(100, 100, 100, 0.1)';

    // Если это связь Дисциплина-Дисциплина (RELATED)
    const val = link.val || 0;
    
    // Считаем интенсивность относительно максимума (но не линейно, чтобы средние связи тоже было видно)
    // Используем корень, чтобы сгладить разницу между 10 и 1000
    const intensity = Math.min(Math.sqrt(val) / Math.sqrt(maxLinkVal || 1), 1);
    
    // Чем сильнее связь, тем она ЯРЧЕ (белее) и непрозрачнее
    // Слабая (1 статья) = тусклая (0.15)
    // Сильная = Яркая белая (0.8)
    const opacity = 0.15 + (intensity * 0.65);
    const brightness = Math.floor(100 + (155 * intensity)); // от 100 до 255
    
    return `rgba(${brightness}, ${brightness}, ${brightness}, ${opacity})`;
  }, [maxLinkVal]);

  // 2. Толщина связи
  const getLinkWidth = useCallback((link: any) => {
    if (link.type === 'CONTAINS') return 0.2; // Ниточка

    // Для дисциплин: логарифмическая или корневая зависимость
    // 1 статья -> 0.5
    // 100 статей -> ~3
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

      // СВЯЗИ
      linkColor={getLinkColor}
      linkWidth={getLinkWidth}
      linkLabel={(link: any) => {
          if (link.type === 'RELATED') return `Shared Articles: ${link.val}`;
          return '';
      }}
      
      // Чтобы связи выглядели как лучи света
      linkResolution={6} 
    />
  );
};
