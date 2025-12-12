import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Truck, Scale, Box, Thermometer, Shield, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import '../../index.css';

const TruckRecommendation = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [selectedTruck, setSelectedTruck] = useState(null);

    const jobRequirements = {
        weight: '2.5 tons',
        volume: '15 Pallets',
        material: 'Pharmaceuticals (Sensitive)',
        temp: '2-8°C Required'
    };

    const trucks = [
        {
            id: 1,
            name: 'Volvo FH16 Aero',
            type: 'Refrigerated Box',
            capacity: '3.0 tons',
            volume: '18 Pallets',
            features: ['Climate Control', 'Air Suspension', 'GPS Tracker'],
            matchScore: 98,
            recommended: true,
            image: null // Placeholder
        },
        {
            id: 2,
            name: 'Tata Prima 5530',
            type: 'Standard Box',
            capacity: '5.0 tons',
            volume: '20 Pallets',
            features: ['Standard Suspension', 'GPS Tracker'],
            matchScore: 65,
            recommended: false,
            issue: 'No Climate Control'
        },
        {
            id: 3,
            name: 'Eicher Pro 3019',
            type: 'Refrigerated Box',
            capacity: '2.0 tons', // Less than required
            volume: '12 Pallets',
            features: ['Climate Control'],
            matchScore: 40,
            recommended: false,
            issue: 'Insufficient Capacity'
        }
    ];

    const handleContinue = () => {
        if (selectedTruck) {
            const userId = localStorage.getItem('userId');
            navigate(`/logistics/driver-matching/${userId}/${id}`);
        }
    };

    return (
        <div className="fade-in" style={{ minHeight: '100vh', background: '#f8fafc', paddingBottom: '3rem' }}>
            {/* Header */}
            <div style={{ background: 'white', borderBottom: '1px solid var(--border)', padding: '1.5rem 3rem' }}>
                <div className="container" style={{ maxWidth: '1200px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                            <span>Jobs</span> <span>/</span> <span>{id}</span> <span>/</span> <span style={{ color: 'var(--text-main)', fontWeight: '500' }}>Truck Recommendation</span>
                        </div>
                        <h1 style={{ fontSize: '1.75rem', fontWeight: '700' }}>Intelligent Truck Selection</h1>
                    </div>
                    <div style={{ display: 'flex', gap: '2rem' }}>
                        <div style={{ textAlign: 'center', opacity: 0.5 }}>
                            <div style={{ width: '32px', height: '32px', background: '#e2e8f0', color: 'var(--text-muted)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600', margin: '0 auto 0.5rem' }}>1</div>
                            <span style={{ fontSize: '0.8rem', fontWeight: '500' }}>Route</span>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ width: '32px', height: '32px', background: 'var(--text-main)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600', margin: '0 auto 0.5rem' }}>2</div>
                            <span style={{ fontSize: '0.8rem', fontWeight: '600' }}>Truck</span>
                        </div>
                        <div style={{ textAlign: 'center', opacity: 0.5 }}>
                            <div style={{ width: '32px', height: '32px', background: '#e2e8f0', color: 'var(--text-muted)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600', margin: '0 auto 0.5rem' }}>3</div>
                            <span style={{ fontSize: '0.8rem', fontWeight: '500' }}>Driver</span>
                        </div>
                    </div>
                </div>
            </div>

            <main className="container" style={{ maxWidth: '1200px', padding: '2rem 1rem' }}>

                <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '2rem' }}>

                    {/* Left: Job Requirements */}
                    <div>
                        <div className="card" style={{ padding: '1.5rem', position: 'sticky', top: '2rem' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1.5rem' }}>Cargo Requirements</h3>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                                        <Scale size={16} /> Weight
                                    </div>
                                    <div style={{ fontWeight: '600' }}>{jobRequirements.weight}</div>
                                </div>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                                        <Box size={16} /> Volume
                                    </div>
                                    <div style={{ fontWeight: '600' }}>{jobRequirements.volume}</div>
                                </div>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                                        <Shield size={16} /> Material Type
                                    </div>
                                    <div style={{ fontWeight: '600' }}>{jobRequirements.material}</div>
                                </div>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                                        <Thermometer size={16} /> Temperature
                                    </div>
                                    <div style={{ fontWeight: '600', color: '#3b82f6' }}>{jobRequirements.temp}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Truck Options */}
                    <div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem' }}>AI Recommended Fleet</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {trucks.map((truck) => (
                                <div
                                    key={truck.id}
                                    onClick={() => setSelectedTruck(truck.id)}
                                    className="card"
                                    style={{
                                        padding: '0',
                                        border: selectedTruck === truck.id ? '2px solid var(--text-main)' : '1px solid var(--border)',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        display: 'grid', gridTemplateColumns: '200px 1fr'
                                    }}
                                >
                                    {/* Truck Image Placeholder */}
                                    <div style={{ background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRight: '1px solid var(--border)' }}>
                                        <Truck size={48} color="var(--text-muted)" />
                                    </div>

                                    <div style={{ padding: '1.5rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                            <div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                    <h3 style={{ fontSize: '1.1rem', fontWeight: '600' }}>{truck.name}</h3>
                                                    {truck.recommended && <span style={{ background: '#ecfdf5', color: '#047857', fontSize: '0.75rem', fontWeight: '600', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>PERFECT MATCH</span>}
                                                </div>
                                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{truck.type}</p>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: truck.matchScore > 80 ? '#10b981' : '#f59e0b' }}>{truck.matchScore}%</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Fit Score</div>
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', gap: '2rem', marginBottom: '1.25rem' }}>
                                            <div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Capacity</div>
                                                <div style={{ fontWeight: '500' }}>{truck.capacity}</div>
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Features</div>
                                                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                                                    {truck.features.map((f, i) => (
                                                        <span key={i} style={{ fontSize: '0.75rem', background: '#f1f5f9', padding: '0.1rem 0.5rem', borderRadius: '4px' }}>{f}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {truck.issue && (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ef4444', fontSize: '0.85rem', fontWeight: '500' }}>
                                                <AlertCircle size={16} />
                                                {truck.issue}
                                            </div>
                                        )}
                                        {truck.recommended && !truck.issue && (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', fontSize: '0.85rem', fontWeight: '500' }}>
                                                <CheckCircle size={16} />
                                                Meets all detailed requirements
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
                            <button
                                onClick={handleContinue}
                                disabled={!selectedTruck}
                                className="btn btn-primary"
                                style={{ padding: '0.75rem 2rem', opacity: !selectedTruck ? 0.5 : 1 }}
                            >
                                Confirm Truck & Proceed
                                <ArrowRight size={18} style={{ marginLeft: '10px' }} />
                            </button>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default TruckRecommendation;
