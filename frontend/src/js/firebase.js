// Importación de los módulos de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, onValue, push } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDyIV7FPBcJm7B26FxIy2o4BTKfWioVrdQ",
  authDomain: "agronomia-81952.firebaseapp.com",
  databaseURL: "https://agronomia-81952-default-rtdb.firebaseio.com",
  projectId: "agronomia-81952",
  storageBucket: "agronomia-81952.appspot.com",
  messagingSenderId: "22395384649",
  appId: "1:22395384649:web:f8280ba23e5195940a2098"
};

// Inicialización de la aplicación Firebase
const firebaseApp = initializeApp(firebaseConfig);
const database = getDatabase(firebaseApp); // Obtiene la referencia a la base de datos
const dataRef = ref(database, '/datos'); // Referencia a la ubicación específica en la base de datos donde se encuentran los datos

// Función para convertir la humedad del suelo de una escala de 1-1023 a una escala de 1-100
function convertirHumedadSuelo(valor) {
  return (valor / 1023) * 100;
}

// Evento que se dispara cuando hay cambios en los datos de la base de datos
onValue(dataRef, (snapshot) => {
  const datos = snapshot.val(); // Obtiene los datos de la instantánea del snapshot

  // Filtra y procesa los datos para calcular los promedios de humedad, humedad del suelo y temperatura
  const datosLimpios = Object.values(datos).map(d => ({
    humedad: d.humedad,
    humedad_suelo: convertirHumedadSuelo(d.humedad_suelo),
    temperatura: d.temperatura || d.temperature
  })).filter(d => typeof d.temperatura === 'number' && !isNaN(d.temperatura));

  // Calcula el total de lecturas y las sumas de los valores de humedad, humedad del suelo y temperatura
  const totalLecturas = datosLimpios.length;
  const sumas = datosLimpios.reduce((acc, lectura) => {
    acc.humedad += lectura.humedad;
    acc.humedad_suelo += lectura.humedad_suelo;
    acc.temperatura += lectura.temperatura;
    return acc;
  }, { humedad: 0, humedad_suelo: 0, temperatura: 0 });

  // Calcula los promedios de humedad, humedad del suelo y temperatura
  const promedios = {
    humedad: sumas.humedad / totalLecturas,
    humedad_suelo: sumas.humedad_suelo / totalLecturas,
    temperatura: sumas.temperatura / totalLecturas,
  };

  // Verificar si los elementos existen antes de modificar el DOM
  const humidityElement = document.getElementById('humedad-ambiental');
  const soilHumidityElement = document.getElementById('humedad-suelo');
  const temperatureElement = document.getElementById('temperatura');
  const mercuryElement = document.getElementById('mercury');

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

  // Actualiza la visualización de la temperatura en el termómetro
  if (mercuryElement) {
    actualizarTemperatura(promedios.temperatura);
  } else {
    console.error('Elemento "mercury" no encontrado en el DOM.');
  }

  // Actualiza la visualización de la humedad en las escalas
  if (document.querySelector('.humidity-scale')) {
    actualizarHumedad(promedios.humedad, 'humidity-scale');
  }
  if (document.querySelector('.soil-humidity-scale')) {
    actualizarHumedad(promedios.humedad_suelo, 'soil-humidity-scale', 100);
  }
});

// Función para actualizar la visualización de la humedad en las escalas
function actualizarHumedad(promedio, scaleClass, max = 100) {
  const escala = document.querySelector(`.${scaleClass}`);
  if (escala) {
    const indicador = document.createElement('div');
    const porcentaje = (promedio / max) * 100;
    indicador.style.position = 'absolute';
    indicador.style.top = '0';
    indicador.style.left = `${porcentaje}%`;
    indicador.style.transform = 'translateX(-50%)';
    indicador.style.width = '2px';
    indicador.style.height = '100%';
    indicador.style.backgroundColor = 'black';
    escala.appendChild(indicador);
  }
}

// Función para actualizar la visualización de la temperatura en el termómetro
function actualizarTemperatura(promedio) {
  const mercury = document.getElementById('mercury');
  if (mercury) {
    const altura = (promedio / 50) * 100;
    mercury.style.height = `${altura}%`;
    const indicator = document.getElementById('temp-indicator');
    if (indicator) {
      indicator.style.bottom = `${altura}%`;
    }
  }
}

// Función para generar datos aleatorios
function generateSensorData() {
  const isSatisfactory = Math.random() < 0.9; // 90% de probabilidad de datos satisfactorios

  let temperature, humidity, soilMoisture;

  if (isSatisfactory) {
    // Generar datos dentro de rangos satisfactorios
    temperature = (Math.random() * 5 + 20).toFixed(1); // Rango de 20 a 25 grados Celsius
    humidity = (Math.random() * 10 + 50).toFixed(1);    // Rango de 50% a 60%
    soilMoisture = Math.floor(Math.random() * 200 + 600); // Rango de 600 a 800
  } else {
    // Generar datos fuera de los rangos satisfactorios
    temperature = (Math.random() * 15 + 30).toFixed(1); // Rango de 30 a 45 grados Celsius
    humidity = (Math.random() * 30 + 20).toFixed(1);    // Rango de 20% a 50%
    soilMoisture = Math.floor(Math.random() * 600);      // Rango de 0 a 600
  }

  const data = {
    timestamp: new Date().toISOString(),
    temperatura: parseFloat(temperature),
    humedad: parseFloat(humidity),
    humedad_suelo: soilMoisture
  };

  console.log("Generando datos del sensor:", data); // Muestra los datos generados en la consola
  return data;
}

// Función para enviar datos generados a Firebase
function sendDataToFirebase() {
  const data = generateSensorData(); // Genera y muestra los datos
  console.log('Enviando datos:', data);

  push(dataRef, data) // Reemplaza `dataRef` con tu referencia de Firebase.
    .then(() => {
      console.log('Datos enviados correctamente a Firebase');
    })
    .catch((error) => {
      console.error('Error al enviar datos a Firebase:', error);
    });
}

// Enviar datos automáticamente cada 1.5 minutos (90 segundos)
setInterval(sendDataToFirebase, 90 * 1000);

// Exporta referencias a la base de datos y funciones de Firebase
export { database, ref, onValue, dataRef, sendDataToFirebase, generateSensorData };
