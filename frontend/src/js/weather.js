// weather.js
export function getWeather(lat, lng) {
    const apiKey = 'a7e8faeb16d2ecfb7ec83a580e1207b1'; // Asegúrate de usar tu propia clave API de OpenWeatherMap
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&lang=es&appid=${apiKey}`;
  
    // Retornar la promesa de la API
    return fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al obtener los datos del clima: ' + response.statusText);
        }
        return response.json(); // Convertir la respuesta a JSON
      })
      .catch((error) => {
        console.error('Error al obtener el clima:', error);
        throw error; // Asegurarse de propagar el error para que se maneje correctamente
      });
  }
  