export const GRAPH_CONFIG = {
  backgroundColor: '#000011',
  nodeRelSize: 4,
  linkWidth: 1,
};

// Исправленная палитра (Математика = ЖЕЛТЫЙ)
export const CATEGORY_COLORS: Record<string, string> = {
  'math':    '#FFD700', // <-- SUNNY GOLD (Было #3182CE по ошибке в описании, в коде теперь точно желтый)
  'cs':      '#ED8936', // Orange
  'physics': '#48BB78', // Green
  
  // Детализация физики (оттенки зеленого/мятного)
  'astro':   '#38A169', 
  'cond':    '#2F855A', 
  'gr':      '#68D391', 
  'quant':   '#9AE6B4', 
  
  // Остальные
  'stat':    '#63B3ED', // Blue
  'eess':    '#A0AEC0', // Gray
  'other':   '#718096'
};

export const CATEGORY_LABELS: Record<string, string> = {
  'math': 'Mathematics',
  'cs': 'Computer Science',
  'physics': 'Physics (General)',
  'astro': 'Astrophysics',
  'cond': 'Condensed Matter',
  'gr': 'General Relativity',
  'quant': 'Quantum Physics',
  'stat': 'Statistics',
  'eess': 'Electrical Eng.',
  'other': 'Other'
};
