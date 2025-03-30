import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchProjectResults, downloadReport } from "../api";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";

const ResultPage = () => {
    const { projectId } = useParams();
    const [projectData, setProjectData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await fetchProjectResults(projectId);
                setProjectData(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [projectId]);

    if (loading) return <p>Загрузка...</p>;
    if (error) return <p className="text-danger">Ошибка: {error}</p>;

    // Данные для графика
    const chartData = {
        labels: projectData?.cashFlow?.map(({ year }) => `Год ${year}`) || [],
        datasets: [
            {
                label: "Выручка",
                data: projectData?.cashFlow?.map(({ revenue }) => revenue) || [],
                backgroundColor: "rgba(75, 192, 192, 0.6)",
            },
            {
                label: "OPEX",
                data: projectData?.cashFlow?.map(({ opex }) => opex) || [],
                backgroundColor: "rgba(255, 99, 132, 0.6)",
            },
            {
                label: "CAPEX",
                data: projectData?.cashFlow?.map(({ capex }) => capex) || [],
                backgroundColor: "rgba(54, 162, 235, 0.6)",
            },
        ],
    };

    return (
        <div className="container">
            <h2 className="my-4">Результаты расчета</h2>

            {projectData && (
                <div>
                    {/* Таблица результатов */}
                    <h4>Финансовые показатели</h4>
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>Показатель</th>
                                <th>Значение</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>NPV</td>
                                <td>{projectData.financialResult?.npv?.toFixed(2) || "—"}</td>
                            </tr>
                            <tr>
                                <td>IRR</td>
                                <td>{projectData.financialResult?.irr?.toFixed(2)}%</td>
                            </tr>
                            <tr>
                                <td>DPBP</td>
                                <td>{projectData.financialResult?.dpbp || "—"} лет</td>
                            </tr>
                        </tbody>
                    </table>

                    {/* График */}
                    <h4>Динамика денежных потоков</h4>
                    <Bar data={chartData} />

                    {/* Кнопка для скачивания PDF */}
                    <button
                        onClick={() => downloadReport(projectId)}
                        className="btn btn-warning mt-3"
                    >
                        📄 Скачать PDF-отчет
                    </button>
                </div>
            )}
        </div>
    );
};

export default ResultPage;
