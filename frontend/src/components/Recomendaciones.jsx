import React, { useState, useEffect } from 'react';
import { createAndTrainModel, recomendar, obtenerPromediosSensores } from '../js/model';
import Header from './Header';
import Footer from './Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloud, faTint, faThermometerHalf } from '@fortawesome/free-solid-svg-icons';

const Recomendaciones = () => {
  const [promedios, setPromedios] = useState({ humedad: 0, humedadSuelo: 0, temperatura: 0 });
  const [recomendacion, setRecomendacion] = useState('Cargando recomendación...');
  const [model, setModel] = useState(null);

  // Entrenar el modelo al inicio
  useEffect(() => {
    const loadModel = async () => {
      const trainedModel = await createAndTrainModel();
      setModel(trainedModel);
      console.log("Modelo entrenado y listo para hacer predicciones.");
    };
    loadModel();
  }, []);

// Obtener los datos promedio de los sensores
useEffect(() => {
  const fetchPromedios = async () => {
    const data = await obtenerPromediosSensores();
    if (data) {
      console.log("Datos de promedio obtenidos:", data); // Log para verificar los datos
      setPromedios({
        humedad: data.humedad || 0,
        humedadSuelo: data.humedad_suelo || 0,
        temperatura: data.temperatura || 0
      });
    } else {
      console.warn("No se encontraron datos de promedio válidos.");
    }
  };
  fetchPromedios();
}, []);


// Generar recomendación cuando el modelo y los datos están listos
useEffect(() => {
  const generateRecommendation = async () => {
    if (model && promedios.humedad !== undefined && promedios.humedadSuelo !== undefined && promedios.temperatura !== undefined) {
      const result = await recomendar(promedios.humedad, promedios.humedadSuelo, promedios.temperatura, model);
      setRecomendacion(result);
    } else {
      console.warn("Datos incompletos para realizar recomendaciones:", promedios);
    }
  };
  generateRecommendation();
}, [model, promedios]);


  return (
    <>
      <Header />
      <div className="container mt-5">
        <h1 className="text-center mb-4">Sistema de Recomendaciones Agrónomas</h1>

        <div className="row mb-4">
          <div className="col-md-4">
            <div className="card p-4 text-center shadow-sm">
              <FontAwesomeIcon icon={faCloud} size="3x" className="mb-3" style={{ color: '#1abc9c' }} />
              <h4>Humedad Ambiental</h4>
              <p>{promedios.humedad !== undefined ? `${promedios.humedad.toFixed(2)}%` : '-'}</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card p-4 text-center shadow-sm">
              <FontAwesomeIcon icon={faTint} size="3x" className="mb-3" style={{ color: '#1abc9c' }} />
              <h4>Humedad del Suelo</h4>
              <p>{promedios.humedadSuelo !== undefined ? `${promedios.humedadSuelo.toFixed(2)}%` : '-'}</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card p-4 text-center shadow-sm">
              <FontAwesomeIcon icon={faThermometerHalf} size="3x" className="mb-3" style={{ color: '#1abc9c' }} />
              <h4>Temperatura</h4>
              <p>{promedios.temperatura !== undefined ? `${promedios.temperatura.toFixed(2)}°C` : '-'}</p>
            </div>
          </div>
        </div>

        <div className="card p-4 shadow-sm">
          <h4 className="text-center">Recomendación de Cultivos</h4>
          <pre className="text-center text-success">
            <b>{recomendacion}</b>
          </pre>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Recomendaciones;
