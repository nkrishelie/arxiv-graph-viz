import { NodeType } from './types';

export const GRAPH_CONFIG = {
  backgroundColor: '#000011',
  nodeRelSize: 6, // Узлы чуть крупнее, раз нет текста
  linkWidth: 1,
};

// Цвета для основных разделов ArXiv (по префиксам)
export const CATEGORY_COLORS: Record<string, string> = {
  'math':    '#3182CE', // Blue (Mathematics)
  'cs':      '#38A169', // Green (Computer Science)
  'physics': '#805AD5', // Purple (Physics generally)
  'ph':      '#805AD5', // Physics (short)
  'astro':   '#D69E2E', // Gold (Astrophysics)
  'cond':    '#D53F8C', // Pink (Condensed Matter)
  'gr':      '#E53E3E', // Red (General Relativity)
  'quant':   '#00B5D8', // Cyan (Quantum)
  'stat':    '#ED8936', // Orange (Statistics)
  'eess':    '#718096', // Gray (Electrical Eng)
  'other':   '#A0AEC0'  // Default
};

// Цвета для типов узлов (если не подошла категория)
export const TYPE_COLORS: Record<string, string> = {
  'article': '#FFFFFF', // Статьи по умолчанию белые (но мы их перекрасим по родителю)
  'discipline': '#ECC94B',
  'adjacent_discipline': '#9F7AEA'
};
