import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Index from './components/Index';
import Sensores from './components/Sensores';
import Recomendaciones from './components/Recomendaciones';
import TrefleAPI from './components/TrefleAPI';
import { getWeather } from './js/weather';


function App() {
  const location = useLocation();
  const [weatherData, setWeatherData] = useState(null);
  const [lastNotificationTime, setLastNotificationTime] = useState(0); // Guardar el último tiempo en que se mostró una notificación

  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  const fetchWeatherData = async () => {
    try {
      const position = await new Promise((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject)
      );
      const { latitude, longitude } = position.coords;
      const weather = await getWeather(latitude, longitude);
      setWeatherData({
        temperature: weather.main.temp,
        conditions: weather.weather[0].description,
        humidity: weather.main.humidity,
        windSpeed: weather.wind.speed
      });
    } catch (error) {
      console.error("Error al obtener el clima:", error);
    }
  };

  const showNotification = (weatherData) => {
    const currentTime = Date.now(); // Obtener el tiempo actual en milisegundos
    const timeSinceLastNotification = currentTime - lastNotificationTime; // Calcular el tiempo transcurrido desde la última notificación

    if (Notification.permission === "granted" && weatherData && timeSinceLastNotification > 60000) { // 60,000 ms = 1 minuto
      new Notification("Datos Meteorológicos", {
        body: `Temperatura: ${weatherData.temperature}°C, Condiciones: ${weatherData.conditions}, Humedad: ${weatherData.humidity}%, Viento: ${weatherData.windSpeed} m/s`,
        icon: "/path-to-your-icon.png"
      });
      setLastNotificationTime(currentTime); // Actualizar el tiempo de la última notificación
    }
  };

  useEffect(() => {
    fetchWeatherData();
  }, [location]);

  useEffect(() => {
    if (weatherData) {
      showNotification(weatherData);
    }
  }, [weatherData]);

  return (
    <Routes>
      <Route exact path="/" element={<Index />} />
      <Route path="/sensores" element={<Sensores />} />
      <Route path="/recomendaciones" element={<Recomendaciones />} />
      <Route path="/trefle" element={<TrefleAPI />} />
    </Routes>
  );
}

export default App;
