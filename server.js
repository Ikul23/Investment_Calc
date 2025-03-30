require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
const sequelize = require("./config/database");
const db = require("./models");

// Импорт маршрутов
const reportRoutes = require("./routes/reportRoutes");
const userRoutes = require("./routes/userRoutes");
const projectsRoutes = require("./routes/projectsRoutes");
const calculateRoutes = require('./routes/calculateRoutes');

app.use('/api/calculate', calculateRoutes);

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true, 
}));

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "client/public")));

app.use("/api", reportRoutes);
app.use("/api/calculate", calculateRoutes);
app.use("/api/users", userRoutes);
app.use("/api/projects", projectsRoutes);

app.get("/api/test", (req, res) => {
  res.json({ message: "Бэкенд работает!" });
});

app.use(express.static(path.join(__dirname, "client/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/dist", "index.html"));
});

// Глобальный обработчик ошибок
app.use((err, req, res, next) => {
  console.error("❌ Ошибка:", err.message);
  console.error("📌 Стек ошибки:", err.stack);
  res.status(err.status || 500).json({ message: err.message || "Ошибка сервера" });
});

// Экспортируем `app` для тестов
module.exports = app;

// Запуск сервера (только в реальной среде, не в тестах)
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
