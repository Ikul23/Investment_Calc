const express = require("express");
const router = express.Router();
const { getProjects, createProject, deleteProject } = require("../controllers/projectController");

// Получить все проекты
router.get("/projects", getProjects);

// Создать новый проект
router.post("/projects", createProject);

// Удалить проект
router.delete("/projects/:id", deleteProject);

module.exports = router;
