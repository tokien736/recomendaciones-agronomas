import { Chart } from 'chart.js';

// Gráfico de Humedad Ambiental
export function createHumidityBarChart(chartId, label, promedio) {
  const ctx = document.getElementById(chartId).getContext('2d');

  // Verifica si ya hay un gráfico en el canvas, y destrúyelo si es necesario
  if (Chart.getChart(chartId)) {
    Chart.getChart(chartId).destroy();
  }

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Humedad'],
      datasets: [{
        label: label,
        data: [promedio],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          max: 100
        }
      }
    }
  });
}

// Gráfico de Humedad del Suelo
export function createSoilHumidityBarChart(chartId, label, promedio) {
  const ctx = document.getElementById(chartId).getContext('2d');

  // Verifica si ya hay un gráfico en el canvas, y destrúyelo si es necesario
  if (Chart.getChart(chartId)) {
    Chart.getChart(chartId).destroy();
  }

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Humedad del Suelo'],
      datasets: [{
        label: label,
        data: [promedio],
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          max: 100
        }
      }
    }
  });
}

// Gráfico de Temperatura
export function createTemperatureBarChart(chartId, label, promedio) {
  const ctx = document.getElementById(chartId).getContext('2d');

  // Verifica si ya hay un gráfico en el canvas, y destrúyelo si es necesario
  if (Chart.getChart(chartId)) {
    Chart.getChart(chartId).destroy();
  }

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Temperatura'],
      datasets: [{
        label: label,
        data: [promedio],
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          max: 50
        }
      }
    }
  });
}
