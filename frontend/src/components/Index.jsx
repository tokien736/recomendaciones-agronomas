import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Solo una vez es necesario
import 'bootstrap/dist/js/bootstrap.bundle.min'; // JS de Bootstrap
import '../css/style.css'; // Tu CSS personalizado
import { initMap } from '../js/maps'; // Asegúrate de que initMap esté correctamente exportado
import Header from './Header';
import Footer from './Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThermometerHalf, faCloud, faTint, faWind } from '@fortawesome/free-solid-svg-icons';
import { getWeather } from '../js/weather'; // Importar la función getWeather
import uploadData from '../js/dataUploader'; // Importa la función de dataUploader.js



const Index = () => {
  // Estado para almacenar los datos del clima y posibles errores
  const [weatherData, setWeatherData] = useState({
    temperature: null,
    conditions: '',
    humidity: null,
    windSpeed: null,
  });
  const [error, setError] = useState(null); // Estado para manejar errores
  // Llama a la función de dataUploader para que se ejecute siempre cada 30 segundos
  useEffect(() => {
    uploadData(); // Ejecuta uploadData inmediatamente al montar el componente

    // Configura un intervalo para llamar a uploadData cada 30 segundos
    const interval = setInterval(uploadData, 30 * 1000);

    // Limpia el intervalo cuando el componente se desmonte
    return () => clearInterval(interval);
  }, []);
  
  // Obtener el clima cuando el componente se monta
  useEffect(() => {
    // Inicializar el mapa cuando el componente se monta
    if (typeof initMap === 'function') {
      initMap(); // Inicializar el mapa
    } else {
      console.error('initMap no está definida');
    }

    // Obtener la ubicación del usuario y los datos del clima
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          // Llamar a la API del clima usando la función getWeather
          getWeather(latitude, longitude)
            .then((data) => {
              setWeatherData({
                temperature: data.main.temp,
                conditions: data.weather[0].description,
                humidity: data.main.humidity,
                windSpeed: data.wind.speed,
              });
            })
            .catch((error) => {
              console.error('Error al obtener el clima:', error);
              setError('No se pudo obtener los datos del clima.');
            });
        },
        (error) => {
          console.error('Error al obtener la geolocalización:', error);
          setError('No se pudo obtener la geolocalización.');
        }
      );
    } else {
      setError('Geolocalización no está soportada por este navegador.');
    }
  }, []);

  return (
    <div>
      <Header />

      {/* Título y descripción */}
      <div className="container text-center my-5">
        <h1 className="display-4">Bienvenido a Agronomía Inteligente</h1>
        <p className="lead text-muted">
          Aquí puedes visualizar la ubicación y el clima actual para ayudarte en la toma de decisiones agrícolas.
        </p>
      </div>

      {/* Sección Principal */}
      <div className="container-fluid main-content">
        <div className="row half-height">
          
          {/* Columna del Mapa */}
          <div className="col-md-6 map-container">
            <h2 className="text-center mb-3">Mapa de tu ubicación</h2>
            <div id="map" className="border" style={{ height: '400px' }}></div>
          </div>
          
          {/* Columna del Clima */}
          <div className="col-md-6 d-flex align-items-center justify-content-center weather-container">
            <div className="weather-box">
              <h2 className="text-center mb-3">Clima en tu ubicación actual:</h2>
              {/* Mostrar error si lo hay */}
              {error ? (
                <p className="text-danger">{error}</p>
              ) : (
                <>
                  <p className="mb-2">
                    <FontAwesomeIcon icon={faThermometerHalf} />{' '}
                    Temperatura: {weatherData.temperature !== null ? `${weatherData.temperature}°C` : 'Cargando...'}
                  </p>
                  <p className="mb-2">
                    <FontAwesomeIcon icon={faCloud} />{' '}
                    Condiciones: {weatherData.conditions || 'Cargando...'}
                  </p>
                  <p className="mb-2">
                    <FontAwesomeIcon icon={faTint} />{' '}
                    Humedad: {weatherData.humidity !== null ? `${weatherData.humidity}%` : 'Cargando...'}
                  </p>
                  <p className="mb-2">
                    <FontAwesomeIcon icon={faWind} />{' '}
                    Viento: {weatherData.windSpeed !== null ? `${weatherData.windSpeed} m/s` : 'Cargando...'}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Index;
