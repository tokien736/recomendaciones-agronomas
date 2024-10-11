import React, { useEffect, useState, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import '../css/styleSensores.css';
import { initMap } from '../js/maps';
import { getWeather } from '../js/weather';
import Header from './Header';
import Footer from './Footer';
import { createHumidityBarChart, createSoilHumidityBarChart, createTemperatureBarChart } from '../js/graficas'; 
import { Chart, registerables } from 'chart.js';

// Registrar los componentes de Chart.js
Chart.register(...registerables);

const Sensores = () => {
  const [promedios, setPromedios] = useState({
    humedad: 65,
    humedad_suelo: 40,
    temperatura: 22,
  });
  const [weather, setWeather] = useState(null);

  // Referencias para los gráficos
  const humidityChartRef = useRef(null);
  const soilHumidityChartRef = useRef(null);
  const temperatureChartRef = useRef(null);

  useEffect(() => {
    initMap(); // Inicializa el mapa

    // Llama a la función para obtener los datos meteorológicos
    getWeather(40.416775, -3.703790).then((data) => {
      if (data) {
        setWeather(data); // Actualiza el estado del clima con los datos obtenidos
      }
    });

    // Crear o actualizar los gráficos cuando el componente se monta o actualiza
    if (humidityChartRef.current) {
      humidityChartRef.current.destroy(); // Destruye el gráfico anterior si existe
    }
    humidityChartRef.current = createHumidityBarChart('humidityChart', 'Humedad Ambiental', promedios.humedad);

    if (soilHumidityChartRef.current) {
      soilHumidityChartRef.current.destroy(); // Destruye el gráfico anterior si existe
    }
    soilHumidityChartRef.current = createSoilHumidityBarChart('soilHumidityChart', 'Humedad del Suelo', promedios.humedad_suelo);

    if (temperatureChartRef.current) {
      temperatureChartRef.current.destroy(); // Destruye el gráfico anterior si existe
    }
    temperatureChartRef.current = createTemperatureBarChart('temperatureChart', 'Temperatura', promedios.temperatura);

    // Cleanup: destruir gráficos cuando el componente se desmonte
    return () => {
      if (humidityChartRef.current) humidityChartRef.current.destroy();
      if (soilHumidityChartRef.current) soilHumidityChartRef.current.destroy();
      if (temperatureChartRef.current) temperatureChartRef.current.destroy();
    };
  }, [promedios]);

  return (
    <div>
      <Header /> {/* Aquí se incluye el Header */}
      <div className="container mt-5">
        <h1 className="text-center mb-5">Datos de Sensores Agronómicos</h1>

        {/* Tarjetas de Datos */}
        <div className="row">
          <div className="col-md-4">
            <div className="card text-center shadow-sm mb-4">
              <div className="card-body">
                <h5 className="card-title">Humedad Ambiental</h5>
                <p className="card-text">
                  <strong>{promedios.humedad}%</strong>
                </p>
                <canvas id="humidityChart" width="300" height="300"></canvas>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card text-center shadow-sm mb-4">
              <div className="card-body">
                <h5 className="card-title">Humedad del Suelo</h5>
                <p className="card-text">
                  <strong>{promedios.humedad_suelo}%</strong>
                </p>
                <canvas id="soilHumidityChart" width="300" height="300"></canvas>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card text-center shadow-sm mb-4">
              <div className="card-body">
                <h5 className="card-title">Temperatura</h5>
                <p className="card-text">
                  <strong>{promedios.temperatura}°C</strong>
                </p>
                <canvas id="temperatureChart" width="300" height="300"></canvas>
              </div>
            </div>
          </div>
        </div>

        {/* Sección del Clima Actual */}
        {weather && (
          <div className="weather-info mt-5">
            <div className="card shadow-sm">
              <div className="card-body">
                <h2 className="card-title text-center">Datos Meteorológicos Actuales</h2>
                <div className="row text-center">
                  <div className="col-md-3">
                    <p>Temperatura: {weather.main.temp}°C</p>
                  </div>
                  <div className="col-md-3">
                    <p>Condiciones: {weather.weather[0].description}</p>
                  </div>
                  <div className="col-md-3">
                    <p>Humedad: {weather.main.humidity}%</p>
                  </div>
                  <div className="col-md-3">
                    <p>Viento: {weather.wind.speed} m/s</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mapa */}
        <div className="map-container mt-5">
          <h2 className="text-center">Ubicación en el Mapa</h2>
          <div id="map" className="rounded shadow-sm" style={{ height: '400px', width: '100%' }}></div>
        </div>
      </div>
      <Footer /> {/* Aquí se incluye el Footer */}
    </div>
  );
};

export default Sensores;
