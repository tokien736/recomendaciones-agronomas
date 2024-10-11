jest.mock('../firebase', () => ({
    convertirHumedadSuelo: jest.fn((valor) => (valor / 1023) * 100),
    dataRef: {},
    onValue: jest.fn((ref, callback) => {
      const mockData = {
        '1': { humedad: 60, humedad_suelo: 512, temperatura: 25 },
        '2': { humedad: 70, humedad_suelo: 700, temperatura: 22 },
      };
      callback({ val: () => mockData });
    }),
  }));
  
  import { recomendar } from '../model';
  
  describe('Model functionalities', () => {
    // Mock para la función fetch que simula la carga del archivo JSON
    beforeEach(() => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true, // Esto asegura que la respuesta sea válida
          json: () =>
            Promise.resolve({
              cultivos: [
                {
                  nombre: 'Tomate',
                  condiciones: {
                    humedad_ambiental: { min: 50, max: 70 },
                    humedad_suelo: { min: 50, max: 80 },
                    temperatura: { min: 20, max: 30 },
                  },
                },
                {
                  nombre: 'Lechuga',
                  condiciones: {
                    humedad_ambiental: { min: 60, max: 90 },
                    humedad_suelo: { min: 60, max: 90 },
                    temperatura: { min: 10, max: 25 },
                  },
                },
              ],
            }),
        })
      );
    });
  
    afterEach(() => {
      global.fetch.mockClear();
    });
  
    test('should recommend crops based on conditions', async () => {
      const recomendaciones = await recomendar(65, 75, 23);
      expect(recomendaciones).toBe('Tomate, Lechuga');
    });
  
    test('should return no recommendation if conditions do not match', async () => {
      const recomendaciones = await recomendar(10, 20, 5); // Valores fuera de rango
      expect(recomendaciones).toBe('No se recomienda sembrar ningún cultivo con las condiciones actuales');
    });
  });
  