import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import InputForm from './pages/InputForm';
import ResultPage from './pages/ResultPage';
import Header from './components/Header'; 
import Footer from './components/Footer'; 


function App() {
  return (
    <Router>
      <Header /> {}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/input" element={<InputForm />} />
        <Route path="/results" element={<ResultPage />} />
      </Routes>
      <Footer /> {}
    </Router>
  );
}

export default App;