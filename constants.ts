export const GRAPH_CONFIG = {
  backgroundColor: '#000011',
  nodeRelSize: 4,
  linkWidth: 1,
};

// ЧИСТАЯ ПАЛИТРА (Только реальные категории)
export const CATEGORY_COLORS: Record<string, string> = {
  // Основные группы
  'math':    '#FFD700', // Sunny Gold
  'cs':      '#ED8936', // Orange
  
  // Специфические разделы физики (Точные коды ArXiv)
  'quant-ph': '#FF4B4B', // Quantum Physics (Red)
  'astro-ph': '#4299E1', // Astrophysics (Blue)
  'gr-qc':    '#9F7AEA', // General Relativity (Purple)
  'cond-mat': '#D53F8C', // Condensed Matter (Pink)
  'hep-th':   '#F687B3', // High Energy Physics (Light Pink)
  
  // Общая физика (для physics.gen-ph, physics.bio-ph и т.д.)
  'physics': '#48BB78', // Green

  // Остальное
  'stat':    '#0BC5EA', // Cyan
  'eess':    '#A0AEC0', // Gray
  'other':   '#718096'
};

// Красивые названия для фильтров
export const CATEGORY_LABELS: Record<string, string> = {
  'math': 'Mathematics',
  'cs': 'Computer Science',
  'quant-ph': 'Quantum Physics',
  'astro-ph': 'Astrophysics',
  'gr-qc': 'General Relativity',
  'cond-mat': 'Condensed Matter',
  'hep-th': 'High Energy Physics',
  'physics': 'Physics (General)',
  'stat': 'Statistics',
  'eess': 'Electrical Eng.',
  'other': 'Other'
};
