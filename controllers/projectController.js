const db = require("../models");
const { Project, CashFlow, FinancialResult } = db;
const { sequelize } = db;
const { calculateNPV } = require("../services/calculationService");

// Получение всех проектов с дополнительными данными
const getProjects = async (req, res) => {
    try {
        const projects = await Project.findAll({
            include: [
                { 
                    model: CashFlow,
                    attributes: ['id', 'year'] 
                },
                {
                    model: FinancialResult,
                    attributes: ['id', 'npv', 'irr']
                }
            ],
            order: [['createdAt', 'DESC']]
        });
        
        res.status(200).json(projects);
    } catch (error) {
        console.error("Ошибка при получении проектов:", error);
        res.status(500).json({ 
            message: "Ошибка при получении проектов",
            error: process.env.NODE_ENV === 'development' ? error.message : null
        });
    }
};

// Получение проекта по ID с полной информацией
const getProjectById = async (req, res) => {
    try {
        const project = await Project.findByPk(req.params.id, {
            include: [
                {
                    model: CashFlow,
                    attributes: { exclude: ['createdAt', 'updatedAt'] },
                    order: [['year', 'ASC']]
                },
                {
                    model: FinancialResult,
                    attributes: { exclude: ['createdAt', 'updatedAt'] }
                }
            ]
        });

        if (!project) {
            return res.status(404).json({ message: "Проект не найден" });
        }

        // Добавляем расчет NPV если нет финансового результата
        if (!project.financialResult) {
            const npv = calculateNPV(project.cashFlows, project.discountRate || 0.25);
            project.dataValues.npv = npv;
        }
if (isNaN(discountRate) || discountRate <= 0) {
    return res.status(400).json({
        message: "Ставка дисконтирования должна быть положительным числом"
    });
}
        res.status(200).json(project);
    } catch (error) {
        console.error("Ошибка при получении проекта:", error);
        res.status(500).json({ 
            message: "Ошибка при получении проекта",
            error: process.env.NODE_ENV === 'development' ? error.message : null
        });
    }
};

// Создание нового проекта
const createProject = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { name, discountRate = 0.25, years = 5 } = req.body;

        if (!name || !discountRate || !years) {
            await t.rollback();
            return res.status(400).json({ 
                message: "Необходимо указать: название, ставку дисконтирования и срок проекта" 
            });
        }

        const project = await Project.create({
            name,
            discountRate,
            years
        }, { transaction: t });

        // Создаем пустые денежные потоки
        const cashFlows = Array.from({ length: years }, (_, i) => ({
            projectId: project.id,
            year: i + 1,
            revenue: 0,
            opex: 0,
            capex: 0
        }));

        await CashFlow.bulkCreate(cashFlows, { transaction: t });
        await t.commit();

        res.status(201).json(project);
    } catch (error) {
        await t.rollback();
        console.error("Ошибка при создании проекта:", error);
        res.status(500).json({ 
            message: "Ошибка сервера",
            error: process.env.NODE_ENV === 'development' ? error.message : null
        });
    }
};
// Удаление проекта и связанных данных
const deleteProject = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const deleted = await Project.destroy({
            where: { id: req.params.id },
            transaction: t
        });

        if (!deleted) {
            await t.rollback();
            return res.status(404).json({ message: "Проект не найден" });
        }

        // Каскадное удаление связанных данных
        await CashFlow.destroy({ 
            where: { projectId: req.params.id },
            transaction: t
        });

        await FinancialResult.destroy({
            where: { projectId: req.params.id },
            transaction: t
        });

        await t.commit();
        res.status(200).json({ message: "Проект успешно удален" });
    } catch (error) {
        await t.rollback();
        console.error("Ошибка при удалении проекта:", error);
        res.status(500).json({
            message: "Ошибка при удалении проекта",
            error: process.env.NODE_ENV === 'development' ? error.message : null
        });
    }
};

module.exports = {
    getProjects,
    getProjectById,
    createProject,
    deleteProject
};