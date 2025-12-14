import { GraphData, Discipline, LinkType, Language, NodeKind } from '../types';

interface LocalizedContent {
  label: string;
  description: string;
  details: string[];
}

interface NodeDefinition {
  group: Discipline;
  kind: NodeKind; // <-- Added Kind
  val: number;
  synonyms?: string[];
  content: Record<Language, LocalizedContent>;
}

const RAW_NODES: Record<string, NodeDefinition> = {
  // ==========================================
  // 1. DISCIPLINES (Корневые разделы)
  // ==========================================
  'math_lang': {
    group: Discipline.LOGIC,
    kind: NodeKind.DISCIPLINE,
    val: 30,
    synonyms: ['Язык математики', 'Маглиш', 'Math Language', 'Syntax'],
    content: {
      en: { label: 'Logic', description: 'The syntactic and semantic framework used to express mathematical concepts.', details: ['Syntax vs. Semantics', 'Matryoshka Principle', 'First-order Languages'] },
      ru: { label: 'Логика', description: 'Синтаксический и семантический каркас для выражения математических понятий.', details: ['Синтаксис и Семантика', 'Принцип Матрешки', 'Языки первого порядка'] }
    }
  },
  'set_theory': {
    group: Discipline.SET_THEORY,
    kind: NodeKind.DISCIPLINE,
    val: 30,
    synonyms: ['Теория множеств', 'Set Theory', 'Cantor\'s Paradise'],
    content: {
      en: { label: 'Set Theory', description: 'The mathematical theory of well-defined collections of objects.', details: ['ZFC Axioms', 'Cardinals', 'Ordinals'] },
      ru: { label: 'Теория множеств', description: 'Математическая теория совокупностей объектов.', details: ['Аксиомы ZFC', 'Кардиналы', 'Ординалы'] }
    }
  },
  'model_theory': {
    group: Discipline.MODEL_THEORY,
    kind: NodeKind.DISCIPLINE,
    val: 30,
    synonyms: ['Теория моделей', 'Model Theory', 'Semantics'],
    content: {
      en: { label: 'Model Theory', description: 'The study of the relationship between formal theories and their models.', details: ['Satisfiability', 'Elementary Equivalence', 'Definability'] },
      ru: { label: 'Теория моделей', description: 'Изучение связи между формальными теориями и их моделями.', details: ['Выполнимость', 'Элементарная эквивалентность', 'Определимость'] }
    }
  },
  'proof_theory': {
    group: Discipline.PROOF_THEORY,
    kind: NodeKind.DISCIPLINE,
    val: 30,
    synonyms: ['Теория доказательств', 'Proof Theory', 'Meta-mathematics'],
    content: {
      en: { label: 'Proof Theory', description: 'The study of proofs as formal mathematical objects.', details: ['Structural Proof Theory', 'Ordinal Analysis', 'Automated Reasoning'] },
      ru: { label: 'Теория доказательств', description: 'Изучение доказательств как формальных математических объектов.', details: ['Структурная теория', 'Ординальный анализ', 'Автоматический вывод'] }
    }
  },
  'comp_theory': {
    group: Discipline.COMPUTABILITY,
    kind: NodeKind.DISCIPLINE,
    val: 30,
    synonyms: ['Теория вычислимости', 'Computability', 'Recursion Theory'],
    content: {
      en: { label: 'Computability Theory', description: 'The study of computable functions and degrees of unsolvability.', details: ['Turing Machines', 'Decidability', 'Complexity'] },
      ru: { label: 'Теория вычислимости', description: 'Изучение вычислимых функций и степеней неразрешимости.', details: ['Машины Тьюринга', 'Разрешимость', 'Сложность'] }
    }
  },
  'algebra_discipline': {
    group: Discipline.ALGEBRA,
    kind: NodeKind.DISCIPLINE,
    val: 30,
    synonyms: ['Общая алгебра', 'General Algebra', 'Abstract Algebra'],
    content: {
      en: { label: 'General Algebra', description: 'The study of algebraic structures and their properties.', details: ['Groups', 'Rings', 'Fields', 'Universal Algebra'] },
      ru: { label: 'Общая алгебра', description: 'Изучение алгебраических структур и их свойств.', details: ['Группы', 'Кольца', 'Поля', 'Универсальная алгебра'] }
    }
  },
  'topology': {
    group: Discipline.TOPOLOGY,
    kind: NodeKind.DISCIPLINE,
    val: 30,
    synonyms: ['Топология', 'Topology', 'General Topology'],
    content: {
      en: { label: 'General Topology', description: 'The study of properties preserved through deformations, twisting, and stretching.', details: ['Open Sets', 'Continuity', 'Compactness'] },
      ru: { label: 'Общая топология', description: 'Изучение свойств, сохраняющихся при деформациях.', details: ['Открытые множества', 'Непрерывность', 'Компактность'] }
    }
  },
  // ==========================================
  // 2. THEORIES (Формальные теории)
  // ==========================================
  'prop_logic': {
    group: Discipline.LOGIC,
    kind: NodeKind.THEORY,
    val: 12,
    synonyms: ['Логика высказываний', 'Propositional Logic', 'Sentential Logic'],
    content: {
      en: { label: 'Propositional Logic', description: 'Logic of propositions and connectives.', details: ['Boolean Logic', 'Tautologies', 'Truth Tables'] },
      ru: { label: 'Логика высказываний', description: 'Логика суждений и связок.', details: ['Булева логика', 'Тавтологии', 'Таблицы истинности'] }
    }
  },
  'pred_logic': {
    group: Discipline.LOGIC,
    kind: NodeKind.THEORY,
    val: 25,
    synonyms: ['Логика первого порядка', 'First-Order Logic', 'FOL', 'Predicate Calculus'],
    content: {
      en: { label: 'First-Order Logic', description: 'Logic allowing quantification over individuals.', details: ['Quantifiers', 'Terms', 'Formulas'] },
      ru: { label: 'Логика первого порядка', description: 'Логика, допускающая квантификацию по индивидам.', details: ['Кванторы', 'Термы', 'Формулы'] }
    }
  },
  'modal_logic': {
    group: Discipline.LOGIC,
    kind: NodeKind.THEORY,
    val: 22,
    synonyms: ['Modal Logic', 'Модальная логика'],
    content: {
      en: { label: 'Modal Logic', description: 'Extensions of logic with modalities (necessity, possibility).', details: ['Kripke Semantics', 'Possible Worlds', 'Accessibility Relation'] },
      ru: { label: 'Модальная логика', description: 'Расширения логики модальностями (необходимость, возможность).', details: ['Семантика Крипке', 'Возможные миры', 'Отношение достижимости'] }
    }
  },
  'zfc': {
    group: Discipline.SET_THEORY,
    kind: NodeKind.THEORY,
    val: 40,
    synonyms: ['ZFC', 'ZFC', 'Zermelo-Fraenkel Choice'],
    content: {
      en: { label: 'ZFC', description: 'The standard axiomatic set theory with Choice.', details: ['Extensionality', 'Infinity', 'Replacement'] },
      ru: { label: 'ZFC', description: 'Стандартная аксиоматическая теория множеств с Выбором.', details: ['Объемность', 'Бесконечность', 'Подстановка'] }
    }
  },
  'theory_HF': {
    group: Discipline.SET_THEORY,
    kind: NodeKind.THEORY,
    val: 15,
    synonyms: ['Наследственно конечные', 'HF', 'Hereditarily Finite'],
    content: {
      en: { label: 'HF Theory', description: 'Set theory without the Axiom of Infinity. Equivalent to PA.', details: ['Finite Sets', 'Ackermann Coding'] },
      ru: { label: 'Теория HF', description: 'Теория множеств без аксиомы бесконечности. Эквивалентна PA.', details: ['Конечные множества', 'Кодировка Аккермана'] }
    }
  },
  'theory_PA': {
    group: Discipline.LOGIC,
    kind: NodeKind.THEORY,
    val: 35,
    synonyms: ['Арифметика Пеано', 'Peano Arithmetic', 'PA'],
    content: {
      en: { label: 'Peano Arithmetic (PA)', description: 'First-order theory of natural numbers with induction.', details: ['Successor', 'Induction Schema', 'Arithmetic Hierarchy'] },
      ru: { label: 'Арифметика Пеано (PA)', description: 'Теория натуральных чисел первого порядка с индукцией.', details: ['Следование', 'Схема индукции', 'Арифметическая иерархия'] }
    }
  },
  'theory_Q': {
    group: Discipline.LOGIC,
    kind: NodeKind.THEORY,
    val: 12,
    synonyms: ['Арифметика Робинсона', 'Robinson\'s Q', 'Q'],
    content: {
      en: { label: 'Robinson\'s Q', description: 'Peano Arithmetic without the induction schema.', details: ['Finitely Axiomatizable', 'Incomplete'] },
      ru: { label: 'Арифметика Робинсона (Q)', description: 'Арифметика Пеано без схемы индукции.', details: ['Конечно аксиоматизируема', 'Неполна'] }
    }
  },
  'theory_Presburger': {
    group: Discipline.LOGIC,
    kind: NodeKind.THEORY,
    val: 12,
    synonyms: ['Арифметика Пресбургера', 'Presburger Arithmetic'],
    content: {
      en: { label: 'Presburger Arithmetic', description: 'Theory of natural numbers with addition only.', details: ['Decidable', 'Complete', 'No multiplication'] },
      ru: { label: 'Арифметика Пресбургера', description: 'Теория натуральных чисел только со сложением.', details: ['Разрешима', 'Полна', 'Нет умножения'] }
    }
  },
  'theory_groups': {
    group: Discipline.ALGEBRA,
    kind: NodeKind.THEORY,
    val: 15,
    synonyms: ['Теория групп', 'Group Theory'],
    content: {
      en: { label: 'Group Theory', description: 'Axioms for groups: closure, associativity, identity, inverse.', details: ['Non-abelian', 'Subgroups', 'Normal subgroups'] },
      ru: { label: 'Теория групп', description: 'Аксиомы групп: замкнутость, ассоциативность, единица, обратный.', details: ['Неабелевы', 'Подгруппы', 'Нормальные подгруппы'] }
    }
  },
'theory_tf_groups': {
  group: Discipline.MODEL_THEORY,
  kind: NodeKind.THEORY,
  val: 22,
  synonyms: ['DAG', 'Divisible Torsion-Free Abelian Groups'],
  content: {
    en: {
      label: 'Theory of Divisible Torsion-Free Abelian Groups',
      description: 'Theory of vector spaces over Q. It is uncountably categorical but not countably categorical.',
      details: ['Complete theory', 'Quantifier Elimination', 'Uncountably categorical']
    },
    ru: {
      label: 'Теория делимых абелевых групп без кручения',
      description: 'Теория векторных пространств над Q. Категорична в несчетных мощностях, но не в счетной.',
      details: ['Полная теория', 'Элиминация кванторов', 'Несчетно категорична']
    }
  }
},
// 1. Несчетная категоричность (свойство)
'concept_uncountable_categoricity': {
  group: Discipline.MODEL_THEORY,
  kind: NodeKind.CONCEPT,
  val: 20,
  synonyms: ['Uncountable categoricity', 'Категоричность в несчетных мощностях'],
  content: {
    en: {
      label: 'Uncountable Categoricity',
      description: 'Property of a theory to have exactly one model (up to isomorphism) in some uncountable cardinality.',
      details: ['Implies categoricity in all uncountable powers (Morley)', 'Example: ACF_0, Vector Spaces']
    },
    ru: {
      label: 'Несчетная категоричность',
      description: 'Свойство теории иметь (с точностью до изоморфизма) ровно одну модель в некоторой несчетной мощности.',
      details: ['Влечет категоричность во всех несчетных мощностях (Морли)', 'Пример: ACF_0, Векторные пространства']
    }
  }
},
  'theory_rings': {
    group: Discipline.ALGEBRA,
    kind: NodeKind.THEORY,
    val: 15,
    synonyms: ['Теория колец', 'Ring Theory'],
    content: {
      en: { label: 'Ring Theory', description: 'Structures with two binary operations generalizing integers.', details: ['Ideals', 'Commutative Rings'] },
      ru: { label: 'Теория колец', description: 'Структуры с двумя операциями, обобщающие целые числа.', details: ['Идеалы', 'Коммутативные кольца'] }
    }
  },
  'theory_fields': {
    group: Discipline.ALGEBRA,
    kind: NodeKind.THEORY,
    val: 15,
    synonyms: ['Теория полей', 'Field Theory'],
    content: {
      en: { label: 'Field Theory', description: 'Commutative rings where every non-zero element is invertible.', details: ['Characteristic', 'Extensions'] },
      ru: { label: 'Теория полей', description: 'Коммутативные кольца, где каждый ненулевой элемент обратим.', details: ['Характеристика', 'Расширения'] }
    }
  },
  'theory_ACF': {
    group: Discipline.MODEL_THEORY,
    kind: NodeKind.THEORY,
    val: 18,
    synonyms: ['ACF', 'Алгебраически замкнутые поля'],
    content: {
      en: { label: 'ACF', description: 'Theory of Algebraically Closed Fields.', details: ['Quantifier Elimination', 'Morley Rank'] },
      ru: { label: 'ACF', description: 'Теория алгебраически замкнутых полей.', details: ['Элиминация кванторов', 'Ранг Морли'] }
    }
  },
  'theory_RCF': {
    group: Discipline.MODEL_THEORY,
    kind: NodeKind.THEORY,
    val: 18,
    synonyms: ['RCF', 'Вещественно замкнутые поля'],
    content: {
      en: { label: 'RCF', description: 'Theory of Real Closed Fields.', details: ['O-minimality', 'Decidable', 'Tarski-Seidenberg'] },
      ru: { label: 'RCF', description: 'Теория вещественно замкнутых полей.', details: ['O-минимальность', 'Разрешимость', 'Тарский-Зайденберг'] }
    }
  },
  'theory_DLO': {
    group: Discipline.ORDER_THEORY,
    kind: NodeKind.THEORY,
    val: 14,
    synonyms: ['DLO', 'Плотный порядок'],
    content: {
      en: { label: 'DLO', description: 'Dense Linear Orders without endpoints.', details: ['$\\omega$-categorical', 'Cantor\'s Theorem'] },
      ru: { label: 'DLO', description: 'Плотные линейные порядки без концов.', details: ['$\\omega$-категоричность', 'Теорема Кантора'] }
    }
  },
  'theory_DisLO': {
    group: Discipline.ORDER_THEORY,
    kind: NodeKind.THEORY,
    val: 10,
    synonyms: ['DisLO', 'Дискретный порядок'],
    content: {
      en: { label: 'Discrete Linear Order', description: 'Orders where every element has a successor/predecessor.', details: ['Models like Z', 'Not categorical'] },
      ru: { label: 'Дискретный порядок', description: 'Порядки, где у каждого элемента есть сосед.', details: ['Модели типа Z', 'Не категорична'] }
    }
  },
  'rca0': {
    group: Discipline.PROOF_THEORY,
    kind: NodeKind.THEORY,
    val: 14,
    synonyms: ['RCA0', 'Recursive Comprehension'],
    content: {
      en: { label: 'RCA_0', description: 'Recursive Comprehension Axiom system.', details: ['Base for Reverse Math', 'Constructive'] },
      ru: { label: 'RCA_0', description: 'Система с аксиомой рекурсивного свертывания.', details: ['База обратной математики', 'Конструктивность'] }
    }
  },
  'wkl0': {
    group: Discipline.PROOF_THEORY,
    kind: NodeKind.THEORY,
    val: 14,
    synonyms: ['WKL0', 'Weak Konig Lemma'],
    content: {
      en: { label: 'WKL_0', description: 'Weak Konig Lemma system.', details: ['Compactness', 'Heine-Borel'] },
      ru: { label: 'WKL_0', description: 'Система со слабой леммой Кенига.', details: ['Компактность', 'Гейне-Борель'] }
    }
  },
'aca0': {
    group: Discipline.PROOF_THEORY,
    kind: NodeKind.THEORY,
    val: 14,
    synonyms: ['ACA0', 'Arithmetic Comprehension'],
    content: {
      en: { 
        // Используем \mathsf для шрифта без засечек, как принято в статьях
        label: '$\\mathsf{ACA}_0$', 
        description: 'Second-order system with Arithmetic Comprehension. It is a conservative extension of PA (proves exactly the same arithmetical theorems).', 
        details: ['Conservative over PA', 'Arithmetical Comprehension', 'Ordinal $\\varepsilon_0$'] 
      },
      ru: { 
        label: '$\\mathsf{ACA}_0$', 
        description: 'Система второго порядка с арифметическим свертыванием. Является консервативным расширением PA (доказывает ровно те же арифметические теоремы).', 
        details: ['Консервативно над PA', 'Арифметическое свертывание', 'Ординал $\\varepsilon_0$'] 
      }
    }
  },
    'atr0': {
    group: Discipline.PROOF_THEORY,
    kind: NodeKind.THEORY,
    val: 12,
    synonyms: ['ATR0', 'Arith Transfinite Recursion'],
    content: {
      en: { label: '$\\mathsf{ATR}_0$', description: 'Arithmetic Transfinite Recursion.', details: ['Well-ordering proofs', 'Ulm Theory'] },
      ru: { label: '$\\mathsf{ATR}_0$', description: 'Арифметическая трансфинитная рекурсия.', details: ['Доказательства фундированности', 'Теория Ульма'] }
    }
  },
  'pi11_ca0': {
    group: Discipline.PROOF_THEORY,
    kind: NodeKind.THEORY,
    val: 12,
    synonyms: ['Pi-1-1 CA0', 'Strong Comprehension'],
    content: {
      en: { label: '$\\Pi^1_1-CA_0$', description: 'Strongest of the Big Five systems.', details: ['Hyperarithmetic', 'Kruskal\'s Theorem'] },
      ru: { label: '$\\Pi^1_1-CA_0$', description: 'Сильнейшая из "Большой пятерки".', details: ['Гиперарифметика', 'Теорема Крускала'] }
    }
  },
  'modal_K': {
    group: Discipline.LOGIC,
    kind: NodeKind.THEORY,
    val: 10,
    synonyms: ['System K', 'Система K'],
    content: {
      en: { 
        label: 'System K', 
        description: 'The minimal normal modal logic.', 
        details: [
          'Distributivity: $\\Box(p \\to q) \\to (\\Box p \\to \\Box q)$', 
          'Rule of Necessitation: $p \\vdash \\Box p$' 
        ] 
      },
      ru: { 
        label: 'Система K', 
        description: 'Минимальная нормальная модальная логика.', 
        details: [
          'Дистрибутивность: $\\Box(p \\to q) \\to (\\Box p \\to \\Box q)$', 
          'Правило усиления: $p \\vdash \\Box p$' 
        ] 
      }
    }
  },
  'modal_K4': {
    group: Discipline.LOGIC,
    kind: NodeKind.THEORY,
    val: 10,
    synonyms: ['System K4', 'Система K4'],
    content: {
      en: { 
        label: 'System K4', 
        description: 'Transitive modal logic.', 
        details: [
          'Transitivity: $\\Box p \\to \\Box\\Box p$', 
          'Frame property: Transitive' 
        ] 
      },
      ru: { 
        label: 'Система K4', 
        description: 'Транзитивная модальная логика.', 
        details: [
          'Транзитивность: $\\Box p \\to \\Box\\Box p$', 
          'Свойство шкалы: Транзитивность' 
        ] 
      }
    }
  },
  'modal_S4': {
    group: Discipline.LOGIC,
    kind: NodeKind.THEORY,
    val: 12,
    synonyms: ['System S4', 'Система S4'],
    content: {
      en: { 
        label: 'System S4', 
        description: 'Reflexive and transitive modal logic (Logic of Knowledge/Topology).', 
        details: [
          'Reflexivity (T): $\\Box p \\to p$', 
          'Transitivity (4): $\\Box p \\to \\Box\\Box p$',
          'Topological Interior'
        ] 
      },
      ru: { 
        label: 'Система S4', 
        description: 'Рефлексивная и транзитивная логика (Логика знания/Топология).', 
        details: [
          'Рефлексивность (T): $\\Box p \\to p$', 
          'Транзитивность (4): $\\Box p \\to \\Box\\Box p$',
          'Топологическая внутренность'
        ] 
      }
    }
  },
  'modal_S5': {
    group: Discipline.LOGIC,
    kind: NodeKind.THEORY,
    val: 12,
    synonyms: ['System S5', 'Система S5'],
    content: {
      en: { 
        label: 'System S5', 
        description: 'Logic of equivalence relations.', 
        details: [
          'Euclidean: $\\Diamond p \\to \\Box\\Diamond p$', 
          'Symmetry: $p \\to \\Box\\Diamond p$',
          'Frame property: Equivalence'
        ] 
      },
      ru: { 
        label: 'Система S5', 
        description: 'Логика отношений эквивалентности.', 
        details: [
          'Евклидовость: $\\Diamond p \\to \\Box\\Diamond p$', 
          'Симметричность: $p \\to \\Box\\Diamond p$',
          'Свойство шкалы: Эквивалентность'
        ] 
      }
    }
  },
  'modal_GL': {
    group: Discipline.LOGIC,
    kind: NodeKind.THEORY,
    val: 14,
    synonyms: ['GL', 'Provability Logic', 'Логика доказуемости'],
    content: {
      en: { 
        label: 'Gödel-Löb (GL)', 
        description: 'Logic of provability in Peano Arithmetic.', 
        details: [
          'Löb Axiom: $\\Box(\\Box p \\to p) \\to \\Box p$',
          'No infinite ascent',
          'Arithmetical Completeness'
        ] 
      },
      ru: { 
        label: 'Гёдель-Лёб (GL)', 
        description: 'Логика доказуемости в арифметике Пеано.', 
        details: [
          'Аксиома Лёба: $\\Box(\\Box p \\to p) \\to \\Box p$', 
          'Нет бесконечного возрастания',
          'Арифметическая полнота'
        ] 
      }
    }
  },
  'intuitionistic_logic': {
    group: Discipline.LOGIC,
    kind: NodeKind.THEORY,
    val: 16,
    synonyms: ['Intuitionistic Logic', 'Интуиционизм', 'IPC'],
    content: {
      en: { label: 'Intuitionistic Logic', description: 'Logic without the Law of Excluded Middle.', details: ['Constructivism', 'Heyting Algebras'] },
      ru: { label: 'Интуиционистская логика', description: 'Логика без закона исключенного третьего.', details: ['Конструктивизм', 'Алгебры Гейтинга'] }
    }
  },
  'heyting_arithmetic': {
    group: Discipline.LOGIC,
    kind: NodeKind.THEORY,
    val: 14,
    synonyms: ['HA', 'Heyting Arithmetic', 'Арифметика Гейтинга'],
    content: {
      en: { label: 'Heyting Arithmetic', description: 'Peano Arithmetic over Intuitionistic Logic.', details: ['Existence Property', 'Realizability'] },
      ru: { label: 'Арифметика Гейтинга', description: 'Арифметика Пеано над интуиционистской логикой.', details: ['Экзистенциальное свойство', 'Реализуемость'] }
    }
  },
  'theory_order': {
    group: Discipline.ORDER_THEORY,
    kind: NodeKind.THEORY,
    val: 20,
    synonyms: ['Order Axioms', 'Аксиомы порядка'],
    content: {
      en: { label: 'Theory of Order', description: 'Axioms defining partial and linear orders.', details: ['Reflexivity', 'Antisymmetry', 'Transitivity'] },
      ru: { label: 'Теория порядка', description: 'Аксиомы частичного и линейного порядка.', details: ['Рефлексивность', 'Антисимметричность', 'Транзитивность'] }
    }
  },
  'system_f': {
    group: Discipline.COMPUTABILITY,
    kind: NodeKind.THEORY,
    val: 14,
    synonyms: ['System F', 'Система F', 'Polymorphic Lambda Calculus'],
    content: {
      en: { label: 'System F', description: 'Polymorphic Lambda Calculus.', details: ['Girard-Reynolds', 'Second Order'] },
      ru: { label: 'Система F', description: 'Полиморфное лямбда-исчисление.', details: ['Жирар-Рейнольдс', 'Второй порядок'] }
    }
  },
  'typed_lambda': {
    group: Discipline.COMPUTABILITY,
    kind: NodeKind.THEORY,
    val: 14,
    synonyms: ['Typed Lambda Calculus', 'Типизированное лямбда-исчисление'],
    content: {
      en: { label: 'Typed Lambda Calculus', description: 'Lambda calculus with type constraints.', details: ['Normalization', 'Type Safety'] },
      ru: { label: 'Типизированное лямбда-исчисление', description: 'Лямбда-исчисление с типами.', details: ['Нормализация', 'Безопасность типов'] }
    }
  },
  'theory_PA2': {
    group: Discipline.LOGIC,
    kind: NodeKind.THEORY,
    val: 12,
    synonyms: ['PA2', 'Second-order Arithmetic', 'Арифметика второго порядка'],
    content: {
      en: { label: 'Second-order PA', description: 'Arithmetic with quantification over sets of numbers.', details: ['Categorical', 'Stronger than PA'] },
      ru: { label: 'PA второго порядка', description: 'Арифметика с кванторами по множествам чисел.', details: ['Категорична', 'Сильнее PA'] }
    }
  },

  // ==========================================
  // 3. STRUCTURES (Модели, пространства, алгебры)
  // ==========================================
  'model_quine': {
    group: Discipline.SET_THEORY,
    kind: NodeKind.STRUCTURE,
    val: 14,
    synonyms: ['NF Model', 'Модель NF', 'New Foundations', 'Universum V in V'],
    content: {
      en: { 
        label: 'Quine\'s Model (NF)', 
        description: 'A model of New Foundations set theory, allowing a universal set.', 
        details: [
          'Universal Set: $V \\in V$', 
          'Stratified formulas', 
          'Disproves Choice (Specker)' // Теорема Шпеккера: в NF аксиома выбора ложна
        ] 
      },
      ru: { 
        label: 'Модель Куайна (NF)', 
        description: 'Модель теории множеств New Foundations, допускающая универсальное множество.', 
        details: [
          'Универсальное множество: $V \\in V$', 
          'Стратификация формул', 
          'Опровергает Выбор (Шпеккер)' 
        ] 
      }
    }
  },
  'ordinal_arithmetic': {
    group: Discipline.SET_THEORY,
    kind: NodeKind.STRUCTURE,
    val: 15,
    synonyms: ['Ordinals', 'Ординалы', 'Порядковые числа'],
    content: {
      en: { label: 'Ordinals', description: 'Order types of well-ordered sets.', details: ['Transfinite Induction', 'Cantor Normal Form'] },
      ru: { label: 'Ординалы', description: 'Порядковые типы вполне упорядоченных множеств.', details: ['Трансфинитная индукция', 'Нормальная форма Кантора'] }
    }
  },
  'cardinal_arithmetic': {
    group: Discipline.SET_THEORY,
    kind: NodeKind.STRUCTURE,
    val: 15,
    synonyms: ['Cardinals', 'Кардиналы', 'Мощность'],
    content: {
      en: { label: 'Cardinals', description: 'Measures of set size.', details: ['Alephs', 'Cardinal Arithmetic'] },
      ru: { label: 'Кардиналы', description: 'Меры размера множеств.', details: ['Алефы', 'Кардинальная арифметика'] }
    }
  },
  'model_N': {
    group: Discipline.MODEL_THEORY,
    kind: NodeKind.STRUCTURE,
    val: 20,
    synonyms: ['N', 'Natural Numbers', 'Натуральные числа'],
    content: {
      en: { label: '$\\mathbb{N}$', description: 'The standard model of arithmetic.', details: ['Well-ordered', 'Inductive'] },
      ru: { label: '$\\mathbb{N}$', description: 'Стандартная модель арифметики.', details: ['Вполне упорядочена', 'Индуктивна'] }
    }
  },
  'model_Z': {
    group: Discipline.ALGEBRA,
    kind: NodeKind.STRUCTURE,
    val: 16,
    synonyms: ['Z', 'Integers', 'Целые числа'],
    content: {
      en: { label: '$\\mathbb{Z}$', description: 'The ring of integers.', details: ['Euclidean Domain', 'Discrete Order'] },
      ru: { label: '$\\mathbb{Z}$', description: 'Кольцо целых чисел.', details: ['Евклидово кольцо', 'Дискретный порядок'] }
    }
  },
  'model_Q': {
    group: Discipline.ALGEBRA,
    kind: NodeKind.STRUCTURE,
    val: 16,
    synonyms: ['Q', 'Rationals', 'Рациональные числа'],
    content: {
      en: { label: '$\\mathbb{Q}$', description: 'The field of rational numbers.', details: ['Prime Field', 'Dense Order'] },
      ru: { label: '$\\mathbb{Q}$', description: 'Поле рациональных чисел.', details: ['Простое поле', 'Плотный порядок'] }
    }
  },
  'model_R': {
    group: Discipline.ALGEBRA,
    kind: NodeKind.STRUCTURE,
    val: 18,
    synonyms: ['R', 'Reals', 'Вещественные числа'],
    content: {
      en: { label: '$\\mathbb{R}$', description: 'The field of real numbers.', details: ['Complete', 'Continuum', 'Archimedean'] },
      ru: { label: '$\\mathbb{R}$', description: 'Поле вещественных чисел.', details: ['Полнота', 'Континуум', 'Архимедово'] }
    }
  },
  'model_C': {
    group: Discipline.ALGEBRA,
    kind: NodeKind.STRUCTURE,
    val: 16,
    synonyms: ['C', 'Complex Numbers', 'Комплексные числа'],
    content: {
      en: { label: '$\\mathbb{C}$', description: 'The field of complex numbers.', details: ['Algebraically Closed', 'Unordered'] },
      ru: { label: '$\\mathbb{C}$', description: 'Поле комплексных чисел.', details: ['Алгебраически замкнуто', 'Неупорядочено'] }
    }
  },
  'model_A': {
    group: Discipline.ALGEBRA,
    kind: NodeKind.STRUCTURE,
    val: 12,
    synonyms: ['A', 'Algebraic Numbers', 'Алгебраические числа'],
    content: {
      en: { label: '$\\mathbb{A}$', description: 'Field of algebraic numbers.', details: ['Countable', 'Algebraically Closed'] },
      ru: { label: '$\\mathbb{A}$', description: 'Поле алгебраических чисел.', details: ['Счетное', 'Алгебраически замкнуто'] }
    }
  },
  'model_L': {
    group: Discipline.SET_THEORY,
    kind: NodeKind.STRUCTURE,
    val: 15,
    synonyms: ['L', 'Constructible Universe', 'Конструктивный универсум'],
    content: {
      en: { label: 'Constructible Universe ($L$)', description: 'The smallest inner model of ZF.', details: ['V=L', 'GCH holds', 'Well-orderable'] },
      ru: { label: 'Конструктивный универсум ($L$)', description: 'Наименьшая внутренняя модель ZF.', details: ['V=L', 'GCH верна', 'Вполне упорядочиваема'] }
    }
  },
  'model_V_omega': {
    group: Discipline.SET_THEORY,
    kind: NodeKind.STRUCTURE,
    val: 14,
    synonyms: ['V_omega', 'Hereditarily Finite Universe'],
    content: {
      en: { label: '$V_\\omega$', description: 'The universe of hereditarily finite sets.', details: ['Model of HF', 'Countable'] },
      ru: { label: '$V_\\omega$', description: 'Универсум наследственно конечных множеств.', details: ['Модель HF', 'Счетная'] }
    }
  },
  'surreal_numbers': {
    group: Discipline.SET_THEORY,
    kind: NodeKind.STRUCTURE,
    val: 14,
    synonyms: ['No', 'Surreal Numbers', 'Сюрреальные числа'],
    content: {
      en: { label: 'Surreal Numbers (No)', description: 'A proper class field containing reals and ordinals.', details: ['Conway', 'Games', 'Largest Field'] },
      ru: { label: 'Сюрреальные числа (No)', description: 'Собственный класс-поле, содержащий R и ординалы.', details: ['Конвей', 'Игры', 'Крупнейшее поле'] }
    }
  },
  'bool_alg': {
    group: Discipline.ORDER_THEORY,
    kind: NodeKind.STRUCTURE,
    val: 16,
    synonyms: ['Boolean Algebra', 'Булева алгебра'],
    content: {
      en: { label: 'Boolean Algebra', description: 'Algebraic structure capturing classical logic.', details: ['Complemented Lattice', 'Distributive'] },
      ru: { label: 'Булева алгебра', description: 'Алгебраическая структура классической логики.', details: ['Дополненная решетка', 'Дистрибутивность'] }
    }
  },
  'heyting_alg': {
    group: Discipline.ORDER_THEORY,
    kind: NodeKind.STRUCTURE,
    val: 14,
    synonyms: ['Heyting Algebra', 'Гейтингова алгебра'],
    content: {
      en: { label: 'Heyting Algebra', description: 'Algebraic structure capturing intuitionistic logic.', details: ['Pseudo-complement', 'Distributive'] },
      ru: { label: 'Гейтингова алгебра', description: 'Алгебраическая структура интуиционистской логики.', details: ['Псевдодополнение', 'Дистрибутивность'] }
    }
  },
  'stone_space': {
    group: Discipline.TOPOLOGY,
    kind: NodeKind.STRUCTURE,
    val: 15,
    synonyms: ['Stone Space', 'Пространство Стоуна'],
    content: {
      en: { label: 'Stone Space', description: 'Totally disconnected compact Hausdorff space.', details: ['Dual to Boolean Algebra', 'Clopen sets'] },
      ru: { label: 'Пространство Стоуна', description: 'Вполне несвязное компактное хаусдорфово пространство.', details: ['Двойственно булевой алгебре', 'Clopen множества'] }
    }
  },
  'priestley_space': {
    group: Discipline.TOPOLOGY,
    kind: NodeKind.STRUCTURE,
    val: 12,
    synonyms: ['Priestley Space', 'Пространство Пристли'],
    content: {
      en: { label: 'Priestley Space', description: 'Ordered topological space dual to distributive lattices.', details: ['Ordered Stone Space'] },
      ru: { label: 'Пространство Пристли', description: 'Упорядоченное топологическое пространство, двойственное дистрибутивным решеткам.', details: ['Упорядоченное пр-во Стоуна'] }
    }
  },
  'esakia_space': {
    group: Discipline.TOPOLOGY,
    kind: NodeKind.STRUCTURE,
    val: 12,
    synonyms: ['Esakia Space', 'Пространство Эсакиа'],
    content: {
      en: { label: 'Esakia Space', description: 'Dual to Heyting algebras.', details: ['Priestley space + Open map'] },
      ru: { label: 'Пространство Эсакиа', description: 'Двойственно алгебрам Гейтинга.', details: ['Пр-во Пристли + Открытое отображение'] }
    }
  },
  'lindenbaum_alg': {
    group: Discipline.LOGIC,
    kind: NodeKind.STRUCTURE,
    val: 12,
    synonyms: ['Lindenbaum Algebra', 'Алгебра Линденбаума'],
    content: {
      en: { label: 'Lindenbaum Algebra', description: 'The algebra of formulas modulo provability.', details: ['Free Boolean Algebra', 'Completeness Proof'] },
      ru: { label: 'Алгебра Линденбаума', description: 'Алгебра формул по модулю доказуемости.', details: ['Свободная булева алгебра', 'Доказательство полноты'] }
    }
  },
  'jsson_tarski_alg': {
    group: Discipline.ALGEBRA,
    kind: NodeKind.STRUCTURE,
    val: 12,
    synonyms: ['Modal Algebra', 'Модальная алгебра', 'Jónsson-Tarski'],
    content: {
      en: { label: 'Modal Algebra', description: 'Boolean algebra with an operator.', details: ['Algebraic Modal Logic'] },
      ru: { label: 'Модальная алгебра', description: 'Булева алгебра с оператором.', details: ['Алгебраическая модальная логика'] }
    }
  },
  'bool_ring': {
    group: Discipline.ALGEBRA,
    kind: NodeKind.STRUCTURE,
    val: 10,
    synonyms: ['Boolean Ring', 'Булево кольцо'],
    content: {
      en: { 
        label: 'Boolean Ring', 
        description: 'Ring where every element is idempotent: $x^2 = x$.', 
        details: ['Equivalent to Boolean Algebra', 'Characteristic $2$'] 
      },
      ru: { 
        label: 'Булево кольцо', 
        description: 'Кольцо, в котором каждый элемент идемпотентен: $x^2 = x$.', 
        details: ['Эквивалентно булевой алгебре', 'Характеристика $2$'] 
      }
    }
  },
  'clop_alg': {
    group: Discipline.TOPOLOGY,
    kind: NodeKind.STRUCTURE,
    val: 10,
    synonyms: ['Clopen Algebra', 'Алгебра Clopen'],
    content: {
      en: { label: 'Clopen Algebra', description: 'Algebra of closed-open sets.', details: ['Zero-dimensional'] },
      ru: { label: 'Алгебра Clopen', description: 'Алгебра открыто-замкнутых множеств.', details: ['Нульмерность'] }
    }
  },
  'model_nonstd': {
    group: Discipline.MODEL_THEORY,
    kind: NodeKind.STRUCTURE,
    val: 14,
    synonyms: ['Non-standard Models', 'Нестандартные модели'],
    content: {
      en: { label: 'Non-standard Model', description: 'Model elementarily equivalent but not isomorphic to standard.', details: ['Hyperreals', 'Infinitesimals'] },
      ru: { label: 'Нестандартная модель', description: 'Элементарно эквивалентна, но не изоморфна стандартной.', details: ['Гипервещественные', 'Бесконечно малые'] }
    }
  },
  'model_Z_plus_Z': {
    group: Discipline.MODEL_THEORY,
    kind: NodeKind.STRUCTURE,
    val: 10,
    synonyms: ['Z + Z'],
    content: {
      en: { label: '$\\mathbb{Z} + \\mathbb{Z}$', description: 'Ordered sum of two integer copies.', details: ['Discrete order', 'No endpoints'] },
      ru: { label: '$\\mathbb{Z} + \\mathbb{Z}$', description: 'Упорядоченная сумма двух копий целых.', details: ['Дискретный порядок', 'Нет концов'] }
    }
  },
  'model_N_ZxQ': {
    group: Discipline.MODEL_THEORY,
    kind: NodeKind.STRUCTURE,
    val: 10,
    synonyms: ['N + ZxQ'],
    content: {
      en: { label: '$\\mathbb{N} + \\mathbb{Z} \\times \\mathbb{Q}$', description: 'Order type of countable non-standard models of PA.', details: ['Standard part', 'Galaxies'] },
      ru: { label: '$\\mathbb{N} + \\mathbb{Z} \\times \\mathbb{Q}$', description: 'Порядковый тип счетных нестандартных моделей PA.', details: ['Стандартная часть', 'Галактики'] }
    }
  },
  'model_random_graph': {
    group: Discipline.MODEL_THEORY,
    kind: NodeKind.STRUCTURE,
    val: 10,
    synonyms: ['Rado Graph', 'Граф Радо', 'Random Graph'],
    content: {
      en: { label: 'Rado Graph', description: 'The unique countable ultrahomogeneous graph.', details: ['Zero-one law', 'Categorical'] },
      ru: { label: 'Граф Радо', description: 'Единственный счетный ультраоднородный граф.', details: ['Закон нуля и единицы', 'Категоричен'] }
    }
  },
  'open_set_topology': {
    group: Discipline.TOPOLOGY,
    kind: NodeKind.STRUCTURE,
    val: 10,
    synonyms: ['Open Sets Lattice', 'Решетка открытых множеств'],
    content: {
      en: { label: 'Open Sets Topology', description: 'The lattice of open sets.', details: ['Heyting Algebra', 'Frame'] },
      ru: { label: 'Топология открытых множеств', description: 'Решетка открытых множеств.', details: ['Гейтингова алгебра', 'Фрейм'] }
    }
  },
  'cylindric_alg': {
    group: Discipline.LOGIC,
    kind: NodeKind.STRUCTURE,
    val: 12,
    synonyms: ['Cylindric Algebra', 'Цилиндрическая алгебра', 'CA'],
    content: {
      en: { label: 'Cylindric Algebra', description: 'Algebraic counterpart to First-Order Logic.', details: ['Cylindrification', 'Diagonal elements'] },
      ru: { label: 'Цилиндрическая алгебра', description: 'Алгебраический аналог логики первого порядка.', details: ['Цилиндрификация', 'Диагональные элементы'] }
    }
  },
  'polyadic_alg': {
    group: Discipline.LOGIC,
    kind: NodeKind.STRUCTURE,
    val: 12,
    synonyms: ['Polyadic Algebra', 'Полиадическая алгебра'],
    content: {
      en: { label: 'Polyadic Algebra', description: 'Halmos\'s algebraic version of FOL.', details: ['Transformation'] },
      ru: { label: 'Полиадическая алгебра', description: 'Алгебраическая версия FOL по Халмошу.', details: ['Преобразования'] }
    }
  },
  'epsilon_0': {
    group: Discipline.PROOF_THEORY,
    kind: NodeKind.STRUCTURE, // Или Concept (Ordinal)
    val: 14,
    synonyms: ['Epsilon-0', 'Эпсилон-нулевое'],
    content: {
      en: { label: '$\\varepsilon_0$', description: 'Proof-theoretic ordinal of PA.', details: ['Gentzen', 'Transfinite Induction'] },
      ru: { label: '$\\varepsilon_0$', description: 'Доказательный ординал PA.', details: ['Генцен', 'Трансфинитная индукция'] }
    }
  },
  
  // ==========================================
  // 4. CONCEPTS (Понятия, методы, объекты)
  // ==========================================
  'inference_concept': {
    group: Discipline.LOGIC,
    kind: NodeKind.CONCEPT,
    val: 20,
    synonyms: ['Выводимость', 'Derivability', 'Turnstile'],
    content: {
      en: { label: 'Derivability ($\\vdash$)', description: 'Syntactic entailment relation.', details: ['Proofs', 'Rules of Inference'] },
      ru: { label: 'Выводимость ($\\vdash$)', description: 'Отношение синтаксического следования.', details: ['Доказательства', 'Правила вывода'] }
    }
  },
  'soundness_completeness': {
    group: Discipline.LOGIC,
    kind: NodeKind.CONCEPT,
    val: 20,
    synonyms: ['Correctness', 'Корректность', 'Completeness', 'Полнота'],
    content: {
      en: { label: 'Soundness & Completeness', description: 'The bridge between syntax and semantics.', details: ['Validity', 'Model existence'] },
      ru: { label: 'Корректность и Полнота', description: 'Мост между синтаксисом и семантикой.', details: ['Общезначимость', 'Существование модели'] }
    }
  },
  'recursion_concept': {
    group: Discipline.COMPUTABILITY,
    kind: NodeKind.CONCEPT,
    val: 18,
    synonyms: ['Recursion', 'Рекурсия'],
    content: {
      en: { label: 'Recursion', description: 'Definition of functions via self-reference.', details: ['Primitive Recursion', 'Mu-recursion'] },
      ru: { label: 'Рекурсия', description: 'Определение функций через самоссылку.', details: ['Примитивная рекурсия', 'Мю-рекурсия'] }
    }
  },
  'type_theory_model': {
    group: Discipline.MODEL_THEORY,
    kind: NodeKind.CONCEPT,
    val: 16,
    synonyms: ['Type', 'Тип'],
    content: {
      en: { label: 'Type (Model Theory)', description: 'Consistent set of formulas describing an element.', details: ['n-types', 'Realization'] },
      ru: { label: 'Тип (Теория моделей)', description: 'Совместное множество формул, описывающее элемент.', details: ['n-типы', 'Реализация'] }
    }
  },
  'complete_type': {
    group: Discipline.MODEL_THEORY,
    kind: NodeKind.CONCEPT,
    val: 14,
    synonyms: ['Complete Type', 'Полный тип'],
    content: {
      en: { label: 'Complete Type', description: 'Maximal consistent set of formulas.', details: ['Stone Space'] },
      ru: { label: 'Полный тип', description: 'Максимальное совместное множество формул.', details: ['Пространство Стоуна'] }
    }
  },
  'isolated_type': {
    group: Discipline.MODEL_THEORY,
    kind: NodeKind.CONCEPT,
    val: 12,
    synonyms: ['Isolated Type', 'Изолированный тип', 'Principal Type'],
    content: {
      en: { label: 'Isolated Type', description: 'Type generated by a single formula.', details: ['Prime Models', 'Atom'] },
      ru: { label: 'Изолированный тип', description: 'Тип, порожденный одной формулой.', details: ['Простые модели', 'Атом'] }
    }
  },
  'ultrafilter': {
    group: Discipline.SET_THEORY,
    kind: NodeKind.CONCEPT,
    val: 15,
    synonyms: ['Ultrafilter', 'Ультрафильтр'],
    content: {
      en: { label: 'Ultrafilter', description: 'Maximal proper filter on a set or algebra.', details: ['Voting system', 'Ultraproduct'] },
      ru: { label: 'Ультрафильтр', description: 'Максимальный собственный фильтр.', details: ['Система голосования', 'Ультрапроизведение'] }
    }
  },
  'ideal_concept': {
    group: Discipline.ALGEBRA,
    kind: NodeKind.CONCEPT,
    val: 14,
    synonyms: ['Ideal', 'Идеал'],
    content: {
      en: { label: 'Ideal', description: 'Substructure of a ring absorbing multiplication.', details: ['Kernels', 'Quotients'] },
      ru: { label: 'Идеал', description: 'Подструктура кольца, поглощающая умножение.', details: ['Ядра', 'Факторы'] }
    }
  },
  'prime_ideal': {
    group: Discipline.ALGEBRA,
    kind: NodeKind.CONCEPT,
    val: 12,
    synonyms: ['Prime Ideal', 'Простой идеал'],
    content: {
      en: { label: 'Prime Ideal', description: 'Ideal defining an integral domain quotient.', details: ['Spectrum'] },
      ru: { label: 'Простой идеал', description: 'Идеал, фактор по которому — область целостности.', details: ['Спектр'] }
    }
  },
  'maximal_ideal': {
    group: Discipline.ALGEBRA,
    kind: NodeKind.CONCEPT,
    val: 12,
    synonyms: ['Maximal Ideal', 'Максимальный идеал'],
    content: {
      en: { label: 'Maximal Ideal', description: 'Ideal defining a field quotient.', details: ['Krull\'s Theorem'] },
      ru: { label: 'Максимальный идеал', description: 'Идеал, фактор по которому — поле.', details: ['Теорема Крулля'] }
    }
  },
  'turing_machine': {
    group: Discipline.COMPUTABILITY,
    kind: NodeKind.CONCEPT,
    val: 18,
    synonyms: ['Машина Тьюринга', 'Turing Machine'],
    content: {
      en: { label: 'Turing Machine', description: 'Abstract mathematical model of computation.', details: ['Tape', 'State', 'Transition'] },
      ru: { label: 'Машина Тьюринга', description: 'Абстрактная математическая модель вычислений.', details: ['Лента', 'Состояние', 'Переход'] }
    }
  },
  'lambda_calc': {
    group: Discipline.COMPUTABILITY,
    kind: NodeKind.CONCEPT,
    val: 18,
    synonyms: ['Lambda Calculus', 'Лямбда-исчисление'],
    content: {
      en: { label: 'Lambda Calculus', description: 'Formal system based on function abstraction.', details: ['Alpha/Beta conversion', 'Church-Turing'] },
      ru: { label: 'Лямбда-исчисление', description: 'Формальная система на основе абстракции функций.', details: ['Альфа/Бета конверсия', 'Чёрч-Тьюринг'] }
    }
  },
  'sequent_calculus': {
    group: Discipline.PROOF_THEORY,
    kind: NodeKind.CONCEPT,
    val: 16,
    synonyms: ['Sequent Calculus', 'Секвенциальное исчисление', 'Gentzen'],
    content: {
      en: { label: 'Sequent Calculus', description: 'Proof system using sequents.', details: ['LK', 'LJ', 'Cut Rule'] },
      ru: { label: 'Секвенциальное исчисление', description: 'Система доказательств с использованием секвенций.', details: ['LK', 'LJ', 'Правило сечения'] }
    }
  },
  'bhk_interpretation': {
    group: Discipline.LOGIC,
    kind: NodeKind.CONCEPT,
    val: 14,
    synonyms: ['BHK', 'БХК', 'Brouwer-Heyting-Kolmogorov'],
    content: {
      en: { label: 'BHK Interpretation', description: 'Constructive interpretation of logical connectives.', details: ['Proofs as constructions'] },
      ru: { label: 'Интерпретация БХК', description: 'Конструктивная интерпретация логических связок.', details: ['Доказательства как построения'] }
    }
  },
  'realizability': {
    group: Discipline.LOGIC,
    kind: NodeKind.CONCEPT,
    val: 14,
    synonyms: ['Realizability', 'Реализуемость', 'Kleene'],
    content: {
      en: { label: 'Realizability', description: 'Number-theoretic interpretation of intuitionistic logic.', details: ['Kleene', 'Computable witnesses'] },
      ru: { label: 'Реализуемость', description: 'Теоретико-числовая интерпретация интуиционизма.', details: ['Клини', 'Вычислимые свидетели'] }
    }
  },
  'forcing_method': {
    group: Discipline.SET_THEORY,
    kind: NodeKind.CONCEPT,
    val: 16,
    synonyms: ['Forcing', 'Форсинг'],
    content: {
      en: { label: 'Forcing', description: 'Technique for constructing models of set theory.', details: ['Cohen', 'Independence proofs', 'Generic'] },
      ru: { label: 'Форсинг', description: 'Техника построения моделей теории множеств.', details: ['Коэн', 'Доказательства независимости', 'Генерик'] }
    }
  },
  'large_cardinals': {
    group: Discipline.SET_THEORY,
    kind: NodeKind.CONCEPT,
    val: 14,
    synonyms: ['Large Cardinals', 'Большие кардиналы'],
    content: {
      en: { label: 'Large Cardinals', description: 'Cardinals implying consistency strength.', details: ['Inaccessible', 'Measurable'] },
      ru: { label: 'Большие кардиналы', description: 'Кардиналы, влекущие силу непротиворечивости.', details: ['Недостижимые', 'Измеримые'] }
    }
  },
  'dedekind_finite': {
    group: Discipline.SET_THEORY,
    kind: NodeKind.CONCEPT,
    val: 12,
    synonyms: ['Dedekind Finite', 'Конечность по Дедекинду'],
    content: {
      en: { label: 'Dedekind Finite', description: 'Set not equinumerous to a proper subset.', details: ['Choice axiom dependence'] },
      ru: { label: 'Конечность по Дедекинду', description: 'Множество, не равномощное собственному подмножеству.', details: ['Зависимость от AC'] }
    }
  },
  'hartogs_number': {
    group: Discipline.SET_THEORY,
    kind: NodeKind.CONCEPT,
    val: 12,
    synonyms: ['Hartogs Number', 'Число Хартогса'],
    content: {
      en: { label: 'Hartogs Number', description: 'Least ordinal not injectible into a set.', details: ['Well-ordering'] },
      ru: { label: 'Число Хартогса', description: 'Наименьший ординал, не вложимый в множество.', details: ['Вполне упорядочение'] }
    }
  },
  'rank_concept': {
    group: Discipline.SET_THEORY,
    kind: NodeKind.CONCEPT,
    val: 14,
    synonyms: ['Rank', 'Ранг'],
    content: {
      en: { label: 'Rank', description: 'The level of a set in the cumulative hierarchy.', details: ['Foundation', 'Depth'] },
      ru: { label: 'Ранг', description: 'Уровень множества в кумулятивной иерархии.', details: ['Основание', 'Глубина'] }
    }
  },
  'transfinite_induction': {
    group: Discipline.SET_THEORY,
    kind: NodeKind.CONCEPT,
    val: 14,
    synonyms: ['Transfinite Induction', 'Трансфинитная индукция'],
    content: {
      en: { label: 'Transfinite Induction', description: 'Induction over well-ordered sets.', details: ['Limit ordinals'] },
      ru: { label: 'Трансфинитная индукция', description: 'Индукция по вполне упорядоченным множествам.', details: ['Предельные ординалы'] }
    }
  },
  'cumulative_hierarchy': {
    group: Discipline.SET_THEORY,
    kind: NodeKind.CONCEPT,
    val: 14,
    synonyms: ['Cumulative Hierarchy', 'Кумулятивная иерархия', 'Von Neumann Universe'],
    content: {
      en: { label: 'Cumulative Hierarchy', description: 'The V universe construction.', details: ['V_alpha', 'Power set iteration'] },
      ru: { label: 'Кумулятивная иерархия', description: 'Построение универсума V.', details: ['V_alpha', 'Итерация булеана'] }
    }
  },
  'sequence_coding': {
    group: Discipline.LOGIC,
    kind: NodeKind.CONCEPT,
    val: 14,
    synonyms: ['Sequence Coding', 'Кодирование последовательностей', 'Gödel Numbering'],
    content: {
      en: { label: 'Sequence Coding', description: 'Representing sequences as numbers.', details: ['Beta function', 'CRT'] },
      ru: { label: 'Кодирование последовательностей', description: 'Представление последовательностей числами.', details: ['Бета-функция', 'КТО'] }
    }
  },
  'algebraic_structure': {
    group: Discipline.ALGEBRA,
    kind: NodeKind.CONCEPT,
    val: 18,
    synonyms: ['Algebraic Structure', 'Алгебраическая структура'],
    content: {
      en: { label: 'Algebraic Structure', description: 'Set with operations.', details: ['Universal Algebra'] },
      ru: { label: 'Алгебраическая структура', description: 'Множество с операциями.', details: ['Универсальная алгебра'] }
    }
  },
  'vector_space': {
    group: Discipline.ALGEBRA,
    kind: NodeKind.CONCEPT,
    val: 14,
    synonyms: ['Vector Space', 'Векторное пространство'],
    content: {
      en: { label: 'Vector Space', description: 'Module over a field.', details: ['Basis', 'Dimension'] },
      ru: { label: 'Векторное пространство', description: 'Модуль над полем.', details: ['Базис', 'Размерность'] }
    }
  },
  'module_ring': {
    group: Discipline.ALGEBRA,
    kind: NodeKind.CONCEPT,
    val: 14,
    synonyms: ['Module', 'Модуль'],
    content: {
      en: { label: 'Module', description: 'Generalization of vector space over a ring.', details: ['Linear Algebra'] },
      ru: { label: 'Модуль', description: 'Обобщение векторного пространства над кольцом.', details: ['Линейная алгебра'] }
    }
  },
  'algebra_ring': {
    group: Discipline.ALGEBRA,
    kind: NodeKind.CONCEPT,
    val: 14,
    synonyms: ['Algebra (Structure)', 'Алгебра (структура)'],
    content: {
      en: { label: 'Algebra', description: 'Module with multiplication.', details: ['Associative', 'Lie'] },
      ru: { label: 'Алгебра', description: 'Модуль с умножением.', details: ['Ассоциативная', 'Ли'] }
    }
  },
  'integral_domain': {
    group: Discipline.ALGEBRA,
    kind: NodeKind.CONCEPT,
    val: 12,
    synonyms: ['Integral Domain', 'Область целостности'],
    content: {
      en: { label: 'Integral Domain', description: 'Ring without zero divisors.', details: ['Cancellation'] },
      ru: { label: 'Область целостности', description: 'Кольцо без делителей нуля.', details: ['Сокращение'] }
    }
  },
  'ufd': {
    group: Discipline.ALGEBRA,
    kind: NodeKind.CONCEPT,
    val: 12,
    synonyms: ['UFD', 'Факториальное кольцо'],
    content: {
      en: { label: 'UFD', description: 'Unique Factorization Domain.', details: ['Irreducibles'] },
      ru: { label: 'Факториальное кольцо', description: 'Кольцо с однозначным разложением.', details: ['Неприводимые'] }
    }
  },
  'pid': {
    group: Discipline.ALGEBRA,
    kind: NodeKind.CONCEPT,
    val: 12,
    synonyms: ['PID', 'ОГИ', 'Principal Ideal Domain'],
    content: {
      en: { label: 'PID', description: 'Principal Ideal Domain.', details: ['Single generator'] },
      ru: { label: 'ОГИ', description: 'Область главных идеалов.', details: ['Один порождающий'] }
    }
  },
  'euclidean_domain': {
    group: Discipline.ALGEBRA,
    kind: NodeKind.CONCEPT,
    val: 12,
    synonyms: ['Euclidean Domain', 'Евклидово кольцо'],
    content: {
      en: { label: 'Euclidean Domain', description: 'Domain with a division algorithm.', details: ['GCD', 'Algorithm'] },
      ru: { label: 'Евклидово кольцо', description: 'Область с алгоритмом деления.', details: ['НОД', 'Алгоритм'] }
    }
  },
  'poset': {
    group: Discipline.ORDER_THEORY,
    kind: NodeKind.CONCEPT,
    val: 14,
    synonyms: ['Poset', 'ЧУМ', 'Partially Ordered Set'],
    content: {
      en: { label: 'Poset', description: 'Partially Ordered Set.', details: ['Reflexive', 'Antisymmetric'] },
      ru: { label: 'ЧУМ', description: 'Частично упорядоченное множество.', details: ['Рефлексивность', 'Антисимметричность'] }
    }
  },
  'linear_order': {
    group: Discipline.ORDER_THEORY,
    kind: NodeKind.CONCEPT,
    val: 15,
    synonyms: ['Linear Order', 'Total Order', 'ЛУМ', 'Линейно упорядоченное множество'],
    content: {
      en: { label: 'Linear Order', description: 'A poset satisfying the connexity property.', details: ['Comparable elements', 'Line'] },
      ru: { label: 'Линейный порядок (ЛУМ)', description: 'ЧУМ, удовлетворяющий свойству связности.', details: ['Сравнимые элементы', 'Линия'] }
    }
  },
  'lattice': {
    group: Discipline.ORDER_THEORY,
    kind: NodeKind.CONCEPT,
    val: 14,
    synonyms: ['Lattice', 'Решетка'],
    content: {
      en: { label: 'Lattice', description: 'Poset with meets and joins.', details: ['Supremum', 'Infimum'] },
      ru: { label: 'Решетка', description: 'ЧУМ с точными гранями.', details: ['Супремум', 'Инфимум'] }
    }
  },
  'dist_lattice': {
    group: Discipline.ORDER_THEORY,
    kind: NodeKind.CONCEPT,
    val: 12,
    synonyms: ['Distributive Lattice', 'Дистрибутивная решетка'],
    content: {
      en: { label: 'Distributive Lattice', description: 'Lattice with distributivity laws.', details: [] },
      ru: { label: 'Дистрибутивная решетка', description: 'Решетка с законами дистрибутивности.', details: [] }
    }
  },
  'auto_group': {
    group: Discipline.ALGEBRA,
    kind: NodeKind.CONCEPT,
    val: 12,
    synonyms: ['Automorphism Group', 'Группа автоморфизмов'],
    content: {
      en: { label: 'Automorphism Group', description: 'Group of symmetries of a structure.', details: [] },
      ru: { label: 'Группа автоморфизмов', description: 'Группа симметрий структуры.', details: [] }
    }
  },
  'diophantine_set': {
    group: Discipline.ALGEBRA,
    kind: NodeKind.CONCEPT,
    val: 12,
    synonyms: ['Diophantine Set', 'Диофантово множество'],
    content: {
      en: { label: 'Diophantine Set', description: 'Set defined by polynomial equations.', details: ['Hilbert 10'] },
      ru: { label: 'Диофантово множество', description: 'Множество, заданное полиномами.', details: ['10-я проблема Гильберта'] }
    }
  },
  'saturated_model': {
    group: Discipline.MODEL_THEORY,
    kind: NodeKind.CONCEPT,
    val: 14,
    synonyms: ['Saturated Model', 'Насыщенная модель'],
    content: {
      en: { label: 'Saturated Model', description: 'Model realizing all types.', details: ['Universality', 'Homogeneity'] },
      ru: { label: 'Насыщенная модель', description: 'Модель, реализующая все типы.', details: ['Универсальность', 'Однородность'] }
    }
  },
  'prime_model': {
    group: Discipline.MODEL_THEORY,
    kind: NodeKind.CONCEPT,
    val: 12,
    synonyms: ['Prime Model', 'Простая модель'],
    content: {
      en: { label: 'Prime Model', description: 'Model embeddable into any other model.', details: ['Atomic'] },
      ru: { label: 'Простая модель', description: 'Модель, вложимая в любую другую.', details: ['Атомная'] }
    }
  },
  'indiscernibles': {
    group: Discipline.MODEL_THEORY,
    kind: NodeKind.CONCEPT,
    val: 12,
    synonyms: ['Indiscernibles', 'Неразличимые'],
    content: {
      en: { label: 'Indiscernibles', description: 'Sequence where order determines truth.', details: ['Ramsey'] },
      ru: { label: 'Неразличимые', description: 'Последовательность, где порядок определяет истину.', details: ['Рамсей'] }
    }
  },
  'qe': {
    group: Discipline.MODEL_THEORY,
    kind: NodeKind.CONCEPT,
    val: 14,
    synonyms: ['QE', 'Quantifier Elimination', 'Элиминация кванторов'],
    content: {
      en: { label: 'Quantifier Elimination', description: 'Formulas equivalent to quantifier-free ones.', details: [] },
      ru: { label: 'Элиминация кванторов', description: 'Формулы эквивалентны бескванторным.', details: [] }
    }
  },
  'ultraproduct': {
    group: Discipline.MODEL_THEORY,
    kind: NodeKind.CONCEPT,
    val: 14,
    synonyms: ['Ultraproduct', 'Ультрапроизведение'],
    content: {
      en: { label: 'Ultraproduct', description: 'Structure construction via ultrafilter.', details: ['Los Theorem'] },
      ru: { label: 'Ультрапроизведение', description: 'Конструкция структуры через ультрафильтр.', details: ['Теорема Лося'] }
    }
  },
  'scattered_space': {
    group: Discipline.TOPOLOGY,
    kind: NodeKind.CONCEPT,
    val: 12,
    synonyms: ['Scattered Space', 'Разреженное пространство'],
    content: {
      en: { label: 'Scattered Space', description: 'Every subset has an isolated point.', details: [] },
      ru: { label: 'Разреженное пространство', description: 'Каждое подмножество имеет изолированную точку.', details: [] }
    }
  },
  'alexandrov_topology': {
    group: Discipline.TOPOLOGY,
    kind: NodeKind.CONCEPT,
    val: 12,
    synonyms: ['Alexandrov Topology', 'Топология Александрова'],
    content: {
      en: { label: 'Alexandrov Topology', description: 'Arbitrary intersections of open sets are open.', details: ['Preorders'] },
      ru: { label: 'Топология Александрова', description: 'Любые пересечения открытых — открыты.', details: ['Предпорядки'] }
    }
  },
  'fixed_point_comb': {
    group: Discipline.COMPUTABILITY,
    kind: NodeKind.CONCEPT,
    val: 12,
    synonyms: ['Fixed Point Combinator', 'Комбинатор неподвижной точки'],
    content: {
      en: { label: 'Y Combinator', description: 'Enables recursion in lambda calculus.', details: [] },
      ru: { label: 'Y-комбинатор', description: 'Обеспечивает рекурсию в лямбда-исчислении.', details: [] }
    }
  },
  'combinators': {
  group: Discipline.COMPUTABILITY,
  kind: NodeKind.CONCEPT,
  val: 14,
  synonyms: ['Combinator Calculus', 'Комбинаторная логика'],
  content: {
    en: { 
      label: 'Combinator Calculus', 
      description: 'Variable-free notation for functions.',
      details: ['S, K, I combinators', 'Curry', 'Church encoding']
    },
    ru: { 
      label: 'Комбинаторная логика', 
      description: 'Безпеременная нотация для функций.',
      details: ['Комбинаторы S, K, I', 'Карри', 'Кодирование Чёрча']
    }
  }
},
  'ski_combinators': {
    group: Discipline.COMPUTABILITY,
    kind: NodeKind.CONCEPT,
    val: 12,
    synonyms: ['SKI', 'Combinators'],
    content: {
      en: { label: 'SKI', description: 'S, K, I combinators.', details: ['Combinatory Logic'] },
      ru: { label: 'SKI', description: 'Комбинаторы S, K, I.', details: ['Комбинаторная логика'] }
    }
  },
  'ordinal_omega': {
    group: Discipline.SET_THEORY,
    kind: NodeKind.CONCEPT,
    val: 14,
    synonyms: ['Omega', 'Омега'],
    content: {
      en: { label: '$\\omega$', description: 'The first infinite ordinal.', details: [] },
      ru: { label: '$\\omega$', description: 'Первый бесконечный ординал.', details: [] }
    }
  },
  'cardinal_aleph1': {
    group: Discipline.SET_THEORY,
    kind: NodeKind.CONCEPT,
    val: 12,
    synonyms: ['Aleph-1', 'Алеф-один'],
    content: {
      en: { label: '$\\aleph_1$', description: 'The first uncountable cardinal.', details: [] },
      ru: { label: '$\\aleph_1$', description: 'Первый несчетный кардинал.', details: [] }
    }
  },
  'gamma_0': {
    group: Discipline.PROOF_THEORY,
    kind: NodeKind.CONCEPT,
    val: 12,
    synonyms: ['Gamma-0', 'Гамма-нулевое'],
    content: {
      en: { label: '$\\Gamma_0$', description: 'Feferman-Schuette ordinal.', details: ['Predicativity'] },
      ru: { label: '$\\Gamma_0$', description: 'Ординал Фефермана-Шютте.', details: ['Предикативность'] }
    }
  },
  'stone_space_types': {
    group: Discipline.MODEL_THEORY,
    kind: NodeKind.CONCEPT,
    val: 14,
    synonyms: ['Space of Types', 'Пространство типов'],
    content: {
      en: { label: 'Space of Types', description: 'Topological space of complete types.', details: ['Compact', 'Totally disconnected'] },
      ru: { label: 'Пространство типов', description: 'Топологическое пространство полных типов.', details: ['Компактное', 'Вполне несвязное'] }
    }
  },
  'omitting_types': {
    group: Discipline.MODEL_THEORY,
    kind: NodeKind.CONCEPT, // Could be theorem, but used as method
    val: 12,
    synonyms: ['Omitting Types', 'Опускание типов'],
    content: {
      en: { label: 'Omitting Types', description: 'Constructing models omitting non-principal types.', details: [] },
      ru: { label: 'Опускание типов', description: 'Построение моделей, опускающих неглавные типы.', details: [] }
    }
  },
  'lambda_reductions': {
    group: Discipline.COMPUTABILITY,
    kind: NodeKind.CONCEPT,
    val: 12,
    synonyms: ['Reductions', 'Редукции'],
    content: {
      en: { label: 'Reductions', description: 'Beta-reduction rules.', details: [] },
      ru: { label: 'Редукции', description: 'Правила бета-редукции.', details: [] }
    }
  },
  'inference_rules': {
    group: Discipline.LOGIC,
    kind: NodeKind.CONCEPT,
    val: 14,
    synonyms: ['Inference Rules', 'Правила вывода'],
    content: {
      en: { label: 'Inference Rules', description: 'Modus Ponens, Generalization, etc.', details: [] },
      ru: { label: 'Правила вывода', description: 'Modus Ponens, Обобщение и т.д.', details: [] }
    }
  },
  'curry_howard': {
    group: Discipline.PROOF_THEORY,
    kind: NodeKind.CONCEPT,
    val: 16,
    synonyms: ['Curry-Howard', 'Карри-Ховард', 'Isomorphism'],
    content: {
      en: { label: 'Curry-Howard', description: 'Propositions as Types.', details: ['Proofs as Programs'] },
      ru: { label: 'Карри-Ховард', description: 'Утверждения как Типы.', details: ['Доказательства как программы'] }
    }
  },
  'homomorphism_thms': {
    group: Discipline.ALGEBRA,
    kind: NodeKind.CONCEPT, // Or Theorem group
    val: 12,
    synonyms: ['Isomorphism Theorems', 'Теоремы об изоморфизме'],
    content: {
      en: { label: 'Isomorphism Theorems', description: 'Fundamental theorems for groups/rings.', details: [] },
      ru: { label: 'Теоремы об изоморфизме', description: 'Фундаментальные теоремы для групп/колец.', details: [] }
    }
  },

  // ==========================================
  // 5. THEOREMS (Именные теоремы, аксиомы, гипотезы)
  // ==========================================
  'axiom_choice': {
    group: Discipline.SET_THEORY,
    kind: NodeKind.THEOREM,
    val: 20,
    synonyms: ['Axiom of Choice', 'Аксиома Выбора', 'AC'],
    content: {
      en: { label: 'Axiom of Choice', description: 'Arbitrary cartesian product of non-empty sets is non-empty.', details: ['Independent', 'Zermelo'] },
      ru: { label: 'Аксиома Выбора', description: 'Произвольное декартово произведение непустых множеств непусто.', details: ['Независима', 'Цермело'] }
    }
  },
  'continuum_hypothesis': {
    group: Discipline.SET_THEORY,
    kind: NodeKind.THEOREM,
    val: 18,
    synonyms: ['CH', 'Continuum Hypothesis', 'Континуум-гипотеза'],
    content: {
      en: { label: 'Continuum Hypothesis', description: 'There is no cardinality strictly between aleph-0 and c.', details: ['Cantor', 'Independent'] },
      ru: { label: 'Континуум-гипотеза', description: 'Нет мощности строго между алеф-0 и c.', details: ['Кантор', 'Независима'] }
    }
  },
  'godel_incompleteness': {
    group: Discipline.LOGIC,
    kind: NodeKind.THEOREM,
    val: 22,
    synonyms: ['Incompleteness Theorems', 'Теоремы о неполноте', 'Gödel'],
    content: {
      en: { label: 'Incompleteness Theorems', description: 'No consistent system containing arithmetic can prove its own consistency.', details: ['First Theorem', 'Second Theorem'] },
      ru: { label: 'Теоремы о неполноте', description: 'Никакая непротиворечивая система с арифметикой не может доказать свою непротиворечивость.', details: ['Первая теорема', 'Вторая теорема'] }
    }
  },
  'thm_completeness': {
    group: Discipline.LOGIC,
    kind: NodeKind.THEOREM,
    val: 20,
    synonyms: ['Completeness Theorem', 'Теорема о полноте'],
    content: {
      en: { label: 'Completeness Theorem', description: 'A theory is consistent iff it has a model.', details: ['Gödel', 'Model Existence'] },
      ru: { label: 'Теорема о полноте', description: 'Теория непротиворечива т. и т. т., когда у нее есть модель.', details: ['Гёдель', 'Существование модели'] }
    }
  },
  'thm_compactness': {
    group: Discipline.LOGIC,
    kind: NodeKind.THEOREM,
    val: 18,
    synonyms: ['Compactness Theorem', 'Теорема компактности'],
    content: {
      en: { label: 'Compactness Theorem', description: 'A theory is satisfiable iff every finite subset is satisfiable.', details: ['Finiteness', 'Non-standard models'] },
      ru: { label: 'Теорема компактности', description: 'Теория выполнима т. и т. т., когда каждое ее конечное подмножество выполнимо.', details: ['Финитность', 'Нестандартные модели'] }
    }
  },
  'thm_lowenheim': {
    group: Discipline.MODEL_THEORY,
    kind: NodeKind.THEOREM,
    val: 18,
    synonyms: ['Löwenheim-Skolem', 'Лёвенгейм-Сколем'],
    content: {
      en: { label: 'Löwenheim-Skolem', description: 'If a theory has an infinite model, it has models of all infinite cardinalities.', details: ['Upward', 'Downward'] },
      ru: { label: 'Лёвенгейм-Сколем', description: 'Если у теории есть бесконечная модель, у нее есть модели всех бесконечных мощностей.', details: ['Вверх', 'Вниз'] }
    }
  },
  'thm_cantor': {
    group: Discipline.SET_THEORY,
    kind: NodeKind.THEOREM,
    val: 18,
    synonyms: ['Cantor\'s Theorem', 'Теорема Кантора'],
    content: {
      en: { label: 'Cantor\'s Theorem', description: 'The power set is strictly larger than the set.', details: ['Diagonal Argument'] },
      ru: { label: 'Теорема Кантора', description: 'Булеан строго больше самого множества.', details: ['Диагональный аргумент'] }
    }
  },
  'thm_cbs': {
    group: Discipline.SET_THEORY,
    kind: NodeKind.THEOREM,
    val: 16,
    synonyms: ['Cantor-Bernstein', 'Кантор-Бернштейн', 'CBS'],
    content: {
      en: { label: 'Cantor-Bernstein', description: 'If A<=B and B<=A, then A=B.', details: ['Bijective', 'Injective'] },
      ru: { label: 'Кантор-Бернштейн', description: 'Если A<=B и B<=A, то A=B.', details: ['Биекция', 'Инъекция'] }
    }
  },
  'thm_zorn': {
    group: Discipline.SET_THEORY,
    kind: NodeKind.THEOREM,
    val: 16,
    synonyms: ['Zorn\'s Lemma', 'Лемма Цорна'],
    content: {
      en: { label: 'Zorn\'s Lemma', description: 'If every chain has an upper bound, there is a maximal element.', details: ['Equivalent to AC'] },
      ru: { label: 'Лемма Цорна', description: 'Если у каждой цепи есть верхняя грань, то есть максимальный элемент.', details: ['Эквивалентна AC'] }
    }
  },
  'thm_zermelo_wo': {
    group: Discipline.SET_THEORY,
    kind: NodeKind.THEOREM,
    val: 16,
    synonyms: ['Well-Ordering Theorem', 'Теорема Цермело', 'Вполне упорядочение'],
    content: {
      en: { label: 'Well-Ordering Theorem', description: 'Every set can be well-ordered.', details: ['Equivalent to AC'] },
      ru: { label: 'Теорема Цермело', description: 'Любое множество может быть вполне упорядочено.', details: ['Эквивалентна AC'] }
    }
  },
// 3. Теорема Морли (Главная теорема о несчетной категоричности)
'thm_morley': {
  group: Discipline.MODEL_THEORY,
  kind: NodeKind.THEOREM,
  val: 25,
  synonyms: ['Morley Categoricity Theorem', 'Теорема Морли'],
  content: {
    en: {
      label: "Morley's Categoricity Theorem",
      description: 'If a countable theory is categorical in one uncountable cardinality, it is categorical in all uncountable cardinalities.',
      details: ['Major result of model theory', 'Introduced Morley Rank', 'Baldwin-Lachlan proof']
    },
    ru: {
      label: 'Теорема Морли о категоричности',
      description: 'Если счетная теория категорична в одной несчетной мощности, то она категорична во всех несчетных мощностях.',
      details: ['Фундаментальный результат', 'Вводит ранг Морли', 'Доказательство Болдуина-Лахлана']
    }
  }
},
  'thm_los_vaught': {
    group: Discipline.MODEL_THEORY,
    kind: NodeKind.THEOREM,
    val: 14,
    synonyms: ['Los-Vaught Test', 'Тест Воота', 'Критерий Лося-Воота'],
    content: {
      en: { label: 'Łoś-Vaught Test', description: 'Categoricity + No finite models implies Completeness.', details: [] },
      ru: { label: 'Тест Воота', description: 'Категоричность + Нет конечных моделей влечет Полноту.', details: [] }
    }
  },
// 4. Теорема Рылль-Нардзевского (Главная теорема о СЧЕТНОЙ категоричности)
'thm_ryll': {
  group: Discipline.MODEL_THEORY,
  kind: NodeKind.THEOREM,
  val: 25,
  synonyms: ['Ryll-Nardzewski Theorem', 'Теорема Рылль-Нардзевского'],
  content: {
    en: {
      label: 'Ryll-Nardzewski Theorem',
      description: 'Characterizes ω-categorical theories via the finiteness of Boolean algebras of formulas (types).',
      details: ['Concerns countable models', 'Isolated types', 'Oligomorphic permutation groups']
    },
    ru: {
      label: 'Теорема Рылль-Нардзевского',
      description: 'Характеризует ω-категоричные теории через конечность булевых алгебр формул (типов).',
      details: ['Относится к счетным моделям', 'Изолированные типы', 'Олигоморфные группы']
    }
  }
},
  'thm_tarski_seidenberg': {
    group: Discipline.MODEL_THEORY,
    kind: NodeKind.THEOREM,
    val: 14,
    synonyms: ['Tarski-Seidenberg', 'Тарский-Зайденберг'],
    content: {
      en: { label: 'Tarski-Seidenberg', description: 'Quantifier elimination for Real Closed Fields.', details: ['Projections', 'Semi-algebraic'] },
      ru: { label: 'Тарский-Зайденберг', description: 'Элиминация кванторов для вещественно замкнутых полей.', details: ['Проекции', 'Полуалгебраические'] }
    }
  },
  'thm_tarski_undef': {
    group: Discipline.LOGIC,
    kind: NodeKind.THEOREM,
    val: 14,
    synonyms: ['Tarski Undefinability', 'Невыразимость истины'],
    content: {
      en: { label: 'Tarski Undefinability', description: 'Arithmetical truth is not arithmetically definable.', details: [] },
      ru: { label: 'Невыразимость истины', description: 'Арифметическая истина не выразима арифметически.', details: [] }
    }
  },
  'church_turing': {
    group: Discipline.COMPUTABILITY,
    kind: NodeKind.THEOREM,
    val: 16,
    synonyms: ['Church-Turing Thesis', 'Тезис Черча-Тьюринга'],
    content: {
      en: { label: 'Church-Turing Thesis', description: 'Intuitive computability equals Turing computability.', details: [] },
      ru: { label: 'Тезис Черча-Тьюринга', description: 'Интуитивная вычислимость равна вычислимости по Тьюрингу.', details: [] }
    }
  },
  'halting_problem': {
    group: Discipline.COMPUTABILITY,
    kind: NodeKind.THEOREM,
    val: 16,
    synonyms: ['Halting Problem', 'Проблема остановки'],
    content: {
      en: { label: 'Halting Problem', description: 'Undecidability of whether a program stops.', details: [] },
      ru: { label: 'Проблема остановки', description: 'Неразрешимость остановки программы.', details: [] }
    }
  },
  'rice_theorem': {
    group: Discipline.COMPUTABILITY,
    kind: NodeKind.THEOREM,
    val: 14,
    synonyms: ['Rice\'s Theorem', 'Теорема Райса'],
    content: {
      en: { label: 'Rice\'s Theorem', description: 'Any non-trivial semantic property of programs is undecidable.', details: [] },
      ru: { label: 'Теорема Райса', description: 'Любое нетривиальное семантическое свойство программ неразрешимо.', details: [] }
    }
  },
  'recursion_theorem': {
    group: Discipline.COMPUTABILITY,
    kind: NodeKind.THEOREM,
    val: 14,
    synonyms: ['Recursion Theorem', 'Теорема о рекурсии', 'Kleene'],
    content: {
      en: { label: 'Recursion Theorem', description: 'Fixed point theorem for computable functions.', details: ['Kleene', 'Quines'] },
      ru: { label: 'Теорема о рекурсии', description: 'Теорема о неподвижной точке для вычислимых функций.', details: ['Клини', 'Куайны'] }
    }
  },
  'smn_theorem': {
    group: Discipline.COMPUTABILITY,
    kind: NodeKind.THEOREM,
    val: 12,
    synonyms: ['s-m-n Theorem', 's-m-n теорема'],
    content: {
      en: { label: 's-m-n Theorem', description: 'Parameterization theorem.', details: [] },
      ru: { label: 's-m-n теорема', description: 'Теорема о параметризации.', details: [] }
    }
  },
  'church_rosser': {
    group: Discipline.COMPUTABILITY,
    kind: NodeKind.THEOREM,
    val: 12,
    synonyms: ['Church-Rosser', 'Черч-Россер'],
    content: {
      en: { label: 'Church-Rosser', description: 'Confluence of lambda calculus.', details: [] },
      ru: { label: 'Черч-Россер', description: 'Конфлюэнтность лямбда-исчисления.', details: [] }
    }
  },
  'thm_chevalley': {
    group: Discipline.ALGEBRA,
    kind: NodeKind.THEOREM,
    val: 12,
    synonyms: ['Chevalley Theorem', 'Теорема Шевалье'],
    content: {
      en: { label: 'Chevalley Theorem', description: 'Constructible sets are closed under projection.', details: [] },
      ru: { label: 'Теорема Шевалье', description: 'Конструктивные множества замкнуты относительно проекции.', details: [] }
    }
  },
  'crt': {
    group: Discipline.ALGEBRA,
    kind: NodeKind.THEOREM,
    val: 14,
    synonyms: ['Chinese Remainder Theorem', 'КТО', 'Китайская теорема об остатках'],
    content: {
      en: { label: 'Chinese Remainder Thm', description: 'System of congruences solution.', details: [] },
      ru: { label: 'Китайская теорема об остатках', description: 'Решение системы сравнений.', details: [] }
    }
  },
  'thm_stone': {
    group: Discipline.TOPOLOGY,
    kind: NodeKind.THEOREM,
    val: 14,
    synonyms: ['Stone Representation', 'Теорема Стоуна'],
    content: {
      en: { label: 'Stone Representation', description: 'Boolean algebras are fields of sets.', details: [] },
      ru: { label: 'Теорема Стоуна', description: 'Булевы алгебры изоморфны полям множеств.', details: [] }
    }
  },
  'bpi': {
    group: Discipline.SET_THEORY,
    kind: NodeKind.THEOREM,
    val: 14,
    synonyms: ['BPI', 'Boolean Prime Ideal Theorem', 'Теорема о простом идеале'],
    content: {
      en: { label: 'BPI', description: 'Boolean Prime Ideal Theorem. Weaker than AC.', details: [] },
      ru: { label: 'BPI', description: 'Теорема о простом идеале в булевой алгебре. Слабее AC.', details: [] }
    }
  },
  'thm_knaster': {
    group: Discipline.ORDER_THEORY,
    kind: NodeKind.THEOREM,
    val: 12,
    synonyms: ['Knaster-Tarski', 'Кнастер-Тарский'],
    content: {
      en: { label: 'Knaster-Tarski', description: 'Fixed point theorem for complete lattices.', details: [] },
      ru: { label: 'Кнастер-Тарский', description: 'Теорема о неподвижной точке для полных решеток.', details: [] }
    }
  },
  'thm_kruskal': {
    group: Discipline.PROOF_THEORY,
    kind: NodeKind.THEOREM,
    val: 12,
    synonyms: ['Kruskal\'s Theorem', 'Теорема Крускала'],
    content: {
      en: { label: 'Kruskal\'s Theorem', description: 'Tree embedding well-quasi-ordering.', details: ['Unprovable in PA'] },
      ru: { label: 'Теорема Крускала', description: 'Вполне-квази-упорядочение деревьев.', details: ['Недоказуема в PA'] }
    }
  },
  'goodstein_theorem': {
    group: Discipline.PROOF_THEORY,
    kind: NodeKind.THEOREM,
    val: 14,
    synonyms: ['Goodstein Theorem', 'Теорема Гудстейна'],
    content: {
      en: { label: 'Goodstein Theorem', description: 'Independence result from PA about numerical sequences.', details: [] },
      ru: { label: 'Теорема Гудстейна', description: 'Независимость от PA утверждения о числовых последовательностях.', details: [] }
    }
  },
  'cut_elimination': {
    group: Discipline.PROOF_THEORY,
    kind: NodeKind.THEOREM,
    val: 14,
    synonyms: ['Cut Elimination', 'Устранение сечения', 'Hauptsatz'],
    content: {
      en: { label: 'Cut Elimination', description: 'Every proof can be transformed into a direct proof.', details: ['Gentzen'] },
      ru: { label: 'Устранение сечения', description: 'Любое доказательство можно преобразовать в прямое.', details: ['Генцен'] }
    }
  },
  'ac_omega': {
    group: Discipline.SET_THEORY,
    kind: NodeKind.THEOREM,
    val: 12,
    synonyms: ['Countable Choice', 'Счетный выбор'],
    content: {
      en: { label: 'Countable Choice', description: 'Choice for countable families.', details: [] },
      ru: { label: 'Счетный выбор', description: 'Выбор для счетных семейств.', details: [] }
    }
  },
  'axiom_determinacy': {
    group: Discipline.SET_THEORY,
    kind: NodeKind.THEOREM,
    val: 12,
    synonyms: ['Axiom of Determinacy', 'Аксиома детерминированности', 'AD'],
    content: {
      en: { label: 'Axiom of Determinacy', description: 'Alternative to Choice for games.', details: [] },
      ru: { label: 'Аксиома детерминированности', description: 'Альтернатива Выбору для игр.', details: [] }
    }
  },
  'markov_principle': {
    group: Discipline.LOGIC,
    kind: NodeKind.THEOREM,
    val: 10,
    synonyms: ['Markov Principle', 'Принцип Маркова'],
    content: {
      en: { label: 'Markov Principle', description: 'Constructive principle regarding termination.', details: [] },
      ru: { label: 'Принцип Маркова', description: 'Конструктивный принцип остановки.', details: [] }
    }
  },
  'skolem_paradox': {
    group: Discipline.MODEL_THEORY,
    kind: NodeKind.THEOREM, // or Concept
    val: 12,
    synonyms: ['Skolem Paradox', 'Парадокс Скулема'],
    content: {
      en: { label: 'Skolem Paradox', description: 'Countable models of set theory.', details: [] },
      ru: { label: 'Парадокс Скулема', description: 'Счетные модели теории множеств.', details: [] }
    }
  },
  'thm_ef_games': {
    group: Discipline.MODEL_THEORY,
    kind: NodeKind.CONCEPT, // method
    val: 14,
    synonyms: ['EF Games', 'Игры ЭФ', 'Ehrenfeucht-Fraisse'],
    content: {
      en: { label: 'EF Games', description: 'Game theoretic characterization of elementary equivalence.', details: [] },
      ru: { label: 'Игры ЭФ', description: 'Игровая характеризация элементарной эквивалентности.', details: [] }
    }
  },
  'ring_poly': {
    group: Discipline.ALGEBRA,
    kind: NodeKind.STRUCTURE,
    val: 14,
    synonyms: ['K[x]', 'Polynomial Ring', 'Кольцо многочленов'],
    content: {
      en: { 
        label: 'Polynomial Ring $K[x]$', 
        description: 'Ring of polynomials over a field.', 
        details: ['UFD', 'Noetherian', 'Not Saturated', 'Hilbert Basis Thm'] 
      },
      ru: { 
        label: 'Кольцо многочленов $K[x]$', 
        description: 'Кольцо многочленов над полем.', 
        details: ['Факториальное (UFD)', 'Нетерово', 'Не насыщенное', 'Базис Гильберта'] 
      }
    }
  },
  'field_rat_func': {
    group: Discipline.ALGEBRA,
    kind: NodeKind.STRUCTURE,
    val: 14,
    synonyms: ['K(x)', 'Function Field', 'Поле рациональных функций'],
    content: {
      en: { 
        label: 'Function Field $K(x)$', 
        description: 'Field of rational functions (fractions of polynomials).', 
        details: ['Transcendental extension', 'Generic Point', 'Realizes generic type'] 
      },
      ru: { 
        label: 'Поле функций $K(x)$', 
        description: 'Поле рациональных дробей.', 
        details: ['Трансцендентное расширение', 'Генерическая точка', 'Реализует генерический тип'] 
      }
    }
  },
  // ==============================================================================
// PROOF-THEORETIC ORDINALS (Доказательные ординалы)
// ==============================================================================
'church_kleene': {
  group: Discipline.PROOF_THEORY,
  kind: NodeKind.STRUCTURE,
  val: 14,
  synonyms: ['ω₁^CK', 'Church-Kleene ordinal', 'Ординал Чёрча-Клини'],
  content: {
    en: { 
      label: '$\\omega_₁^{CK}$', 
      description: 'The supremum of computable ordinals. First non-computable ordinal.',
      details: ['Hyperarithmetical hierarchy', 'Kleene\'s O', 'Admissible ordinal']
    },
    ru: { 
      label: '$\\omega_₁^{CK}$', 
      description: 'Супремум вычислимых ординалов. Первый невычислимый ординал.',
      details: ['Гиперарифметическая иерархия', 'Kleene O', 'Допустимый ординал']
    }
  }
},

'ordinal_bachmann_howard': {
  group: Discipline.PROOF_THEORY,
  kind: NodeKind.STRUCTURE,
  val: 12,
  synonyms: ['Bachmann-Howard ordinal', 'Ординал Бахмана-Ховарда'],
  content: {
    en: { 
      label: 'Bachmann-Howard Ordinal', 
      description: 'Proof-theoretic ordinal of Kripke-Platek set theory with infinity.',
      details: ['KP + Infinity', 'Collapsing functions']
    },
    ru: { 
      label: 'Ординал Бахмана-Ховарда', 
      description: 'Доказательный ординал теории множеств Крипке-Платека с бесконечностью.',
      details: ['KP + Inf', 'Коллапсирующие функции']
    }
  }
},

'ordinal_takeuti_feferman_buchholz': {
  group: Discipline.PROOF_THEORY,
  kind: NodeKind.STRUCTURE,
  val: 12,
  synonyms: ['ψ₀(Ω_ω)', 'TFB ordinal'],
  content: {
    en: { 
      label: 'Takeuti-Feferman-Buchholz', 
      description: 'Proof-theoretic ordinal of $\\Pi^1_1-CA_0$ and related systems.',
      details: ['Extended Veblen', 'Ordinal collapsing']
    },
    ru: { 
      label: 'Ординал Такеути-Феферман-Бухгольц', 
      description: 'Доказательный ординал $\\Pi^1_1-CA_0$ и связанных систем.',
      details: ['Расширенный Веблен', 'Коллапс ординалов']
    }
  }
},

// ==============================================================================
// MODEL THEORY ADDITIONS
// ==============================================================================
'reduct': {
  group: Discipline.MODEL_THEORY,
  kind: NodeKind.CONCEPT,
  val: 12,
  synonyms: ['Reduct', 'Редукт', 'Restriction'],
  content: {
    en: { 
      label: 'Reduct', 
      description: 'Structure obtained by forgetting part of the signature.',
      details: ['Signature restriction', 'Definability', 'Induced structure']
    },
    ru: { 
      label: 'Редукт', 
      description: 'Структура, полученная забыванием части сигнатуры.',
      details: ['Ограничение сигнатуры', 'Определимость', 'Индуцированная структура']
    }
  }
},

'kripke_model': {
  group: Discipline.LOGIC,
  kind: NodeKind.CONCEPT,
  val: 14,
  synonyms: ['Kripke Model', 'Модель Крипке'],
  content: {
    en: { 
      label: 'Kripke Model', 
      description: 'Frame with valuation function. (W, R, V)',
      details: ['Truth at worlds', 'Forcing relation']
    },
    ru: { 
      label: 'Модель Крипке', 
      description: 'Шкала с функцией оценки. (W, R, V)',
      details: ['Истинность в мирах', 'Отношение вынуждения']
    }
  }
},

// ==============================================================================
// ORDER THEORY ADDITIONS
// ==============================================================================
'well_order': {
  group: Discipline.ORDER_THEORY,
  kind: NodeKind.CONCEPT,
  val: 16,
  synonyms: ['Well-order', 'Вполне упорядоченное множество', 'Well-ordering'],
  content: {
    en: { 
      label: 'Well-Order', 
      description: 'Total order where every non-empty subset has a least element.',
      details: ['Foundation', 'Transfinite induction', 'Order type']
    },
    ru: { 
      label: 'Вполне упорядоченное множество', 
      description: 'Линейный порядок, в котором каждое непустое подмножество имеет наименьший элемент.',
      details: ['Фундированность', 'Трансфинитная индукция', 'Тип порядка']
    }
  }
},

'chain_order': {
  group: Discipline.ORDER_THEORY,
  kind: NodeKind.CONCEPT,
  val: 12,
  synonyms: ['Chain', 'Цепь', 'Totally ordered subset'],
  content: {
    en: { 
      label: 'Chain', 
      description: 'Totally ordered subset of a poset.',
      details: ['Maximal chains', 'Zorn\'s Lemma']
    },
    ru: { 
      label: 'Цепь', 
      description: 'Линейно упорядоченное подмножество частично упорядоченного множества.',
      details: ['Максимальные цепи', 'Лемма Цорна']
    }
  }
},

'antichain': {
  group: Discipline.ORDER_THEORY,
  kind: NodeKind.CONCEPT,
  val: 12,
  synonyms: ['Antichain', 'Антицепь'],
  content: {
    en: { 
      label: 'Antichain', 
      description: 'Subset with no comparable elements.',
      details: ['Sperner\'s theorem', 'Width', 'Dilworth\'s theorem']
    },
    ru: { 
      label: 'Антицепь', 
      description: 'Подмножество без сравнимых элементов.',
      details: ['Теорема Шпернера', 'Ширина', 'Теорема Дилворта']
    }
  }
},

'narrow_order': {
  group: Discipline.ORDER_THEORY,
  kind: NodeKind.CONCEPT,
  val: 10,
  synonyms: ['Narrow Order', 'Стройный порядок', 'Slim Order'],
  content: {
    en: { 
      label: 'Narrow Order', 
      description: 'Order with no uncountable chains or antichains.',
      details: ['Aronszajn trees', 'Suslin hypothesis']
    },
    ru: { 
      label: 'Стройный порядок', 
      description: 'Порядок без несчётных цепей и антицепей.',
      details: ['Деревья Аронсзайна', 'Гипотеза Суслина']
    }
  }
},

// ==============================================================================
// COMPUTABILITY THEORY EXTENSIONS
// ==============================================================================
'computable_function': {
  group: Discipline.COMPUTABILITY,
  kind: NodeKind.CONCEPT,
  val: 18,
  synonyms: ['Computable Function', 'Вычислимая функция', 'Recursive'],
  content: {
    en: { 
      label: 'Computable Function', 
      description: 'Function computable by Turing machine or equivalent model.',
      details: ['Church-Turing equivalence', 'Partial/Total', 'Enumeration']
    },
    ru: { 
      label: 'Вычислимая функция', 
      description: 'Функция, вычислимая машиной Тьюринга или эквивалентной моделью.',
      details: ['Эквивалентность Чёрча-Тьюринга', 'Частичная/Полная', 'Нумерация']
    }
  }
},

'partial_recursive': {
  group: Discipline.COMPUTABILITY,
  kind: NodeKind.CONCEPT,
  val: 16,
  synonyms: ['Partial Recursive Function', 'Частично рекурсивная функция', 'μ-recursive'],
  content: {
    en: { 
      label: 'Partial Recursive', 
      description: 'Function defined by primitive recursion and unbounded search.',
      details: ['μ-operator', 'Kleene normal form', 'Halting problem']
    },
    ru: { 
      label: 'Частично рекурсивная', 
      description: 'Функция, определённая примитивной рекурсией и неограниченным поиском.',
      details: ['μ-оператор', 'Нормальная форма Клини', 'Проблема остановки']
    }
  }
},

'sigma1_definable': {
  group: Discipline.COMPUTABILITY,
  kind: NodeKind.CONCEPT,
  val: 14,
  synonyms: ['Σ₁-definable', 'Σ₁-определимые функции', 'Recursively enumerable'],
  content: {
    en: { 
      label: '$\\Sigma_1$-definable', 
      description: 'Functions whose graph is recursively enumerable.',
      details: ['Arithmetical hierarchy', 'Post\'s theorem', 'Turing reducibility']
    },
    ru: { 
      label: '$\\Sigma_1$-определимые', 
      description: 'Функции, чей график перечислим.',
      details: ['Арифметическая иерархия', 'Теорема Поста', 'Тьюринг-сводимость']
    }
  }
},

'markov_algorithm': {
  group: Discipline.COMPUTABILITY,
  kind: NodeKind.CONCEPT,
  val: 14,
  synonyms: ['Markov Algorithm', 'Нормальный алгорифм Маркова', 'String rewriting'],
  content: {
    en: { 
      label: 'Markov Algorithm', 
      description: 'String rewriting system equivalent to Turing machines.',
      details: ['Production rules', 'Normal algorithms', 'Completeness']
    },
    ru: { 
      label: 'Алгорифм Маркова', 
      description: 'Система переписывания строк, эквивалентная машинам Тьюринга.',
      details: ['Подстановки', 'Нормальные алгорифмы', 'Полнота']
    }
  }
},

'universal_pl': {
  group: Discipline.COMPUTABILITY,
  kind: NodeKind.CONCEPT,
  val: 14,
  synonyms: ['Universal Programming Language', 'Универсальный язык программирования', 'Turing-complete'],
  content: {
    en: { 
      label: 'Universal PL', 
      description: 'Programming language capable of computing all computable functions.',
      details: ['Turing completeness', 'Simulation', 'Undecidability']
    },
    ru: { 
      label: 'Универсальный ЯП', 
      description: 'Язык программирования, способный вычислить все вычислимые функции.',
      details: ['Тьюринг-полнота', 'Симуляция', 'Неразрешимость']
    }
  }
},

'polytime_function': {
  group: Discipline.COMPUTABILITY,
  kind: NodeKind.CONCEPT,
  val: 14,
  synonyms: ['Polynomial Time', 'Полиномиальное время', 'P-time', 'PTIME'],
  content: {
    en: { 
      label: 'Polynomial Time', 
      description: 'Functions computable in time polynomial in input size.',
      details: ['Complexity class P', 'Efficient computation', 'P vs NP']
    },
    ru: { 
      label: 'Полиномиальное время', 
      description: 'Функции, вычислимые за полиномиальное от размера входа время.',
      details: ['Класс сложности P', 'Эффективные вычисления', 'P vs NP']
    }
  }
},

'polyspace_function': {
  group: Discipline.COMPUTABILITY,
  kind: NodeKind.CONCEPT,
  val: 12,
  synonyms: ['Polynomial Space', 'Полиномиальная память', 'PSPACE'],
  content: {
    en: { 
      label: 'Polynomial Space', 
      description: 'Functions computable using polynomial space.',
      details: ['Complexity class PSPACE', 'Savitch\'s theorem', 'PSPACE-complete']
    },
    ru: { 
      label: 'Полиномиальная память', 
      description: 'Функции, вычислимые с использованием полиномиальной памяти.',
      details: ['Класс PSPACE', 'Теорема Савича', 'PSPACE-полнота']
    }
  }
},

'primitive_recursive': {
  group: Discipline.COMPUTABILITY,
  kind: NodeKind.CONCEPT,
  val: 14,
  synonyms: ['Primitive Recursive', 'Примитивно рекурсивные', 'PR'],
  content: {
    en: { 
      label: 'Primitive Recursive', 
      description: 'Functions defined without unbounded search.',
      details: ['Bounded recursion', 'Provably total', 'Ackermann function']
    },
    ru: { 
      label: 'Примитивно рекурсивные', 
      description: 'Функции без неограниченного поиска.',
      details: ['Ограниченная рекурсия', 'Доказуемо тотальные', 'Функция Аккермана']
    }
  }
},

// ==============================================================================
// SET THEORY: ZF^- and V_{ω+ω}
// ==============================================================================
'zf_minus': {
  group: Discipline.SET_THEORY,
  kind: NodeKind.THEORY,
  val: 28,
  synonyms: ['ZF⁻', 'ZF without Replacement', 'ZF минус подстановка'],
  content: {
    en: { 
      label: '$\\mathsf{ZF}^-$', 
      description: 'ZF without the Axiom Schema of Replacement.',
      details: ['Separation only', 'Weaker than ZF', 'Models $V_{\\omega+\\omega}$']
    },
    ru: { 
      label: '$\\mathsf{ZF}^-$', 
      description: 'ZF без схемы аксиом подстановки.',
      details: ['Только выделение', 'Слабее ZF', 'Моделируется $V_{\\omega+\\omega}$']
    }
  }
},

'model_V_omega_omega': {
  group: Discipline.SET_THEORY,
  kind: NodeKind.STRUCTURE,
  val: 14,
  synonyms: ['V_{ω+ω}', 'Model up to ω+ω'],
  content: {
    en: { 
      label: '$V_{\\omega+\\omega}$', 
      description: 'Cumulative hierarchy up to ordinal $\\omega+\\omega$.',
      details: ['Model of $\\mathsf{ZF}^-$', 'Countable stages', 'Without Replacement']
    },
    ru: { 
      label: '$V_{\\omega+\\omega}$', 
      description: 'Кумулятивная иерархия до ординала $\\omega+\\omega$.',
      details: ['Модель $\\mathsf{ZF}^-$', 'Счётные этапы', 'Без подстановки']
    }
  }
},
'thm_cantor_iso': {
    group: Discipline.MODEL_THEORY, // Или Discipline.LOGIC, если MODEL_THEORY нет
    kind: NodeKind.THEOREM,
    val: 25,
    synonyms: ['Cantor Theorem on DLO', 'Теорема Кантора о DLO', 'Back-and-forth theorem'],
    content: {
      en: {
        label: "Cantor's Isomorphism Theorem",
        description: 'Any two countable dense linear orders without endpoints are isomorphic.',
        details: ['Back-and-forth method', 'Countable models', 'Aleph-0 categoricity']
      },
      ru: {
        label: 'Теорема Кантора об изоморфизме',
        description: 'Любые два счетных плотных линейных порядка без концов изоморфны.',
        details: ['Метод "туда-сюда"', 'Счетные модели', 'Aleph-0 категоричность']
      }
    }
  },
'concept_back_and_forth': {
  group: Discipline.MODEL_THEORY,
  kind: NodeKind.CONCEPT, // Или NodeKind.METHOD, если есть
  val: 20,
  synonyms: ['Back-and-forth method', 'Метод подбора изоморфизма'],
  content: {
    en: {
      label: 'Back-and-forth method',
      description: 'A method for constructing isomorphisms between countably infinite structures by extending partial isomorphisms.',
      details: ['Used in Cantor theorem', 'Fraïssé limits']
    },
    ru: {
      label: 'Метод «туда-сюда»',
      description: 'Метод построения изоморфизма между счетными структурами путем пошагового продления частичных отображений.',
      details: ['Ключевой метод в теории моделей', 'Используется для доказательства элементарной эквивалентности']
    }
  }
},
  'concept_ramsey_theory': {
    group: Discipline.LOGIC, // Теория Рамсея находится на стыке логики и комбинаторики
    kind: NodeKind.CONCEPT,
    val: 22,
    synonyms: ['Теория Рамсея', 'Partition Calculus', 'Ramsey Theory'],
    content: {
      en: {
        label: 'Ramsey Theory',
        description: 'A branch of mathematics studying the conditions under which order must appear in large structures ("Complete disorder is impossible").',
        details: ['Pigeonhole principle', 'Ramsey Theorem', 'Partition relations']
      },
      ru: {
        label: 'Теория Рамсея',
        description: 'Раздел математики, изучающий условия, при которых в больших структурах неизбежно появляется порядок («Полный беспорядок невозможен»).',
        details: ['Принцип Дирихле', 'Теорема Рамсея', 'Свойство разбиения']
      }
    }
  },

// 3. Недостающий концепт: Алеф-0 категоричность (важное свойство DLO)
'concept_aleph0_categorical': {
  group: Discipline.MODEL_THEORY,
  kind: NodeKind.CONCEPT,
  val: 20,
  synonyms: ['Countable categoricity', 'Счетная категоричность'],
  content: {
    en: {
      label: 'ω-Categoricity',
      description: 'A theory is ω-categorical if all its countable models are isomorphic.',
      details: ['Ryll-Nardzewski theorem', 'Vaught test']
    },
    ru: {
      label: 'ω-Категоричность',
      description: 'Свойство теории иметь (с точностью до изоморфизма) ровно одну счетную модель.',
      details: ['Критерий Лося-Воота', 'Свойство DLO']
    }
  }
},
  'thm_kanamori_mcaloon': {
    group: Discipline.LOGIC,
    kind: NodeKind.THEOREM,
    val: 20,
    synonyms: ['Kanamori-McAloon', 'KM Theorem'],
    content: {
      en: {
        label: 'Kanamori-McAloon Theorem',
        description: 'A combinatorial principle in Ramsey theory unprovable in Peano Arithmetic.',
        details: ['Unprovability in PA', 'Ramsey Theory', 'Independent statements']
      },
      ru: {
        label: 'Теорема Канамори-Макалуна',
        description: 'Комбинаторный принцип теории Рамсея, недоказуемый в арифметике Пеано.',
        details: ['Недоказуемость в PA', 'Теория Рамсея', 'Независимые утверждения']
      }
    }
  },
// ==============================================================================
// HELPER CONCEPTS
// ==============================================================================
'transitive_set': {
  group: Discipline.SET_THEORY,
  kind: NodeKind.CONCEPT,
  val: 12,
  synonyms: ['Transitive Set', 'Транзитивное множество'],
  content: {
    en: { 
      label: 'Transitive Set', 
      description: 'Set where x ∈ A implies x ⊆ A.',
      details: ['Ordinals are transitive', 'von Neumann construction']
    },
    ru: { 
      label: 'Транзитивное множество', 
      description: 'Множество, где x ∈ A влечёт x ⊆ A.',
      details: ['Ординалы транзитивны', 'Конструкция фон Неймана']
    }
  }
},

};

// ==============================================================================
// МАТРИЦА СВЯЗЕЙ (ONTOLOGY MATRIX)
// 1. Discipline -> * : CONTAINS (Дисциплина включает тему)
// 2. Theory     -> Theory   : EXTENDS  (ZFC расширяет HF, S4 расширяет K)
// 3. Structure  -> Structure: EXTENDS  (R расширяет Q)
// 4. Concept    -> Concept  : EXTENDS  (Простой идеал расширяет Идеал)
// 5. Structure  -> Theory   : MODELS   (N моделирует PA)
// 6. Theory     -> Theorem  : PROVES   (ZFC доказывает Теорему Кантора)
// 7. Theorem    -> * : RELATED  (Теорема говорит о...)
// 8. * -> * : EQUIVALENT (Изоморфизмы, двойственности)
// ==============================================================================

const RAW_LINKS = [
// DLO "связана" с теоремой (Теорема описывает свойства моделей DLO)
{ source: 'theory_DLO', target: 'thm_cantor_iso', type: LinkType.RELATED, label: 'Characterized by' },
// Теорема "использует" метод туда-сюда (это корректно, так как это метод доказательства)
{ source: 'concept_back_and_forth', target: 'thm_cantor_iso', type: LinkType.PROVES, label: 'Proof method' },
// Теорема "устанавливает" категоричность
{ source: 'thm_cantor_iso', target: 'concept_aleph0_categorical', type: LinkType.RELATED, label: 'Implies' },
// Если у вас есть узел ZFC (мета-теория), то корректная связь PROVES была бы оттуда:
{ source: 'zfc', target: 'thm_cantor_iso', type: LinkType.PROVES, label: 'Meta-proof' },
  // Связи для теоремы Канамори-Макалуна
{ source: 'theory_PA', target: 'thm_kanamori_mcaloon', type: LinkType.RELATED, label: 'Independence' },
{ source: 'theory_PA', target: 'goodstein_theorem', type: LinkType.RELATED, label: 'Independence' },
{ source: 'thm_kanamori_mcaloon', target: 'goodstein_theorem', type: LinkType.RELATED, label: 'Similar unprovability' },
{ source: 'concept_ramsey_theory', target: 'thm_kanamori_mcaloon', type: LinkType.CONTAINS },
  // ==============================================================================
  // 1. DISCIPLINES (ROOTS) -> CONTAINS
  // ==============================================================================
  { source: 'math_lang', target: 'pred_logic', type: LinkType.CONTAINS },
  { source: 'math_lang', target: 'prop_logic', type: LinkType.CONTAINS },
  { source: 'math_lang', target: 'inference_concept', type: LinkType.CONTAINS },

  { source: 'set_theory', target: 'zfc', type: LinkType.CONTAINS },
  { source: 'set_theory', target: 'theory_HF', type: LinkType.CONTAINS },
  { source: 'set_theory', target: 'ordinal_arithmetic', type: LinkType.CONTAINS },
  { source: 'set_theory', target: 'cardinal_arithmetic', type: LinkType.CONTAINS },
  { source: 'set_theory', target: 'ultrafilter', type: LinkType.CONTAINS },
  { source: 'set_theory', target: 'continuum_hypothesis', type: LinkType.CONTAINS },

  { source: 'model_theory', target: 'theory_ACF', type: LinkType.CONTAINS },
  { source: 'model_theory', target: 'theory_RCF', type: LinkType.CONTAINS },
  { source: 'model_theory', target: 'model_nonstd', type: LinkType.CONTAINS },
  { source: 'model_theory', target: 'ultraproduct', type: LinkType.CONTAINS },
  { source: 'model_theory', target: 'thm_lowenheim', type: LinkType.CONTAINS },

  { source: 'proof_theory', target: 'sequent_calculus', type: LinkType.CONTAINS },
  { source: 'proof_theory', target: 'godel_incompleteness', type: LinkType.CONTAINS },
  { source: 'proof_theory', target: 'epsilon_0', type: LinkType.CONTAINS },
  { source: 'proof_theory', target: 'gamma_0', type: LinkType.CONTAINS },
  { source: 'proof_theory', target: 'cut_elimination', type: LinkType.CONTAINS },
  { source: 'proof_theory', target: 'rca0', type: LinkType.CONTAINS, label: 'Subsystem of analysis' },

  { source: 'comp_theory', target: 'turing_machine', type: LinkType.CONTAINS },
  { source: 'comp_theory', target: 'lambda_calc', type: LinkType.CONTAINS },
  { source: 'comp_theory', target: 'recursion_concept', type: LinkType.CONTAINS },
  { source: 'comp_theory', target: 'halting_problem', type: LinkType.CONTAINS },
  { source: 'comp_theory', target: 'church_turing', type: LinkType.CONTAINS },

  { source: 'algebra_discipline', target: 'algebraic_structure', type: LinkType.CONTAINS },
  { source: 'algebra_discipline', target: 'theory_groups', type: LinkType.CONTAINS },
  { source: 'algebra_discipline', target: 'theory_rings', type: LinkType.CONTAINS },
  { source: 'algebra_discipline', target: 'theory_fields', type: LinkType.CONTAINS },
  { source: 'algebra_discipline', target: 'homomorphism_thms', type: LinkType.CONTAINS },

  { source: 'topology', target: 'stone_space', type: LinkType.CONTAINS },
  { source: 'topology', target: 'open_set_topology', type: LinkType.CONTAINS },
  { source: 'topology', target: 'alexandrov_topology', type: LinkType.CONTAINS },
  { source: 'topology', target: 'clop_alg', type: LinkType.CONTAINS },

  // ==============================================================================
  // 2. HIERARCHIES (EXTENDS)
  // Direction: Child -> Parent (Наследник расширяет Родителя)
  // ==============================================================================
  
  // --- Logic & Arithmetic ---
  { source: 'theory_PA', target: 'theory_Q', type: LinkType.EXTENDS }, // PA добавляет индукцию к Q
  { source: 'theory_PA', target: 'theory_Presburger', type: LinkType.EXTENDS }, // PA добавляет умножение
  { source: 'theory_PA2', target: 'theory_PA', type: LinkType.EXTENDS }, // 2-й порядок > 1-й
  { source: 'heyting_arithmetic', target: 'theory_PA', type: LinkType.RELATED }, // HA - интуиционистская PA (параллельная ветка)
  { source: 'modal_GL', target: 'modal_K4', type: LinkType.EXTENDS }, // GL транзитивна + Лёб
  { source: 'modal_logic', target: 'topology', type: LinkType.RELATED },
  { source: 'theory_PA', target: 'pred_logic', type: LinkType.EXTENDS },
  { source: 'heyting_arithmetic', target: 'intuitionistic_logic', type: LinkType.EXTENDS }, // Арифметика Гейтинга строится НА БАЗЕ Интуиционистской логики
  // Интуиционистская логика базируется на логике высказываний (как и классическая)
  // Но является альтернативой классической логике предикатов
  { source: 'intuitionistic_logic', target: 'prop_logic', type: LinkType.EXTENDS },
  // Гёделевский перевод: Интуиционистская логика вкладывается в S4
  { source: 'intuitionistic_logic', target: 'modal_S4', type: LinkType.RELATED },
  // Modal GL как логика доказуемости - ключевая связь!
  { source: 'modal_GL', target: 'proof_theory', type: LinkType.RELATED, label: 'Provability logic' },
  { source: 'modal_GL', target: 'godel_incompleteness', type: LinkType.RELATED, label: 'Löb theorem relates to Gödel' },
  { source: 'modal_GL', target: 'theory_PA', type: LinkType.RELATED, label: 'Arithmetical interpretation' },

  // --- Set Theory ---
  { source: 'zfc', target: 'pred_logic', type: LinkType.EXTENDS, label: 'Provides formal language' },
  { source: 'zfc', target: 'theory_HF', type: LinkType.EXTENDS }, // ZFC добавляет бесконечность
  { source: 'large_cardinals', target: 'zfc', type: LinkType.EXTENDS }, // Большие кардиналы > ZFC

  // --- Algebra (Structures) ---
  { source: 'theory_rings', target: 'theory_groups', type: LinkType.EXTENDS }, // Кольцо содержит аддитивную группу
  { source: 'theory_fields', target: 'theory_rings', type: LinkType.EXTENDS }, // Поле - это кольцо
  { source: 'theory_ACF', target: 'theory_fields', type: LinkType.EXTENDS, label: 'Adds algebraic closure' },
  { source: 'theory_RCF', target: 'theory_fields', type: LinkType.EXTENDS },
  { source: 'theory_tf_groups', target: 'theory_groups', type: LinkType.EXTENDS, label: 'Adds real closure' },
  
  // --- Algebra (Concepts) ---
  { source: 'module_ring', target: 'algebraic_structure', type: LinkType.EXTENDS },
  { source: 'algebra_ring', target: 'module_ring', type: LinkType.EXTENDS },
  { source: 'vector_space', target: 'module_ring', type: LinkType.EXTENDS }, // Векторное пр-во - модуль над полем
  { source: 'integral_domain', target: 'theory_rings', type: LinkType.EXTENDS },
  { source: 'ufd', target: 'integral_domain', type: LinkType.EXTENDS },
  { source: 'pid', target: 'ufd', type: LinkType.EXTENDS },
  { source: 'euclidean_domain', target: 'pid', type: LinkType.EXTENDS },
  { source: 'prime_ideal', target: 'ideal_concept', type: LinkType.EXTENDS },
  { source: 'maximal_ideal', target: 'prime_ideal', type: LinkType.EXTENDS }, // Максимальный всегда простой

  // --- Order Theory ---
  { source: 'theory_order', target: 'pred_logic', type: LinkType.EXTENDS },
  { source: 'theory_order', target: 'poset', type: LinkType.CONTAINS },
  { source: 'lattice', target: 'poset', type: LinkType.EXTENDS },
  { source: 'dist_lattice', target: 'lattice', type: LinkType.EXTENDS },
  { source: 'bool_alg', target: 'dist_lattice', type: LinkType.EXTENDS },
  { source: 'heyting_alg', target: 'dist_lattice', type: LinkType.EXTENDS },
  { source: 'poset', target: 'linear_order', type: LinkType.CONTAINS },
  { source: 'theory_DLO', target: 'linear_order', type: LinkType.CONTAINS },
  { source: 'theory_DisLO', target: 'linear_order', type: LinkType.CONTAINS },
  // RCF integrates Order Theory
  { source: 'theory_RCF', target: 'theory_order', type: LinkType.EXTENDS, label: 'Includes linear order' },
  
  // --- Modal Logic Hierarchy ---
  { source: 'modal_logic', target: 'prop_logic', type: LinkType.EXTENDS },
  { source: 'modal_K', target: 'modal_logic', type: LinkType.EXTENDS },
  { source: 'modal_K4', target: 'modal_K', type: LinkType.EXTENDS },
  { source: 'modal_S4', target: 'modal_K4', type: LinkType.EXTENDS },
  { source: 'modal_S5', target: 'modal_S4', type: LinkType.EXTENDS },

  // --- Computability ---
  { source: 'typed_lambda', target: 'lambda_calc', type: LinkType.EXTENDS },
  { source: 'system_f', target: 'typed_lambda', type: LinkType.EXTENDS },

  // --- Reverse Math Hierarchy ---
  { source: 'wkl0', target: 'rca0', type: LinkType.EXTENDS },
  { source: 'aca0', target: 'wkl0', type: LinkType.EXTENDS },
  { source: 'atr0', target: 'aca0', type: LinkType.EXTENDS },
  { source: 'pi11_ca0', target: 'atr0', type: LinkType.EXTENDS },
  // Связи reverse math с другими областями
  { source: 'wkl0', target: 'topology', type: LinkType.RELATED, label: 'Compactness properties' },
  { source: 'aca0', target: 'model_theory', type: LinkType.RELATED, label: 'Arithmetic definability' },
  { source: 'rca0', target: 'comp_theory', type: LinkType.RELATED, label: 'Computable mathematics base' },
  { source: 'atr0', target: 'ordinal_arithmetic', type: LinkType.RELATED, label: 'Transfinite recursion' },
  // --- Number Systems (Structures) ---
  { source: 'model_Z', target: 'model_N', type: LinkType.EXTENDS },
  { source: 'model_Q', target: 'model_Z', type: LinkType.EXTENDS },
  { source: 'model_R', target: 'model_Q', type: LinkType.EXTENDS },
  { source: 'model_C', target: 'model_R', type: LinkType.EXTENDS },
  { source: 'model_A', target: 'model_Q', type: LinkType.EXTENDS }, // Алгебраические расширяют Q
  { source: 'surreal_numbers', target: 'model_R', type: LinkType.EXTENDS },
  { source: 'surreal_numbers', target: 'ordinal_arithmetic', type: LinkType.EXTENDS },
  { source: 'transitive_set', target: 'ordinal_arithmetic', type: LinkType.EXTENDS },

  // ==============================================================================
  // 3. MODELS (Structure -> Theory)
  // Структура является моделью теории
  // ==============================================================================
  { source: 'model_N', target: 'theory_PA', type: LinkType.MODELS },
  { source: 'model_N', target: 'theory_DisLO', type: LinkType.MODELS }, // N дискретно упорядочено
  { source: 'model_Z', target: 'theory_rings', type: LinkType.MODELS },
  { source: 'model_Z', target: 'euclidean_domain', type: LinkType.MODELS },
  { source: 'model_Q', target: 'theory_fields', type: LinkType.MODELS },
  { source: 'model_Q', target: 'theory_DLO', type: LinkType.MODELS },
  { source: 'model_R', target: 'theory_RCF', type: LinkType.MODELS, label: 'Standard model' },
  { source: 'model_C', target: 'theory_ACF', type: LinkType.MODELS, label: 'Standard model' },
  { source: 'model_A', target: 'theory_ACF', type: LinkType.MODELS }, // A - тоже модель ACF
  
  { source: 'model_V_omega', target: 'theory_HF', type: LinkType.MODELS },
  { source: 'model_L', target: 'zfc', type: LinkType.MODELS },
  { source: 'model_L', target: 'continuum_hypothesis', type: LinkType.MODELS }, // L |= CH
  { source: 'surreal_numbers', target: 'theory_RCF', type: LinkType.MODELS },
  { source: 'model_nonstd', target: 'theory_PA', type: LinkType.MODELS },
  { source: 'model_quine', target: 'set_theory', type: LinkType.MODELS }, // NF models

  { source: 'bool_alg', target: 'prop_logic', type: LinkType.MODELS },
  { source: 'heyting_alg', target: 'intuitionistic_logic', type: LinkType.MODELS },
  { source: 'jsson_tarski_alg', target: 'modal_K', type: LinkType.MODELS },
  { source: 'lindenbaum_alg', target: 'prop_logic', type: LinkType.MODELS }, // Каноническая модель
  // Intuitionistic logic corresponds to the lattice of Open Sets
  { source: 'intuitionistic_logic', target: 'open_set_topology', type: LinkType.EQUIVALENT, label: 'Heyting Algebra of Open Sets' },
  
  { source: 'alexandrov_topology', target: 'modal_S4', type: LinkType.MODELS },
  // S4 is topologically equivalent to the interior operator (Kuratowski)
  { source: 'modal_S4', target: 'topology', type: LinkType.EQUIVALENT, label: 'Topological Interpretation (McKinsey-Tarski)' },
  { source: 'stone_space', target: 'prop_logic', type: LinkType.RELATED }, // Через двойственность

  // ==============================================================================
  // 4. PROVES (Theory -> Theorem)
  // Теория доказывает теорему или утверждение
  // ==============================================================================
  // ZFC proofs
  { source: 'zfc', target: 'thm_cantor', type: LinkType.PROVES },
  { source: 'zfc', target: 'thm_cbs', type: LinkType.PROVES },
  { source: 'zfc', target: 'thm_zermelo_wo', type: LinkType.PROVES },
  { source: 'zfc', target: 'axiom_choice', type: LinkType.CONTAINS }, // В ZFC это аксиома
  { source: 'zfc', target: 'ordinal_arithmetic', type: LinkType.PROVES },
  { source: 'zfc', target: 'cardinal_arithmetic', type: LinkType.PROVES },
  
  // PA & Logic proofs
  { source: 'theory_PA', target: 'crt', type: LinkType.PROVES }, // КТО
  { source: 'theory_PA', target: 'sequence_coding', type: LinkType.PROVES }, // Бета-функция
  { source: 'theory_PA', target: 'thm_tarski_undef', type: LinkType.RELATED, label: 'Subject of theorem' },
  { source: 'pred_logic', target: 'thm_completeness', type: LinkType.PROVES },
  { source: 'pred_logic', target: 'thm_compactness', type: LinkType.PROVES },
  { source: 'pred_logic', target: 'thm_lowenheim', type: LinkType.PROVES },
  
  // Computability proofs
  { source: 'comp_theory', target: 'smn_theorem', type: LinkType.PROVES },
  { source: 'comp_theory', target: 'recursion_theorem', type: LinkType.PROVES },
  { source: 'comp_theory', target: 'rice_theorem', type: LinkType.PROVES },
  { source: 'lambda_calc', target: 'church_rosser', type: LinkType.PROVES },
  
  // Algebra & Other
  { source: 'theory_ACF', target: 'thm_chevalley', type: LinkType.PROVES },
  { source: 'theory_ACF', target: 'thm_morley', type: LinkType.PROVES },
  { source: 'theory_RCF', target: 'thm_tarski_seidenberg', type: LinkType.PROVES },
  { source: 'pi11_ca0', target: 'thm_kruskal', type: LinkType.PROVES },

  // ==============================================================================
  // 5. EQUIVALENT (Any <-> Any)
  // Эквивалентность, Изоморфизм, Двойственность
  // ==============================================================================
  // Теоремы
  { source: 'axiom_choice', target: 'thm_zorn', type: LinkType.EQUIVALENT },
  { source: 'axiom_choice', target: 'thm_zermelo_wo', type: LinkType.EQUIVALENT },
  { source: 'bpi', target: 'thm_stone', type: LinkType.EQUIVALENT },
  
  // Двойственности
  { source: 'dist_lattice', target: 'priestley_space', type: LinkType.EQUIVALENT }, // Двойственность Пристли
  { source: 'heyting_alg', target: 'esakia_space', type: LinkType.EQUIVALENT }, // Двойственность Эсакиа
  { source: 'bool_alg', target: 'bool_ring', type: LinkType.EQUIVALENT, label: 'Structure isomorphism' }, // Алгебраическая экв.
  { source: 'stone_space', target: 'ultrafilter', type: LinkType.RELATED, label: 'Points via ultrafilters' },
  { source: 'bpi', target: 'ultrafilter', type: LinkType.EQUIVALENT, label: 'BPI ⟺ Ultrafilter Theorem' },

  // Структуры и теории
  { source: 'theory_PA', target: 'theory_HF', type: LinkType.EQUIVALENT }, // Би-интерпретируемость
  { source: 'aca0', target: 'theory_PA', type: LinkType.EQUIVALENT, label: 'Conservative extension' }, // Консервативность
  { source: 'ordinal_omega', target: 'model_N', type: LinkType.EQUIVALENT },
  { source: 'lambda_calc', target: 'ski_combinators', type: LinkType.EQUIVALENT, label: 'Computational equivalence' }, // Эквивалентность по вычислимости
  
  // ==============================================================================
  // 6. RELATED / CONTAINS (Contextual Links)
  // Смысловые связи, методы, применения
  // ==============================================================================
  // Cross-discipline
  { source: 'algebra_discipline', target: 'set_theory', type: LinkType.EXTENDS, label: 'Structures are sets with operations' },
  { source: 'topology', target: 'set_theory', type: LinkType.EXTENDS, label: 'Structure on a set' },
  { source: 'model_theory', target: 'set_theory', type: LinkType.EXTENDS, label: 'All structures' },
  // ZFC обеспечивает универсум для большинства математических объектов
  { source: 'math_lang', target: 'set_theory', type: LinkType.RELATED, label: 'Provides formal language' },
  //{ source: 'model_theory', target: 'algebra_discipline', type: LinkType.RELATED, label: 'Studies algebraic structures' },
  { source: 'proof_theory', target: 'comp_theory', type: LinkType.RELATED, label: 'Via Curry-Howard, decidability' },
  { source: 'proof_theory', target: 'math_lang', type: LinkType.RELATED, label: 'Syntactic analysis' },
  { source: 'comp_theory', target: 'math_lang', type: LinkType.RELATED, label: 'Computability of logical systems' },
  
  // Incompleteness cluster
  { source: 'theory_PA', target: 'godel_incompleteness', type: LinkType.RELATED },
  { source: 'godel_incompleteness', target: 'sequence_coding', type: LinkType.RELATED }, // Метод доказательства
  { source: 'godel_incompleteness', target: 'recursion_concept', type: LinkType.RELATED }, // Самореференция
  { source: 'diophantine_set', target: 'godel_incompleteness', type: LinkType.RELATED }, // MRDP теорема
  // MRDP Theorem connects Diophantine sets to Computability
  { source: 'diophantine_set', target: 'comp_theory', type: LinkType.RELATED, label: 'MRDP Theorem / Enumerable sets' },
  // Independence cluster
  { source: 'continuum_hypothesis', target: 'forcing_method', type: LinkType.RELATED }, // Метод доказательства
  { source: 'axiom_choice', target: 'forcing_method', type: LinkType.RELATED },
  { source: 'forcing_method', target: 'model_L', type: LinkType.RELATED }, // L - ground model
  // Forcing использует топологические концепции
  { source: 'forcing_method', target: 'topology', type: LinkType.RELATED, label: 'Dense sets, filters' },
  { source: 'forcing_method', target: 'bool_alg', type: LinkType.RELATED, label: 'Boolean-valued models' },
  { source: 'large_cardinals', target: 'model_theory', type: LinkType.RELATED, label: 'Elementary embeddings' },
  // Reverse Math cluster
  { source: 'wkl0', target: 'thm_compactness', type: LinkType.PROVES, label: 'Proves compactness' },
  { source: 'bpi', target: 'wkl0', type: LinkType.RELATED }, // BPI доказуема в WKL0+
  // Q is essential for undecidability
  { source: 'theory_Q', target: 'comp_theory', type: LinkType.RELATED, label: 'Essential for incompleteness' },
  // Model Theory cluster
  { source: 'model_theory', target: 'type_theory_model', type: LinkType.CONTAINS, label: 'Core concept' },
  { source: 'model_theory', target: 'saturated_model', type: LinkType.CONTAINS, label:'Model property' },
  { source: 'model_theory', target: 'prime_model', type: LinkType.CONTAINS, label: 'Model property' },
  { source: 'model_theory', target: 'indiscernibles', type: LinkType.CONTAINS, label: 'Structural property' },
  { source: 'model_theory', target: 'qe', type: LinkType.CONTAINS, label: 'Method' },
  { source: 'model_theory', target: 'omitting_types', type: LinkType.CONTAINS, label: 'Method' },
  { source: 'model_theory', target: 'thm_ef_games', type: LinkType.CONTAINS, label: 'Method' },
  
  { source: 'type_theory_model', target: 'stone_space_types', type: LinkType.RELATED },
  { source: 'stone_space_types', target: 'complete_type', type: LinkType.CONTAINS },
  { source: 'stone_space_types', target: 'isolated_type', type: LinkType.CONTAINS },
  { source: 'thm_ryll', target: 'type_theory_model', type: LinkType.RELATED },
  { source: 'thm_los_vaught', target: 'thm_morley', type: LinkType.RELATED },
  // Type spaces как обобщение
  { source: 'stone_space_types', target: 'stone_space', type: LinkType.EXTENDS, label: 'Generalization to model theory' },
  { source: 'type_theory_model', target: 'topology', type: LinkType.RELATED, label: 'Topological space of types' },
  
  // Ultraproducts & Non-standard
  { source: 'ultraproduct', target: 'ultrafilter', type: LinkType.CONTAINS },
  { source: 'ultraproduct', target: 'thm_compactness', type: LinkType.RELATED }, // Метод доказательства
  { source: 'model_nonstd', target: 'surreal_numbers', type: LinkType.RELATED },
  
  // Algebra & Ideals
  { source: 'theory_rings', target: 'ideal_concept', type: LinkType.CONTAINS },
  { source: 'prime_ideal', target: 'integral_domain', type: LinkType.RELATED }, // Фактор - область целостности
  { source: 'maximal_ideal', target: 'theory_fields', type: LinkType.RELATED }, // Фактор - поле
  { source: 'bpi', target: 'prime_ideal', type: LinkType.RELATED }, // Теорема о простом идеале

  // Proof Theory & Ordinals
  { source: 'epsilon_0', target: 'goodstein_theorem', type: LinkType.RELATED },
  { source: 'cut_elimination', target: 'sequent_calculus', type: LinkType.RELATED },
  { source: 'gamma_0', target: 'epsilon_0', type: LinkType.EXTENDS, label: 'Extends Veblen hierarchy' },
  
  // Computability Misc
  { source: 'church_turing', target: 'turing_machine', type: LinkType.RELATED },
  { source: 'church_turing', target: 'lambda_calc', type: LinkType.RELATED },
  { source: 'lambda_calc', target: 'lambda_reductions', type: LinkType.CONTAINS },
  { source: 'lambda_calc', target: 'fixed_point_comb', type: LinkType.CONTAINS },
  { source: 'realizability', target: 'heyting_arithmetic', type: LinkType.RELATED },
  { source: 'markov_principle', target: 'heyting_arithmetic', type: LinkType.RELATED },
  
  // Curry-Howard
  { source: 'curry_howard', target: 'intuitionistic_logic', type: LinkType.RELATED },
  { source: 'curry_howard', target: 'typed_lambda', type: LinkType.RELATED },
  { source: 'curry_howard', target: 'proof_theory', type: LinkType.RELATED },

  // Topology & Order
  { source: 'thm_stone', target: 'stone_space', type: LinkType.RELATED },
  { source: 'thm_stone', target: 'bool_alg', type: LinkType.RELATED },
  { source: 'thm_knaster', target: 'lattice', type: LinkType.RELATED },
  { source: 'thm_knaster', target: 'thm_cbs', type: LinkType.PROVES }, // Используется в доказательстве
  { source: 'modal_GL', target: 'scattered_space', type: LinkType.RELATED },
  { source: 'alexandrov_topology', target: 'poset', type: LinkType.RELATED }, // Связь порядков и топологии
  // Order theory фундаментальна для set theory
  { source: 'theory_order', target: 'set_theory', type: LinkType.RELATED, label: 'Well-orderings, ordinals' },
  { source: 'linear_order', target: 'ordinal_arithmetic', type: LinkType.RELATED, label: 'Ordinals are well-orders' },
  { source: 'lattice', target: 'algebra_discipline', type: LinkType.RELATED, label: 'Algebraic structure' },
  { source: 'poset', target: 'alexandrov_topology', type: LinkType.EQUIVALENT, label: 'Alexandrov correspondence' },
  
  // Set Theory Misc
  { source: 'skolem_paradox', target: 'thm_lowenheim', type: LinkType.RELATED, label: 'Derived from' },
  { source: 'skolem_paradox', target: 'model_N', type: LinkType.RELATED },
  { source: 'hartogs_number', target: 'ordinal_arithmetic', type: LinkType.RELATED },
  { source: 'axiom_choice', target: 'cardinal_arithmetic', type: LinkType.RELATED }, // Нужна для арифметики кардиналов
  { source: 'dedekind_finite', target: 'axiom_choice', type: LinkType.RELATED }, // Зависимость
  { source: 'ac_omega', target: 'topology', type: LinkType.RELATED }, // Нужна для анализа (мера Лебега)
  { source: 'ordinal_arithmetic', target: 'cardinal_arithmetic', type: LinkType.RELATED, label: 'Uses Alephs'},
  
  // Algebra & Logic (Algebraic Logic)
  { source: 'cylindric_alg', target: 'pred_logic', type: LinkType.EQUIVALENT },
  { source: 'polyadic_alg', target: 'pred_logic', type: LinkType.EQUIVALENT },
  { source: 'cylindric_alg', target: 'bool_alg', type: LinkType.EXTENDS },

  // Расширение связей теорем о неполноте
{ source: 'godel_incompleteness', target: 'model_nonstd', type: LinkType.RELATED, label: 'Non-standard models demonstrate incompleteness' },
{ source: 'halting_problem', target: 'godel_incompleteness', type: LinkType.RELATED, label: 'Similar diagonalization' },
{ source: 'goodstein_theorem', target: 'transfinite_induction', type: LinkType.RELATED, label: 'Proof requires ε₀' },
{ source: 'thm_tarski_undef', target: 'godel_incompleteness', type: LinkType.RELATED, label: 'Undefinability results' },
  // BHK и realizability
{ source: 'bhk_interpretation', target: 'heyting_arithmetic', type: LinkType.RELATED, label: 'Interprets HA' },
{ source: 'realizability', target: 'comp_theory', type: LinkType.RELATED, label: 'Uses computable functions' },
{ source: 'realizability', target: 'bhk_interpretation', type: LinkType.RELATED, label: 'Formalizes BHK' },
{ source: 'markov_principle', target: 'realizability', type: LinkType.RELATED, label: 'Realizability interpretation' },
  // Game-theoretic методы
{ source: 'thm_ef_games', target: 'thm_lowenheim', type: LinkType.RELATED, label: 'Alternative proof method' },
{ source: 'thm_ef_games', target: 'concept_back_and_forth', type: LinkType.RELATED, label: 'Proof method' },
{ source: 'axiom_determinacy', target: 'large_cardinals', type: LinkType.RELATED, label: 'Consistency via Woodin cardinals' },

  // Цилиндрические алгебры
{ source: 'cylindric_alg', target: 'model_theory', type: LinkType.RELATED, label: 'Algebraic semantics for FOL' },
{ source: 'lindenbaum_alg', target: 'cylindric_alg', type: LinkType.RELATED, label: 'Lindenbaum-Tarski for FOL' },

// Boolean rings
{ source: 'bool_ring', target: 'set_theory', type: LinkType.RELATED, label: 'Fields of sets' },
// Omega и алефы
{ source: 'ordinal_omega', target: 'cardinal_aleph1', type: LinkType.RELATED, label: 'ω₁ is the first uncountable' },
{ source: 'continuum_hypothesis', target: 'cardinal_aleph1', type: LinkType.RELATED, label: '2^ℵ₀ = ℵ₁?' },
{ source: 'cardinal_aleph1', target: 'model_R', type: LinkType.RELATED, label: 'Continuum problem' },
// Scattered spaces и ординалы
{ source: 'scattered_space', target: 'ordinal_arithmetic', type: LinkType.RELATED, label: 'Cantor-Bendixson rank' },
{ source: 'priestley_space', target: 'theory_order', type: LinkType.RELATED, label: 'Ordered topological space' },
{ source: 'esakia_space', target: 'priestley_space', type: LinkType.EXTENDS, label: 'Priestley + continuity' },
  // V_α и ординалы
{ source: 'cumulative_hierarchy', target: 'ordinal_arithmetic', type: LinkType.CONTAINS, label: 'Indexed by ordinals' },
{ source: 'model_V_omega', target: 'cumulative_hierarchy', type: LinkType.RELATED, label: 'Stage ω' },

// --- Automorphism Group ---
  // Группа автоморфизмов — важнейший инструмент в Теории Моделей (анализ симметрий)
  { source: 'model_theory', target: 'auto_group', type: LinkType.RELATED, label: 'Tool for analyzing structures' },
  // Сама по себе группа автоморфизмов удовлетворяет аксиомам Групп
  { source: 'auto_group', target: 'theory_groups', type: LinkType.MODELS, label: 'Is a group structure' },

  // --- Specific Models ---
  // Z+Z — модель дискретного линейного порядка
  { source: 'model_Z_plus_Z', target: 'theory_DisLO', type: LinkType.MODELS, label: 'Model of discrete order' },
  // N + ZxQ — порядковый тип нестандартных моделей арифметики
  { source: 'model_N_ZxQ', target: 'theory_PA', type: LinkType.MODELS, label: 'Order type of non-standard models' },
  // Свяжем с концептом нестандартных моделей
  { source: 'model_N_ZxQ', target: 'model_nonstd', type: LinkType.RELATED, label: 'Specific instance' },

  // --- Logic Meta-properties ---
  // Soundness & Completeness относятся к Логике в целом
  { source: 'math_lang', target: 'soundness_completeness', type: LinkType.CONTAINS, label: 'Meta-logical properties' },
  // Теорема о полноте формализует концепт полноты
  { source: 'thm_completeness', target: 'soundness_completeness', type: LinkType.RELATED, label: 'Formal statement' },

  // --- Inference Rules ---
  // Выводимость (Inference Concept) состоит из Правил вывода
  { source: 'inference_concept', target: 'inference_rules', type: LinkType.CONTAINS, label: 'Defined by rules' },
  // Правила вывода являются частью Логики предикатов
  { source: 'pred_logic', target: 'inference_rules', type: LinkType.CONTAINS, label: 'Modus Ponens, Generalization' },

  // --- Структурные связи (Алгебра) ---
  { source: 'ring_poly', target: 'theory_rings', type: LinkType.MODELS, label: 'Canonical integral domain' },
  { source: 'ring_poly', target: 'ufd', type: LinkType.EXTENDS, label: 'Is a UFD'  }, // K[x] is a UFD
  { source: 'field_rat_func', target: 'ring_poly', type: LinkType.EXTENDS, label: 'Field of fractions'  }, // Field of fractions extends the ring
  { source: 'field_rat_func', target: 'theory_fields', type: LinkType.MODELS, label: 'Infinite dimensional extension' },

  // --- Теоретико-модельные свойства ---
  // 1. Насыщенность (точнее, ее отсутствие)
  // K[x] — классический пример счетной, но НЕ насыщенной модели (опускает типы пределов)
  { source: 'ring_poly', target: 'saturated_model', type: LinkType.RELATED, label: 'Counter-example: Not saturated' },
    // 2. Типы (Генерический тип)
  // Переменная 'x' в K(x) реализует тип элемента, который не является корнем никакого многочлена
  { source: 'field_rat_func', target: 'type_theory_model', type: LinkType.RELATED, label: 'Realizes the Generic Type' },  // Или specific 'generic_type' если бы он был
  // 3. Связь с трансцендентностью (из примера в model_theory.tex)
  // Если у нас есть узел model_A (алгебраические числа), то K(x) — это антипод
  { source: 'field_rat_func', target: 'model_A', type: LinkType.RELATED, label: 'Transcendental vs Algebraic' },
  // 4. Максимальные идеалы
  // В K[x] идеалы порождаются неприводимыми многочленами
  { source: 'ring_poly', target: 'maximal_ideal', type: LinkType.CONTAINS, label: 'Generated by irreducibles' },

  // --- Saturated Models (Насыщенные модели) ---
  { source: 'model_Q', target: 'saturated_model', type: LinkType.MODELS, label: 'Countable saturated model (DLO)' },
  { source: 'model_random_graph', target: 'saturated_model', type: LinkType.MODELS, label: 'Countable saturated model' },
  { source: 'model_C', target: 'saturated_model', type: LinkType.MODELS, label: 'Saturated in uncountable cardinals' },
  { source: 'model_nonstd', target: 'saturated_model', type: LinkType.MODELS, label: 'Constructed to be saturated' },

  // --- Prime Models (Простые/Атомарные модели) ---
  { source: 'model_Q', target: 'prime_model', type: LinkType.MODELS, label: 'Prime model of DLO' },
  { source: 'model_N', target: 'prime_model', type: LinkType.MODELS, label: 'Prime model of PA' },
  { source: 'model_A', target: 'prime_model', type: LinkType.MODELS, label: 'Prime model of ACF0' },

  // --- Quantifier Elimination (QE) Examples ---
  // Хотя QE — свойство теории, связь с моделями полезна для навигации
  { source: 'model_C', target: 'qe', type: LinkType.MODELS, label: 'Chevalley-Tarski Theorem' },
  { source: 'model_R', target: 'qe', type: LinkType.MODELS, label: 'Tarski-Seidenberg Theorem' },
  { source: 'model_Q', target: 'qe', type: LinkType.MODELS, label: 'Admitted by DLO' },

  // --- Construction Methods ---
  { source: 'model_nonstd', target: 'ultraproduct', type: LinkType.MODELS, label: 'Constructed via ultraproduct' },
  { source: 'surreal_numbers', target: 'indiscernibles', type: LinkType.MODELS, label: 'Rich structure' },
  
  // --- Stone Spaces Examples ---
  { source: 'bool_alg', target: 'stone_space', type: LinkType.EQUIVALENT, label: 'Stone Duality' },

  // --- Transfinite Induction Fixes ---
  // Связываем с Ординалами (это "родная" структура для индукции)
  { source: 'ordinal_arithmetic', target: 'transfinite_induction', type: LinkType.MODELS, label: 'Defined on well-orders'  },
  // Связываем с теорией ATR0 (она постулирует трансфинитную рекурсию)
  { source: 'atr0', target: 'transfinite_induction', type: LinkType.CONTAINS, label: 'Axiom of Transfinite Recursion' },
  // Связываем с ординалом Epsilon-0 (предел индукции для PA)
  { source: 'epsilon_0', target: 'transfinite_induction', type: LinkType.MODELS, label: 'Proof-theoretic limit' },
  // --- Dedekind Finite Fixes ---
  // Связываем с Кардиналами (это понятие о размере/мощности)
  { source: 'dedekind_finite', target: 'cardinal_arithmetic', type: LinkType.EXTENDS, label: 'Definition of finiteness' },
  // Связываем с Омегой (Dedekind finite <=> нет подмножества равномощного omega)
  { source: 'dedekind_finite', target: 'ordinal_omega', type: LinkType.RELATED, label: 'Contrast with infinity' },
  // Связываем с моделью наследственно конечных множеств
  { source: 'model_V_omega', target: 'dedekind_finite', type: LinkType.MODELS, label: 'Contains standard finite sets' },
  // Связь с ZFC (в ZFC это эквивалентно обычной конечности)
  { source: 'dedekind_finite', target: 'zfc', type: LinkType.RELATED, label: 'Equivalent to finite in ZFC' },

  // --- Computability & Lambda Fixes ---
  // Typed Lambda is a formal theory within Computability
  { source: 'comp_theory', target: 'typed_lambda', type: LinkType.CONTAINS, label: 'Formal system' },
  // Church-Rosser holds for Typed Lambda Calculus
  { source: 'typed_lambda', target: 'church_rosser', type: LinkType.PROVES, label: 'Confluence property' },
  // Also connects to Proof Theory via Curry-Howard
  { source: 'proof_theory', target: 'typed_lambda', type: LinkType.RELATED, label: 'Corresponds to Intuitionistic Logic' },
  // --- Model Theory Fixes ---
  // Random Graph is a key structure in Model Theory (zero-one law)
  { source: 'model_theory', target: 'model_random_graph', type: LinkType.CONTAINS, label: 'Example of omega-categorical structure' },
  // Ryll-Nardzewski is a fundamental theorem of Model Theory
  { source: 'model_theory', target: 'thm_ryll', type: LinkType.CONTAINS, label: 'Characterizes omega-categoricity' },
  // The Random Graph is the prime example for this theorem
  { source: 'model_random_graph', target: 'thm_ryll', type: LinkType.MODELS, label: 'Illustrates' },
  // --- Set Theory Fixes ---
  // Axiom of Determinacy is a candidate axiom for Set Theory
  { source: 'set_theory', target: 'axiom_determinacy', type: LinkType.CONTAINS, label: 'Alternative axiom'  },
  // It conflicts with AC
  { source: 'axiom_determinacy', target: 'axiom_choice', type: LinkType.RELATED, label: 'Contradicts (in full universe)' },
  // Hartogs number is the least ordinal not map-able into X. 
  // Fundamental to set theory cardinality without Choice.
  { source: 'set_theory', target: 'hartogs_number', type: LinkType.CONTAINS, label: 'Cardinality concept' },
  // Cumulative Hierarchy is the universe V for ZFC
  { source: 'set_theory', target: 'cumulative_hierarchy', type: LinkType.CONTAINS, label: 'Universe construction' },
  { source: 'zfc', target: 'cumulative_hierarchy', type: LinkType.RELATED, label: 'Standard universe V' },
  // Rank is the index in the hierarchy
  { source: 'cumulative_hierarchy', target: 'rank_concept', type: LinkType.CONTAINS, label: 'Defined by hierarchy stage' },
  // Rank is crucial for the Axiom of Foundation (Regularity) in ZFC
  { source: 'zfc', target: 'rank_concept', type: LinkType.RELATED, label: 'Foundation axiom' },
  // --- Order Theory Hierarchy Fixes ---
  // DLO extends general Order Theory
  { source: 'theory_DLO', target: 'theory_order', type: LinkType.EXTENDS, label: 'Adds density and no endpoints' },
  // Discrete Linear Order extends general Order Theory
  { source: 'theory_DisLO', target: 'theory_order', type: LinkType.EXTENDS, label: 'Adds discreteness' },
  // ==============================================================================
// PROOF-THEORETIC ORDINALS CLUSTER
// ==============================================================================
{ source: 'epsilon_0', target: 'ordinal_arithmetic', type: LinkType.MODELS },
{ source: 'church_kleene', target: 'gamma_0', type: LinkType.EXTENDS, label: 'Supremum of hyperarithmetic' },
{ source: 'ordinal_bachmann_howard', target: 'church_kleene', type: LinkType.EXTENDS },
{ source: 'ordinal_takeuti_feferman_buchholz', target: 'ordinal_bachmann_howard', type: LinkType.EXTENDS },

// Связи с теориями
{ source: 'epsilon_0', target: 'theory_PA', type: LinkType.RELATED, label: 'Proof-theoretic ordinal of PA' },
{ source: 'gamma_0', target: 'atr0', type: LinkType.RELATED, label: 'Proof-theoretic ordinal of ATR₀' },
{ source: 'church_kleene', target: 'pi11_ca0', type: LinkType.RELATED, label: 'Related to Π¹₁-CA₀' },
{ source: 'ordinal_takeuti_feferman_buchholz', target: 'pi11_ca0', type: LinkType.RELATED, label: 'Proof-theoretic ordinal of Π¹₁-CA₀' },

// Computability связи
{ source: 'church_kleene', target: 'comp_theory', type: LinkType.RELATED, label: 'First non-computable ordinal' },
{ source: 'church_kleene', target: 'computable_function', type: LinkType.RELATED, label: 'Supremum of computable ordinals' },

// ==============================================================================
// KRIPKE FRAMES & MODAL LOGIC
// ==============================================================================
{ source: 'kripke_model', target: 'modal_logic', type: LinkType.MODELS, label: 'Semantics for modal logic' },
{ source: 'kripke_model', target: 'modal_K', type: LinkType.MODELS, label: 'Any frame validates K' },
{ source: 'kripke_model', target: 'modal_K4', type: LinkType.MODELS, label: 'Transitive frames' },
{ source: 'kripke_model', target: 'modal_S4', type: LinkType.MODELS, label: 'Reflexive + transitive' },
{ source: 'kripke_model', target: 'modal_S5', type: LinkType.MODELS, label: 'Equivalence relations' },
{ source: 'kripke_model', target: 'modal_GL', type: LinkType.MODELS, label: 'Transitive + irreflexive + well-founded' },

// Kripke и топология
{ source: 'kripke_model', target: 'poset', type: LinkType.EXTENDS, label: 'Preorder structure' },
{ source: 'kripke_model', target: 'alexandrov_topology', type: LinkType.MODELS, label: 'Alexandrov space from preorder' },

// ==============================================================================
// ORDER THEORY ADDITIONS
// ==============================================================================
{ source: 'well_order', target: 'linear_order', type: LinkType.EXTENDS, label: 'Linear order + well-founded' },
{ source: 'ordinal_arithmetic', target: 'well_order', type: LinkType.MODELS, label: 'Ordinals are order types of well-orders' },
{ source: 'transfinite_induction', target: 'well_order', type: LinkType.RELATED, label: 'Induction on well-orders' },
{ source: 'thm_zermelo_wo', target: 'well_order', type: LinkType.RELATED, label: 'Every set can be well-ordered' },
{ source: 'thm_zermelo_wo', target: 'thm_zorn', type: LinkType.EQUIVALENT },
// Chains and antichains
{ source: 'poset', target: 'chain_order', type: LinkType.CONTAINS, label: 'Totally ordered subset' },
{ source: 'poset', target: 'antichain', type: LinkType.CONTAINS, label: 'Pairwise incomparable subset' },
{ source: 'chain_order', target: 'thm_zorn', type: LinkType.RELATED, label: 'Every chain has upper bound' },
{ source: 'narrow_order', target: 'chain_order', type: LinkType.RELATED, label: 'No uncountable chains' },
{ source: 'narrow_order', target: 'antichain', type: LinkType.RELATED, label: 'No uncountable antichains' },

// Narrow orders и континуум-гипотеза
{ source: 'narrow_order', target: 'continuum_hypothesis', type: LinkType.RELATED, label: 'Suslin hypothesis' },
{ source: 'narrow_order', target: 'poset', type: LinkType.EXTENDS, label: 'Aronszajn trees' },

// ==============================================================================
// REDUCTS
// ==============================================================================
{ source: 'model_theory', target: 'reduct', type: LinkType.CONTAINS },
{ source: 'reduct', target: 'algebraic_structure', type: LinkType.RELATED, label: 'Signature restriction' },
// ==============================================================================
// COMPUTABILITY: EQUIVALENCES OF COMPUTABLE FUNCTIONS
// ==============================================================================
{ source: 'comp_theory', target: 'computable_function', type: LinkType.CONTAINS },
{ source: 'partial_recursive', target: 'computable_function', type: LinkType.EQUIVALENT, label: 'Church-Turing equivalence' },
{ source: 'turing_machine', target: 'computable_function', type: LinkType.EQUIVALENT, label: 'Turing-computable' },
{ source: 'lambda_calc', target: 'computable_function', type: LinkType.EQUIVALENT, label: 'λ-computable' },
{ source: 'markov_algorithm', target: 'computable_function', type: LinkType.EQUIVALENT, label: 'Markov-computable' },
{ source: 'universal_pl', target: 'computable_function', type: LinkType.EQUIVALENT, label: 'Turing-complete languages' },
{ source: 'sigma1_definable', target: 'computable_function', type: LinkType.EQUIVALENT, label: 'Graph is r.e.' },
{ source: 'combinators', target: 'computable_function', type: LinkType.EQUIVALENT, label: 'Combinator-computable' },
{ source: 'ski_combinators', target: 'combinators', type: LinkType.RELATED, label: 'Basis {S,K,I}' },

// Primitive recursive - подмножество
{ source: 'partial_recursive', target: 'primitive_recursive', type: LinkType.CONTAINS, label: 'Subset: no μ-operator' },

// Bounded complexity
{ source: 'computable_function', target: 'polytime_function', type: LinkType.CONTAINS, label: 'Time-bounded subset' },
{ source: 'computable_function', target: 'polyspace_function', type: LinkType.CONTAINS, label: 'Space-bounded subset' },

// Связь с теориями
{ source: 'theory_PA', target: 'partial_recursive', type: LinkType.CONTAINS, label: 'Representable in PA' },
{ source: 'theory_PA', target: 'sigma1_definable', type: LinkType.CONTAINS, label: 'Arithmetical hierarchy' },
{ source: 'theory_Q', target: 'primitive_recursive', type: LinkType.RELATED, label: 'Representable in Q' },

// Church-Turing thesis
{ source: 'church_turing', target: 'computable_function', type: LinkType.RELATED, label: 'Informal = Formal' },

// ==============================================================================
// ZF⁻ AND V_{ω+ω}
// ==============================================================================
{ source: 'zfc', target: 'zf_minus', type: LinkType.PROVES, label: 'ZFC without Replacement' },
{ source: 'zf_minus', target: 'pred_logic', type: LinkType.EXTENDS, label: 'Formulated in FOL' },
{ source: 'model_V_omega_omega', target: 'zf_minus', type: LinkType.MODELS, label: 'Model of ZF⁻' },
{ source: 'cumulative_hierarchy', target: 'model_V_omega_omega', type: LinkType.CONTAINS, label: 'Stage ω+ω' },

{ source: 'model_theory', target: 'algebraic_structure', type: LinkType.RELATED },
{ source: 'vector_space', target: 'theory_tf_groups', type: LinkType.CONTAINS, label: 'Torsion-free group one can interpret as a Vector space' },
{ source: 'model_Z', target: 'diophantine_set', type: LinkType.CONTAINS },

// Связь DLO и Теоремы Кантора (через RELATED, как мета-теорема о моделях)
{ source: 'theory_DLO', target: 'thm_cantor_iso', type: LinkType.RELATED, label: 'Characterized by models' },
// Связь DLO и Омега-категоричности (DLO обладает этим свойством)
{ source: 'concept_aleph0_categorical', target: 'theory_DLO', type: LinkType.RELATED, label: 'Prime example' },
// Теория делимых абелевых групп без кручения (DAG) обладает несчетной категоричностью (Это классический пример)
{ source: 'theory_tf_groups', target: 'concept_uncountable_categoricity', type: LinkType.RELATED, label: 'Prime example' },
// Теорема Морли характеризует несчетную категоричность (Источник [700])
{ source: 'thm_morley', target: 'concept_uncountable_categoricity', type: LinkType.RELATED, label: 'Characterizes' },
// Теорема Рылль-Нардзевского характеризует СЧЕТНУЮ категоричность
// (Связываем с concept_aleph0_categorical, который мы создали ранее)
{ source: 'thm_ryll', target: 'concept_aleph0_categorical', type: LinkType.RELATED, label: 'Characterizes' },
// Дополнительно: связываем две теоремы как "пару" результатов о категоричности
{ source: 'thm_morley', target: 'thm_ryll', type: LinkType.RELATED, label: 'Counterpart theorem' },
// Связь теории групп с элиминацией кванторов
{ source: 'theory_tf_groups', target: 'qe', type: LinkType.RELATED, label: 'Admits QE' },

];

export const getGraphData = (lang: Language = 'en'): GraphData => {
  const nodes = Object.keys(RAW_NODES).map(id => {
    const node = RAW_NODES[id];
    const content = node.content[lang] || node.content['en'];
    return {
      id,
      group: node.group,
      kind: node.kind,
      val: node.val,
      synonyms: node.synonyms,
      label: content.label,
      description: content.description,
      details: content.details
    };
  });

  const links = RAW_LINKS.map(link => {
    // ИСПРАВЛЕНИЕ:
    // Для связей типа EXTENDS ("Расширяет") мы меняем направление.
    // Было: Base -> Extension (Булева -> Модальная)
    // Стало: Extension -> Base (Модальная -> Булева)
    // Теперь стрелка значит: "X extends Y" (X наследуется от Y)
    if (link.type === LinkType.EXTENDS) {
      return { ...link, source: link.target, target: link.source };
    }
    return { ...link };
  });

  return { nodes, links };
};
