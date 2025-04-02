require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");
const errorHandler = require("./middleware/errorHandler");
const requestLogger = require("./middleware/requestLogger");
const sequelize = require("./config/database");

const app = express();

// Импорт маршрутов
const routes = require("./routes");

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
}));

app.use(express.json());
app.use(requestLogger);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Подключаем маршруты
app.use('/api', routes);

// Тестовый роут
app.get("/api/test", (req, res) => {
  res.json({ message: "Бэкенд работает!" });
});

// Статические файлы (Frontend)
app.use(express.static(path.join(__dirname, "client/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/dist", "index.html"));
});

// Обработчик ошибок
app.use(errorHandler);

// Глобальный обработчик ошибок (лучше оставить в самом конце)
app.use((err, req, res, next) => {
  console.error("❌ Ошибка:", err.message);
  console.error("📌 Стек ошибки:", err.stack);
  res.status(err.status || 500).json({ message: err.message || "Ошибка сервера" });
});

// Экспортируем `app` для тестов
module.exports = app;

// Запуск сервера
if (require.main === module) {
  const PORT = process.env.PORT || 5000;

  sequelize.sync({ alter: true })
    .then(() => {
      console.log("✅ Модели синхронизированы");
      const server = app.listen(PORT, () => {
        console.log(`🚀 Сервер запущен на порту ${PORT}`);
      });

      process.on("SIGTERM", async () => {
        console.log("🔄 Остановка сервера...");
        await sequelize.close();
        server.close(() => {
          console.log("✅ Сервер остановлен.");
          process.exit(0);
        });
      });
    })
    .catch((err) => console.error("❌ Ошибка синхронизации моделей:", err));
}
