import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './components/Index';
import Sensores from './components/Sensores';
import Recomendaciones from './components/Recomendaciones';
import TrefleAPI from './components/TrefleAPI'; // Asegúrate de que el componente TrefleAPI esté importado

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Index />} />
        <Route path="/sensores" element={<Sensores />} />
        <Route path="/recomendaciones" element={<Recomendaciones />} />
        <Route path="/trefle" element={<TrefleAPI />} /> {/* Ruta para Trefle */}
      </Routes>
    </Router>
  );
}

export default App;
