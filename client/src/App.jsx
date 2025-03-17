import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import InputForm from './pages/InputForm';
import ResultPage from './pages/ResultPage';
import Header from './components/Header'; 
import Footer from './components/Footer'; 

console.log("✅ App.js загружен");

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/input" element={<InputForm />} />
        <Route path="/results" element={<ResultPage />} />
      </Routes>
      <Footer>
  <div className="text-center mt-4">
    <p>Есть вопросы? Свяжитесь с нами:</p>
    <a href="mailto:kompaniya.gisplyus@bk.ru" className="btn btn-outline-primary me-2">E-mail</a>
    <a href="https://t.me/ikul23" className="btn btn-outline-info me-2">Telegram</a>
  </div>
</Footer>
    </>
  );
}

export default App;