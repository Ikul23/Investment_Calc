#Архитектура проекта: Экспресс-расчеты окупаемости инвестиционных проектов

##

1. Описание проекта
   Веб-приложение для быстрого расчета окупаемости инвестиционных проектов на основе NPV, IRR, PP, DPP. Пользователь вводит данные (OPEX, CAPEX, выручку), система рассчитывает показатели и выводит результаты в виде таблицы.

2. Технологический стек
   Бэкенд (серверная часть)
   Node.js + Express – реализация REST API
   PostgreSQL – хранение данных о проектах и расчетах
   Sequelize – ORM для работы с БД
   Postman – тестирование API
   Фронтенд (клиентская часть)
   JavaScript (ES6+) – логика работы интерфейса
   Bootstrap – стилизация
   Fetch API/Axios – отправка запросов к API
   SPA (Single Page Application) – динамическое обновление данных
   Хостинг
   Nginx сервер для раздачи фронта и API
   Хостинг - Render

3. Верхнеуровневая логика
   Поток работы пользователя
   Пользователь создает новый проект, вводит название.
   Добавляет финансовые данные (OPEX, CAPEX, выручка) по годам.
   Указывает ставку дисконтирования (фиксированную).
   Нажимает «Рассчитать», сервер выполняет расчеты.
   Получает результаты в виде таблицы.

   ###API-эндпоинты (RESTful)

   Метод Эндпоинт Описание
   POST /projects Создание проекта
   GET /projects Получение списка проектов
   POST /cashflows Добавление данных (OPEX, CAPEX, выручка)
   POST /calculate Запуск расчета (NPV, IRR, PP, DPP)
   GET /results/:project_id Получение результатов расчета
