import React, { useState } from "react";
import { Container, Form, Button, Table } from "react-bootstrap";
import { sendProjectData } from "../api";

function InputForm() {
  const [projectData, setProjectData] = useState({
    name: "",
    opex: "",
    capex: "",
  });

  const [yearlyData, setYearlyData] = useState([]);

  const handleProjectInputChange = (e) => {
    const { name, value } = e.target;
    setProjectData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const addYearRow = () => {
    if (yearlyData.length < 7) {
      setYearlyData([...yearlyData, { year: "", revenue: "", expenses: "" }]);
    } else {
      alert("Максимум 7 лет!");
    }
  };

  const handleYearInputChange = (index, field, value) => {
    const updatedData = [...yearlyData];
    updatedData[index][field] = value;
    setYearlyData(updatedData);
  };

  const removeYearRow = (index) => {
    const updatedData = yearlyData.filter((_, i) => i !== index);
    setYearlyData(updatedData);
  };

  // Обновлённый обработчик отправки формы
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await sendProjectData(projectData, yearlyData);
      console.log("Ответ сервера:", result);
      alert("Данные успешно отправлены!");
    } catch (error) {
      alert("Ошибка при отправке данных на сервер!");
    }
  };

  return (
    <Container className="mt-5 p-4">
      <h2 className="text-center text-primary mb-4">Ввод данных</h2>
      <Form onSubmit={handleSubmit}>
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

        <Button variant="success" className="mb-3" onClick={addYearRow}>
          + Добавить год
        </Button>

        <Button variant="primary" size="lg" className="w-100 mt-4" type="submit">
          Рассчитать
        </Button>
      </Form>
    </Container>
  );
}

export default InputForm;
