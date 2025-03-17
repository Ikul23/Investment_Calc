import React, { useState } from 'react';

function YearInput({ onYearDataChange }) {
  // Состояние для хранения данных по годам
  const [yearData, setYearData] = useState({
    year: '',
    revenue: '',
    expenses: '',
  });

  // Обработчик изменения полей ввода
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setYearData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Обработчик отправки данных
  const handleSubmit = (e) => {
    e.preventDefault();
    onYearDataChange(yearData); // Передаем данные в родительский компонент
    setYearData({ year: '', revenue: '', expenses: '' }); // Очищаем форму
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="year">Год:</label>
        <input
          type="number"
          id="year"
          name="year"
          value={yearData.year}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <label htmlFor="revenue">Доход:</label>
        <input
          type="number"
          id="revenue"
          name="revenue"
          value={yearData.revenue}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <label htmlFor="expenses">Расходы:</label>
        <input
          type="number"
          id="expenses"
          name="expenses"
          value={yearData.expenses}
          onChange={handleInputChange}
          required
        />
      </div>
      <button type="submit">Добавить год</button>
    </form>
  );
}

export default YearInput;