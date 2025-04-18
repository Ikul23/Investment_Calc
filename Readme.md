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
React – построение пользовательского интерфейса
Bootstrap – стилизация
Fetch API/Axios – отправка запросов к API
SPA (Single Page Application) – динамическое обновление данных

#### Тестирование

Jest – основной фреймворк для тестирования
SuperTest – тестирование API
React Testing Library – тестирование React-компонентов
User Event – симуляция пользовательских действий в тестах

#### Хостинг

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

| Метод | Эндпоинт             | Описание                                 |
| ----- | -------------------- | ---------------------------------------- |
| POST  | /projects            | Создание проекта                         |
| GET   | /projects            | Получение списка проектов                |
| POST  | /cashflows           | Добавление данных (OPEX, CAPEX, выручка) |
| POST  | /calculate           | Запуск расчета (NPV, IRR, PP, DPP)       |
| GET   | /results/:project_id | Получение результатов расчета            |

## Структура Проекта

📦 InvestmentCalculationProject

📂 client
┣ 📂 src
┃ ┣ 📂 components → Модульные компоненты React
┃ ┃ ┣ 📜 Header.js (Шапка с заголовком)
┃ ┃ ┣ 📜 Footer.js (Кнопки обратной связи)
┃ ┃ ┣ 📜 YearInput.js (Компонент для ввода данных по годам)
┃ ┣ 📂 pages → Страницы SPA
┃ ┃ ┣ 📜 Home.js (Главная страница: ввод данных проекта)
┃ ┃ ┣ 📜 InputForm.js (Форма ввода данных по годам)
┃ ┃ ┣ 📜 ResultPage.js (Вывод результатов расчета)
┃ ┣ 📜 App.js (Главный компонент с роутингом)
┃ ┣ 📜 main.js (Точка входа в приложение)
┃ ┣ 📜 index.css (Глобальные стили)
┣ 📂 public (статические файлы: CSS, JS, изображения)
┃ ┣ 📂 images → Хранение картинок
┃ ┣ 📜 index.html (Основной контейнер SPA)
┣ 📜 package.json (Зависимости React)

📂 config
┣ 📜 config.js (конфигурация Sequelize)
┣ 📜 database.js (подключение к БД через Sequelize)

📂 controllers
┣ 📜 projectController.js (логика обработки проектов)
┣ 📜 calculationController.js (логика финансовых расчетов)

📂 migrations (файлы миграций Sequelize)

📂 models
┣ 📜 cashFlows.js (модель для хранения денежных потоков)
┣ 📜 financialResults.js (модель финансовых результатов, например, NPV, IRR и т. д.)
┣ 📜 project.js (модель проекта: название, описание и связи с другими таблицами)
┣ 📜 index.js (экспорт всех моделей и настройка связей)

📂 routes
┣ 📜 calculateRoutes.js (маршруты для расчетов)
┣ 📜 projectsRoutes.js (маршруты проектов)
┣ 📜 userRoutes.js (маршруты пользователей)
┣ 📜 index.js (объединение всех маршрутов)

📂 seeders (начальные данные для БД)

📂 services
┃ ┣ 📜 index.js (фасад, использующий DI)
┃ ┣ 📜 cashFlowCalculator.js
┃ ┣ 📜 financialResultCalculator.js
┃ ┣ 📜 yearlyDataCalculator.js
┃ ┣ 📜 utils.js (общие утилиты для расчетов)

📂 tests

┣ 📂 integration
┃ ┣ 📜 api.routes.test.js (интеграционные тесты API)
┃ ┣ 📜 frontend.integration.test.js (тесты фронтенд-компонентов)
┃ ┣ 📜 models-controllers.test.js (тесты взаимодействия моделей и контроллеров)
┃ ┣ 📜 integration.test.js (полный цикл работы системы)

📂 middleware (новая директория)
┣ 📜 authMiddleware.js
┣ 📜 errorHandler.js
┣ 📜 requestLogger.js

📜 .env (переменные окружения)
📜 .env.test (переменные окружения для тестов)
📜 .gitignore (игнорируемые файлы Git)
📜 .babelrc (настройки Babel для тестов)
📜 jest.config.js (настройки Jest)
📜 package.json (зависимости проекта)
📜 package-lock.json (фиксированные версии зависимостей)
📜 Readme.md (документация проекта)
📜 server.js (главный серверный файл, инициализация сервера Express)
📜 Diploma_I_Kuleshov.pdf (файл диплома по проекту)

## <[Веб адрес Проекта](https://investment-calc.onrender.com)>
