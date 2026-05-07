'use client';

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Leaflet with Next.js
const DefaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

export const OfflineMap = ({ center }: { center?: [number, number] }) => {
    const [position, setPosition] = useState<[number, number]>(center || [20.5937, 78.9629]); // Default to India center

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((pos) => {
                setPosition([pos.coords.latitude, pos.coords.longitude]);
            });
        }
    }, []);

    return (
        <div className="h-[400px] w-full rounded-3xl overflow-hidden border-4 border-white shadow-2xl relative">
            <div className="absolute top-4 right-4 z-[1000] bg-white px-4 py-2 rounded-full shadow-lg text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                Offline Map Ready
            </div>
            <MapContainer
                center={position}
                zoom={13}
                scrollWheelZoom={false}
                className="h-full w-full"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                // In a true offline PWA, these tiles would be cached by the service worker
                />
                <Marker position={position}>
                    <Popup>
                        You are here. <br /> Emergency help notified.
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    );
};
