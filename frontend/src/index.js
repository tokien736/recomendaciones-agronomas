import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom'; // Asegúrate de importar Router
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Router> {/* Aquí envolvemos la aplicación con Router */}
      <App /> {/* Componente App que contiene las rutas */}
    </Router>
  </React.StrictMode>
);

reportWebVitals();
