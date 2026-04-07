import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapComponentProps {
    location: string;
    destination: string;
}


const CITY_COORDINATES: { [key: string]: [number, number] } = {
    "Kathmandu": [27.7172, 85.3240],
    "Lalitpur": [27.6644, 85.3188],
    "Bhaktapur": [27.6710, 85.4298],
    "Pokhara": [28.2096, 83.9856],
    "Chitwan": [27.5291, 84.3542],
    "Biratnagar": [26.4525, 87.2718],
    "Birgunj": [27.0138, 84.8768],
    "Dharan": [26.8126, 87.2789],
    "Nepalgunj": [28.0506, 81.6141],
    "Butwal": [27.7006, 83.4484],
    "Hetauda": [27.4285, 85.0303],
    "Janakpur": [26.7271, 85.9407],
    "Dhangadhi": [28.6852, 80.5908],
    "Itahari": [26.6669, 87.2807],
    "Nagarkot": [27.7127, 85.5298],
    "Dhulikhel": [27.6253, 85.5561],
    "Lumbini": [27.4840, 83.2760],
    "Mustang": [28.9985, 83.8473],
    "Manang": [28.6667, 84.0000],
    "Ilam": [26.9080, 87.9250]
};


const MapUpdater: React.FC<{ center: [number, number], zoom: number }> = ({ center, zoom }) => {
    const map = useMap();
    useEffect(() => {
        map.setView(center, zoom);
    }, [center, zoom, map]);
    return null;
};

const MapComponent: React.FC<MapComponentProps> = ({ location, destination }) => {
    const defaultCenter: [number, number] = [28.3949, 84.1240]; 
    const defaultZoom = 7;

    const locCoords = CITY_COORDINATES[location] || null;
    const destCoords = CITY_COORDINATES[destination] || null;

    // Determine center and zoom
    let center = defaultCenter;
    let zoom = defaultZoom;

    if (locCoords && destCoords) {
        // Simple midpoint calculation
        center = [(locCoords[0] + destCoords[0]) / 2, (locCoords[1] + destCoords[1]) / 2];
        zoom = 8; // Zoom in a bit if both are selected
    } else if (locCoords) {
        center = locCoords;
        zoom = 12;
    } else if (destCoords) {
        center = destCoords;
        zoom = 12;
    }

    return (
        <div className="h-96 w-full rounded-2xl overflow-hidden shadow-lg border-2 border-gray-100 z-0 relative">
            <MapContainer center={center} zoom={zoom} scrollWheelZoom={false} className="h-full w-full">
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {locCoords && (
                    <Marker position={locCoords}>
                        <Popup>Pickup: {location}</Popup>
                    </Marker>
                )}

                {destCoords && (
                    <Marker position={destCoords}>
                        <Popup>Destination: {destination}</Popup>
                    </Marker>
                )}

                <MapUpdater center={center} zoom={zoom} />
            </MapContainer>
        </div>
    );
};

export default MapComponent;
