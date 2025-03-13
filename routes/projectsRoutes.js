const express = require("express");
const router = express.Router();
const { getProjects, createProject, deleteProject } = require("../controllers/projectController");

// Получить все проекты
router.get("/", getProjects);

// Создать новый проект
router.post("/", createProject);

// Удалить проект
router.delete("/:id", deleteProject);

// Тестовый маршрут для проверки
router.get("/test", (req, res) => {
  res.json({ message: "Маршрут /api/projects работает!" });
});

module.exports = router;
