import { Discipline, LinkType, Language, NodeKind } from './types';

// Цвета для дисциплин (групп) - Насыщенная палитра
export const DISCIPLINE_COLORS: Record<Discipline, string> = {
  [Discipline.SET_THEORY]: '#EF4444',   // Red
  [Discipline.MODEL_THEORY]: '#22C55E', // Green
  [Discipline.LOGIC]: '#3B82F6',        // Blue
  [Discipline.ALGEBRA]: '#EAB308',      // Yellow
  [Discipline.TOPOLOGY]: '#F97316',     // Orange
  [Discipline.PROOF_THEORY]: '#A855F7', // Violet
  [Discipline.COMPUTABILITY]: '#FFFFFF',// White
  [Discipline.ORDER_THEORY]: '#84CC16', // Lime
  //[Discipline.FOUNDATIONS]: '#94A3B8',  // Slate
};

// Цвета для связей (согласованные с дисциплинами)
export const LINK_COLORS: Record<LinkType, string> = {
  [LinkType.PROVES]: '#3B82F6',     // Blue (Logic: Доказательство)
  [LinkType.EXTENDS]: '#EF4444',    // Red (Sets: Расширение)
  [LinkType.MODELS]: '#22C55E',     // Green (Models: Моделирование)
  [LinkType.EQUIVALENT]: '#EAB308', // Yellow (Algebra: Изоморфизм)
  [LinkType.CONTAINS]: '#A855F7',   // Violet (Включение / Состав)
  [LinkType.RELATED]: '#64748B',    // Slate (Нейтральная связь)
};

// Локализация дисциплин
export const DISCIPLINE_LABELS: Record<Discipline, Record<Language, string>> = {
  [Discipline.LOGIC]: { en: 'Logic', ru: 'Логика' },
  [Discipline.SET_THEORY]: { en: 'Set Theory', ru: 'Теория Множеств' },
  [Discipline.MODEL_THEORY]: { en: 'Model Theory', ru: 'Теория Моделей' },
  [Discipline.COMPUTABILITY]: { en: 'Computability', ru: 'Теория вычислимости' },
  [Discipline.ALGEBRA]: { en: 'Algebra', ru: 'Алгебра' },
  [Discipline.PROOF_THEORY]: { en: 'Proof Theory', ru: 'Теория Доказательств' },
  [Discipline.TOPOLOGY]: { en: 'Topology', ru: 'Топология' },
  [Discipline.ORDER_THEORY]: { en: 'Order Theory', ru: 'Теория Порядков' },
  //[Discipline.FOUNDATIONS]: { en: 'Foundations', ru: 'Основания' },
};

// Локализация типов узлов (Род)
export const KIND_LABELS: Record<NodeKind, Record<Language, string>> = {
  [NodeKind.DISCIPLINE]: { en: 'Discipline', ru: 'Раздел' },
  [NodeKind.THEORY]: { en: 'Formal theory', ru: 'Формальная теория' },
  [NodeKind.STRUCTURE]: { en: 'Structure / Model', ru: 'Структура / Модель' },
  [NodeKind.CONCEPT]: { en: 'Concept', ru: 'Понятие' },
  [NodeKind.THEOREM]: { en: 'Theorem', ru: 'Теорема' },
};

// Локализация типов связей
export const LINK_LABELS: Record<LinkType, Record<Language, string>> = {
  [LinkType.EXTENDS]: { en: 'Extends', ru: 'Расширяет' },
  [LinkType.PROVES]: { en: 'Proves / Implies', ru: 'Доказывает / Влечет' },
  [LinkType.MODELS]: { en: 'Models / Interprets', ru: 'Моделирует / Реализует' },
  [LinkType.EQUIVALENT]: { en: 'Equivalent / Isomorphic', ru: 'Эквивалентно / Изоморфно' },
  [LinkType.CONTAINS]: { en: 'Contains / Includes', ru: 'Содержит / Включает' },
  [LinkType.RELATED]: { en: 'Related to', ru: 'Связано с' },
};
