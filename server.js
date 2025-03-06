require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

const calculateRoutes = require("./routes/calculateRoutes");
const userRoutes = require("./routes/userRoutes");
const projectsRoutes = require("./routes/projectsRoutes"); 

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

// Подключаем маршруты
app.use("/api/calculate", calculateRoutes);
app.use("/api/users", userRoutes);
app.use("/api/projects", projectsRoutes);

// Тестовый маршрут
app.get("/", (req, res) => {
  res.send("Приложение запущено...");
});

// Проверка работы API
app.get("/api/test", (req, res) => {
  res.json({ message: "Бэкенд работает!" });
});

// Указываем порт из .env или по умолчанию 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

