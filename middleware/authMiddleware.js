// middleware/authMiddleware.js
const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization;
    
    if (!token) {
        return res.status(401).json({ message: "Нет доступа" });
    }
    
    // Дальше можно добавить логику проверки токена
    next();
};

module.exports = authMiddleware;
