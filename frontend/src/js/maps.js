/* global google */
import { useEffect } from 'react';
import { getWeather } from './weather';

// Exportando 'initMap' como una exportación nombrada
export function initMap() { 
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            const userLatLng = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            const map = new google.maps.Map(document.getElementById('map'), {
                center: userLatLng,
                zoom: 15
            });

            new google.maps.Marker({
                position: userLatLng,
                map: map,
                title: 'Tu ubicación actual'
            });

            getWeather(userLatLng.lat, userLatLng.lng);
        });
    } else {
        console.error('Geolocation no está soportado por este navegador.');
    }
}

function loadGoogleMaps(callback) {
    const existingScript = document.getElementById('googleMaps');

    if (!existingScript) {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap`;
        script.id = 'googleMaps';
        document.body.appendChild(script);

        script.onload = () => {
            if (callback) callback();
        };
    } else {
        if (callback) callback();
    }
}

// Exportando 'MapComponent' como exportación por defecto
export default function MapComponent() {
    useEffect(() => {
        loadGoogleMaps(() => {
            initMap();
        });
    }, []);

    return (
        <div id="map" style={{ width: '100%', height: '400px' }}></div>
    );
}
