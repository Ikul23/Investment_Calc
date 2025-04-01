// services/yearlyDataCalculator.js
const aggregateYearlyData = (projects) => {
    return projects.map(project => {
        return {
            id: project.id,
            name: project.name,
            discountRate: project.discountRate,
            years: project.years,
            cashFlows: project.CashFlows,
            financialResults: project.FinancialResults
        };
    });
};

module.exports = { aggregateYearlyData };
