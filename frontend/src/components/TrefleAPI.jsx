import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TrefleAPI = () => {
  const [plantData, setPlantData] = useState([]); // Estado para almacenar los datos de las plantas
  const [loading, setLoading] = useState(true); // Estado para controlar si está cargando
  const [error, setError] = useState(null); // Estado para manejar errores

  // Asegúrate de que la API Key esté obteniéndose correctamente del archivo .env
  const API_KEY = process.env.REACT_APP_TREFLE_API_KEY; 

  const fetchPlants = async () => {
    try {
      const response = await axios.get(`https://trefle.io/api/v1/plants?token=${API_KEY}`);
      setPlantData(response.data.data);
      setLoading(false);
    } catch (error) {
      setError('Error al obtener los datos de las plantas');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlants();
  }, []);

  if (loading) {
    return <div>Cargando datos de las plantas...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container mt-5">
      <h1>Datos de Plantas desde Trefle API</h1>
      <div className="row">
        {plantData.map((plant) => (
          <div key={plant.id} className="col-md-4">
            <div className="card mb-4">
              <img src={plant.image_url} alt={plant.common_name} className="card-img-top" />
              <div className="card-body">
                <h5 className="card-title">{plant.common_name}</h5>
                <p className="card-text"><strong>Nombre científico:</strong> {plant.scientific_name}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrefleAPI;
