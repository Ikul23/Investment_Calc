require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

const pool = require("./db");

app.get("/api/db-test", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW()");
        res.json({ success: true, time: result.rows[0] });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});


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

