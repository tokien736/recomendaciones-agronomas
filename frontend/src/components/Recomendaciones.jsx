import React, { useState, useEffect } from 'react';
import { database, ref, onValue } from '../js/firebase'; // Rutas corregidas
import { recomendar } from '../js/model'; // Rutas corregidas
import Header from './Header'; // Importación del Header
import Footer from './Footer'; // Importación del Footer
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloud, faTint, faThermometerHalf } from '@fortawesome/free-solid-svg-icons';

const Recomendaciones = () => {
  const [humedad, setHumedad] = useState(null);
  const [humedadSuelo, setHumedadSuelo] = useState(null);
  const [temperatura, setTemperatura] = useState(null);
  const [recomendacion, setRecomendacion] = useState('');

  // Carga de los datos desde Firebase
  useEffect(() => {
    const dataRef = ref(database, '/datos');
    onValue(dataRef, (snapshot) => {
      const datos = snapshot.val();
      const data = Object.values(datos).map(d => ({
        humedad: d.humedad,
        humedad_suelo: d.humedad_suelo,
        temperatura: d.temperatura,
      })).filter(d => typeof d.temperatura === 'number' && !isNaN(d.temperatura));

      const totalLecturas = data.length;
      const sumas = data.reduce((acc, lectura) => {
        acc.humedad += lectura.humedad;
        acc.humedad_suelo += lectura.humedad_suelo;
        acc.temperatura += lectura.temperatura;
        return acc;
      }, { humedad: 0, humedad_suelo: 0, temperatura: 0 });

      const promedios = {
        humedad: sumas.humedad / totalLecturas,
        humedad_suelo: sumas.humedad_suelo / totalLecturas,
        temperatura: sumas.temperatura / totalLecturas,
      };

      setHumedad(promedios.humedad);
      setHumedadSuelo(promedios.humedad_suelo);
      setTemperatura(promedios.temperatura);
    });
  }, []);

  const handleRecomendacion = async () => {
    if (humedad !== null && humedadSuelo !== null && temperatura !== null) {
      const result = await recomendar(humedad, humedadSuelo, temperatura);
      setRecomendacion(result);
    }
  };

  return (
    <>
      {/* Header */}
      <Header />

      {/* Contenido principal */}
      <div className="container mt-5">
        <h1 className="text-center mb-4">Sistema de Recomendaciones Agrónomas</h1>

        {/* Tarjeta para los datos del sensor */}
        <div className="row mb-4">
          <div className="col-md-4">
            <div className="card p-4 text-center shadow-sm">
              <FontAwesomeIcon icon={faCloud} size="3x" className="mb-3" style={{ color: '#1abc9c' }} />
              <h4>Humedad Ambiental</h4>
              <p>{humedad !== null ? `${humedad.toFixed(2)}%` : '-'}</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card p-4 text-center shadow-sm">
              <FontAwesomeIcon icon={faTint} size="3x" className="mb-3" style={{ color: '#1abc9c' }} />
              <h4>Humedad del Suelo</h4>
              <p>{humedadSuelo !== null ? `${humedadSuelo.toFixed(2)}%` : '-'}</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card p-4 text-center shadow-sm">
              <FontAwesomeIcon icon={faThermometerHalf} size="3x" className="mb-3" style={{ color: '#1abc9c' }} />
              <h4>Temperatura</h4>
              <p>{temperatura !== null ? `${temperatura.toFixed(2)}°C` : '-'}</p>
            </div>
          </div>
        </div>

        {/* Botón de obtención de recomendación */}
        <div className="text-center mb-4">
          <button onClick={handleRecomendacion} className="btn btn-lg btn-primary">
            Obtener Recomendación
          </button>
        </div>

        {/* Resultado de la recomendación */}
        <div className="card p-4 shadow-sm">
          {recomendacion ? (
            <div>
              <h4 className="text-center">Recomendación de cultivos</h4>
              <p className="text-center">
                Con la temperatura promedio de <b>{temperatura?.toFixed(2)}°C</b>, 
                la humedad ambiental promedio de <b>{humedad?.toFixed(2)}%</b>, y 
                la humedad del suelo de <b>{humedadSuelo?.toFixed(2)}</b>, se recomienda sembrar los siguientes cultivos:
              </p>
              <p className="text-center text-success"><b>{recomendacion}</b></p>
              <p className="text-center">que cumplen las condiciones ambientales.</p>
            </div>
          ) : (
            <p className="text-center text-muted">No se ha generado ninguna recomendación aún.</p>
          )}
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </>
  );
};

export default Recomendaciones;
