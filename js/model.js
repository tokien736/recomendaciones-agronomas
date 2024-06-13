// Importación de TensorFlow.js y las funciones de Firebase
import * as tf from 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@3.9.0/dist/tf.min.js';
import { database, ref, onValue } from './firebase.js'; // Importa las funciones de Firebase desde un archivo local

// Función para cargar el JSON de condiciones de cultivos
async function loadCultivos() {
    const response = await fetch('./condiciones_cultivos.json'); // Realiza una solicitud para cargar el JSON de condiciones de cultivos
    if (!response.ok) { // Verifica si la solicitud fue exitosa
        throw new Error('Failed to load cultivos JSON'); // Lanza un error si la carga del JSON falla
    }
    return await response.json(); // Retorna el JSON de condiciones de cultivos
}

// Función asincrónica para cargar datos desde Firebase
async function loadData() {
    return new Promise((resolve, reject) => { // Crea una promesa para manejar la carga de datos de Firebase
        const dataRef = ref(database, '/datos'); // Obtiene la referencia a la ubicación de los datos en la base de datos
        onValue(dataRef, (snapshot) => { // Escucha cambios en los datos de Firebase
            try {
                const datos = snapshot.val(); // Obtiene los datos de la instantánea del snapshot
                if (!datos) throw new Error('No data available'); // Lanza un error si no hay datos disponibles
                
                const data = Object.values(datos).map(d => ({ // Mapea los datos a un formato adecuado
                    humedad: d.humedad,
                    humedad_suelo: d.humedad_suelo,
                    temperatura: d.temperatura
                })).filter(d => typeof d.temperatura === 'number' && !isNaN(d.temperatura)); // Filtra datos válidos
                
                if (data.length === 0) throw new Error('No valid data entries found'); // Lanza un error si no se encuentran entradas válidas
                
                const features = data.map(d => [d.humedad, d.humedad_suelo, d.temperatura]); // Prepara las características para el modelo
                
                resolve(features); // Resuelve la promesa con las características
            } catch (error) {
                reject(error); // Rechaza la promesa si hay un error
            }
        }, reject);
    });
}

// Función para crear y entrenar el modelo
async function createAndTrainModel() {
    try {
        const features = await loadData(); // Carga los datos desde Firebase

        // Crea un modelo secuencial
        const model = tf.sequential();
        // Agrega una capa densa al modelo con activación ReLU
        model.add(tf.layers.dense({ units: 10, inputShape: [3], activation: 'relu' }));
        // Agrega una capa densa al modelo con activación sigmoide
        model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }));

        // Compila el modelo con optimizador Adam, pérdida de entropía cruzada binaria y métricas de precisión
        model.compile({ optimizer: 'adam', loss: 'binaryCrossentropy', metrics: ['accuracy'] });

        // Entrena el modelo con los datos
        await model.fit(tf.tensor2d(features), tf.tensor2d(features.map(() => [1])), {
            epochs: 10, // Número de épocas de entrenamiento
            callbacks: {
                // Función de devolución de llamada al final de cada época para imprimir la pérdida
                onEpochEnd: (epoch, logs) => console.log(`Epoch ${epoch + 1}: loss = ${logs.loss.toFixed(4)}`)
            }
        });

        return model; // Retorna el modelo entrenado
    } catch (error) {
        console.error('Error during model training:', error); // Maneja errores durante el entrenamiento del modelo
    }
}

// Función para recomendar cultivos basada en las condiciones
async function recomendar(humedad, humedadSuelo, temperatura) {
    try {
        const cultivos = await loadCultivos(); // Carga las condiciones de cultivos

        // Filtra los cultivos que cumplen con las condiciones dadas
        const recomendaciones = cultivos.cultivos.filter(cultivo => {
            const condiciones = cultivo.condiciones; // Obtiene las condiciones de crecimiento del cultivo actual
            return humedad >= condiciones.humedad_ambiental.min && humedad <= condiciones.humedad_ambiental.max &&
                   humedadSuelo >= condiciones.humedad_suelo.min && humedadSuelo <= condiciones.humedad_suelo.max &&
                   temperatura >= condiciones.temperatura.min && temperatura <= condiciones.temperatura.max;
        }).map(cultivo => cultivo.nombre); // Mapea los nombres de los cultivos recomendados

        // Retorna una cadena con los nombres de los cultivos recomendados o un mensaje de no recomendación
        return recomendaciones.length > 0 ? recomendaciones.join(', ') : 'No se recomienda sembrar ningún cultivo con las condiciones actuales';
    } catch (error) {
        console.error('Error during recommendation:', error); // Maneja errores durante la recomendación
    }
}

// Exporta las funciones para su uso en otros módulos
export { createAndTrainModel, recomendar };
