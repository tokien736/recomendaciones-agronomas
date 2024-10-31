import * as tf from '@tensorflow/tfjs';
import { database, ref, onValue } from './firebase';

// Función para cargar el archivo JSON de cultivos
async function loadCultivos() {
    try {
        const response = await fetch('/condiciones_cultivos.json');
        if (!response.ok) {
            throw new Error('No se pudo cargar el archivo de cultivos JSON');
        }
        return await response.json();
    } catch (error) {
        console.error("Error al cargar cultivos:", error);
        return [];
    }
}

// Función para convertir la humedad del suelo de 0-1023 a 0-100%
function convertirHumedadSuelo(valor) {
    if (isNaN(valor)) {
        console.error("Error: Valor de humedad_suelo no es un número:", valor);
        return 0; // Valor predeterminado en caso de error
    }
    const humedadConvertida = Math.min(Math.max((valor / 1023), 0), 1) * 100;
    console.log("Valor original de humedad_suelo:", valor, "-> Convertido a 0-100%:", humedadConvertida);
    return humedadConvertida;
}

// Cargar datos de Firebase, calcular promedios y convertir humedad del suelo
async function obtenerPromediosSensores() {
    return new Promise((resolve, reject) => {
        const dataRef = ref(database, '/datos');
        onValue(dataRef, (snapshot) => {
            try {
                const datos = snapshot.val();
                if (!datos) throw new Error('No hay datos disponibles en Firebase');

                console.log("Datos originales de Firebase:", datos);

                const data = Object.values(datos).map(d => {
                    const humedad = parseFloat(d.humedad);
                    const humedad_suelo = convertirHumedadSuelo(parseFloat(d.humedad_suelo));
                    const temperatura = parseFloat(d.temperatura);

                    console.log("Valores individuales procesados - Humedad:", humedad, "Humedad Suelo:", humedad_suelo, "Temperatura:", temperatura);
                    return { humedad, humedad_suelo, temperatura };
                }).filter(d => !isNaN(d.humedad) && !isNaN(d.humedad_suelo) && !isNaN(d.temperatura));

                const totalLecturas = data.length;
                if (totalLecturas === 0) {
                    console.warn('Advertencia: No se encontraron entradas de datos válidas después de procesar.');
                    throw new Error('No se encontraron entradas de datos válidas en Firebase');
                }

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

                console.log("Sumas calculadas:", sumas);
                console.log("Total de lecturas:", totalLecturas);
                console.log("Promedios calculados:", promedios);

                resolve(promedios);
            } catch (error) {
                console.error("Error al obtener promedios de sensores:", error);
                reject(error);
            }
        }, reject);
    });
}
// Función para crear y entrenar el modelo de TensorFlow
async function createAndTrainModel() {
    try {
        // Llama a la función que obtiene los datos promedio de los sensores
        const allSensorData = await obtenerPromediosSensores();

        // Verifica si los datos de los sensores están completos
        if (!allSensorData || !allSensorData.humedad || !allSensorData.humedad_suelo || !allSensorData.temperatura) {
            console.warn("Advertencia: No hay datos válidos para entrenar el modelo.");
            return null; // Sale de la función si faltan datos
        }

        // Prepara los datos de entrada (features) y etiquetas (labels) para el entrenamiento
        const features = [[allSensorData.humedad, allSensorData.humedad_suelo, allSensorData.temperatura]];
        const labels = [[1]]; // Etiqueta binaria, posiblemente para un caso de clasificación

        console.log("Datos utilizados para entrenamiento:", features);

        // Define el modelo secuencial de TensorFlow
        const model = tf.sequential();

        // Añade una capa densa con 256 neuronas y activación 'relu' (la primera capa oculta)
        model.add(tf.layers.dense({ units: 256, inputShape: [3], activation: 'relu' }));
        
        // Añade una segunda capa oculta con 128 neuronas y activación 'relu'
        model.add(tf.layers.dense({ units: 128, activation: 'relu' }));

        // Añade una tercera capa oculta con 64 neuronas y activación 'relu'
        model.add(tf.layers.dense({ units: 64, activation: 'relu' }));

        // Añade una cuarta capa oculta con 64 neuronas y activación 'relu'
        model.add(tf.layers.dense({ units: 64, activation: 'relu' }));

        // Añade una quinta capa oculta con 32 neuronas y activación 'relu'
        model.add(tf.layers.dense({ units: 32, activation: 'relu' }));

        // Añade una sexta capa oculta con 16 neuronas y activación 'relu'
        model.add(tf.layers.dense({ units: 16, activation: 'relu' }));

        // Añade una séptima capa oculta con 8 neuronas y activación 'relu'
        model.add(tf.layers.dense({ units: 8, activation: 'relu' }));
        
        // Añade la capa de salida con 1 neurona y activación 'sigmoid' para la clasificación binaria
        model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }));

        // Compila el modelo especificando el optimizador, la función de pérdida y las métricas de evaluación
        model.compile({ 
            optimizer: tf.train.adam(0.001), // Optimización con una tasa de aprendizaje ajustada
            loss: 'binaryCrossentropy', // Función de pérdida adecuada para clasificación binaria
            metrics: ['accuracy', 'mse'] // Métricas adicionales para evaluar precisión y error cuadrático medio
        });

        // Entrena el modelo con los datos de entrada y etiquetas definidas
        await model.fit(tf.tensor2d(features), tf.tensor2d(labels), {
            epochs: 50, // Define el número de épocas para un entrenamiento más prolongado
            callbacks: {
                // Callback para mostrar el progreso al final de cada época
                onEpochEnd: (epoch, logs) => console.log(`Epoch ${epoch + 1}: loss = ${logs.loss.toFixed(4)}, accuracy = ${logs.acc?.toFixed(4)}`)
            }
        });

        console.log("Modelo entrenado correctamente"); // Mensaje de confirmación al completar el entrenamiento
        return model; // Devuelve el modelo entrenado
    } catch (error) {
        // Captura y muestra cualquier error que ocurra durante el proceso
        console.error('Error durante el entrenamiento del modelo:', error);
        return null; // Devuelve null en caso de error
    }
}



async function recomendar(humedad, humedadSuelo, temperatura, model) {
    try {
        if (humedad === undefined || humedadSuelo === undefined || temperatura === undefined) {
            console.error("Error: Los valores de humedad, humedad del suelo o temperatura son null o undefined.");
            console.log("Valores actuales:", { humedad, humedadSuelo, temperatura });
            return "Error: Datos insuficientes para generar una recomendación.";
        }

        console.log("Condiciones actuales para recomendaciones:");
        console.log("Humedad Ambiental:", humedad.toFixed(2));
        console.log("Humedad del Suelo (0-100%):", humedadSuelo.toFixed(2));
        console.log("Temperatura:", temperatura.toFixed(2));

        const inputTensor = tf.tensor2d([[humedad, humedadSuelo, temperatura]]);
        const prediction = model.predict(inputTensor);
        const predictionValue = (await prediction.arraySync())[0][0];

        console.log("Valor de predicción del modelo:", predictionValue);

        const cultivos = await loadCultivos();
        if (cultivos.length === 0) {
            console.warn("Advertencia: No se encontraron cultivos en el archivo JSON.");
            return "No hay cultivos disponibles para recomendar.";
        }

        const recomendaciones = cultivos.cultivos.filter(cultivo => {
            const condiciones = cultivo.condiciones;
            return humedad >= condiciones.humedad_ambiental.min && humedad <= condiciones.humedad_ambiental.max &&
                   humedadSuelo >= condiciones.humedad_suelo.min && humedadSuelo <= condiciones.humedad_suelo.max &&
                   temperatura >= condiciones.temperatura.min && temperatura <= condiciones.temperatura.max &&
                   predictionValue >= 0.5;
        }).map(cultivo => ({
            nombre: cultivo.nombre,
            agua_requerida: cultivo.agua_requerida || "No especificado",
            luz_requerida: cultivo.luz_requerida || "No especificado",
            fertilizacion: cultivo.fertilizacion || "No especificado",
            otros: cultivo.otros || "No especificado"
        }));

        if (recomendaciones.length > 0) {
            return recomendaciones.map(cultivo =>
                `🌱 Cultivo: ${cultivo.nombre}\n  💧 Agua requerida: ${cultivo.agua_requerida}\n  ☀️ Luz requerida: ${cultivo.luz_requerida}\n  🌱 Fertilización: ${cultivo.fertilizacion}\n  📌 Recomendaciones: ${cultivo.otros}\n`
            ).join("\n\n");
        } else {
            return `No se recomienda sembrar ningún cultivo con las condiciones actuales.\n\n` +
                   `📌 Condiciones actuales:\n` +
                   `  - Humedad ambiental: ${humedad.toFixed(2)}%\n` +
                   `  - Humedad del suelo: ${humedadSuelo.toFixed(2)}%\n` +
                   `  - Temperatura: ${temperatura.toFixed(2)}°C`;
        }
    } catch (error) {
        console.error('Error durante la recomendación:', error);
        return "No se pudo generar la recomendación.";
    }
}

export { createAndTrainModel, recomendar, obtenerPromediosSensores };
