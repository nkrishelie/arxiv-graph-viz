export type NodeType =
  | 'discipline'           // Основные дисциплины
  | 'adjacent_discipline'  // Смежные и заглушки
  | 'article';             // Статьи

export type LinkType =
  | 'CONTAINS'
  | 'RELATED'
  | 'DEPENDS';

export interface GraphNode {
  id: string;
  label: string;
  type: NodeType;
  val: number;
  // Новые поля:
  description?: string;
  cluster?: string;
  group?: string;
  primary_category?: string;
  authors?: string[];
  url?: string;
  tags?: string[];
}

export interface GraphLink {
  source: string | GraphNode;
  target: string | GraphNode;
  type: LinkType;
  label?: string;
  val?: number;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
  meta?: {
    total_papers: number; // Теперь это число статей за 365 дней
  };
}
