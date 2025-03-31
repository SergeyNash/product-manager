#!/bin/bash

# Сборка проекта
npm run export

# Переход в директорию сборки
cd out

# Создание .nojekyll файла
touch .nojekyll

# Инициализация Git
git init
git add .
git commit -m "Deploy to GitHub Pages"

# Пуш на ветку gh-pages
git push -f git@github.com:username/product-manager-portfolio.git main:gh-pages

# Возврат в корневую директорию
cd ..

