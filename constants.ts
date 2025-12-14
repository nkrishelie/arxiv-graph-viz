import { NodeType } from './types';

// Оставляем alias для совместимости, чтобы старые компоненты не ругались на NodeKind
export type NodeKind = NodeType; 

// Настройки 3D графа
export const GRAPH_CONFIG = {
  minZoom: 4,
  maxZoom: 4000,
  backgroundColor: '#000011', // Space dark blue
  nodeRelSize: 4,
  linkWidth: 1.5,
  particleWidth: 2
};

// Константы интерфейса
export const UI_CONSTANTS = {
  TRANSITION_DURATION: 300,
  SIDEBAR_WIDTH: 320
};
