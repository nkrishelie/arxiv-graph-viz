import React, { useRef, useEffect } from 'react';
import ForceGraph3D from 'react-force-graph-3d';
import SpriteText from 'three-spritetext';
import * as THREE from 'three';
import { GraphData, GraphNode, GraphLink, LinkType } from '../types';
import { DISCIPLINE_COLORS, LINK_COLORS, LINK_LABELS } from '../constants';
import { NavigationControls } from './NavigationControls';

interface Props {
  data: GraphData;
  onNodeClick: (node: GraphNode) => void;
  searchQuery: string;
  activeLanguage: string;
}

// Функция очистки LaTeX
const cleanLabel = (label: string): string => {
  if (!label) return '';
  return label
    .replace(/\$/g, '') 
    .replace(/\\mathbb{N}/g, 'ℕ')
    .replace(/\\mathbb{Z}/g, 'ℤ')
    .replace(/\\mathbb{Q}/g, 'ℚ')
    .replace(/\\mathbb{R}/g, 'ℝ')
    .replace(/\\mathbb{C}/g, 'ℂ')
    .replace(/\\mathbb{A}/g, '𝔸')
    .replace(/\\omega/g, 'ω')
    .replace(/\\aleph/g, 'ℵ')
    .replace(/\\varepsilon/g, 'ε')
    .replace(/\\Gamma/g, 'Γ')
    .replace(/\\Delta/g, 'Δ')
    .replace(/\\Sigma/g, 'Σ')
    .replace(/\\Pi/g, 'Π')
    .replace(/\\lambda/g, 'λ')
    .replace(/\\phi/g, 'φ')
    .replace(/\\vdash/g, '⊢')
    .replace(/\\forall/g, '∀')
    .replace(/\\exists/g, '∃')
    .replace(/\\to/g, '→')
    .replace(/\\leftrightarrow/g, '↔')
    .replace(/\\Rightarrow/g, '⇒')
    .replace(/\\Leftrightarrow/g, '⇔')
    .replace(/\\models/g, '⊨')
    .replace(/\\neg/g, '¬')
    .replace(/\\land/g, '∧')
    .replace(/\\lor/g, '∨')
    .replace(/\\square/g, '□')
    .replace(/\\diamond/g, '◇')
    .replace(/\\le/g, '≤')
    .replace(/\\ge/g, '≥')
    .replace(/\\ne/g, '≠')
    .replace(/\\neq/g, '≠')
    .replace(/\\times/g, '×')
    .replace(/\\cdot/g, '·')
    .replace(/\\in/g, '∈')
    .replace(/\\subset/g, '⊂')
    .replace(/\\subseteq/g, '⊆')
    .replace(/\\cup/g, '∪')
    .replace(/\\cap/g, '∩')
    .replace(/\\setminus/g, '\\')
    .replace(/\\bot/g, '⊥')
    .replace(/\\top/g, '⊤')
    .replace(/\\mathsf{([a-zA-Z0-9_]+)}/g, '$1')
    .replace(/\\mathbf{([a-zA-Z0-9_]+)}/g, '$1')
    .replace(/\\mathrm{([a-zA-Z0-9_]+)}/g, '$1')
    .replace(/\\text{([a-zA-Z0-9\s]+)}/g, '$1')
    .replace(/\^\{?([0-9a-z])\}?/g, '$1')
    .replace(/_0/g, '₀') 
    .replace(/_1/g, '₁')
    .replace(/_2/g, '₂')
    .replace(/_n/g, 'ₙ')
    .replace(/_k/g, 'ₖ')
    .replace(/\\/g, '')
    .trim();
};

export const GraphViewer: React.FC<Props> = ({ data, onNodeClick, searchQuery, activeLanguage }) => {
  const graphRef = useRef<any>(null);
  const isInited = useRef(false);

// === НАСТРОЙКА ФИЗИКИ И КАМЕРЫ ===
  useEffect(() => {
    // Если данных нет, ничего не делаем
    if (!data || data.nodes.length === 0) return;

    const fg = graphRef.current;
    if (!fg) return;

    // Мы применяем настройки ТОЛЬКО если это "свежий" граф (первая загрузка или смена языка).
    // Если isInited.current === true, значит это просто фильтрация, 
    // и мы не должны сбрасывать камеру или перезапускать физику.
    if (!isInited.current) {
      const timer = setTimeout(() => {
        // 1. Настройка сил (чтобы граф был широким)
        fg.d3Force('charge')?.strength(-150);
        fg.d3Force('link')?.distance((link: any) => {
          if (link.type === 'RELATED') return 90; 
          return 60; 
        });

        // 2. Ставим камеру далеко, чтобы избежать "взрыва" на весь экран
        fg.cameraPosition({ x: 0, y: 0, z: 1600 }); 
        
        // 3. Запускаем симуляцию
        fg.d3ReheatSimulation();
      }, 100);

      return () => clearTimeout(timer);
    }
    
    // При фильтрации (else) ничего делать не нужно —
    // библиотека сама плавно скроет/покажет узлы.

  }, [data, activeLanguage]); // Добавили activeLanguage для надежности
  
  // === ПОИСК И ФОКУСИРОВКА ===
  useEffect(() => {
    if (searchQuery && graphRef.current && data.nodes.length > 0) {
      const normalizeForSearch = (str: string) => {
        if (!str) return '';
        return str
          .toLowerCase()
          .replace(/\\mathbb{([a-z])}/g, '$1')
          .replace(/\\mathsf{([a-z0-9]+)}/g, '$1')
          .replace(/\\mathbf{([a-z0-9]+)}/g, '$1')
          .replace(/\\mathrm{([a-z0-9]+)}/g, '$1')
          .replace(/ℕ/g, 'n').replace(/ℤ/g, 'z').replace(/ℚ/g, 'q')
          .replace(/ℝ/g, 'r').replace(/ℂ/g, 'c').replace(/𝔸/g, 'a')
          .replace(/×/g, 'x')
          .replace(/[\$\\\{\}\s]/g, '')
          .replace(/\s/g, '');
      };

      const q = normalizeForSearch(searchQuery);
      const foundNode = data.nodes.find(n => {
        if (normalizeForSearch(n.id).includes(q)) return true;
        if (normalizeForSearch(n.label).includes(q)) return true;
        if (n.synonyms?.some(s => normalizeForSearch(s).includes(q))) return true;
        return false;
      });

      if (foundNode) {
        const nodeSize = foundNode.val || 1;
        const distance = nodeSize > 20 ? 60 : 40; 
        const distRatio = 1 + distance/Math.hypot(foundNode.x || 1, foundNode.y || 1, foundNode.z || 1);
        
        const targetPos = (foundNode.x || foundNode.y || foundNode.z) 
          ? { x: foundNode.x * distRatio, y: foundNode.y * distRatio, z: foundNode.z * distRatio }
          : { x: 0, y: 0, z: distance };

        graphRef.current.cameraPosition(
          targetPos,
          { x: foundNode.x, y: foundNode.y, z: foundNode.z },
          2000
        );
      }
    }
  }, [searchQuery, data]);

  // --- НАВИГАЦИЯ ---
  const handleRotate = (h: number, v: number) => {
    const fg = graphRef.current;
    if (!fg) return;
    const currentPos = fg.cameraPosition();
    const spherical = new THREE.Spherical();
    spherical.setFromVector3(new THREE.Vector3(currentPos.x, currentPos.y, currentPos.z));
    spherical.theta += h * 0.2; 
    spherical.phi += v * 0.2;
    spherical.makeSafe();
    const newPos = new THREE.Vector3().setFromSpherical(spherical);
    fg.cameraPosition({ x: newPos.x, y: newPos.y, z: newPos.z }, currentPos.lookAt, 400);
  };

  const handleZoom = (dir: number) => {
    const fg = graphRef.current;
    if (!fg) return;
    const currentPos = fg.cameraPosition();
    const factor = dir > 0 ? 1.4 : 0.7; 
    fg.cameraPosition(
      { x: currentPos.x * factor, y: currentPos.y * factor, z: currentPos.z * factor },
      currentPos.lookAt,
      400
    );
  };

  const handleReset = () => {
    // Возврат в исходную далекую позицию
    graphRef.current?.cameraPosition({ x: 0, y: 0, z: 1600 }, { x: 0, y: 0, z: 0 }, 1000);
  };
  
  if (!data || !data.nodes || data.nodes.length === 0) {
    return <div className="w-full h-full flex items-center justify-center text-white">Loading Graph...</div>;
  }

  return (
    <div className="relative w-full h-full">
      <ForceGraph3D
        // key={activeLanguage} <--- УБРАЛИ ЭТОТ КЛЮЧ!
        ref={graphRef}
        graphData={data}
        
        // Взаимодействие
        onNodeClick={(node: any) => {
          const distance = 40;
          const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);

          const newPos = (node.x || node.y || node.z)
            ? { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio }
            : { x: 0, y: 0, z: distance };

          graphRef.current.cameraPosition(
            newPos,
            { x: node.x, y: node.y, z: node.z },
            3000 
          );
          onNodeClick(node);
        }}

        // Оптимизация физики
        warmupTicks={50}
        cooldownTicks={50}
        d3VelocityDecay={0.2}
        d3AlphaDecay={0.05}
        
        // Колбек остановки: только для первой загрузки
        onEngineStop={() => {
            isInited.current = true;
        }}

        // Всплывашка
        nodeLabel={(node: any) => {
          const labelText = cleanLabel(node.label);
          return `
            <div class="px-3 py-1 bg-slate-900/90 border border-slate-600 rounded-lg shadow-xl backdrop-blur-sm">
              <div class="text-slate-100 font-medium text-sm whitespace-nowrap">
                ${labelText}
              </div>
            </div>
          `;
        }}

        // === НОВОЕ: Тултип для связей (с поддержкой кастомного текста) ===
        linkLabel={(link: any) => {
          // 1. Пытаемся взять кастомное описание из данных связи
          const customLabel = link.label;

          // 2. Если его нет, берем стандартное название типа
          const displayLabel = customLabel 
            ? customLabel 
            : (LINK_LABELS[link.type as LinkType]?.[activeLanguage as Language] || String(link.type));

          // Возвращаем HTML
          return `
            <div class="px-2 py-1 bg-black/80 border border-slate-700 rounded shadow-sm backdrop-blur-sm pointer-events-none">
              <div class="text-slate-200 text-[10px] uppercase tracking-wide font-semibold text-center">
                ${displayLabel}
              </div>
            </div>
          `;
        }}
        linkHoverPrecision={5}

        // Отрисовка узлов
        nodeThreeObject={(node: any) => {
          const color = DISCIPLINE_COLORS[node.group as any] || '#cccccc';
          const size = (node.val || 1);
          const isMain = size >= 20;
          
          const group = new THREE.Group();
          
          const radius = isMain ? Math.pow(size, 0.4) * 1.2 : Math.pow(size, 0.4) * 0.8 + 1.5; 
          const geometry = new THREE.SphereGeometry(radius, 16, 16); 
          
          const material = new THREE.MeshPhysicalMaterial({
            color: color,
            emissive: color,
            emissiveIntensity: isMain ? 0.7 : 0.1,
            roughness: 0.4,
            metalness: 0.1,
          });
          
          const sphere = new THREE.Mesh(geometry, material);
          group.add(sphere);

          // Текст
          const SpriteTextClass = (SpriteText as any).default || SpriteText;
          if (SpriteTextClass) {
            const cleanText = cleanLabel(node.label);
            const sprite = new SpriteTextClass(cleanText);
            
            sprite.color = color;
            sprite.textHeight = isMain ? 3 + (size / 10) : 1.5 + (size / 20);
            sprite.position.y = radius + sprite.textHeight * 0.6 + 1.0;
            
            sprite.backgroundColor = '#00000080';
            sprite.padding = 1;
            sprite.borderRadius = 3;
            sprite.material.depthTest = false;
            sprite.material.depthWrite = false;
            sprite.renderOrder = 999;
            
            group.add(sprite);
          }
          return group;
        }}

        // Настройки связей
        linkColor={(link: any) => LINK_COLORS[link.type as LinkType] || '#ffffff'}
        linkWidth={(link: any) => link.type === LinkType.RELATED ? 0.3 : 1.5}

        // Частицы: Отключаем для EQUIVALENT и RELATED, чтобы убрать направленность
        linkDirectionalParticles={(link: any) => (link.type === LinkType.RELATED || link.type === LinkType.EQUIVALENT) ? 0 : 2}
        linkDirectionalParticleSpeed={0.005}
        linkDirectionalParticleWidth={(link: any) => (link.type === LinkType.RELATED || link.type === LinkType.EQUIVALENT) ? 0 : 1.5}

        // Стрелки: Отключаем для EQUIVALENT и RELATED, чтобы убрать направленность
        linkDirectionalArrowLength={(link: any) => {
          if (link.type === LinkType.EQUIVALENT || link.type === LinkType.RELATED) return 0;
          return 4;
        }}
        linkDirectionalArrowRelPos={1}
        
        backgroundColor="#000005"
        showNavInfo={false}
        controlType="trackball"
        enableNodeDrag={true}
      />
      
      <NavigationControls 
        onRotate={handleRotate}
        onZoom={handleZoom}
        onReset={handleReset}
      />
    </div>
  );
};


const getNodeColor = (node: any) => {
  if (node.cluster === 'ADJACENT') return '#9370DB';
  if (node.cluster === 'OTHER') return '#808080';

  if (node.type === 'article') {
     if (node.cluster && node.cluster !== 'ADJACENT' && node.cluster !== 'OTHER') {
        return d3.schemeCategory10[parseInt(node.cluster) % 10] || '#3182CE'; // Или используй d3.scaleOrdinal
     }
     return '#A9A9A9';
  }
  return '#3182CE'; // Цвет по умолчанию или d3 scale по id
};
