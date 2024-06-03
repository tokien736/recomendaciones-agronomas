// Función de inicialización del mapa
function initMap() {
    // Verifica si el navegador soporta la Geolocalización
    if (navigator.geolocation) {
        // Obtiene la ubicación actual del usuario
        navigator.geolocation.getCurrentPosition(function(position) {
            var userLatLng = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            // Crea un mapa centrado en la ubicación del usuario
            var map = new google.maps.Map(document.getElementById('map'), {
                center: userLatLng, // Centra el mapa en la ubicación del usuario
                zoom: 15 // Establece el nivel de zoom
            });

            // Crea un marcador en la ubicación del usuario
            var marker = new google.maps.Marker({
                position: userLatLng,
                map: map,
                title: 'Tu ubicación actual'
            });

            // Llama a la función para obtener el clima
            getWeather(userLatLng.lat, userLatLng.lng);
        }, function() {
            // Manejo de errores en caso de no poder obtener la ubicación del usuario
            handleLocationError(true);
        });
    } else {
        // El navegador no soporta Geolocalización
        handleLocationError(false);
    }
}

// Función para manejar errores de Geolocalización
function handleLocationError(browserHasGeolocation) {
    var mapCenter = { lat: 40.7128, lng: -74.0060 }; // Coordenadas predeterminadas (Nueva York)
    
    // Crea un mapa centrado en una ubicación predeterminada
    var map = new google.maps.Map(document.getElementById('map'), {
        center: mapCenter,
        zoom: 10
    });

    // Muestra un mensaje de error
    var infoWindow = new google.maps.InfoWindow({
        content: browserHasGeolocation ?
            'Error: El servicio de Geolocalización falló.' :
            'Error: Tu navegador no soporta Geolocalización.'
    });

    var marker = new google.maps.Marker({
        position: mapCenter,
        map: map,
        title: 'Error'
    });
    marker.addListener('click', function() {
        infoWindow.open(map, marker);
    });
}
