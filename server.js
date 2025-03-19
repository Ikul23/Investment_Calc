require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const { sequelize } = require("./config/database");
const db = require("./models"); // ✅ Подключаем все модели перед `sync()`

// Проверка подключения к БД
sequelize
  .authenticate()
  .then(() => console.log("✅ Успешное подключение к БД"))
  .catch((err) => console.error("❌ Ошибка подключения к БД:", err));

// Импорт маршрутов
const calculateRoutes = require("./routes/calculateRoutes");
const userRoutes = require("./routes/userRoutes");
const projectsRoutes = require("./routes/projectsRoutes");

// CORS (настроен для локальной разработки и продакшена)
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());

// 📌 Фронтенд (если нужно раздавать статику)
app.use(express.static(path.join(__dirname, "client/public")));

// Подключаем маршруты API
app.use("/api/calculate", calculateRoutes);
app.use("/api/users", userRoutes);
app.use("/api/projects", projectsRoutes);

// Тестовый маршрут
app.get("/api/test", (req, res) => {
  res.json({ message: "Бэкенд работает!" });
});

// 📌 Раздача фронтенда (SPA)
app.use(express.static(path.join(__dirname, "client/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/dist", "index.html"));
});

// 📌 Middleware для обработки ошибок API
app.use((err, req, res, next) => {
  console.error("❌ Ошибка:", err.message);
  res.status(err.status || 500).json({ message: err.message || "Ошибка сервера" });
});

// Запуск сервера
const PORT = process.env.PORT || 5000;

sequelize
  .sync({ alter: true }) // ✅ Подключение моделей перед синхронизацией
  .then(() => console.log("✅ Модели синхронизированы"))
  .catch((err) => console.error("❌ Ошибка синхронизации моделей:", err));

app.listen(PORT, () => console.log(`🚀 Сервер запущен на порту ${PORT}`));
