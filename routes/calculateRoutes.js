const express = require("express");
const router = express.Router();

const DISCOUNT_RATE = 0.25; // Фиксированная ставка дисконтирования (25%)


const getDiscountFactor = (period) => {
    return 1 / Math.pow(1 + DISCOUNT_RATE, period);
};

// Эндпоинт расчета дисконтированных потоков
router.post("/calculate", (req, res) => {
    try {
        const { cashFlows } = req.body; 
        if (!Array.isArray(cashFlows)) {
            return res.status(400).json({ error: "cashFlows должен быть массивом" });
        }

        let discountedCashFlows = [];
        let npv = 0;

        cashFlows.forEach((flow, index) => {
            const discountFactor = getDiscountFactor(index);
            const discountedValue = flow * discountFactor;
            discountedCashFlows.push(discountedValue);
            npv += discountedValue;
        });

        res.json({
            discountRate: DISCOUNT_RATE,
            discountedCashFlows,
            npv,
        });
    } catch (error) {
        console.error("Ошибка при расчете:", error);
        res.status(500).json({ error: "Ошибка сервера" });
    }
});

module.exports = router;
