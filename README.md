# Sistema de Recomendaciones Agrónomas

Este proyecto implementa un sistema de recomendaciones para el cuidado de plantas utilizando TensorFlow.js. El sistema está diseñado para proporcionar recomendaciones basadas en las condiciones específicas de las plantas y los datos proporcionados.

## Descripción

El Sistema de Recomendaciones Agrónomas es una aplicación web que utiliza técnicas de aprendizaje automático para analizar datos sobre las condiciones de las plantas y proporcionar recomendaciones personalizadas para su cuidado. Utiliza TensorFlow.js para ejecutar modelos de aprendizaje automático directamente en el navegador, lo que permite una experiencia de usuario fluida y rápida sin necesidad de servidores backend.

## Características

- **Recomendaciones Personalizadas:** Ofrece sugerencias específicas para el cuidado de las plantas según sus necesidades.
- **Uso de TensorFlow.js:** Implementación de modelos de aprendizaje automático directamente en el navegador.
- **Interfaz Intuitiva:** Fácil de usar para usuarios con diferentes niveles de experiencia en el cuidado de plantas.
- **Análisis en Tiempo Real:** Procesa y analiza los datos en tiempo real para proporcionar recomendaciones inmediatas.

## Requisitos

- Node.js
- npm o yarn

## Instalación

1. Clona el repositorio:

    ```bash
    git clone https://github.com/tokien736/recomendaciones-agronomas.git
    ```

2. Navega al directorio del proyecto:

    ```bash
    cd recomendaciones-agronomas
    ```

3. Instala las dependencias:

    ```bash
    npm install
    ```

    o

    ```bash
    yarn install
    ```

## Uso

1. Inicia el servidor de desarrollo:

    ```bash
    npm start
    ```

    o

    ```bash
    yarn start
    ```

2. Abre tu navegador y navega a `http://localhost:3000` para ver la aplicación en acción.

3. Introduce los datos de la planta (como la humedad del suelo, la luz recibida, y la temperatura) y obtén recomendaciones personalizadas para su cuidado.

## Ejemplo de Código

A continuación se muestra un ejemplo de cómo se puede utilizar TensorFlow.js para crear un modelo de recomendaciones:

```javascript
import * as tf from '@tensorflow/tfjs';

// Definir el modelo
const model = tf.sequential();
model.add(tf.layers.dense({ units: 32, activation: 'relu', inputShape: [inputFeatures] }));
model.add(tf.layers.dense({ units: 1, activation: 'linear' }));

// Compilar el modelo
model.compile({ optimizer: 'adam', loss: 'meanSquaredError' });

// Entrenar el modelo
async function trainModel(data) {
  const { inputs, labels } = data;
  await model.fit(inputs, labels, {
    epochs: 50,
    batchSize: 32,
  });
}

// Predecir recomendaciones
async function predict(inputData) {
  const prediction = model.predict(tf.tensor2d([inputData], [1, inputFeatures]));
  return prediction.dataSync()[0];
}
