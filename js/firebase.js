import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "agronomia-81952.firebaseapp.com",
  databaseURL: "https://agronomia-81952-default-rtdb.firebaseio.com",
  projectId: "agronomia-81952",
  storageBucket: "agronomia-81952.appspot.com",
  messagingSenderId: "22395384649",
  appId: "1:22395384649:web:f8280ba23e5195940a2098"
};

const firebaseApp = initializeApp(firebaseConfig);
const database = getDatabase(firebaseApp);
const dataRef = ref(database, '/datos');

onValue(dataRef, (snapshot) => {
  const datos = snapshot.val();

  const datosLimpios = Object.values(datos).map(d => ({
    humedad: d.humedad,
    humedad_suelo: convertirHumedadSuelo(d.humedad_suelo),
    temperatura: d.temperatura || d.temperature
  })).filter(d => typeof d.temperatura === 'number' && !isNaN(d.temperatura));

  const totalLecturas = datosLimpios.length;

  const sumas = datosLimpios.reduce((acc, lectura) => {
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

  console.log("Promedios calculados:", promedios);

  document.getElementById('humedad-ambiental').innerText = `${promedios.humedad.toFixed(2)}`;
  document.getElementById('humedad-suelo').innerText = `${promedios.humedad_suelo.toFixed(2)}`;
  document.getElementById('temperatura').innerText = `${promedios.temperatura.toFixed(2)}`;

  if (document.querySelector('.humidity-scale')) {
    actualizarHumedad(promedios.humedad, 'humidity-scale');
  }
  if (document.querySelector('.soil-humidity-scale')) {
    actualizarHumedad(promedios.humedad_suelo, 'soil-humidity-scale', 1023);
  }
  if (document.getElementById('mercury')) {
    actualizarTemperatura(promedios.temperatura);
  }
});

function convertirHumedadSuelo(valor) {
  return valor;
}

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

export { database, ref, onValue };
