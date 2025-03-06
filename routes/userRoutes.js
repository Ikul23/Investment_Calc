const express = require("express");
const router = express.Router();

// Пример маршрута для получения списка пользователей
router.get("/", (req, res) => {
  res.json({ message: "Список пользователей" });
});

module.exports = router;
