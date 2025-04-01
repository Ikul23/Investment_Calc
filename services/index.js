// services/index.js
const { calculateCashFlow } = require('./cashFlowCalculator');
const { calculateFinancialResults } = require('./financialResultCalculator');
const { aggregateYearlyData } = require('./yearlyDataCalculator');

module.exports = {
    calculateCashFlow,
    calculateFinancialResults,
    aggregateYearlyData
};
