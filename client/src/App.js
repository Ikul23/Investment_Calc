import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import InputForm from './pages/InputForm';
import ResultPage from './pages/ResultPage';
import Header from './components/Header'; 
import Footer from './components/Footer'; 

console.log("✅ App.js загружен");

function App() {
  return (
    <Router>
      <Header /> {}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/input" element={<InputForm />} />
        <Route path="/results" element={<ResultPage />} />
      </Routes>
      <Footer /> {<div class="text-center mt-4">
            <p>Есть вопросы? Свяжитесь с нами:</p>
            <a href="mailto:kompaniya.gisplyus@bk.ru" class="btn btn-outline-primary me-2">E-mail</a>
            <a href="https://t.me/ikul23" class="btn btn-outline-info me-2">Telegram</a>
            
        </div>}
    </Router>
  );
}

export default App;