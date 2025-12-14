import React, { useState, useEffect, useMemo, useRef } from 'react';
import { GraphNode, GraphLink, Discipline, LinkType, Language, NodeKind } from '../types';
import { DISCIPLINE_COLORS, LINK_COLORS, DISCIPLINE_LABELS, LINK_LABELS, KIND_LABELS } from '../constants';
import Latex from 'react-latex-next';

const cleanForSearch = (str: string) => {
  if (!str) return '';
  return str
    .replace(/\$/g, '')
    .replace(/\\mathbb{([a-z])}/gi, '$1')
    .replace(/\\mathsf{([a-z0-9]+)}/gi, '$1')
    .replace(/\\mathbf{([a-z0-9]+)}/gi, '$1')
    .replace(/\\mathrm{([a-z0-9]+)}/gi, '$1')
    .replace(/\\/g, '')
    .trim();
};

const escapeCsv = (str: string) => {
  if (!str) return '';
  const result = str.replace(/"/g, '""');
  if (result.search(/("|,|\n)/g) >= 0) {
    return `"${result}"`;
  }
  return result;
};

const normalize = (str: string) => str.toLowerCase().replace(/\s/g, '');

interface Props {
  nodes: GraphNode[];
  links: GraphLink[];
  selectedNode: GraphNode | null;
  onSearch: (query: string) => void;
  onCloseSidebar: () => void;
  currentLang: Language;
  onToggleLang: (lang: Language) => void;
  
  hiddenGroups: Set<Discipline>;
  onToggleGroup: (group: Discipline) => void;

  hiddenKinds: Set<NodeKind>;
  onToggleKind: (kind: NodeKind) => void;
}

export const UIOverlay: React.FC<Props> = ({ 
  nodes,
  links,
  selectedNode, 
  onSearch, 
  onCloseSidebar,
  currentLang,
  onToggleLang,
  hiddenGroups,
  onToggleGroup,
  hiddenKinds,
  onToggleKind
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isLegendOpen, setIsLegendOpen] = useState(true);
  const [filteredNodes, setFilteredNodes] = useState<GraphNode[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // --- Draggable Logic State ---
  const [position, setPosition] = useState({ x: -1, y: 100 }); 
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedNode && position.x === -1) {
       setPosition({ x: window.innerWidth - 520, y: 100 });
    }
  }, [selectedNode]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (cardRef.current && e.button === 0) { 
      setIsDragging(true);
      const rect = cardRef.current.getBoundingClientRect();
      dragStartRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
      e.stopPropagation(); 
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newX = Math.max(0, Math.min(window.innerWidth - 500, e.clientX - dragStartRef.current.x));
        const newY = Math.max(0, Math.min(window.innerHeight - 100, e.clientY - dragStartRef.current.y));
        setPosition({ x: newX, y: newY });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  // --- End Draggable Logic ---

  const activeDisciplines = useMemo(() => {
    return new Set(nodes.map(n => n.group));
  }, [nodes]);

  const activeKinds = useMemo(() => {
    return new Set(nodes.filter(n => n.kind).map(n => n.kind!));
  }, [nodes]);

  // --- Neighbors (Connected Nodes) Calculation ---
  const visibleNeighbors = useMemo(() => {
    if (!selectedNode) return [];

    const neighborIds = new Set<string>();

    links.forEach(l => {
      const sourceId = typeof l.source === 'object' ? (l.source as any).id : l.source;
      const targetId = typeof l.target === 'object' ? (l.target as any).id : l.target;

      let otherId: string | null = null;
      if (sourceId === selectedNode.id) otherId = targetId;
      else if (targetId === selectedNode.id) otherId = sourceId;

      if (otherId) neighborIds.add(otherId);
    });

    return nodes
      .filter(n => neighborIds.has(n.id))
      .filter(n => {
        const isGroupHidden = hiddenGroups.has(n.group);
        const isKindHidden = n.kind ? hiddenKinds.has(n.kind) : false;
        return !isGroupHidden && !isKindHidden;
      })
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [selectedNode, links, nodes, hiddenGroups, hiddenKinds]);

  const handleExport = () => {
    const nodesHeader = ['ID', 'Label', 'Group', 'Kind', 'Description', 'Details'];
    const nodesRows = nodes.map(n => [
      n.id,
      cleanForSearch(n.label),
      DISCIPLINE_LABELS[n.group][currentLang],
      n.kind ? KIND_LABELS[n.kind][currentLang] : '',
      cleanForSearch(n.description),
      n.details ? n.details.map(cleanForSearch).join('; ') : ''
    ]);
    
    const nodesCsvContent = [
      nodesHeader.join(','),
      ...nodesRows.map(row => row.map(escapeCsv).join(','))
    ].join('\n');

    const linksHeader = ['Source ID', 'Target ID', 'Relation Type'];
    const linksRows = links.map((l: any) => [
      typeof l.source === 'object' ? l.source.id : l.source,
      typeof l.target === 'object' ? l.target.id : l.target,
      LINK_LABELS[l.type as LinkType][currentLang]
    ]);

    const linksCsvContent = [
      linksHeader.join(','),
      ...linksRows.map(row => row.map(escapeCsv).join(','))
    ].join('\n');

    downloadFile(nodesCsvContent, `math_nexus_nodes_${currentLang}.csv`);
    downloadFile(linksCsvContent, `math_nexus_links_${currentLang}.csv`);
  };

  const downloadFile = (content: string, fileName: string) => {
    const blob = new Blob(['\uFEFF' + content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    if (!inputValue || inputValue.length < 2) {
      setFilteredNodes([]);
      setShowDropdown(false);
      return;
    }
    const q = normalize(inputValue);
    const results = nodes.filter(n => {
      if (normalize(n.id).includes(q)) return true;
      const labelClean = normalize(cleanForSearch(n.label));
      if (labelClean.includes(q)) return true;
      if (n.synonyms?.some(s => normalize(s).includes(q))) return true;
      if (normalize(cleanForSearch(n.description)).includes(q)) return true;
      return false;
    });
    setFilteredNodes(results.slice(0, 50));
    setShowDropdown(true);
  }, [inputValue, nodes]);

  const handleSelectNode = (node: GraphNode) => {
    setInputValue(cleanForSearch(node.label)); 
    setShowDropdown(false);
    onSearch(node.id);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (filteredNodes.length > 0) {
        handleSelectNode(filteredNodes[0]);
      } else {
        onSearch(inputValue);
      }
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 overflow-hidden">
      {/* Top Bar */}
      <div className="pointer-events-none w-full flex flex-col md:flex-row gap-4 items-start md:items-center justify-between relative z-30">
        <div className="w-full max-w-md relative pointer-events-auto">
          <h1 className="text-3xl font-bold text-white drop-shadow-lg tracking-tight mb-2">
            MathLogic <span className="text-blue-400">Nexus</span>
          </h1>
          <div className="relative">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => inputValue.length >= 2 && setShowDropdown(true)}
              onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
              placeholder={currentLang === 'en' ? "Search..." : "Поиск..."}
              className="w-full px-4 py-2 bg-slate-800/90 text-white border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400 backdrop-blur-md shadow-xl"
            />
            {/* Dropdown Results */}
            {showDropdown && filteredNodes.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl z-50 max-h-[60vh] overflow-y-auto custom-scrollbar">
                {filteredNodes.map((node) => {
                  const isGroupHidden = hiddenGroups.has(node.group);
                  const isKindHidden = node.kind ? hiddenKinds.has(node.kind) : false;
                  const isHidden = isGroupHidden || isKindHidden;

                  const groupLabel = DISCIPLINE_LABELS[node.group][currentLang];
                  const kindLabel = node.kind ? KIND_LABELS[node.kind][currentLang] : '';
                  const metaInfo = `[${groupLabel}${kindLabel ? `, ${kindLabel}` : ''}]`;

                  return (
                    <div
                      key={node.id}
                      onClick={() => {
                        if (!isHidden) handleSelectNode(node);
                      }}
                      className={`
                        px-4 py-2 border-b border-slate-800 last:border-0 flex items-center justify-between group transition-all
                        ${isHidden 
                          ? 'opacity-50 cursor-not-allowed grayscale'
                          : 'cursor-pointer hover:bg-slate-700'
                        }
                      `}
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        <span 
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ backgroundColor: DISCIPLINE_COLORS[node.group] }}
                        />
                        <span className={`text-sm truncate transition-colors ${isHidden ? 'text-slate-500' : 'text-slate-200 group-hover:text-white'}`}>
                          <Latex>{node.label}</Latex>
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 ml-2 flex-shrink-0 uppercase tracking-wide">
                        {metaInfo}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-2 pointer-events-auto">
          {/* Telegram Link (Fixed Icon) */}
          <a 
            href="https://t.me/mathreisender_geschwaetz" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-center px-3 py-1.5 bg-slate-800/80 border border-slate-600 rounded-lg hover:bg-blue-600 text-slate-300 hover:text-white transition-all backdrop-blur-md group"
            title={currentLang === 'en' ? "Join Telegram Channel" : "Телеграм-канал"}
          >
            <svg 
              viewBox="0 0 24 24" 
              fill="currentColor" 
              className="w-5 h-5 transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform"
            >
               <path d="M20.665 3.717l-17.73 6.837c-1.21.486-1.203 1.161-.222 1.462l4.552 1.42l10.532-6.645c.498-.303.953-.14.579.192l-8.533 7.701h-.002l.002.001l-.314 4.692c.46 0 .663-.211.921-.46l2.211-2.15l4.599 3.397c.848.467 1.457.227 1.668-.785l3.019-14.228c.309-1.239-.473-1.8-1.282-1.434z"/>
            </svg>
          </a>
          <button onClick={handleExport} className="flex items-center justify-center px-3 py-1.5 bg-slate-800/80 border border-slate-600 rounded-lg hover:bg-blue-600 text-slate-300 hover:text-white transition-all backdrop-blur-md" title={currentLang === 'en' ? "Export CSV" : "Экспорт CSV"}>
            <span className="text-lg">💾</span>
          </button>
          <div className="flex space-x-2 bg-slate-900/80 p-1.5 rounded-lg border border-slate-700 backdrop-blur-md">
            <button onClick={() => onToggleLang('ru')} className={`px-3 py-1.5 rounded-md text-xl transition-all ${currentLang === 'ru' ? 'bg-slate-700 shadow-md scale-105 grayscale-0' : 'grayscale opacity-50 hover:opacity-100'}`}>🇷🇺</button>
            <button onClick={() => onToggleLang('en')} className={`px-3 py-1.5 rounded-md text-xl transition-all ${currentLang === 'en' ? 'bg-slate-700 shadow-md scale-105 grayscale-0' : 'grayscale opacity-50 hover:opacity-100'}`}>🇺🇸</button>
          </div>
        </div>
      </div>
      
      {/* Legend */}
      <div className="pointer-events-auto absolute top-24 right-4 max-h-[90vh] overflow-y-auto custom-scrollbar z-20">
        <div className={`bg-slate-900/80 backdrop-blur-md border border-slate-700 rounded-lg transition-all duration-300 ${isLegendOpen ? 'p-4' : 'p-2'}`}>
          <div className="flex items-center justify-between cursor-pointer gap-4" onClick={() => setIsLegendOpen(!isLegendOpen)}>
            <h3 className={`font-semibold text-slate-200 ${!isLegendOpen && 'hidden'}`}>{currentLang === 'en' ? 'Legend' : 'Легенда'}</h3>
            <span className="text-slate-400 text-sm">{isLegendOpen ? '▼' : '▲'}</span>
          </div>
          
          {isLegendOpen && (
            <div className="mt-3 space-y-4">
              
              {/* Disciplines */}
              <div>
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 border-b border-slate-700 pb-1">{currentLang === 'en' ? 'Disciplines' : 'Разделы'}</h4>
                <div className="space-y-1.5">
                  {(Object.keys(DISCIPLINE_COLORS) as Discipline[])
                    .filter(disc => activeDisciplines.has(disc))
                    .map((disc) => {
                      const isHidden = hiddenGroups.has(disc);
                      return (
                        <div 
                          key={disc} 
                          className={`flex items-center space-x-2 cursor-pointer transition-opacity duration-200 ${isHidden ? 'opacity-40 grayscale' : 'opacity-100 hover:opacity-80'}`}
                          onClick={() => onToggleGroup(disc)}
                        >
                          <span 
                            className={`w-3 h-3 rounded-full flex-shrink-0 ${isHidden ? 'border border-slate-500' : 'shadow-glow'}`} 
                            style={{ 
                              backgroundColor: isHidden ? 'transparent' : DISCIPLINE_COLORS[disc], 
                              boxShadow: isHidden ? 'none' : `0 0 6px ${DISCIPLINE_COLORS[disc]}` 
                            }}
                          ></span>
                          <span className={`text-xs text-slate-300 leading-tight ${isHidden ? 'line-through decoration-slate-500' : ''}`}>
                            {DISCIPLINE_LABELS[disc][currentLang]}
                          </span>
                        </div>
                      );
                  })}
                </div>
              </div>

              {/* Node Kinds */}
              <div>
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 border-b border-slate-700 pb-1">{currentLang === 'en' ? 'Node Types' : 'Типы Узлов'}</h4>
                <div className="space-y-1.5">
                  {(Object.values(NodeKind) as NodeKind[])
                    .filter(kind => activeKinds.has(kind))
                    .map((kind) => {
                      const isHidden = hiddenKinds.has(kind);
                      return (
                        <div 
                          key={kind} 
                          className={`flex items-center space-x-2 cursor-pointer transition-opacity duration-200 ${isHidden ? 'opacity-40' : 'opacity-100 hover:opacity-80'}`}
                          onClick={() => onToggleKind(kind)}
                        >
                          <span 
                            className={`w-3 h-3 rounded-sm flex-shrink-0 border flex items-center justify-center`}
                            style={{
                              borderColor: isHidden ? '#64748b' : '#94a3b8',
                              backgroundColor: isHidden ? 'transparent' : '#475569'
                            }}
                          >
                            {!isHidden && <span className="block w-1.5 h-1.5 bg-blue-400 rounded-[1px]"></span>}
                          </span>
                          <span className={`text-xs text-slate-300 leading-tight ${isHidden ? 'line-through decoration-slate-500' : ''}`}>
                            {KIND_LABELS[kind][currentLang]}
                          </span>
                        </div>
                      );
                  })}
                </div>
              </div>

              {/* Relations */}
              <div>
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 border-b border-slate-700 pb-1">{currentLang === 'en' ? 'Relations' : 'Связи'}</h4>
                <div className="space-y-1.5">
                  {(Object.values(LinkType) as LinkType[]).map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <div className="flex items-center w-8 flex-shrink-0">
                        <div className="h-[2px] w-full" style={{ backgroundColor: LINK_COLORS[type] }}></div>
                      </div>
                      <span className="text-xs text-slate-300 leading-tight">{LINK_LABELS[type][currentLang]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Detail Sidebar - DRAGGABLE & WIDER */}
      {selectedNode && (
        <div 
          ref={cardRef}
          className="pointer-events-auto absolute bg-slate-900/95 backdrop-blur-xl border border-slate-700 rounded-xl shadow-2xl flex flex-col z-40 w-[95vw] md:w-[500px]"
          style={{
            left: position.x >= 0 ? position.x : undefined,
            top: position.y,
            right: position.x === -1 ? 16 : undefined,
            maxHeight: '80vh'
          }}
        >
          {/* Header (Drag Handle) */}
          <div 
            className={`p-4 border-b border-slate-700 flex justify-between items-start select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
            onMouseDown={handleMouseDown}
          >
             <h2 className="text-2xl font-bold text-white leading-tight pointer-events-none select-text">
                <Latex>{selectedNode.label}</Latex>
              </h2>
              <button 
                onClick={onCloseSidebar} 
                className="text-slate-400 hover:text-white transition-colors p-1 ml-4 flex-shrink-0"
                onMouseDown={(e) => e.stopPropagation()} 
              >
                ✕
              </button>
          </div>

          <div className="p-6 overflow-y-auto flex-1 custom-scrollbar cursor-auto">
            
            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-3 mb-6 text-sm text-slate-400 font-medium">
              <div className="flex items-center gap-2">
                <span 
                  className="w-2 h-2 rounded-full" 
                  style={{ 
                    backgroundColor: DISCIPLINE_COLORS[selectedNode.group],
                    boxShadow: `0 0 6px ${DISCIPLINE_COLORS[selectedNode.group]}`
                  }}
                />
                <span className="uppercase tracking-wide text-xs">
                  {DISCIPLINE_LABELS[selectedNode.group][currentLang]}
                </span>
              </div>

              {selectedNode.kind && (
                <>
                  <span className="text-slate-600">/</span>
                  <span className="uppercase tracking-wide text-xs">
                    {KIND_LABELS[selectedNode.kind][currentLang]}
                  </span>
                </>
              )}
            </div>
            
            {/* Description */}
            <div className="text-slate-300 leading-relaxed mb-6 text-sm">
              <Latex>{selectedNode.description}</Latex>
            </div>

            {/* Key Concepts */}
            {selectedNode.details && selectedNode.details.length > 0 && (
              <div className="space-y-3 mb-6">
                <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider border-b border-slate-700 pb-1">
                  {currentLang === 'en' ? 'Key Concepts' : 'Ключевые понятия'}
                </h3>
                <ul className="space-y-2">
                  {selectedNode.details.map((detail, idx) => (
                    <li key={idx} className="flex items-start space-x-2 bg-slate-800/50 p-2.5 rounded-md border border-slate-700/50">
                      <span className="text-blue-400 mt-0.5 text-xs">●</span>
                      <span className="text-sm text-slate-200 leading-snug">
                        <Latex>{detail}</Latex>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Connected Nodes (Updated Layout) */}
            {visibleNeighbors.length > 0 && (
              <div className="space-y-3">
                 <h3 className="text-xs font-bold text-emerald-500 uppercase tracking-wider border-b border-slate-700 pb-1">
                  {currentLang === 'en' ? 'Related Nodes' : 'Связанные узлы'}
                </h3>
                <div className="">
                  {visibleNeighbors.map(node => {
                    const groupLabel = DISCIPLINE_LABELS[node.group][currentLang];
                    const kindLabel = node.kind ? KIND_LABELS[node.kind][currentLang] : '';
                    const metaInfo = `[${groupLabel}${kindLabel ? `, ${kindLabel}` : ''}]`;
                    
                    return (
                      <div 
                        key={node.id}
                        onClick={() => handleSelectNode(node)}
                        className="px-2 py-2 border-b border-slate-800 last:border-0 flex items-center justify-between group transition-all cursor-pointer hover:bg-slate-800"
                      >
                         <div className="flex items-center gap-2 overflow-hidden">
                           <span 
                             className="w-2 h-2 rounded-full flex-shrink-0"
                             style={{ backgroundColor: DISCIPLINE_COLORS[node.group] }}
                           />
                           <span className="text-sm truncate text-slate-200 group-hover:text-white transition-colors">
                             <Latex>{node.label}</Latex>
                           </span>
                         </div>
                         <span className="text-[10px] text-slate-500 ml-2 flex-shrink-0 uppercase tracking-wide">
                           {metaInfo}
                         </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>
          <div className="p-3 border-t border-slate-800 bg-slate-900/80 text-center text-[10px] text-slate-500 uppercase tracking-widest cursor-pointer hover:text-slate-300 transition-colors rounded-b-xl" onClick={onCloseSidebar}>
            {currentLang === 'en' ? 'Close Panel' : 'Закрыть'}
          </div>
        </div>
      )}
    </div>
  );
};
