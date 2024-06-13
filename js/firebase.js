// Importación de los módulos de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
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

  // Muestra los promedios en el documento HTML
  document.getElementById('humedad-ambiental').innerText = `${promedios.humedad.toFixed(2)}`;
  document.getElementById('humedad-suelo').innerText = `${promedios.humedad_suelo.toFixed(2)}`;
  document.getElementById('temperatura').innerText = `${promedios.temperatura.toFixed(2)}`;

  // Actualiza la visualización de la humedad en las escalas
  if (document.querySelector('.humidity-scale')) {
    actualizarHumedad(promedios.humedad, 'humidity-scale');
  }
  if (document.querySelector('.soil-humidity-scale')) {
    actualizarHumedad(promedios.humedad_suelo, 'soil-humidity-scale', 1023);
  }

  // Actualiza la visualización de la temperatura en el termómetro
  if (document.getElementById('mercury')) {
    actualizarTemperatura(promedios.temperatura);
  }
});

// Función para convertir la humedad del suelo
function convertirHumedadSuelo(valor) {
  return valor;
}

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

// Exporta referencias a la base de datos y funciones de Firebase
export { database, ref, onValue };
