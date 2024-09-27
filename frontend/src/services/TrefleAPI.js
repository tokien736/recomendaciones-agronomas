import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TrefleAPI = () => {
  const [plantData, setPlantData] = useState([]); // Estado para almacenar los datos de las plantas
  const [loading, setLoading] = useState(true); // Estado para controlar si está cargando
  const [error, setError] = useState(null); // Estado para manejar errores

  // API Key colocada directamente en el archivo
  const API_KEY = 'A_xQq41CUJN_SLGJYvWsCtgbL5-V1E1H_f_nAOS4kWk'; // Reemplaza con tu propia API Key

  // Función para hacer la solicitud a la API
  const fetchPlants = async () => {
    try {
      const response = await axios.get(`https://trefle.io/api/v1/plants?token=${API_KEY}`);
      setPlantData(response.data.data); // Guardamos los datos de las plantas
      setLoading(false); // Detenemos el estado de carga
    } catch (error) {
      setError('Error al obtener los datos de las plantas');
      setLoading(false); // Detenemos el estado de carga
    }
  };

  // Llamamos a la función fetchPlants cuando el componente se monta
  useEffect(() => {
    fetchPlants();
  }, []);

  // Si está cargando, mostramos un mensaje
  if (loading) {
    return <div>Cargando datos de las plantas...</div>;
  }

  // Si hay un error, mostramos el mensaje de error
  if (error) {
    return <div>{error}</div>;
  }

  // Si tenemos los datos, los mostramos
  return (
    <div className="container mt-5">
      <h1>Datos de Plantas desde Trefle API</h1>
      <div className="row">
        {plantData.map((plant) => (
          <div key={plant.id} className="col-md-4">
            <div className="card mb-4">
              {plant.image_url && (
                <img src={plant.image_url} alt={plant.common_name} className="card-img-top" />
              )}
              <div className="card-body">
                <h5 className="card-title">{plant.common_name || 'Nombre común no disponible'}</h5>
                <p className="card-text">
                  <strong>Nombre científico:</strong> {plant.scientific_name || 'Nombre científico no disponible'}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrefleAPI;
