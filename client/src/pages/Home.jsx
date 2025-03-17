import React from "react";
import { Link } from "react-router-dom";
import { Container, Button } from "react-bootstrap";
import "../index.css"; 
function Home() {
  return (
    <Container className="text-center mt-5 p-4">
      <h1 className="mb-4 text-primary">
        Экспресс расчет оценки эффективности инвестиционного проекта
      </h1>
      <Link to="/input">
        <Button variant="success" size="lg">
          Начать расчет
        </Button>
      </Link>
    </Container>
  );
}

export default Home;
