// Mock de Firebase para Jest
jest.mock('../firebase', () => ({
    convertirHumedadSuelo: jest.fn((valor) => (valor / 1023) * 100),
    onValue: jest.fn((ref, callback) => {
      const mockData = {
        '1': { humedad: 60, humedad_suelo: 512, temperatura: 25 },
        '2': { humedad: 70, humedad_suelo: 700, temperatura: 22 },
      };
      callback({ val: () => mockData });
    }),
  }));
  
  describe('Firebase data processing', () => {
    test('should convert soil humidity from scale 1-1023 to 1-100', () => {
      const rawHumidity = 511;
      const convertedHumidity = (rawHumidity / 1023) * 100;
      expect(convertedHumidity).toBeCloseTo(49.95, 2); // Verifica el valor con 2 decimales
    });
  
    test('should handle undefined DOM elements gracefully', () => {
      document.body.innerHTML = `
        <div id="humedad-ambiental"></div>
        <div id="humedad-suelo"></div>
        <div id="temperatura"></div>
      `;
  
      // Simula los valores promedio
      const promedios = {
        humedad: 65,
        humedad_suelo: 78,
        temperatura: 23,
      };
  
      const humidityElement = document.getElementById('humedad-ambiental');
      const soilHumidityElement = document.getElementById('humedad-suelo');
      const temperatureElement = document.getElementById('temperatura');
  
      if (humidityElement) {
        humidityElement.innerText = `${promedios.humedad.toFixed(2)}%`;
      }
  
      if (soilHumidityElement) {
        soilHumidityElement.innerText = `${promedios.humedad_suelo.toFixed(2)}%`;
      }
  
      if (temperatureElement) {
        temperatureElement.innerText = `${promedios.temperatura.toFixed(2)}°C`;
      }
  
      expect(humidityElement.innerText).toBe('65.00%');
      expect(soilHumidityElement.innerText).toBe('78.00%');
      expect(temperatureElement.innerText).toBe('23.00°C');
    });
  });
  