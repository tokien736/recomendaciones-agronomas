import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faThermometerHalf, faSeedling, faLeaf } from '@fortawesome/free-solid-svg-icons';
import '../css/style.css';

const Header = () => {
  const location = useLocation();

  return (
    <nav className="navbar navbar-expand-lg custom-navbar">
      <div className="container">
        <Link className="navbar-brand" to="/">🌿 Agronomía</Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ml-auto">
            <li className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
              <Link className="nav-link" to="/">
                <FontAwesomeIcon icon={faHome} /> Inicio
              </Link>
            </li>
            <li className={`nav-item ${location.pathname === '/sensores' ? 'active' : ''}`}>
              <Link className="nav-link" to="/sensores">
                <FontAwesomeIcon icon={faThermometerHalf} /> Datos Sensores
              </Link>
            </li>
            <li className={`nav-item ${location.pathname === '/recomendaciones' ? 'active' : ''}`}>
              <Link className="nav-link" to="/recomendaciones">
                <FontAwesomeIcon icon={faSeedling} /> Recomendaciones
              </Link>
            </li>
            {/* <li className={`nav-item ${location.pathname === '/trefle' ? 'active' : ''}`}>
              <Link className="nav-link" to="/trefle">
                <FontAwesomeIcon icon={faLeaf} /> Trefle API
              </Link>
            </li> */}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
