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
  const cameraTimer = useRef<NodeJS.Timeout | null>(null);

  // --- ЛОГИКА ЦВЕТОВ ---
  const getNodeColor = useCallback((node: any) => {
    const rawId = node.primary_category || node.id;
    if (!rawId) return '#718096';
    if (node.type === 'article' && !node.primary_category) return '#A0AEC0';
    const lowerId = rawId.toLowerCase();

    if (lowerId.includes('quant-ph')) return CATEGORY_COLORS['quant-ph'];
    if (lowerId.includes('astro-ph')) return CATEGORY_COLORS['astro-ph'];
    if (lowerId.includes('gr-qc')) return CATEGORY_COLORS['gr-qc'];
    if (lowerId.includes('cond-mat')) return CATEGORY_COLORS['cond-mat'];
    if (lowerId.includes('hep')) return CATEGORY_COLORS['hep-th'];

    const prefix = rawId.split('.')[0];
    if (CATEGORY_COLORS[prefix]) return CATEGORY_COLORS[prefix];
    if (lowerId.includes('ph') || prefix === 'physics') return CATEGORY_COLORS['physics'];

    return CATEGORY_COLORS['other'];
  }, []);

  // --- ФИЗИКА (ГЛАВНОЕ ИЗМЕНЕНИЕ) ---
  useEffect(() => {
    if (fgRef.current) {
      const nodeCount = data.nodes.length;
      const isSkeletonMode = nodeCount < 500; // Режим "Только дисциплины"

      // 1. СИЛА ОТТАЛКИВАНИЯ (Charge)
      // В режиме скелета отталкиваем сильнее, чтобы разлепить кластеры
      const chargeStrength = isSkeletonMode ? -1500 : -100;
      fgRef.current.d3Force('charge').strength(chargeStrength);

      // 2. ДЛИНА СВЯЗЕЙ (Link Distance) - ВОТ ТУТ МАГИЯ
      fgRef.current.d3Force('link').distance((link: any) => {
        // А) Связь "Статья -> Дисциплина" (CONTAINS)
        // Держим статьи на коротком поводке (30), чтобы они облепляли свою категорию
        if (link.type === 'CONTAINS') return 30;

        // Б) Связь "Дисциплина <-> Дисциплина" (RELATED)
        // Чем больше вес (val), тем КОРОЧЕ связь (сильнее притяжение)
        // Базовая дистанция 400. Делим на корень из веса.
        // Вес 1 -> дист 400 (далеко)
        // Вес 100 -> дист 40 (очень близко)
        // Math.max(50, ...) не дает им слипнуться в одну точку
        const dist = 400 / (Math.sqrt(link.val || 1));
        return Math.max(60, dist); 
      });
      
      // Перезапуск и Камера
      if (isSkeletonMode) {
          fgRef.current.d3ReheatSimulation();
          if (cameraTimer.current) clearTimeout(cameraTimer.current);
          cameraTimer.current = setTimeout(() => {
              fgRef.current.cameraPosition({ x: 0, y: 0, z: 2000 }, { x: 0, y: 0, z: 0 }, 1500);
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
        focusNode, 2000
      );
    }
  }, [focusNode]);

  // Управление
  const handleZoom = (factor: number) => {
    if (!fgRef.current) return;
    const currentPos = fgRef.current.cameraPosition();
    fgRef.current.cameraPosition({ x: currentPos.x * factor, y: currentPos.y * factor, z: currentPos.z * factor }, currentPos.lookAt, 500);
  };
  const handleRotate = (angleX: number, angleY: number) => {
    if (!fgRef.current) return;
    const { x, y, z } = fgRef.current.cameraPosition();
    const cosY = Math.cos(angleY), sinY = Math.sin(angleY);
    const x1 = x * cosY - z * sinY, z1 = x * sinY + z * cosY;
    const y1 = y + angleX * Math.sqrt(x*x + z*z);
    fgRef.current.cameraPosition({ x: x1, y: y1, z: z1 }, { x: 0, y: 0, z: 0 }, 500);
  };
  const handleReset = () => {
    if (!fgRef.current) return;
    const nodeCount = data.nodes.length;
    const isSkeletonMode = nodeCount < 500; 
    const zPos = isSkeletonMode ? 2000 : 1500;
    fgRef.current.cameraPosition({ x: 0, y: 0, z: zPos }, { x: 0, y: 0, z: 0 }, 1500);
  };

  // Rendering
  const nodeThreeObject = useCallback((node: any) => {
    const group = new THREE.Group();
    const color = getNodeColor(node);
    const size = (node.type === 'discipline' || node.type === 'adjacent_discipline') ? 10 : 2;
    const geometry = new THREE.SphereGeometry(size, 16, 16);
    const material = new THREE.MeshLambertMaterial({ color: color, transparent: true, opacity: node.type === 'article' ? 0.6 : 0.95 });
    group.add(new THREE.Mesh(geometry, material));
    if (node.type !== 'article') {
      const sprite = new SpriteText(node.label);
      sprite.color = color;
      sprite.textHeight = 12; sprite.position.y = size + 5; group.add(sprite);
    }
    return group;
  }, [getNodeColor]);

  const getLinkColor = useCallback((link: any) => {
    if (link.type === 'CONTAINS') return 'rgba(100, 100, 100, 0.1)';
    const intensity = Math.min(Math.sqrt(link.val || 0) / Math.sqrt(maxLinkVal || 1), 1);
    const opacity = 0.2 + (intensity * 0.8); // Чуть ярче
    const brightness = Math.floor(100 + (155 * intensity));
    return `rgba(${brightness}, ${brightness}, ${brightness}, ${opacity})`;
  }, [maxLinkVal]);

  const getLinkWidth = useCallback((link: any) => {
    if (link.type === 'CONTAINS') return 0.2;
    // Логарифмическая толщина: чтобы супер-связи не становились бревнами
    return Math.max(0.5, Math.log2((link.val || 1) + 1)); 
  }, []);

  return (
    <div className="relative w-full h-full">
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
        
        // --- АНИМАЦИЯ (ЧАСТИЦЫ) ---
        // Рисуем частицы ТОЛЬКО на связях дисциплин
        linkDirectionalParticles={(link: any) => {
            if (link.type === 'CONTAINS') return 0; // На статьях не шумим
            // Кол-во частиц зависит от силы связи (макс 4, чтобы не было фейерверка)
            return Math.min(4, Math.ceil(Math.sqrt(link.val || 0) / 2));
        }}
        // Скорость зависит от веса (сильнее связь = быстрее поток)
        linkDirectionalParticleSpeed={(link: any) => {
            return 0.002 + (Math.sqrt(link.val || 0) * 0.001);
        }}
        // Размер частицы
        linkDirectionalParticleWidth={1.5}
        linkDirectionalParticleResolution={8}
      />

      {/* Панель (без изменений) */}
      <div className="absolute bottom-6 left-6 flex flex-col gap-4 z-50">
        <div className="hidden md:flex flex-col gap-2">
            <div className="flex gap-2">
                <button onClick={() => handleZoom(0.7)} className="w-10 h-10 bg-gray-800/80 hover:bg-gray-700 text-white rounded-full flex items-center justify-center border border-gray-600 font-bold" title="Zoom In">+</button>
                <button onClick={() => handleZoom(1.4)} className="w-10 h-10 bg-gray-800/80 hover:bg-gray-700 text-white rounded-full flex items-center justify-center border border-gray-600 font-bold" title="Zoom Out">-</button>
            </div>
            <div className="flex flex-col items-center gap-1 bg-gray-900/50 p-2 rounded-xl border border-gray-700/50">
                <button onClick={() => handleRotate(0.2, 0)} className="w-8 h-6 bg-gray-800 hover:bg-gray-700 text-white rounded flex items-center justify-center text-xs">▲</button>
                <div className="flex gap-2">
                    <button onClick={() => handleRotate(0, 0.2)} className="w-8 h-6 bg-gray-800 hover:bg-gray-700 text-white rounded flex items-center justify-center text-xs">◀</button>
                    <button onClick={() => handleRotate(0, -0.2)} className="w-8 h-6 bg-gray-800 hover:bg-gray-700 text-white rounded flex items-center justify-center text-xs">▶</button>
                </div>
                <button onClick={() => handleRotate(-0.2, 0)} className="w-8 h-6 bg-gray-800 hover:bg-gray-700 text-white rounded flex items-center justify-center text-xs">▼</button>
            </div>
        </div>
        <button onClick={handleReset} className="w-12 h-12 bg-blue-600/90 hover:bg-blue-500 text-white rounded-full flex items-center justify-center border border-blue-400 shadow-lg shadow-blue-900/50 transition-all transform hover:scale-105" title="Reset View">⟳</button>
      </div>
    </div>
  );
};
