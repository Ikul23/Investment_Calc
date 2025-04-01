// services/cashFlowCalculator.js
const calculateCashFlow = (revenue, opex, capex, usefulLifeYears) => {
    const cashFlow = [];
    for (let year = 1; year <= revenue.length; year++) {
        const depreciation = capex / usefulLifeYears; // Амортизация
        const operatingCashFlow = revenue[year - 1] - opex[year - 1] - depreciation;
        cashFlow.push({
            year,
            revenue: revenue[year - 1],
            opex: opex[year - 1],
            capex: year === 1 ? capex : 0, // CAPEX только в 1-й год
            depreciation,
            operatingCashFlow,
        });
    }
    return cashFlow;
};

module.exports = { calculateCashFlow };
