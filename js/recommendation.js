// Importación de funciones desde archivos locales
import { createAndTrainModel, recomendar } from './model.js';
import { database, ref, onValue } from './firebase.js';

// Función que se ejecuta cuando el DOM se ha cargado completamente
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Crear y entrenar el modelo al cargar la página
        await createAndTrainModel();

        // Obtener referencia a los datos en la base de datos Firebase
        const dataRef = ref(database, '/datos');
        
        // Escuchar cambios en los datos en tiempo real
        onValue(dataRef, (snapshot) => {
            const datos = snapshot.val(); // Obtener los datos de la instantánea del snapshot
            const data = Object.values(datos).map(d => ({ // Mapear los datos en un formato adecuado
                humedad: d.humedad,
                humedad_suelo: d.humedad_suelo,
                temperatura: d.temperatura
            })).filter(d => typeof d.temperatura === 'number' && !isNaN(d.temperatura)); // Filtrar datos válidos
            
            // Calcular promedios de humedad, humedad del suelo y temperatura
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

            // Mostrar los promedios en el documento HTML
            document.getElementById('humedad-ambiental').innerText = `${promedios.humedad.toFixed(2)}`;
            document.getElementById('humedad-suelo').innerText = `${promedios.humedad_suelo.toFixed(2)}`;
            document.getElementById('temperatura').innerText = `${promedios.temperatura.toFixed(2)}`;
        });

        // Evento click del botón de recomendación
        document.getElementById('recomendarBtn').addEventListener('click', async () => {
            // Obtener los valores de humedad, humedad del suelo y temperatura del documento HTML
            const humedad = parseFloat(document.getElementById('humedad-ambiental').innerText);
            const humedadSuelo = parseFloat(document.getElementById('humedad-suelo').innerText);
            const temperatura = parseFloat(document.getElementById('temperatura').innerText);
            
            // Obtener recomendación de cultivos según las condiciones ambientales
            const recomendacion = await recomendar(humedad, humedadSuelo, temperatura);

            // Mostrar la recomendación en el documento HTML
            const resultDiv = document.getElementById('result');
            resultDiv.innerHTML = `
                <p>Con la temperatura promedio que se tiene de <b>${temperatura.toFixed(2)}°C</b> con la humedad ambiental promedio de <b>${humedad.toFixed(2)}%</b> con la humedad del suelo de <b>${humedadSuelo.toFixed(2)}</b>, se recomienda sembrar los siguientes cultivos:</p>
                <p><b>${recomendacion}</b></p>
                <p>que cumplen las condiciones ambientales</p>
            `;
        });
    } catch (error) {
        console.error('Error during initialization:', error); // Manejar errores durante la inicialización
    }
});
