const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const db = require("../models");
const FinancialResult = db.FinancialResult;
const CashFlow = db.CashFlow;
const Project = db.Project;

const getResults = async (req, res) => {
    try {
        const project = await Project.findByPk(req.params.projectId);
        if (!project) {
            return res.status(404).json({ message: "Проект не найден" });
        }

        const result = await FinancialResult.findOne({ where: { projectId: id } });
if (!result) {
    return res.status(404).json({ message: "Результаты не найдены" });
}

        if (!result) {
            return res.status(404).json({ 
                message: "Результаты не рассчитаны",
                npv: null,
                irr: null,
                pp: null,
                dpp: null
            });
        }

        res.status(200).json({
            npv: result.npv,
            irr: result.irr,
            pp: result.pp,
            dpp: result.dpp,
            project: {
                id: project.id,
                name: project.name
            }
        });
    } catch (error) {
        console.error("Ошибка при получении результатов:", error);
        res.status(500).json({ 
            message: "Ошибка сервера",
            error: process.env.NODE_ENV === 'development' ? error.message : null
        });
    }
};

const generateReport = async (req, res) => {
    const { projectId } = req.params;

    try {
        // Получаем данные проекта
        const project = await Project.findByPk(projectId, {
            include: [
                { model: CashFlow },
                { model: FinancialResult }
            ]
        });

        if (!project) {
            return res.status(404).json({ message: "Проект не найден" });
        }

        // Создаем директорию для отчетов, если её нет
        const reportsDir = path.join(__dirname, '../reports');
        if (!fs.existsSync(reportsDir)) {
            fs.mkdirSync(reportsDir, { recursive: true });
        }

        // Создаем PDF-документ
        const doc = new PDFDocument();
        const filePath = path.join(reportsDir, `report_${projectId}.pdf`);
        const writeStream = fs.createWriteStream(filePath);
        doc.pipe(writeStream);

        // Заголовок
        doc.fontSize(20)
           .text(`Отчет по проекту: ${project.name}`, { align: "center" })
           .moveDown(2);

        // Финансовые показатели
        doc.fontSize(14)
           .text("Финансовые результаты:", { underline: true })
           .moveDown();
        
        if (project.FinancialResult) {
            doc.text(`NPV: ${project.FinancialResult.npv.toFixed(2)}`);
            doc.text(`IRR: ${project.FinancialResult.irr.toFixed(2)}%`);
            doc.text(`PP: ${project.FinancialResult.pp} лет`);
            doc.text(`DPP: ${project.FinancialResult.dpp} лет`);
        } else {
            doc.text("Финансовые результаты не рассчитаны");
        }
        doc.moveDown(2);

        // Денежные потоки
        doc.fontSize(14)
           .text("Денежные потоки:", { underline: true })
           .moveDown();
        
        if (project.CashFlows && project.CashFlows.length > 0) {
            project.CashFlows.forEach(flow => {
                doc.text(`Год ${flow.year}: Выручка ${flow.revenue}, OPEX ${flow.opex}, CAPEX ${flow.capex}`);
            });
        } else {
            doc.text("Данные о денежных потоках отсутствуют");
        }

        doc.end();

        // После завершения записи отправляем файл
        writeStream.on("finish", () => {
            res.download(filePath, `report_${projectId}.pdf`, (err) => {
                if (err) {
                    console.error("Ошибка при скачивании отчета:", err);
                    return res.status(500).json({ message: "Ошибка при скачивании отчета" });
                }
                // Удаляем файл после скачивания
                fs.unlink(filePath, (err) => {
                    if (err) console.error("Ошибка при удалении файла:", err);
                });
            });
        });

        // Обработка ошибок генерации PDF
        writeStream.on("error", (err) => {
            console.error("Ошибка при создании PDF:", err);
            res.status(500).json({ message: "Ошибка при создании отчета" });
        });

    } catch (error) {
        console.error("Ошибка при генерации отчета:", error);
        res.status(500).json({ 
            message: "Ошибка при создании отчета", 
            error: process.env.NODE_ENV === 'development' ? error.message : undefined 
        });
    }
};

module.exports = { 
    getResults,
    generateReport 
};