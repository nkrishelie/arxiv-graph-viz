export const GRAPH_CONFIG = {
  backgroundColor: '#000011',
  nodeRelSize: 4,
  linkWidth: 1,
};

export const CATEGORY_COLORS: Record<string, string> = {
  // 1. Математика и CS (Оставляем как тебе понравилось)
  'math':    '#FFD700', // Sunny Gold
  'cs':      '#ED8936', // Orange

  // 2. ФИЗИКА (РАЗДЕЛЯЕМ ЦВЕТА)
  'physics': '#48BB78', // General Physics (Зеленый)
  
  // Твои запросы:
  'quant-ph': '#FF4B4B', // Quantum Physics -> RED (Neon Red)
  'quant':    '#FF4B4B', // (на случай короткого префикса)
  
  'astro-ph': '#4299E1', // Astrophysics -> BLUE (Bright Blue)
  'astro':    '#4299E1',
  
  'gr-qc':    '#9F7AEA', // General Relativity -> PURPLE
  'gr':       '#9F7AEA',
  
  'cond-mat': '#D53F8C', // Condensed Matter -> PINK (чтобы отличалась от остальных)
  'cond':     '#D53F8C',
  
  'hep-th':   '#F687B3', // High Energy Physics -> Light Pink/Red
  'hep-ph':   '#F687B3',
  'hep-ex':   '#F687B3',

  // 3. Остальное
  'stat':    '#0BC5EA', // Cyan
  'eess':    '#A0AEC0', // Gray
  'other':   '#718096'
};

export const CATEGORY_LABELS: Record<string, string> = {
  'math': 'Mathematics',
  'cs': 'Computer Science',
  'physics': 'Physics (General)',
  'quant-ph': 'Quantum Physics',
  'astro-ph': 'Astrophysics',
  'gr-qc': 'General Relativity',
  'cond-mat': 'Condensed Matter',
  'hep-th': 'High Energy Physics',
  'stat': 'Statistics',
  'eess': 'Electrical Eng.',
  'other': 'Other'
};
