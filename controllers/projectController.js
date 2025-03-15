const db = require("../models");
const Project = db.Project;
const CashFlow = db.CashFlow;
const FinancialResult = db.FinancialResult;
const { sequelize } = db; 

// Получить все проекты (включая денежные потоки и финрезультаты)
const getProjects = async (req, res) => {
    try {
        const projects = await Project.findAll();
        res.json(projects);
    } catch (error) {
        console.error("❌ Ошибка при получении проектов:", error);
        res.status(500).json({ message: "Ошибка при получении проектов", error: error.message || error });
    }
};

// Получить проект по ID
const getProjectById = async (req, res) => {
    const { id } = req.params;
    try {
        const project = await Project.findByPk();
        
        if (!project) {
            return res.status(404).json({ message: "Проект не найден" });
        }
        
        res.json(project);
    } catch (error) {
        console.error("❌ Ошибка при получении проекта:", error);
        res.status(500).json({ message: "Ошибка при получении проекта", error: error.message || error });
    }
};

// Создать проект
const createProject = async (req, res) => { 
    let { name, opex, capex, revenue, usefulLifeYears } = req.body;

    if (!name || !opex || !capex || !revenue) {
        return res.status(400).json({ message: "Заполните все обязательные поля!" });
    }

    if (!usefulLifeYears) {
        usefulLifeYears = 5;
    }

    try {
        const newProject = await Project.create({ name, opex, capex, revenue, usefulLifeYears });
        res.status(201).json(newProject);
    } catch (error) {
        console.error("❌ Ошибка при создании проекта:", error);
        res.status(500).json({ message: "Ошибка при создании проекта", error: error.message || error });
    }
};

// Удалить проект и связанные записи
const deleteProject = async (req, res) => {
    const { id } = req.params;
    const t = await sequelize.transaction();
    
    try {
        await CashFlow.destroy({ where: { projectId: id }, transaction: t });
        await FinancialResult.destroy({ where: { projectId: id }, transaction: t });
        await Project.destroy({ where: { id }, transaction: t });
        
        await t.commit();
        res.json({ message: "Проект и связанные данные удалены" });
    } catch (error) {
        await t.rollback();
        console.error("❌ Ошибка при удалении проекта:", error);
        res.status(500).json({
            message: "Ошибка при удалении проекта",
            error: error.message || error 
        });
    }
};

module.exports = { 
    getProjects, 
    getProjectById, 
    createProject, 
    deleteProject 
};