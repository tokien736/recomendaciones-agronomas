import { createAndTrainModel, recomendar, convertirHumedadSuelo } from './model.js';
import { dataRef, onValue } from './firebase.js';

// Inicializa el mapa
function initMap() {
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 5,
        center: { lat: -9.19, lng: -75.0152 }, // Coordenadas centrales del país
    });
    return map;
}

// Agrega un marcador al mapa
function addMarker(map, lat, lng, title) {
    new google.maps.Marker({
        position: { lat, lng },
        map,
        title,
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    try {
        await createAndTrainModel();

        const map = initMap();

        onValue(dataRef, (snapshot) => {
            const datos = snapshot.val();
            const data = Object.values(datos).map(d => ({
                humedad: d.humedad,
                humedad_suelo: convertirHumedadSuelo(d.humedad_suelo),
                temperatura: d.temperatura
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

            // Verificar si los elementos existen antes de modificar el DOM
            const humidityElement = document.getElementById('humedad-ambiental');
            const soilHumidityElement = document.getElementById('humedad-suelo');
            const temperatureElement = document.getElementById('temperatura');

            if (humidityElement) {
                humidityElement.innerText = `${promedios.humedad.toFixed(2)}%`;
            } else {
                console.error('Elemento "humedad-ambiental" no encontrado en el DOM.');
            }

            if (soilHumidityElement) {
                soilHumidityElement.innerText = `${promedios.humedad_suelo.toFixed(2)}%`;
            } else {
                console.error('Elemento "humedad-suelo" no encontrado en el DOM.');
            }

            if (temperatureElement) {
                temperatureElement.innerText = `${promedios.temperatura.toFixed(2)}°C`;
            } else {
                console.error('Elemento "temperatura" no encontrado en el DOM.');
            }
        });

        document.getElementById('recomendarBtn').addEventListener('click', async () => {
            const humidityElement = document.getElementById('humedad-ambiental');
            const soilHumidityElement = document.getElementById('humedad-suelo');
            const temperatureElement = document.getElementById('temperatura');

            if (!humidityElement || !soilHumidityElement || !temperatureElement) {
                console.error('Uno o más elementos no existen en el DOM.');
                return;
            }

            const humedad = parseFloat(humidityElement.innerText);
            const humedadSuelo = parseFloat(soilHumidityElement.innerText);
            const temperatura = parseFloat(temperatureElement.innerText);

            const recomendacion = await recomendar(humedad, humedadSuelo, temperatura);

            const resultDiv = document.getElementById('result');
            if (resultDiv) {
                resultDiv.innerHTML = `
                    <p>Con la temperatura promedio que se tiene de <b>${temperatura.toFixed(2)}°C</b> con la humedad ambiental promedio de <b>${humedad.toFixed(2)}%</b> con la humedad del suelo de <b>${humedadSuelo.toFixed(2)}%</b>, se recomienda sembrar los siguientes cultivos:</p>
                    <p><b>${recomendacion}</b></p>
                    <p>que cumplen las condiciones ambientales</p>
                `;

                const lugaresRecomendados = obtenerLugaresRecomendados(humedad, humedadSuelo, temperatura);
                document.getElementById('lugaresRecomendados').innerHTML = `
                    <h4>Lugares recomendados para sembrar:</h4>
                    <ul>
                        ${lugaresRecomendados.map(lugar => `<li>${lugar}</li>`).join('')}
                    </ul>
                `;

                lugaresRecomendados.forEach(lugar => {
                    const coordenadas = getCoordinates(lugar);
                    addMarker(map, coordenadas.lat, coordenadas.lng, lugar);
                });

                crearGraficaRecomendaciones(recomendacion.split(', '));
                crearNuevaGrafica(humedad, humedadSuelo, temperatura);
            }
        });
    } catch (error) {
        console.error('Error during initialization:', error);
    }
});

function obtenerLugaresRecomendados(humedad, humedadSuelo, temperatura) {
    const localidades = [
        { nombre: 'Santo Tomás', humedad: 65, temperatura: 12, lat: -13.5296, lng: -72.0207 },
        { nombre: 'La Convención', humedad: 70, temperatura: 20, lat: -12.9253, lng: -72.6873 },
        { nombre: 'Chinchero', humedad: 60, temperatura: 15, lat: -13.3983, lng: -72.0447 },
        { nombre: 'Ollantaytambo', humedad: 58, temperatura: 17, lat: -13.2588, lng: -72.2642 },
        { nombre: 'Pisac', humedad: 62, temperatura: 18, lat: -13.4194, lng: -71.8456 },
        { nombre: 'Urubamba', humedad: 66, temperatura: 19, lat: -13.3042, lng: -72.1151 },
        { nombre: 'Anta', humedad: 64, temperatura: 16, lat: -13.5233, lng: -72.1414 },
        { nombre: 'Espinar', humedad: 55, temperatura: 13, lat: -14.8891, lng: -71.3826 }
    ];

    return localidades.filter(l =>
        humedad >= l.humedad - 5 && humedad <= l.humedad + 5 &&
        temperatura >= l.temperatura - 2 && temperatura <= l.temperatura + 2
    ).map(l => l.nombre);
}

// Función para obtener coordenadas de un lugar (simulada)
function getCoordinates(nombre) {
    const coordenadas = {
        'Santo Tomás': { lat: -13.5296, lng: -72.0207 },
        'La Convención': { lat: -12.9253, lng: -72.6873 },
        'Chinchero': { lat: -13.3983, lng: -72.0447 },
        'Ollantaytambo': { lat: -13.2588, lng: -72.2642 },
        'Pisac': { lat: -13.4194, lng: -71.8456 },
        'Urubamba': { lat: -13.3042, lng: -72.1151 },
        'Anta': { lat: -13.5233, lng: -72.1414 },
        'Espinar': { lat: -14.8891, lng: -71.3826 }
    };
    return coordenadas[nombre];
}

function crearGraficaRecomendaciones(cultivos) {
    const ctx = document.getElementById('recomendacionesChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: cultivos,
            datasets: [{
                label: 'Cultivos Recomendados',
                data: cultivos.map(() => 1),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        display: false
                    }
                }
            }
        }
    });
}

function crearNuevaGrafica(humedad, humedadSuelo, temperatura) {
    const ctx = document.getElementById('nuevaGrafica').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Humedad Ambiental', 'Humedad del Suelo', 'Temperatura'],
            datasets: [{
                label: 'Condiciones Actuales',
                data: [humedad, humedadSuelo, temperatura],
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
                fill: true
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });
}
