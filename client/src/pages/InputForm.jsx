import React, { useState } from "react";
import { Container, Form, Button, Table } from "react-bootstrap";
import "../index.css";

function InputForm() {
  // Состояние для хранения данных проекта
  const [projectData, setProjectData] = useState({
    name: "",
    opex: "",
    capex: "",
  });

  // Состояние для хранения данных по годам
  const [yearlyData, setYearlyData] = useState([]);

  // Обработчик изменения полей формы проекта
  const handleProjectInputChange = (e) => {
    const { name, value } = e.target;
    setProjectData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Обработчик добавления новой строки (года)
  const addYearRow = () => {
    if (yearlyData.length < 7) {
      setYearlyData([...yearlyData, { year: "", revenue: "", expenses: "" }]);
    } else {
      alert("Максимум 7 лет!");
    }
  };

  // Обработчик изменения данных в таблице
  const handleYearInputChange = (index, field, value) => {
    const updatedData = [...yearlyData];
    updatedData[index][field] = value;
    setYearlyData(updatedData);
  };

  // Обработчик удаления строки
  const removeYearRow = (index) => {
    const updatedData = yearlyData.filter((_, i) => i !== index);
    setYearlyData(updatedData);
  };

  // Обработчик отправки формы
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Данные проекта:", projectData);
    console.log("Данные по годам:", yearlyData);
    alert("Данные успешно отправлены!");
  };

  return (
    <Container className="mt-5 p-4">
      <h2 className="text-center text-primary mb-4">Ввод данных</h2>
      <Form onSubmit={handleSubmit}>
        {/* Поля для ввода данных проекта */}
        <Form.Group className="mb-3">
          <Form.Label>Название проекта</Form.Label>
          <Form.Control
            type="text"
            name="name"
            placeholder="Введите название проекта"
            value={projectData.name}
            onChange={handleProjectInputChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Операционные затраты (OPEX)</Form.Label>
          <Form.Control
            type="number"
            name="opex"
            placeholder="Введите OPEX (руб)"
            value={projectData.opex}
            onChange={handleProjectInputChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Капитальные затраты (CAPEX)</Form.Label>
          <Form.Control
            type="number"
            name="capex"
            placeholder="Введите CAPEX (руб)"
            value={projectData.capex}
            onChange={handleProjectInputChange}
          />
        </Form.Group>

        {/* Таблица для ввода данных по годам */}
        <h4 className="mt-4">Данные по годам:</h4>
        <Table striped bordered hover className="mt-2">
          <thead>
            <tr>
              <th>Год</th>
              <th>Доход</th>
              <th>Расходы</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {yearlyData.map((row, index) => (
              <tr key={index}>
                <td>
                  <Form.Control
                    type="number"
                    placeholder="Год"
                    value={row.year}
                    onChange={(e) => handleYearInputChange(index, "year", e.target.value)}
                  />
                </td>
                <td>
                  <Form.Control
                    type="number"
                    placeholder="Доход"
                    value={row.revenue}
                    onChange={(e) => handleYearInputChange(index, "revenue", e.target.value)}
                  />
                </td>
                <td>
                  <Form.Control
                    type="number"
                    placeholder="Расходы"
                    value={row.expenses}
                    onChange={(e) => handleYearInputChange(index, "expenses", e.target.value)}
                  />
                </td>
                <td>
                  <Button variant="danger" onClick={() => removeYearRow(index)}>Удалить</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {/* Кнопка добавления года */}
        <Button variant="success" className="mb-3" onClick={addYearRow}>
          + Добавить год
        </Button>

        {/* Кнопка отправки формы */}
        <Button variant="primary" size="lg" className="w-100 mt-4" type="submit">
          Рассчитать
        </Button>
      </Form>
    </Container>
  );
}

export default InputForm;
