// Importa las referencias de datos y la función onValue desde el archivo firebase.js
import { dataRef, onValue } from "./js/firebase.js";

// Función para convertir el valor de la humedad del suelo
function convertirHumedadSuelo(valor) {
  return ((1023 - valor) / 1023) * 100;
}

// Se ejecuta cuando hay un cambio en los datos referenciados
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

  // Actualiza el contenido del elemento HTML con los datos promedio
  const datosFirebaseElement = document.getElementById('datosFirebase');
  datosFirebaseElement.innerHTML = JSON.stringify(promedios, null, 2);

  // Crea gráficos de barras para humedad y temperatura
  createHumidityBarChart('humedadChart', 'Humedad', promedios.humedad);
  createHumidityBarChart('humedadSueloChart', 'Humedad del Suelo', promedios.humedad_suelo);
  createTemperatureBarChart('promediosChart', promedios.temperatura);
});

// Función para crear un gráfico de barras de humedad
function createHumidityBarChart(chartId, label, promedio) {
  const ctx = document.getElementById(chartId).getContext('2d');
  
  // Datos para el gráfico
  const data = {
    labels: ['0', '10', '20', '30', '40', '50', '60', '70', '80', '90', '100'],
    datasets: [{
      label: label,
      data: Array(11).fill(promedio),
      backgroundColor: (context) => {
        const value = context.dataset.data[context.dataIndex];
        if (value < 40) return 'rgba(255, 99, 132, 0.6)'; // Muy seco
        if (value < 60) return 'rgba(75, 192, 192, 0.6)'; // Óptimo
        return 'rgba(54, 162, 235, 0.6)'; // Muy húmedo
      },
      borderColor: (context) => {
        const value = context.dataset.data[context.dataIndex];
        if (value < 40) return 'rgba(255, 99, 132, 1)'; // Muy seco
        if (value < 60) return 'rgba(75, 192, 192, 1)'; // Óptimo
        return 'rgba(54, 162, 235, 1)'; // Muy húmedo
      },
      borderWidth: 1
    }]
  };

  // Configuración del gráfico
  new Chart(ctx, {
    type: 'bar',
    data: data,
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          max: 100
        }
      },
      plugins: {
        legend: {
          display: false
        },
        title: {
          display: true,
          text: label
        }
      }
    }
  });
}

// Función para crear un gráfico de barras de temperatura
function createTemperatureBarChart(chartId, temperatura) {
  const ctx = document.getElementById(chartId).getContext('2d');
  
  // Gradiente de colores para el gráfico de temperatura
  const gradient = ctx.createLinearGradient(0, 0, 0, 400);
  gradient.addColorStop(0, 'rgba(255, 0, 0, 1)'); // Calor
  gradient.addColorStop(0.5, 'rgba(255, 255, 0, 1)'); // Templado
  gradient.addColorStop(1, 'rgba(0, 0, 255, 1)'); // Frío
  
  // Datos para el gráfico
  const data = {
    labels: ['Temperatura'],
    datasets: [{
      label: 'Temperatura',
      data: [temperatura],
      backgroundColor: gradient,
      borderColor: 'rgba(0, 0, 0, 1)',
      borderWidth: 1
    }]
  };

  // Configuración del gráfico
  new Chart(ctx, {
    type: 'bar',
    data: data,
    options: {
      indexAxis: 'y',
      responsive: true,
      scales: {
        x: {
          beginAtZero: true,
          max: 50
        }
      },
      plugins: {
        legend: {
          display: false
        },
        title: {
          display: true,
          text: 'Promedio de Temperatura'
        }
      }
    }
  });
}

// Exporta las funciones para crear gráficos
export { createHumidityBarChart, createTemperatureBarChart };
