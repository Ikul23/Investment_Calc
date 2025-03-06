const express = require("express");
const router = express.Router();
const { getProjects, createProject, deleteProject } = require("../controllers/projectController");

// Получить все проекты
router.get("/projects", getProjects);

// Создать новый проект
router.post("/projects", createProject);

// Удалить проект
router.delete("/projects/:id", deleteProject);

// Тестовый маршрут для проверки
router.get("/", (req, res) => {
  res.json({ message: "Маршрут /api/projects работает!" });
});

module.exports = router;
