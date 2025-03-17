import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './app';
import Home from './pages/Home';
import InputForm from './pages/InputForm';
import ResultPage from './pages/ResultPage';
import './index.css';

const Root = () => {
  try {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/input" element={<InputForm />} />
          <Route path="/results" element={<ResultPage />} />
        </Routes>
      </Router>
    );
  } catch (error) {
    console.error('Ошибка в маршрутах:', error);
    return <h1>Ошибка загрузки приложения</h1>;
  }
};

ReactDOM.createRoot(document.getElementById('root')).render(<Root />);
