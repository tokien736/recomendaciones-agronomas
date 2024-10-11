/* global google */ // Para Google Maps
import { Chart } from 'chart.js'; // Importar Chart.js si no está en el HTML

function createGoogleMap(elementId) {
  if (typeof google !== 'undefined') {
    const map = new google.maps.Map(document.getElementById(elementId), {
      zoom: 8,
      center: { lat: -34.397, lng: 150.644 },
    });
  } else {
    console.error('Google Maps API no está cargada.');
  }
}

function renderChart(chartElementId, data) {
  const ctx = document.getElementById(chartElementId).getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
      datasets: [
        {
          label: '# of Votes',
          data: [12, 19, 3, 5, 2, 3],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}

export { createGoogleMap, renderChart };
