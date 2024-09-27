import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <Link className="navbar-brand" to="/">Agronomía</Link>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ml-auto">
          <li className="nav-item active">
            <Link className="nav-link" to="/">Inicio</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/sensores">Datos Sensores</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/recomendaciones">Recomendaciones</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/trefle">Trefle API</Link> {/* Enlace para Trefle */}
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Header;
