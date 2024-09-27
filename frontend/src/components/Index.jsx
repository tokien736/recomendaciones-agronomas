import React, { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/style.css';
import { initMap } from '../js/maps'; // Asegúrate de que `initMap` esté exportado correctamente
import Header from './Header';
import Footer from './Footer';

const Index = () => {
  useEffect(() => {
    if (typeof initMap === 'function') {
      initMap(); // Inicializa el mapa cuando el componente se monta
    } else {
      console.error('initMap no está definida');
    }
  }, []);

  return (
    <div>
      <Header />

      <div className="container-fluid">
        <div className="row half-height">
          <div className="col-md-6">
            <div id="map" className="border" style={{ height: '400px' }}></div> {/* Asegúrate de definir el tamaño del mapa */}
          </div>
          <div className="col-md-6 d-flex align-items-center justify-content-center">
            <div id="weather" className="alert alert-info">Clima no disponible</div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Index;
