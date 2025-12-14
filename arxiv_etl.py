#!/usr/bin/env python
# coding: utf-8

# In[6]:


# резервный список категорий на случай если парсинг сайта не сработает
TAXONOMY_R = {'math.AC': {'name': 'Commutative Algebra',
  'description': 'Commutative rings, modules, ideals, homological algebra, computational aspects, invariant theory, connections to algebraic geometry and combinatorics'},
 'math.AG': {'name': 'Algebraic Geometry',
  'description': 'Algebraic varieties, stacks, sheaves, schemes, moduli spaces, complex geometry, quantum cohomology'},
 'math.AP': {'name': 'Analysis of PDEs',
  'description': "Existence and uniqueness, boundary conditions, linear and non-linear operators, stability, soliton theory, integrable PDE's, conservation laws, qualitative dynamics"},
 'math.AT': {'name': 'Algebraic Topology',
  'description': 'Homotopy theory, homological algebra, algebraic treatments of manifolds'},
 'math.CA': {'name': 'Classical Analysis and ODEs',
  'description': "Special functions, orthogonal polynomials, harmonic analysis, ODE's, differential relations, calculus of variations, approximations, expansions, asymptotics"},
 'math.CO': {'name': 'Combinatorics',
  'description': 'Discrete mathematics, graph theory, enumeration, combinatorial optimization, Ramsey theory, combinatorial game theory'},
 'math.CT': {'name': 'Category Theory',
  'description': 'Enriched categories, topoi, abelian categories, monoidal categories, homological algebra'},
 'math.CV': {'name': 'Complex Variables',
  'description': 'Holomorphic functions, automorphic group actions and forms, pseudoconvexity, complex geometry, analytic spaces, analytic sheaves'},
 'math.DG': {'name': 'Differential Geometry',
  'description': 'Complex, contact, Riemannian, pseudo-Riemannian and Finsler geometry, relativity, gauge theory, global analysis'},
 'math.DS': {'name': 'Dynamical Systems',
  'description': 'Dynamics of differential equations and flows, mechanics, classical few-body problems, iterations, complex dynamics, delayed differential equations'},
 'math.FA': {'name': 'Functional Analysis',
  'description': 'Banach spaces, function spaces, real functions, integral transforms, theory of distributions, measure theory'},
 'math.GM': {'name': 'General Mathematics',
  'description': 'Mathematical material of general interest, topics not covered elsewhere'},
 'math.GN': {'name': 'General Topology',
  'description': 'Continuum theory, point-set topology, spaces with algebraic structure, foundations, dimension theory, local and global properties'},
 'math.GR': {'name': 'Group Theory',
  'description': 'Finite groups, topological groups, representation theory, cohomology, classification and structure'},
 'math.GT': {'name': 'Geometric Topology',
  'description': 'Manifolds, orbifolds, polyhedra, cell complexes, foliations, geometric structures'},
 'math.HO': {'name': 'History and Overview',
  'description': 'Biographies, philosophy of mathematics, mathematics education, recreational mathematics, communication of mathematics, ethics in mathematics'},
 'math.IT': {'name': 'Information Theory',
  'description': 'math.IT is an alias for cs.IT. Covers theoretical and experimental aspects of information theory and coding.'},
 'math.KT': {'name': 'K-Theory and Homology',
  'description': 'Algebraic and topological K-theory, relations with topology, commutative algebra, and operator algebras'},
 'math.LO': {'name': 'Logic',
  'description': 'Logic, set theory, point-set topology, formal mathematics'},
 'math.MG': {'name': 'Metric Geometry',
  'description': 'Euclidean, hyperbolic, discrete, convex, coarse geometry, comparisons in Riemannian geometry, symmetric spaces'},
 'math.MP': {'name': 'Mathematical Physics',
  'description': 'math.MP is an alias for math-ph. Articles in this category focus on areas of research that illustrate the application of mathematics to problems in physics, develop mathematical methods for such applications, or provide mathematically rigorous formulations of existing physical theories. Submissions to math-ph should be of interest to both physically oriented mathematicians and mathematically oriented physicists; submissions which are primarily of interest to theoretical physicists or to mathematicians should probably be directed to the respective physics/math categories'},
 'math.NA': {'name': 'Numerical Analysis',
  'description': 'Numerical algorithms for problems in analysis and algebra, scientific computation'},
 'math.NT': {'name': 'Number Theory',
  'description': 'Prime numbers, diophantine equations, analytic number theory, algebraic number theory, arithmetic geometry, Galois theory'},
 'math.OA': {'name': 'Operator Algebras',
  'description': 'Algebras of operators on Hilbert space, C^*-algebras, von Neumann algebras, non-commutative geometry'},
 'math.OC': {'name': 'Optimization and Control',
  'description': 'Operations research, linear programming, control theory, systems theory, optimal control, game theory'},
 'math.PR': {'name': 'Probability',
  'description': 'Theory and applications of probability and stochastic processes: e.g. central limit theorems, large deviations, stochastic differential equations, models from statistical mechanics, queuing theory'},
 'math.QA': {'name': 'Quantum Algebra',
  'description': 'Quantum groups, skein theories, operadic and diagrammatic algebra, quantum field theory'},
 'math.RA': {'name': 'Rings and Algebras',
  'description': 'Non-commutative rings and algebras, non-associative algebras, universal algebra and lattice theory, linear algebra, semigroups'},
 'math.RT': {'name': 'Representation Theory',
  'description': 'Linear representations of algebras and groups, Lie theory, associative algebras, multilinear algebra'},
 'math.SG': {'name': 'Symplectic Geometry',
  'description': 'Hamiltonian systems, symplectic flows, classical integrable systems'},
 'math.SP': {'name': 'Spectral Theory',
  'description': 'Schrodinger operators, operators on manifolds, general differential operators, numerical studies, integral operators, discrete models, resonances, non-self-adjoint operators, random operators/matrices'},
 'math.ST': {'name': 'Statistics Theory',
  'description': 'Applied, computational and theoretical statistics: e.g. statistical inference, regression, time series, multivariate analysis, data analysis, Markov chain Monte Carlo, design of experiments, case studies'}
               }


# In[12]:


import arxiv
import pandas as pd
import json
import requests
import re
from bs4 import BeautifulSoup
from google.cloud import bigquery
from google.oauth2 import service_account
from datetime import datetime, timedelta
import json
import os

# ==========================================
# КОНФИГУРАЦИЯ
# ==========================================

# Путь к твоему ключу (как в твоем исходном файле)
KEY_PATH = "/home/nkrishelie/Python/Store/AllsoftEcom.json" 
PROJECT_ID = "burnished-yeti-250015"
DATASET_ID = "arXiv"
TABLE_ID = "articles"
FULL_TABLE_REF = f"{PROJECT_ID}.{DATASET_ID}.{TABLE_ID}"

# Настройки парсинга
DAYS_TO_FETCH = 5  # Скачиваем только за последнюю неделю (инкрементальная загрузка)
ANALYSIS_PERIOD_DAYS = 365 # Анализируем данные за год
TOP_LIMIT_PER_CAT = 15

# Инициализация клиента BQ
credentials = service_account.Credentials.from_service_account_file(KEY_PATH)
bq_client = bigquery.Client(project=PROJECT_ID, credentials=credentials)
arxiv_client = arxiv.Client()



# In[8]:


# ==========================================
# ШАГ 1: УНИВЕРСАЛЬНАЯ ТАКСОНОМИЯ С КЭШИРОВАНИЕМ
# ==========================================

TAXONOMY_CACHE_FILE = "arxiv_taxonomy_cache.json"

def get_universal_taxonomy():
    """
    1. Парсит сайт arXiv.
    2. Если успешно и данных много -> сохраняет в JSON.
    3. Если неудачно или данных мало -> читает из JSON.
    """
    url = "https://arxiv.org/category_taxonomy"
    fetched_taxonomy = {}
    
    # --- 1. Попытка скачивания ---
    print("Attempting to fetch taxonomy from arXiv...")
    try:
        response = requests.get(url, timeout=10)
        if response.status_code == 200:
            soup = BeautifulSoup(response.content, 'html.parser')
            
            sections = soup.find_all('h2', class_='accordion-head')
            for section in sections:
                section_name = section.get_text(strip=True)
                
                # Определяем группу
                group_code = "other"
                if "Mathematics" in section_name: group_code = "math"
                elif "Computer Science" in section_name: group_code = "cs"
                elif "Physics" in section_name: group_code = "physics"
                elif "Biology" in section_name: group_code = "bio"
                elif "Finance" in section_name: group_code = "fin"
                elif "Statistics" in section_name: group_code = "stat"
                elif "Economics" in section_name: group_code = "econ"
                elif "Electrical" in section_name: group_code = "eess"

                content_block = section.find_next_sibling('div', class_='accordion-body')
                if content_block:
                    for h4 in content_block.find_all('h4'):
                        full_text = h4.get_text(separator=' ', strip=True)
                        match = re.search(r'([a-z\-]+\.[A-Z\-a-z]{2,})\s*\((.+)\)', full_text)
                        
                        if match:
                            code = match.group(1).strip()
                            name = match.group(2).strip()
                            
                            desc = ""
                            parent = h4.find_parent('div', class_='column')
                            if parent:
                                desc_col = parent.find_next_sibling('div', class_='column')
                                if desc_col and desc_col.find('p'):
                                    desc = desc_col.find('p').get_text(strip=True)
                            
                            fetched_taxonomy[code] = {
                                'name': name, 
                                'description': desc,
                                'group': group_code
                            }
    except Exception as e:
        print(f"Error fetching from web: {e}")

    # --- 2. Работа с Кэшем ---
    cached_taxonomy = {}
    if os.path.exists(TAXONOMY_CACHE_FILE):
        try:
            with open(TAXONOMY_CACHE_FILE, 'r', encoding='utf-8') as f:
                cached_taxonomy = json.load(f)
            print(f"Found cached taxonomy with {len(cached_taxonomy)} entries.")
        except Exception as e:
            print(f"Error reading cache: {e}")

    # --- 3. Принятие решения (Validation & Fallback) ---
    
    # Если скачали меньше, чем было в кэше (или 0) — откатываемся на кэш
    if len(fetched_taxonomy) < len(cached_taxonomy):
        print(f"Warning: Fetched only {len(fetched_taxonomy)} categories, but cache has {len(cached_taxonomy)}.")
        print("Using CACHED version to ensure data integrity.")
        final_taxonomy = cached_taxonomy
        
    elif len(fetched_taxonomy) > 0:
        print(f"Success: Fetched {len(fetched_taxonomy)} categories (Cache had {len(cached_taxonomy)}).")
        print("Updating cache file...")
        # Сохраняем новую версию
        with open(TAXONOMY_CACHE_FILE, 'w', encoding='utf-8') as f:
            json.dump(fetched_taxonomy, f, ensure_ascii=False, indent=2)
        final_taxonomy = fetched_taxonomy
        
    else:
        # И интернет не работает, и кэша нет
        print("Critical Warning: Web fetch failed and no cache found.")
        final_taxonomy = {}

    return final_taxonomy

# Запуск
TAXONOMY = get_universal_taxonomy()

# --- 4. Хардкод на самый крайний случай (если и файла нет) ---
if not TAXONOMY:
    print("Using hardcoded fallback.")
    TAXONOMY = TAXONOMY_R

print(f"Final Taxonomy loaded: {len(TAXONOMY)} categories.")


# In[15]:


# ==========================================
# 2. EXTRACT & LOAD (ArXiv -> BigQuery)
# ==========================================

print(f"Fetching articles for the last {DAYS_TO_FETCH} days...")

# Поиск по всем мат. категориям сразу
search = arxiv.Search(
    query = "cat:math.*",
    max_results = 5000, # С запасом
    sort_by = arxiv.SortCriterion.SubmittedDate
)

new_rows = []
cutoff_date = datetime.now() - timedelta(days=DAYS_TO_FETCH)

for r in arxiv_client.results(search):
    pub_date = r.published.replace(tzinfo=None)
    if pub_date < cutoff_date:
        break # Дальше идут старые статьи, останавливаемся
    
    # Фильтруем категории (оставляем только те, что в таксономии)
    cats = [c for c in r.categories if c in TAXONOMY]
    if not cats: continue

    new_rows.append({
        "id": r.entry_id.split('/')[-1],
        "title": r.title.replace('\n', ' '),
        "abstract": r.summary.replace('\n', ' '),
        "authors": [a.name for a in r.authors],
        "categories": cats,
        "primary_category": r.primary_category,
        "published_date": pub_date.strftime("%Y-%m-%d"),
        "updated_at": datetime.now().isoformat(),
        "url": r.entry_id
    })

if new_rows:
    print(f"Uploading {len(new_rows)} new articles to BigQuery...")
    
    # Используем временную таблицу для безопасного MERGE
    temp_table_id = f"{PROJECT_ID}.{DATASET_ID}.temp_upload"
    
    # ИСПРАВЛЕНИЕ: Указываем ПОЛНУЮ схему для временной таблицы, 
    # чтобы она совпадала со структурой данных
    job_config = bigquery.LoadJobConfig(
        schema=[
            bigquery.SchemaField("id", "STRING"),
            bigquery.SchemaField("title", "STRING"),
            bigquery.SchemaField("abstract", "STRING"),
            bigquery.SchemaField("authors", "STRING", mode="REPEATED"),
            bigquery.SchemaField("categories", "STRING", mode="REPEATED"),
            bigquery.SchemaField("primary_category", "STRING"),
            bigquery.SchemaField("published_date", "DATE"),
            bigquery.SchemaField("updated_at", "TIMESTAMP"),
            bigquery.SchemaField("url", "STRING"),
        ],
        write_disposition="WRITE_TRUNCATE", # Перезаписываем временную таблицу при каждом запуске
        source_format=bigquery.SourceFormat.NEWLINE_DELIMITED_JSON
    )
    
    # Загружаем данные
    try:
        job = bq_client.load_table_from_json(new_rows, temp_table_id, job_config=job_config)
        job.result() # Ждем завершения
        print("Temp table loaded.")

        # MERGE запрос: обновляет старые, вставляет новые
        # (Остается без изменений)
        merge_query = f"""
        MERGE `{FULL_TABLE_REF}` T
        USING `{temp_table_id}` S
        ON T.id = S.id
        WHEN MATCHED THEN
          UPDATE SET 
            T.title = S.title,
            T.categories = S.categories,
            T.updated_at = S.updated_at
        WHEN NOT MATCHED THEN
          INSERT (id, title, abstract, authors, categories, primary_category, published_date, updated_at, url)
          VALUES (id, title, abstract, authors, categories, primary_category, S.published_date, S.updated_at, url)
        """
        bq_client.query(merge_query).result()
        print("Merge complete.")
        
    except Exception as e:
        print(f"BigQuery Error: {e}")
        # Если ошибка валидации, выводим подробности
        if hasattr(job, 'errors') and job.errors:
            print("Detailed errors:", job.errors)
else:
    print("No new articles found.")



# In[16]:


# ==========================================
# 3. TRANSFORM (SQL Analytics)
# ==========================================

print("Running SQL analytics...")

# А. Расчет весов связей (CROSS-CATEGORY CO-OCCURRENCE)
# Теперь, когда у нас в базе лежат И math.AG, И cs.AI, И physics.gen-ph,
# этот запрос автоматически посчитает связи МЕЖДУ дисциплинами разных наук.
# Например: сколько раз math.DG встречалась вместе с hep-th.

links_query = f"""
WITH exploded AS (
    SELECT id, cat 
    FROM `{FULL_TABLE_REF}`, UNNEST(categories) cat
    WHERE published_date >= DATE_SUB(CURRENT_DATE(), INTERVAL {ANALYSIS_PERIOD_DAYS} DAY)
)
SELECT 
    t1.cat as source, 
    t2.cat as target, 
    COUNT(*) as weight
FROM exploded t1
JOIN exploded t2 ON t1.id = t2.id
WHERE t1.cat < t2.cat -- Исключаем дубликаты (A-B и B-A) и петли (A-A)
GROUP BY 1, 2
HAVING weight >= 2 -- Фильтруем совсем случайные связи (шум)
ORDER BY weight DESC
"""

# Получаем DataFrame с весами: source | target | weight
links_df = bq_client.query(links_query).to_dataframe()
print(f"Calculated {len(links_df)} inter-category links.")


# Б. Выбор ТОП статей для узлов
# ВАЖНО: Так как primary_category теперь "честная" (например, 'cs.AI'),
# PARTITION BY primary_category будет ранжировать статьи ВНУТРИ этих категорий.
# Это значит, что мы получим Топ-15 статей по cs.AI, Топ-15 по math.AG и т.д.

nodes_query = f"""
WITH scored_articles AS (
    SELECT 
        *,
        -- Рейтинг: Мультидисциплинарность (кол-во категорий) дает высокий балл
        (ARRAY_LENGTH(categories) * 100) AS score
    FROM `{FULL_TABLE_REF}`
    WHERE published_date >= DATE_SUB(CURRENT_DATE(), INTERVAL {ANALYSIS_PERIOD_DAYS} DAY)
),
ranked AS (
    SELECT 
        *,
        -- Нумеруем статьи 1..N внутри каждой "родной" категории
        ROW_NUMBER() OVER(PARTITION BY primary_category ORDER BY score DESC, published_date DESC) as rank
    FROM scored_articles
)
-- Оставляем только лидеров в своих категориях
SELECT * FROM ranked WHERE rank <= {TOP_LIMIT_PER_CAT}
"""

nodes_df = bq_client.query(nodes_query).to_dataframe()
print(f"Selected {len(nodes_df)} top articles across all categories.")


# In[17]:


# ... (Код получения TAXONOMY и выгрузки nodes_df из BigQuery остается тем же) ...

# ==========================================
# 4. JSON GENERATION (С логикой Fallback)
# ==========================================

final_nodes = []
final_links = []
seen_nodes = set()

# Специальный ID для категории-заглушки
FALLBACK_ID = "misc.other"
FALLBACK_NODE = {
    "id": FALLBACK_ID,
    "label": "Other Disciplines",
    "type": "adjacent_discipline", # Или отдельный тип 'misc'
    "group": "other",
    "description": "Articles from categories not explicitly tracked in the current taxonomy.",
    "cluster": "OTHER",
    "val": 15
}

# Флаг, понадобился ли нам этот узел
fallback_needed = False

# 4.1. Создаем узлы ИЗВЕСТНЫХ дисциплин
for code, info in TAXONOMY.items():
    # Определяем тип (Math или Adjacent)
    node_type = 'discipline' if info.get('group') == 'math' else 'adjacent_discipline'
    
    final_nodes.append({
        "id": code,
        "label": info['name'],
        "type": node_type,
        "group": info.get('group', 'other'),
        "description": info.get('description', ''),
        "cluster": code if node_type == 'discipline' else 'ADJACENT',
        "val": 25 if node_type == 'discipline' else 20
    })
    seen_nodes.add(code)

# 4.2. Обработка статей и привязка к категориям
for _, row in nodes_df.iterrows():
    p_cat = row['primary_category']
    cats = list(row['categories'])
    
    # --- ЛОГИКА ОПРЕДЕЛЕНИЯ КЛАСТЕРА ---
    if p_cat in TAXONOMY:
        # Если категория известна, используем её
        main_cluster = p_cat
        is_math = (TAXONOMY[p_cat].get('group') == 'math')
        cluster_color_key = p_cat if is_math else 'ADJACENT'
    else:
        # Категория неизвестна -> используем заглушку
        main_cluster = FALLBACK_ID
        cluster_color_key = 'OTHER'
        fallback_needed = True

    # Добавляем узел статьи
    if row['id'] not in seen_nodes:
        final_nodes.append({
            "id": row['id'],
            "label": row['title'],
            "type": "article",
            "description": row['abstract'],
            "authors": list(row['authors']),
            "cluster": cluster_color_key, # Для раскраски
            "primary_category": p_cat,    # Сохраняем оригинал для инфо-панели
            "val": 5,
            "url": row['url']
        })
        seen_nodes.add(row['id'])

    # --- ЛОГИКА СВЯЗЕЙ (CONTAINS) ---
    
    # 1. Связь с Primary Category (или заглушкой)
    if p_cat in seen_nodes:
        target_cat = p_cat
    else:
        # Если первичной категории нет в графе -> линкуем на заглушку
        target_cat = FALLBACK_ID
        fallback_needed = True
    
    final_links.append({
        "source": target_cat,
        "target": row['id'],
        "type": "CONTAINS",
        "val": 2 # Основная связь потолще
    })

    # 2. Связи с остальными категориями (Secondary)
    for c in cats:
        if c == p_cat: continue # Уже связали выше
        
        if c in seen_nodes:
            # Если вторичная категория известна -> связываем
            final_links.append({
                "source": c,
                "target": row['id'],
                "type": "CONTAINS",
                "val": 1
            })
        # Если вторичная категория неизвестна -> ИГНОРИРУЕМ
        # (не стоит захламлять заглушку вторичными связями, иначе получится "клубок")

# 4.3. Добавляем узел-заглушку в список, если он пригодился
if fallback_needed:
    final_nodes.append(FALLBACK_NODE)
    seen_nodes.add(FALLBACK_ID)

# Связи RELATED (Дисциплина <-> Дисциплина) из SQL
max_w = links_df['weight'].max() if not links_df.empty else 1
for _, row in links_df.iterrows():
    if row['source'] in TAXONOMY and row['target'] in TAXONOMY:
        final_links.append({
            "source": row['source'],
            "target": row['target'],
            "type": "RELATED",
            "label": f"{row['weight']} shared articles",
            "val": (row['weight'] / max_w) * 10
        })

# 4.4. Связи DEPENDS (Статья <-> Статья) - оставляем в Python, 
# т.к. SQL для пересечения массивов строк сложен и дорог
# Работаем только с выбранными "топ" статьями
articles_list = [n for n in final_nodes if n['type'] == 'article']
from itertools import combinations

for a1, a2 in combinations(articles_list, 2):
    s1 = set(a1['authors'])
    s2 = set(a2['authors'])
    common = list(s1.intersection(s2))
    if common:
        final_links.append({
            "source": a1['id'],
            "target": a2['id'],
            "type": "DEPENDS",
            "label": "Authors: " + ", ".join(common),
            "val": len(common) * 2
        })

# Сохранение
output_data = {"nodes": final_nodes, "links": final_links}
with open("graph_data.json", 'w', encoding='utf-8') as f:
    json.dump(output_data, f, ensure_ascii=False, indent=2)

print(f"Done. Nodes: {len(final_nodes)}, Links: {len(final_links)}")


