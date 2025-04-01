// services/financialResultCalculator.js
const { calculateNPV, calculateIRR, calculateDPBP } = require('./utils');

const calculateFinancialResults = (cashFlows, discountRate) => {
    const npv = calculateNPV(cashFlows, discountRate);
    const irr = calculateIRR(cashFlows);
    const dpbp = calculateDPBP(cashFlows);
    
    return { npv, irr, dpbp };
};

module.exports = { calculateFinancialResults };
