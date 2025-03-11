# Название Проекта: "Экспресс-расчеты окупаемости инвестиционных проектов"

## Описание Проекта

### 1. Функционал приложения

Веб-приложение для быстрого расчета окупаемости инвестиционных проектов на основе NPV, IRR, PP, DPP. Пользователь вводит данные (OPEX, CAPEX, выручку), система рассчитывает показатели и выводит результаты в виде таблицы.

### 2. Технологический стек

#### Бэкенд (серверная часть)

Node.js + Express – реализация REST API
PostgreSQL (16) – хранение данных о проектах и расчетах
Sequelize – ORM для работы с БД
Postman – тестирование API

#### Фронтенд (клиентская часть)

JavaScript (ES6+) – логика работы интерфейса
Bootstrap – стилизация
Fetch API/Axios – отправка запросов к API
SPA (Single Page Application) – динамическое обновление данных
Хостинг
Nginx сервер для раздачи фронта и API
Хостинг - Render

### 3. Верхнеуровневая логика

Поток работы пользователя
Пользователь создает новый проект, вводит название.
Добавляет финансовые данные (OPEX, CAPEX, выручка) по годам.
Указывает ставку дисконтирования (фиксированную).
Нажимает «Рассчитать», сервер выполняет расчеты.
Получает результаты в виде таблицы.

## API-эндпоинты (RESTful)

Метод Эндпоинт Описание
POST /projects Создание проекта
GET /projects Получение списка проектов
POST /cashflows Добавление данных (OPEX, CAPEX, выручка)
POST /calculate Запуск расчета (NPV, IRR, PP, DPP)
GET /results/:project_id Получение результатов расчета

## Структура Проекта

📦 InvestmentCalculationProject

┣ 📂 config
┃ ┣ 📜 config.json # Файл конфигурации Sequelize
┃ ┣ 📜 database.js # Подключение к БД через Sequelize

┣ 📂 controllers
┃ ┣ 📜 projectController.js # Логика обработки запросов проектов

┣ 📂 migrations # Папка для миграций Sequelize

┣ 📂 models # Папка для моделей Sequelize

┣ 📂 routes
┃ ┣ 📜 calculateRoutes.js # Маршруты расчётов
┃ ┣ 📜 projectsRoutes.js # Маршруты проектов
┃ ┣ 📜 userRoutes.js # Маршруты пользователей

┣ 📂 seeders # Папка для наполнения БД начальными данными

┣ 📜 .env # Переменные окружения

┣ 📜 .gitignore # Игнорируемые файлы Git

┣ 📜 package.json # Зависимости проекта

┣ 📜 package-lock.json # Фиксация версий зависимостей

┣ 📜 Readme.md # Документация проекта

┣ 📜 server.js # Главный серверный файл

┣ 📂 client # Каталог для фронтенда

┃ ┣ 📂 public # Статика (CSS, JS, картинки)
┃ ┃ ┣ 📜 index.html # Главный HTML-файл
┃ ┃ ┣ 📜 styles.css # Основной CSS
┃ ┃ ┣ 📜 script.js # Основной JS
┃ ┃ ┣ 📂 assets # Картинки, иконки

┃ ┣ 📂 src # Исходники React
┃ ┣ 📜 package.json # Зависимости фронта

## <["Веб адрес Проекта"](https://github.com/Ikul23/JS_ADVANCED/tree/main/HT3)>
