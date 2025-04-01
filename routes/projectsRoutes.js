const express = require("express");
const router = express.Router();
const { getProjects, getProjectById, createProject, deleteProject } = require("../controllers/projectController");

router.get('/ping', (req, res) => {
    res.json({ message: 'pong' });
});

// GET /api/projects - получить все проекты
router.get('/', getProjects);

// GET /api/projects/:id - получить проект по ID
router.get('/:id', getProjectById);

// Создать новый проект
router.post("/", createProject);

// Удалить проект
router.delete("/:id", deleteProject);

// Тестовый маршрут для проверки
router.get("/test", (req, res) => {
  res.json({ message: "Маршрут /api/projects работает!" });
});

module.exports = router;
