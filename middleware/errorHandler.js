// middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
    console.error(`[ERROR] ${err.message}`);

    res.status(err.status || 500).json({
        message: "Ошибка сервера",
        error: err.message,
    });
};

module.exports = errorHandler;
