// Función para obtener el clima usando la API de OpenWeatherMap
function getWeather(lat, lng) {
    var apiKey = 'a7e8faeb16d2ecfb7ec83a580e1207b1'; // Reemplaza con tu clave API de OpenWeatherMap
    var url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&lang=es&appid=${apiKey}`; // URL de la API de OpenWeatherMap

    fetch(url) // Realiza una solicitud GET a la API de OpenWeatherMap
        .then(response => response.json()) // Convierte la respuesta a formato JSON
        .then(data => { // Maneja los datos recibidos
            var weatherDiv = document.getElementById('weather'); // Obtiene el elemento HTML donde se mostrará la información del clima
            var weatherInfo = `
                <h2>Clima en tu ubicación actual:</h2>
                <p>Temperatura: ${data.main.temp}°C</p> 
                <p>Condiciones: ${data.weather[0].description}</p>
                <p>Humedad: ${data.main.humidity}%</p>
                <p>Viento: ${data.wind.speed} m/s</p>
            `;
            weatherDiv.innerHTML = weatherInfo; // Inserta la información del clima en el elemento HTML
        })
        .catch(error => { // Maneja los errores
            console.error('Error al obtener el clima:', error); // Muestra un mensaje de error en la consola
        });
}

export { getWeather };
