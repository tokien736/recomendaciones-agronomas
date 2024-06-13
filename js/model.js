import * as tf from 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@3.9.0/dist/tf.min.js';
import { database, ref, onValue } from './firebase.js';

// Cargar el JSON de condiciones de cultivos
async function loadCultivos() {
    const response = await fetch('./condiciones_cultivos.json');
    if (!response.ok) {
        throw new Error('Failed to load cultivos JSON');
    }
    return await response.json();
}

async function loadData() {
    return new Promise((resolve, reject) => {
        const dataRef = ref(database, '/datos');
        onValue(dataRef, (snapshot) => {
            try {
                const datos = snapshot.val();
                if (!datos) throw new Error('No data available');
                
                const data = Object.values(datos).map(d => ({
                    humedad: d.humedad,
                    humedad_suelo: d.humedad_suelo,
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

async function createAndTrainModel() {
    try {
        const features = await loadData();

        const model = tf.sequential();
        model.add(tf.layers.dense({ units: 10, inputShape: [3], activation: 'relu' }));
        model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }));

        model.compile({ optimizer: 'adam', loss: 'binaryCrossentropy', metrics: ['accuracy'] });

        // Placeholder for training, as we are using static data
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

export { createAndTrainModel, recomendar };
