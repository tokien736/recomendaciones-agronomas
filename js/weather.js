// Función para obtener el clima usando la API de OpenWeatherMap
function getWeather(lat, lng) {
    var apiKey = 'a7e8faeb16d2ecfb7ec83a580e1207b1'; // Reemplaza esto con tu clave API de OpenWeatherMap
    var url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&lang=es&appid=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            var weatherDiv = document.getElementById('weather');
            var weatherInfo = `
                <h2>Clima en tu ubicación actual:</h2>
                <p>Temperatura: ${data.main.temp}°C</p>
                <p>Condiciones: ${data.weather[0].description}</p>
                <p>Humedad: ${data.main.humidity}%</p>
                <p>Viento: ${data.wind.speed} m/s</p>
            `;
            weatherDiv.innerHTML = weatherInfo;
        })
        .catch(error => {
            console.error('Error al obtener el clima:', error);
        });
}