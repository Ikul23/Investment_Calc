// services/utils.js
const calculateNPV = (cashFlows, discountRate) => {
    return cashFlows.reduce((npv, flow, i) => {
        return npv + flow.operatingCashFlow / Math.pow(1 + discountRate, i + 1);
    }, 0);
};

const calculateIRR = (cashFlows) => {
    let irr = 0.1, epsilon = 0.0001, maxIterations = 100;
    for (let i = 0; i < maxIterations; i++) {
        const npv = calculateNPV(cashFlows, irr);
        if (Math.abs(npv) < epsilon) return irr;
        irr += 0.0001;
    }
    return irr;
};

const calculateDPBP = (cashFlows) => {
    let cumulativeCashFlow = 0;
    for (let year = 0; year < cashFlows.length; year++) {
        cumulativeCashFlow += cashFlows[year].operatingCashFlow;
        if (cumulativeCashFlow >= 0) return year + 1;
    }
    return null;
};

module.exports = { calculateNPV, calculateIRR, calculateDPBP };
