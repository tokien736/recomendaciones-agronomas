// firebase.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDyIV7FPBcJm7B26FxIy2o4BTKfWioVrdQ",
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

// Escuchar cambios en la referencia de datos
onValue(dataRef, (snapshot) => {
  const datos = snapshot.val();

  // Filtrar y limpiar datos
  const datosLimpios = datos.map(d => ({
    humedad: d.humedad,
    humedad_suelo: d.humedad_suelo,
    temperatura: d.temperatura || d.temperature // Corregir posibles errores de propiedad
  })).filter(d => typeof d.temperatura === 'number' && !isNaN(d.temperatura));

  // Calcular promedios
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

  // Mostrar los promedios en el elemento con id "datosFirebase"
  const datosFirebaseElement = document.getElementById('datosFirebase');
  datosFirebaseElement.innerHTML = JSON.stringify(promedios, null, 2);

  // Crear gráficas circulares para humedad y humedad del suelo
  createDoughnutChart('humedadChart', 'Humedad', promedios.humedad);
  createDoughnutChart('humedadSueloChart', 'Humedad del Suelo', promedios.humedad_suelo);

  // Mostrar promedio de temperatura en el elemento con id "promedioTemperatura"
  const promedioTemperaturaElement = document.getElementById('promedioTemperatura');
  promedioTemperaturaElement.innerHTML = `Promedio de Temperatura: ${promedios.temperatura.toFixed(2)}°C`;

  // Crear gráfica de barras para los promedios
  createBarChart('promediosChart', promedios);
});

function createDoughnutChart(chartId, label, promedio) {
  const ctx = document.getElementById(chartId).getContext('2d');
  const data = {
    labels: [label],
    datasets: [{
      data: [promedio],
      backgroundColor: ['rgba(54, 162, 235, 0.2)'],
      borderColor: ['rgba(54, 162, 235, 1)'],
      borderWidth: 1
    }]
  };

  new Chart(ctx, {
    type: 'doughnut',
    data: data,
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: `Promedio de ${label}`
        }
      }
    },
  });
}

function createBarChart(chartId, promedios) {
  const ctx = document.getElementById(chartId).getContext('2d');
  const data = {
    labels: ['Humedad', 'Humedad del Suelo', 'Temperatura'],
    datasets: [{
      label: 'Promedios',
      data: [promedios.humedad, promedios.humedad_suelo, promedios.temperatura],
      backgroundColor: [
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)'
      ],
      borderColor: [
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)'
      ],
      borderWidth: 1
    }]
  };

  new Chart(ctx, {
    type: 'bar',
    data: data,
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true
        }
      },
      plugins: {
        legend: {
          display: false
        },
        title: {
          display: true,
          text: 'Promedios de Humedad, Humedad del Suelo y Temperatura'
        }
      }
    },
  });
}

export { firebaseApp, database, dataRef, onValue };
