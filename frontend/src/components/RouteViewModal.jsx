import React, { useEffect, useRef } from 'react';
import { X, MapPin, Clock, Truck, User } from 'lucide-react';
import { MapContainer, TileLayer, Polyline, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import polyline from '@mapbox/polyline';
import L from 'leaflet';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icon for pickup (green)
const pickupIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Custom icon for drop (red)
const dropIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const RouteViewModal = ({ isOpen, onClose, routeData }) => {
    if (!isOpen) return null;

    let positions = [];
    let center = [20.5937, 78.9629]; // Default center (India)

    if (routeData?.routePolyline) {
        try {
            // Decode Google Maps polyline format
            positions = polyline.decode(routeData.routePolyline);
            if (positions.length > 0) {
                center = positions[Math.floor(positions.length / 2)]; // Center of route
            }
        } catch (e) {
            console.error('Error decoding polyline:', e);
        }
    }

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
        }}>
            <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                width: '90%',
                maxWidth: '1000px',
                maxHeight: '90vh',
                overflow: 'hidden',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            }}>
                {/* Header */}
                <div style={{
                    padding: '1.5rem',
                    borderBottom: '1px solid #e5e7eb',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}>
                    <div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#111827', margin: 0 }}>
                            Route Details - {routeData?.jobReferenceId}
                        </h2>
                        <p style={{ color: '#6b7280', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                            {routeData?.pickupCity} → {routeData?.dropCity}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '0.5rem',
                            borderRadius: '6px',
                            transition: 'background-color 0.2s',
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                    >
                        <X size={24} color="#6b7280" />
                    </button>
                </div>

                {/* Content */}
                <div style={{ display: 'flex', height: 'calc(90vh - 100px)' }}>
                    {/* Map */}
                    <div style={{ flex: 2 }}>
                        {positions.length > 0 ? (
                            <MapContainer
                                center={center}
                                zoom={6}
                                scrollWheelZoom={true}
                                style={{ height: '100%', width: '100%' }}
                            >
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                {/* Route Polyline */}
                                <Polyline positions={positions} color="#2563eb" weight={4} />

                                {/* Pickup Marker */}
                                {positions.length > 0 && (
                                    <Marker position={positions[0]} icon={pickupIcon}>
                                    </Marker>
                                )}

                                {/* Drop Marker */}
                                {positions.length > 1 && (
                                    <Marker position={positions[positions.length - 1]} icon={dropIcon}>
                                    </Marker>
                                )}
                            </MapContainer>
                        ) : (
                            <div style={{
                                height: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: '#f9fafb',
                                color: '#6b7280'
                            }}>
                                <div style={{ textAlign: 'center' }}>
                                    <MapPin size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                                    <p>No route data available</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Route Details Sidebar */}
                    <div style={{
                        flex: 1,
                        padding: '1.5rem',
                        backgroundColor: '#f9fafb',
                        overflowY: 'auto',
                        borderLeft: '1px solid #e5e7eb',
                    }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem', color: '#111827' }}>
                            Route Information
                        </h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {/* Distance */}
                            <div style={{ display: 'flex', alignItems: 'start', gap: '0.75rem' }}>
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '8px',
                                    backgroundColor: '#e0f2fe',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                    <MapPin size={20} color="#0284c7" />
                                </div>
                                <div>
                                    <p style={{ fontSize: '0.85rem', color: '#6b7280', margin: 0 }}>Distance</p>
                                    <p style={{ fontSize: '1rem', fontWeight: '600', color: '#111827', margin: '0.25rem 0 0 0' }}>
                                        {routeData?.plannedDistance || 'N/A'}
                                    </p>
                                </div>
                            </div>

                            {/* Duration */}
                            <div style={{ display: 'flex', alignItems: 'start', gap: '0.75rem' }}>
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '8px',
                                    backgroundColor: '#fef3c7',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                    <Clock size={20} color="#d97706" />
                                </div>
                                <div>
                                    <p style={{ fontSize: '0.85rem', color: '#6b7280', margin: 0 }}>Duration</p>
                                    <p style={{ fontSize: '1rem', fontWeight: '600', color: '#111827', margin: '0.25rem 0 0 0' }}>
                                        {routeData?.plannedDuration || 'N/A'}
                                    </p>
                                </div>
                            </div>

                            {/* Vehicle Type */}
                            <div style={{ display: 'flex', alignItems: 'start', gap: '0.75rem' }}>
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '8px',
                                    backgroundColor: '#ddd6fe',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                    <Truck size={20} color="#7c3aed" />
                                </div>
                                <div>
                                    <p style={{ fontSize: '0.85rem', color: '#6b7280', margin: 0 }}>Vehicle Type</p>
                                    <p style={{ fontSize: '1rem', fontWeight: '600', color: '#111827', margin: '0.25rem 0 0 0' }}>
                                        {routeData?.vehicleType || 'N/A'}
                                    </p>
                                </div>
                            </div>

                            {/* Driver Experience */}
                            <div style={{ display: 'flex', alignItems: 'start', gap: '0.75rem' }}>
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '8px',
                                    backgroundColor: '#dcfce7',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                    <User size={20} color="#16a34a" />
                                </div>
                                <div>
                                    <p style={{ fontSize: '0.85rem', color: '#6b7280', margin: 0 }}>Driver Experience</p>
                                    <p style={{ fontSize: '1rem', fontWeight: '600', color: '#111827', margin: '0.25rem 0 0 0' }}>
                                        {routeData?.driverExperience || 'N/A'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Route Locations */}
                        <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #e5e7eb' }}>
                            <h4 style={{ fontSize: '0.95rem', fontWeight: '600', marginBottom: '1rem', color: '#111827' }}>
                                Locations
                            </h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {/* Pickup */}
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                        <div style={{
                                            width: '8px',
                                            height: '8px',
                                            borderRadius: '50%',
                                            backgroundColor: '#10b981',
                                        }}></div>
                                        <p style={{ fontSize: '0.8rem', color: '#6b7280', margin: 0 }}>Pickup</p>
                                    </div>
                                    <p style={{ fontSize: '0.9rem', fontWeight: '500', color: '#111827', margin: '0 0 0 1.25rem' }}>
                                        {routeData?.pickupCity}, {routeData?.pickupState}
                                    </p>
                                </div>
                                {/* Drop */}
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                        <div style={{
                                            width: '8px',
                                            height: '8px',
                                            borderRadius: '50%',
                                            backgroundColor: '#ef4444',
                                        }}></div>
                                        <p style={{ fontSize: '0.8rem', color: '#6b7280', margin: 0 }}>Drop</p>
                                    </div>
                                    <p style={{ fontSize: '0.9rem', fontWeight: '500', color: '#111827', margin: '0 0 0 1.25rem' }}>
                                        {routeData?.dropCity}, {routeData?.dropState}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RouteViewModal;
