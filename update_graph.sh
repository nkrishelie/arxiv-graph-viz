#!/bin/sh

# 1. Переходим в папку проекта (ВАЖНО: укажи свой реальный путь)
cd /home/nkrishelie/MATH/arXiv

# 2. Активируем виртуальное окружение (если используется)
# source venv/bin/activate

# 3. Запускаем Python-скрипт обновления данных
# Мы экспортируем Jupyter Notebook в .py файл для запуска из консоли,
# или запускаем .py, если ты сохранил его отдельно.
echo "--- Starting Data ETL ---"
python3 arxiv_etl.py

# 4. Проверяем, изменился ли файл данных
if git status --porcelain | grep "graph_data.json"; then
    echo "--- Data changed. Pushing to GitHub... ---"
    
    # Добавляем обновленный JSON
    git add . # graph_data.json
    
    # Можно добавить и код фронтенда, если менял его
    # git add . 
    
    # Коммитим с датой
    current_date=$(date "+%Y-%m-%d %H:%M")
    git commit -m "Auto-update ArXiv Data: $current_date"
    
    # Отправляем на GitHub (Vercel подхватит сам)
    git push origin main
    
    echo "--- Update Complete! ---"
else
    echo "--- No changes in data. Skipping push. ---"
fi
