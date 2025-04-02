const express = require("express");
const router = express.Router();
const { Project, CashFlow, FinancialResult } = require("../models");
const { calculateNPV,  calculateIRR, calculateDPBP } = require("../services/financialResultCalculator");

// Эндпоинт для выполнения расчетов
router.post("/", async (req, res) => {
    try {
        const { projectId } = req.body;
        
        // 1. Проверяем существование проекта
        const project = await Project.findByPk(projectId);
        if (!project) {
            return res.status(404).json({ message: "Проект не найден" });
        }

        // 2. Получаем денежные потоки проекта
        const cashFlows = await CashFlow.findAll({
            where: { projectId },
            order: [['year', 'ASC']],
            raw: true
        });

        if (!cashFlows || cashFlows.length === 0) {
            return res.status(400).json({ message: "Нет данных по денежным потокам" });
        }

        // 3. Вычисляем показатели
        const npv = calculateNPV(cashFlows, project.discountRate);
        const irr = calculateIRR(cashFlows);        
        const dpp = calculateDPBP(cashFlows, project.discountRate);

        // 4. Сохраняем результаты
        const result = await FinancialResult.create({
            projectId,
            npv,
            irr,            
            dpp
        });

        // 5. Возвращаем ответ
        res.status(200).json({
            npv,
            irr,            
            dpp,
            project: {
                id: project.id,
                name: project.name
            }
        });

    } catch (error) {
        console.error("Ошибка при расчетах:", error);
        res.status(500).json({ 
            message: "Ошибка сервера при выполнении расчетов",
            error: error.message 
        });
    }
});

module.exports = router;