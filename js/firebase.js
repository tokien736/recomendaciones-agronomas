// Importa las funciones necesarias de Firebase
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

// Inicializa la aplicación de Firebase
const firebaseApp = initializeApp(firebaseConfig);
// Obtiene la instancia de la base de datos de Firebase
const database = getDatabase(firebaseApp);
// Referencia a los datos en la base de datos
const dataRef = ref(database, '/datos');

// Función que se ejecuta cada vez que hay un cambio en los datos referenciados
onValue(dataRef, (snapshot) => {
  // Obtiene los datos de la instantánea
  const datos = snapshot.val();

  // Procesa y limpia los datos
  const datosLimpios = datos.map(d => ({
    humedad: d.humedad,
    humedad_suelo: convertirHumedadSuelo(d.humedad_suelo),
    temperatura: d.temperatura || d.temperature
  })).filter(d => typeof d.temperatura === 'number' && !isNaN(d.temperatura));

  // Calcula el número total de lecturas
  const totalLecturas = datosLimpios.length;

  // Suma las lecturas de humedad, humedad del suelo y temperatura
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

  // Muestra los promedios calculados en la consola
  console.log("Promedios calculados:", promedios);

  // Actualiza el contenido de los elementos HTML con los valores promedio
  document.getElementById('humedad-ambiental').innerText = `${promedios.humedad.toFixed(2)}%`;
  document.getElementById('humedad-suelo').innerText = `${promedios.humedad_suelo.toFixed(2)}`;
  document.getElementById('temperatura').innerText = `${promedios.temperatura.toFixed(2)}°C`;

  // Llama a las funciones para actualizar las escalas y el termómetro
  actualizarHumedad(promedios.humedad, 'humidity-scale');
  actualizarHumedad(promedios.humedad_suelo, 'soil-humidity-scale', 1023);
  actualizarTemperatura(promedios.temperatura);
});

// Función para convertir el valor de humedad del suelo, si es necesario
function convertirHumedadSuelo(valor) {
  return valor; // Si ya está en la escala de 1 a 1023, no necesitamos convertirlo
}

// Función para actualizar la escala de humedad
function actualizarHumedad(promedio, scaleClass, max = 100) {
  const escala = document.querySelector(`.${scaleClass}`);
  const indicador = document.createElement('div');
  const porcentaje = (promedio / max) * 100; // Convertir el valor a porcentaje
  indicador.style.position = 'absolute';
  indicador.style.top = '0';
  indicador.style.left = `${porcentaje}%`;
  indicador.style.transform = 'translateX(-50%)';
  indicador.style.width = '2px';
  indicador.style.height = '100%';
  indicador.style.backgroundColor = 'black';
  escala.appendChild(indicador);
}

// Función para actualizar el termómetro con la temperatura promedio
function actualizarTemperatura(promedio) {
  const mercury = document.getElementById('mercury');
  const altura = (promedio / 50) * 100; // Escalar la temperatura a la altura del termómetro
  mercury.style.height = `${altura}%`;

  const indicator = document.getElementById('temp-indicator');
  indicator.style.bottom = `${altura}%`;
}
