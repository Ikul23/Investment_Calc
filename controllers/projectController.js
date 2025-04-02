const db = require("../models");
const { Project, CashFlow, FinancialResult } = db;
const { sequelize } = db;
const { calculateNPV } = require("../services/financialResultCalculator");
const { calculateCashFlow } = require("../services/cashFlowCalculator");
const { calculateFinancialResults } = require("../services/financialResultCalculator");

// Получение всех проектов с дополнительными данными
const getProjects = async (req, res) => {
  try {
    const projects = await Project.findAll({
      include: [{
        model: CashFlow,
        as: 'cashFlows', // Используем тот же алиас
        attributes: ['id', 'year', 'opex', 'capex', 'revenue'] // Опционально: выбираем нужные поля
      }],
      attributes: ['id', 'name', 'discountRate', 'years'] // Опционально: выбираем нужные поля проекта
    });

    res.status(200).json(projects);
  } catch (error) {
    console.error('Ошибка при получении проектов:', error);
    res.status(500).json({
      message: 'Ошибка сервера при получении проектов',
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
        const { name, years = 5 } = req.body;
        const discountRate = 0.25;  // Фиксированная ставка дисконтирования
        const usefulLifeYears = 7;  // Срок полезного использования

        // Валидация входных данных
        if (!name || !years) {
            await t.rollback();
            return res.status(400).json({ 
                message: "Необходимо указать: название и срок проекта" 
            });
        }

        // 1. Создаем проект
        const project = await Project.create({
            name,
            discountRate,
            years,
            opex: 0,  
            capex: 0,
            revenue: 0
        }, { transaction: t });

        // 2. Создаем денежные потоки
        const emptyCashFlows = Array.from({ length: usefulLifeYears }, (_, i) => ({
            year: i + 1,
            opex: 0,
            capex: 0,
            revenue: 0,
            projectId: project.id
        }));

        await CashFlow.bulkCreate(emptyCashFlows, { transaction: t });

        // 3. Рассчитываем финансовые показатели (пока с нулевыми значениями)
        const initialResults = {
            npv: 0,
            irr: 0,
            dpbp: usefulLifeYears, // По умолчанию равен сроку проекта
            pp: usefulLifeYears
        };

        // 4. Создаем запись с финансовыми результатами
        await FinancialResult.create({
            projectId: project.id,
            year: new Date().getFullYear(),
            revenue: 0,
            operatingExpenses: 0,
            netProfit: 0,
            npv: initialResults.npv,
            irr: initialResults.irr,
            dpbp: initialResults.dpbp,
            pp: initialResults.pp
        }, { transaction: t });

        await t.commit();
        
        // Формируем ответ с созданными данными
        const response = {
            project: {
                id: project.id,
                name: project.name,
                discountRate: project.discountRate,
                years: project.years
            },
            message: "Проект успешно создан с пустыми денежными потоками"
        };

        res.status(201).json(response);
    } catch (error) {
        await t.rollback();
        console.error("Ошибка при создании проекта:", error);
        
        const errorResponse = {
            message: "Ошибка при создании проекта",
            error: error.message
        };
        
        res.status(500).json(errorResponse);
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