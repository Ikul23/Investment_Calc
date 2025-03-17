require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path"); // ✅ Добавили импорт

const app = express();
const {sequelize} = require("./config/database");

// Проверка подключения к БД
sequelize
  .authenticate()
  .then(() => console.log("✅ Успешное подключение к БД"))
  .catch((err) => console.error("❌ Ошибка подключения к БД:", err));

// Импорт маршрутов
const calculateRoutes = require("./routes/calculateRoutes");
const userRoutes = require("./routes/userRoutes");
const projectsRoutes = require("./routes/projectsRoutes");

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

// фронт
app.use(express.static('client/public'));

// Подключаем маршруты API
app.use("/api/calculate", calculateRoutes);
app.use("/api/users", userRoutes);
app.use("/api/projects", projectsRoutes);

// Проверка работы API
app.get("/api/test", (req, res) => {
  res.json({ message: "Бэкенд работает!" });
});

// Подключаем фронтенд (статические файлы)
app.use(express.static(path.join(__dirname, "client/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/dist", "index.html"));
});


const PORT = process.env.PORT || 5000;


sequelize
  .sync({ alter: true }) 
  .then(() => console.log("✅ Модели синхронизированы"))
  .catch((err) => console.error("❌ Ошибка синхронизации:", err));

app.listen(PORT, () => console.log(`🚀 Сервер запущен на порту ${PORT}`));
