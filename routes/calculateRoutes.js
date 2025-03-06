const express = require("express");
const router = express.Router();


router.post("/", (req, res) => {
  const { initialInvestment, interestRate, years } = req.body;

  if (!initialInvestment || !interestRate || !years) {
    return res.status(400).json({ message: "Введите все данные" });
  }

  // Простая формула сложного процента
  const finalAmount = initialInvestment * Math.pow(1 + interestRate / 100, years);

  res.json({ initialInvestment, interestRate, years, finalAmount });
});

// Тестовый маршрут для проверки
router.get("/", (req, res) => {
  res.json({ message: "Маршрут /api/calculate работает!" });
});


module.exports = router;
