import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

// Логирование ошибок
console.log("✅ main.jsx загружен");
console.log('Инициализация приложения');
try {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  console.log('Root элемент найден:', !!root);
  root.render(
     <BrowserRouter>
    <App />
  </BrowserRouter>,
  );
  console.log('Рендеринг завершен');
} catch (error) {
  console.error('Ошибка при инициализации React:', error);
}