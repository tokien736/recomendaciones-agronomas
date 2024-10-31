import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, push } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

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
const dataRef = ref(database, '/datos'); // Referencia a la ubicación específica en la base de datos donde se almacenarán los datos

// Función para generar datos de ejemplo
function generateSensorData() {
  const temperature = (Math.random() * 15 + 10).toFixed(1); // Rango de 10 a 25 grados Celsius
  const humidity = (Math.random() * 50 + 20).toFixed(1);    // Rango de 20% a 70%
  const soilMoisture = Math.floor(Math.random() * 1024);    // Rango de 0 a 1023

  return {
    timestamp: new Date().toISOString(),
    temperatura: parseFloat(temperature),
    humedad: parseFloat(humidity),
    humedad_suelo: soilMoisture
  };
}

// Función para enviar datos a Firebase
function sendDataToFirebase() {
  const data = generateSensorData();
  console.log('Enviando datos:', data);

  push(dataRef, data)
    .then(() => {
      console.log('Datos enviados correctamente a Firebase');
    })
    .catch((error) => {
      console.error('Error al enviar datos a Firebase:', error);
    });
}

// Enviar datos cada 5 minutos (5 * 60 * 1000 ms)
setInterval(sendDataToFirebase, 5 * 60 * 1000);

// Enviar datos inmediatamente al iniciar
sendDataToFirebase();

// Exportar sendDataToFirebase como exportación por defecto
export default sendDataToFirebase;
