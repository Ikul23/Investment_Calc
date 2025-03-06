let projects = []; // Временный массив вместо базы данных

// Получить все проекты
const getProjects = (req, res) => {
    res.json(projects);
};

// Создать проект
const createProject = (req, res) => {
    const { name, opex, capex, revenue } = req.body;
    if (!name || !opex || !capex || !revenue) {
        return res.status(400).json({ message: "Заполните все поля!" });
    }

    const newProject = { id: projects.length + 1, name, opex, capex, revenue };
    projects.push(newProject);
    res.status(201).json(newProject);
};

// Удалить проект
const deleteProject = (req, res) => {
    const { id } = req.params;
    projects = projects.filter(proj => proj.id !== Number(id));
    res.json({ message: "Проект удален" });
};

module.exports = { getProjects, createProject, deleteProject };
