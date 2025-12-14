export const GRAPH_CONFIG = {
  backgroundColor: '#000011',
  nodeRelSize: 4,
  linkWidth: 1, // Базовая ширина (будет умножаться на вес)
};

// Твоя новая палитра
export const CATEGORY_COLORS: Record<string, string> = {
  'math':    '#F6E05E', // Насыщенный солнечный желтый
  'cs':      '#ED8936', // Оранжевый
  'physics': '#48BB78', // Зеленый
  
  // Детализация физики (все будут зелеными оттенками или можно выделить)
  'astro':   '#38A169', // Dark Green
  'cond':    '#2F855A', // Forest Green
  'gr':      '#68D391', // Light Green
  'quant':   '#9AE6B4', // Pale Green
  
  // Остальные
  'stat':    '#63B3ED', // Blue (Statistics)
  'eess':    '#A0AEC0', // Gray (Engineering)
  'other':   '#718096'  // Dark Gray
};

// Человекочитаемые названия для фильтров
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
