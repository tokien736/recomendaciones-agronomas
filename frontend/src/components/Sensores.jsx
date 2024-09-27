import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/styleSensores.css'; // Carga el archivo styleSensores.css

const Sensores = () => {
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <a className="navbar-brand" href="#">Agronomía</a>
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
              <a className="nav-link" href="/">Inicio</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/sensores">Datos Sensores</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/recomendaciones">Recomendaciones</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Contacto</a>
            </li>
          </ul>
        </div>
      </nav>

      <div className="container mt-5">
        <h1 className="text-center">Humedad Ambiental</h1>
        <div className="humidity-scale">
          <div className="range too-dry">SECO</div>
          <div className="range optimal">ÓPTIMO</div>
          <div className="range too-humid">MUY HÚMEDO</div>
        </div>
        <div className="d-flex justify-content-between mt-2 numbers">
          <span>0</span>
          <span>10</span>
          <span>20</span>
          {/* Puedes agregar más etiquetas aquí */}
        </div>
      </div>

      <footer className="footer-bottom mt-auto py-3 bg-dark">
        <div className="container text-white text-center">
          <span className="text-muted">Todos los derechos reservados</span>
        </div>
      </footer>
    </div>
  );
};

export default Sensores;
