/**
 * Рассчитывает чистый приведенный доход (NPV)
 * @param {Array} cashFlows - Массив денежных потоков
 * @param {number} discountRate - Ставка дисконтирования
 * @returns {number} Значение NPV
 */
const calculateNPV = (cashFlows, discountRate) => {
  let npv = 0;

  cashFlows.forEach((flow, index) => {
    const year = index + 1; // Годы начинаются с 1
    const discountFactor = 1 / Math.pow(1 + discountRate, year);
    const netCashFlow = flow.revenue - flow.opex - flow.capex;
    npv += netCashFlow * discountFactor;
  });

  return parseFloat(npv.toFixed(2));
};

/**
 * Рассчитывает внутреннюю норму доходности (IRR)
 * @param {Array} cashFlows - Массив денежных потоков
 * @returns {number} Значение IRR в процентах
 */
const calculateIRR = (cashFlows) => {
  const maxIterations = 1000;
  const tolerance = 0.00001;
  let guess = 0.1; // Начальное предположение 10%

  for (let i = 0; i < maxIterations; i++) {
    let npv = 0;
    let derivative = 0;

    cashFlows.forEach((flow, index) => {
      const year = index + 1;
      const netCashFlow = flow.revenue - flow.opex - flow.capex;
      const denominator = Math.pow(1 + guess, year);

      npv += netCashFlow / denominator;
      derivative -= year * netCashFlow / (denominator * (1 + guess));
    });

    const newGuess = guess - npv / derivative;

    if (Math.abs(newGuess - guess) < tolerance) {
      return parseFloat((newGuess * 100).toFixed(2)); // Возвращаем в процентах
    }

    guess = newGuess;
  }

  throw new Error('IRR не может быть рассчитан');
};

/**
 * Рассчитывает простой срок окупаемости (PP)
 * @param {Array} cashFlows - Массив денежных потоков
 * @returns {number} Срок окупаемости в годах
 */
const calculatePP = (cashFlows) => {
  let cumulativeCashFlow = 0;
  let investment = 0;

  // Считаем общие инвестиции (CAPEX в первый год)
  if (cashFlows.length > 0) {
    investment = cashFlows[0].capex;
  }

  for (let i = 0; i < cashFlows.length; i++) {
    const flow = cashFlows[i];
    cumulativeCashFlow += flow.revenue - flow.opex - (i === 0 ? 0 : flow.capex);

    if (cumulativeCashFlow >= investment) {
      // Линейная интерполяция для точного расчета
      const prevCumulative = cumulativeCashFlow - (flow.revenue - flow.opex - (i === 0 ? 0 : flow.capex));
      const fraction = (investment - prevCumulative) / (cumulativeCashFlow - prevCumulative);
      return parseFloat((i + fraction).toFixed(2));
    }
  }

  return Infinity; // Проект не окупился
};

/**
 * Рассчитывает дисконтированный срок окупаемости (DPP)
 * @param {Array} cashFlows - Массив денежных потоков
 * @param {number} discountRate - Ставка дисконтирования
 * @returns {number} Дисконтированный срок окупаемости в годах
 */
const calculateDPP = (cashFlows, discountRate) => {
  let cumulativeDiscountedCashFlow = 0;
  let investment = 0;

  // Считаем общие инвестиции (CAPEX в первый год)
  if (cashFlows.length > 0) {
    investment = cashFlows[0].capex;
  }

  for (let i = 0; i < cashFlows.length; i++) {
    const flow = cashFlows[i];
    const year = i + 1;
    const discountFactor = 1 / Math.pow(1 + discountRate, year);
    const discountedCashFlow = (flow.revenue - flow.opex - (i === 0 ? 0 : flow.capex)) * discountFactor;

    cumulativeDiscountedCashFlow += discountedCashFlow;

    if (cumulativeDiscountedCashFlow >= investment) {
      // Линейная интерполяция для точного расчета
      const prevCumulative = cumulativeDiscountedCashFlow - discountedCashFlow;
      const fraction = (investment - prevCumulative) / (cumulativeDiscountedCashFlow - prevCumulative);
      return parseFloat((i + fraction).toFixed(2));
    }
  }

  return Infinity; // Проект не окупился
};

module.exports = {
  calculateNPV,
  calculateIRR,
  calculatePP,
  calculateDPP
};
