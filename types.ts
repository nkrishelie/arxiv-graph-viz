export enum Discipline {
  LOGIC = 'Mathematical Logic',
  SET_THEORY = 'Set Theory',
  MODEL_THEORY = 'Model Theory',
  COMPUTABILITY = 'Computability Theory',
  ALGEBRA = 'General Algebra',
  PROOF_THEORY = 'Proof Theory',
  TOPOLOGY = 'Topology',
  ORDER_THEORY = 'Order Theory & Lattices',
  //FOUNDATIONS = 'Foundations & Maglish'
}

// НОВОЕ: Род узла для строгой онтологии
export enum NodeKind {
  DISCIPLINE = 'Discipline', // Корневые разделы
  THEORY = 'Theory',         // Формальные теории (ZFC, PA)
  STRUCTURE = 'Structure',   // Модели, кольца, поля (N, R, Stone Space)
  CONCEPT = 'Concept',       // Определения, методы (Идеал, Ранг, Тип)
  THEOREM = 'Theorem'        // Утверждения, леммы, аксиомы (Цермело, Гёдель)
}

export enum LinkType {
  EXTENDS = 'Extends/Generalizes',
  PROVES = 'Proves/Implies',
  MODELS = 'Models/Interprets',
  EQUIVALENT = 'Equivalent To',
  CONTAINS = 'Contains/Uses',
  RELATED = 'Related To'
}

export type Language = 'en' | 'ru';

export interface GraphNode {
  id: string;
  label: string;
  group: Discipline;
  kind?: NodeKind;
  description: string;
  details?: string[]; 
  synonyms?: string[]; 
  val?: number; 
  x?: number;
  y?: number;
  z?: number;
}

export interface GraphLink {
  source: string;
  target: string;
  type: LinkType;
  label?: string;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}
