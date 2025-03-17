import React from "react";
import { Container, Form, Button } from "react-bootstrap";
import "../index.css";

function InputForm() {
  return (
    <Container className="mt-5 p-4">
      <h2 className="text-center text-primary mb-4">Ввод данных</h2>
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Название проекта</Form.Label>
          <Form.Control type="text" placeholder="Введите название проекта" />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Операционные затраты (OPEX)</Form.Label>
          <Form.Control type="number" placeholder="Введите OPEX (руб)" />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Капитальные затраты (CAPEX)</Form.Label>
          <Form.Control type="number" placeholder="Введите CAPEX (руб)" />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Прогнозируемая выручка</Form.Label>
          <Form.Control type="number" placeholder="Введите выручку (руб)" />
        </Form.Group>

        <Button variant="primary" size="lg" className="w-100">
          Рассчитать
        </Button>
      </Form>
    </Container>
  );
}

export default InputForm;
