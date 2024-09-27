import * as tf from '@tensorflow/tfjs';
import { database, ref, onValue, dataRef } from './firebase'; // Ajusta la ruta según la estructura de tu proyecto

// Función para convertir la humedad del suelo de 0-1023 a 0-100
function convertirHumedadSuelo(valor) {
    return (valor / 1023) * 100;
}

// Cargar los datos del archivo JSON
async function loadCultivos() {
    const response = await fetch('/condiciones_cultivos.json'); // Asegúrate de que el JSON esté en 'public'
    if (!response.ok) {
        throw new Error('Failed to load cultivos JSON');
    }
    return await response.json();
}

// Cargar datos de Firebase y preprocesarlos
async function loadData() {
    return new Promise((resolve, reject) => {
        onValue(dataRef, (snapshot) => {
            try {
                const datos = snapshot.val();
                if (!datos) throw new Error('No data available');

                const data = Object.values(datos).map(d => ({
                    humedad: d.humedad,
                    humedad_suelo: convertirHumedadSuelo(d.humedad_suelo),
                    temperatura: d.temperatura
                })).filter(d => typeof d.temperatura === 'number' && !isNaN(d.temperatura));

                if (data.length === 0) throw new Error('No valid data entries found');

                const features = data.map(d => [d.humedad, d.humedad_suelo, d.temperatura]);

                resolve(features);
            } catch (error) {
                reject(error);
            }
        }, reject);
    });
}

// Crear y entrenar el modelo de TensorFlow
async function createAndTrainModel() {
    try {
        const features = await loadData();

        const model = tf.sequential();
        model.add(tf.layers.dense({ units: 10, inputShape: [3], activation: 'relu' }));
        model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }));

        model.compile({ optimizer: 'adam', loss: 'binaryCrossentropy', metrics: ['accuracy'] });

        await model.fit(tf.tensor2d(features), tf.tensor2d(features.map(() => [1])), {
            epochs: 10,
            callbacks: {
                onEpochEnd: (epoch, logs) => console.log(`Epoch ${epoch + 1}: loss = ${logs.loss.toFixed(4)}`)
            }
        });

        return model;
    } catch (error) {
        console.error('Error during model training:', error);
    }
}

// Función para recomendar cultivos basados en las condiciones actuales
async function recomendar(humedad, humedadSuelo, temperatura) {
    try {
        const cultivos = await loadCultivos();

        const recomendaciones = cultivos.cultivos.filter(cultivo => {
            const condiciones = cultivo.condiciones;
            return humedad >= condiciones.humedad_ambiental.min && humedad <= condiciones.humedad_ambiental.max &&
                   humedadSuelo >= condiciones.humedad_suelo.min && humedadSuelo <= condiciones.humedad_suelo.max &&
                   temperatura >= condiciones.temperatura.min && temperatura <= condiciones.temperatura.max;
        }).map(cultivo => cultivo.nombre);

        return recomendaciones.length > 0 ? recomendaciones.join(', ') : 'No se recomienda sembrar ningún cultivo con las condiciones actuales';
    } catch (error) {
        console.error('Error during recommendation:', error);
    }
}

export { createAndTrainModel, recomendar, convertirHumedadSuelo };
