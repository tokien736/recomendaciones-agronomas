import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { recomendar } from '../js/model'; // Asegúrate de que `recomendar` esté correctamente exportado
import Header from './Header'; // Importar el header
import Footer from './Footer'; // Importar el footer

const Recomendaciones = () => {
  const [result, setResult] = useState(''); // Estado para almacenar la recomendación

  const handleRecomendacion = async () => {
    try {
      const humedad = 60;  // Puedes obtener estos valores dinámicamente o de tu estado
      const humedadSuelo = 50;
      const temperatura = 25;

      const recomendacion = await recomendar(humedad, humedadSuelo, temperatura);
      setResult(recomendacion);
    } catch (error) {
      console.error('Error obteniendo la recomendación:', error);
    }
  };

  return (
    <div>
      <Header /> {/* Agregar el Header */}

      <div className="container mt-5">
        <h1 className="text-center">Sistema de Recomendaciones Agrónomas</h1>
        <div id="sensor-data" className="form-group">
          <p>Humedad Ambiental: <span id="humedad-ambiental">60</span>%</p>
          <p>Humedad del Suelo: <span id="humedad-suelo">50</span></p>
          <p>Temperatura: <span id="temperatura">25</span>°C</p>
        </div>
        <button className="btn btn-primary" onClick={handleRecomendacion}>
          Obtener Recomendación
        </button>
        <div id="result" className="mt-4">
          {result && (
            <div>
              <h4>Recomendación:</h4>
              <p>{result}</p>
            </div>
          )}
        </div>
      </div>

      <Footer /> {/* Agregar el Footer */}
    </div>
  );
};

export default Recomendaciones;
