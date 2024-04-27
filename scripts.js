// scripts.js

let map;
let directionsService;
let directionsRenderer;
let routeCoordinates = []; // Store all the route coordinates
let currentPositionIndex = 0;
let interval;

function initMap() {
    // Initialize the map
    map = new google.maps.Map(document.getElementById("map-container"), {
        zoom: 8,
        center: { lat: -1.9536, lng: 30.0609 }, // Kigali, Rwanda
    });

    // Initialize Directions Service and Renderer
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);

    // Calculate and display route
    calculateAndDisplayRoute();
}

function calculateAndDisplayRoute() {
    const request = {
        origin: "Kigali, Rwanda",
        destination: "Gicumbi, Rwanda",
        travelMode: google.maps.TravelMode.DRIVING,
    };

    // Request directions and display them on the map
    directionsService.route(request, function(response, status) {
        if (status === google.maps.DirectionsStatus.OK) {
            directionsRenderer.setDirections(response);
            const route = response.routes[0];
            routeCoordinates = extractRouteCoordinates(route); // Extract all coordinates from the route
            startRealTimeProgress();
        } else {
            window.alert("Directions request failed due to " + status);
        }
    });
}

function extractRouteCoordinates(route) {
    const coordinates = [];
    route.legs.forEach(leg => {
        leg.steps.forEach(step => {
            step.path.forEach(point => {
                coordinates.push({ lat: point.lat(), lng: point.lng() });
            });
        });
    });
    return coordinates;
}

function startRealTimeProgress() {
    interval = setInterval(function() {
        // Check if we reached the end of the route
        if (currentPositionIndex >= routeCoordinates.length) {
            clearInterval(interval);
            return;
        }

        // Update the map's center to the current position
        map.setCenter(routeCoordinates[currentPositionIndex]);

        // Move to the next position
        currentPositionIndex++;

    }, 1000); // Update every 1 second
}
