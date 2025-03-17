import React, { useState } from "react";
import { Container, Form, Button, ListGroup } from "react-bootstrap";
import YearInput from "../components/YearInput"; 
import "../index.css";

function InputForm() {
  // Состояние для хранения данных проекта
  const [projectData, setProjectData] = useState({
    name: "",
    opex: "",
    capex: "",
    revenue: "",
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

  // Обработчик добавления данных за год
  const handleYearData = (yearData) => {
    setYearlyData((prevData) => [...prevData, yearData]);
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

        <Form.Group className="mb-3">
          <Form.Label>Прогнозируемая выручка</Form.Label>
          <Form.Control
            type="number"
            name="revenue"
            placeholder="Введите выручку (руб)"
            value={projectData.revenue}
            onChange={handleProjectInputChange}
          />
        </Form.Group>

        {/* Компонент для ввода данных по годам */}
        <YearInput onYearDataChange={handleYearData} />

        {/* Отображение введенных данных по годам */}
        {yearlyData.length > 0 && (
          <div className="mt-4">
            <h4>Введенные данные по годам:</h4>
            <ListGroup>
              {yearlyData.map((data, index) => (
                <ListGroup.Item key={index}>
                  Год: {data.year}, Доход: {data.revenue}, Расходы: {data.expenses}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>
        )}

        {/* Кнопка отправки формы */}
        <Button variant="primary" size="lg" className="w-100 mt-4" type="submit">
          Рассчитать
        </Button>
      </Form>
    </Container>
  );
}

export default InputForm;