const { Project, CashFlow, FinancialResult } = require("../models");

// Получить все проекты (включая денежные потоки и финрезультаты)
const getProjects = async (req, res) => {
    try {
        const projects = await Project.findAll({
            include: [CashFlow, FinancialResult]
        });
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: "Ошибка при получении проектов", error });
    }
};

// Создать проект
const createProject = async (req, res) => {
    const { name, opex, capex, revenue, cashFlows, financialResults } = req.body;
    if (!name || !opex || !capex || !revenue) {
        return res.status(400).json({ message: "Заполните все поля!" });
    }

    try {
        const newProject = await Project.create({ name, opex, capex, revenue });

        // Если переданы денежные потоки – создаем их
        if (cashFlows && Array.isArray(cashFlows)) {
            await Promise.all(
                cashFlows.map(flow => 
                    CashFlow.create({ ...flow, projectId: newProject.id })
                )
            );
        }

        // Если переданы финрезультаты – создаем их
        if (financialResults && Array.isArray(financialResults)) {
            await Promise.all(
                financialResults.map(result => 
                    FinancialResult.create({ ...result, projectId: newProject.id })
                )
            );
        }

        res.status(201).json(newProject);
    } catch (error) {
        res.status(500).json({ message: "Ошибка при создании проекта", error });
    }
};

// Удалить проект и связанные записи
const deleteProject = async (req, res) => {
    const { id } = req.params;
    try {
        await CashFlow.destroy({ where: { projectId: id } });
        await FinancialResult.destroy({ where: { projectId: id } });
        await Project.destroy({ where: { id } });

        res.json({ message: "Проект и связанные данные удалены" });
    } catch (error) {
        res.status(500).json({ message: "Ошибка при удалении проекта", error });
    }
};

module.exports = { getProjects, createProject, deleteProject };
