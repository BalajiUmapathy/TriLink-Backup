import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { User, Shield, Star, Award, Map, CheckCircle, ArrowRight, ThumbsUp } from 'lucide-react';
import '../../index.css';

const DriverMatching = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [selectedDriver, setSelectedDriver] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);

    const drivers = [
        {
            id: 1,
            name: 'Vikram Singh',
            experience: '12 Years',
            rating: 4.9,
            trips: 850,
            stabilityScore: 98,
            certs: ['Hazmat', 'Heavy Load', 'Night Driving'],
            familiarity: 'High (20+ trips on this route)',
            status: 'Available',
            image: null
        },
        {
            id: 2,
            name: 'Rajesh Kumar',
            experience: '5 Years',
            rating: 4.5,
            trips: 320,
            stabilityScore: 82,
            certs: ['Heavy Load'],
            familiarity: 'Medium (5 trips on this route)',
            status: 'Available',
            image: null
        },
        {
            id: 3,
            name: 'Amit Patel',
            experience: '2 Years',
            rating: 4.2,
            trips: 150,
            stabilityScore: 70,
            certs: ['Standard'],
            familiarity: 'Low (First time)',
            status: 'Busy',
            image: null
        }
    ];

    const handleAssign = () => {
        if (selectedDriver) {
            setShowSuccess(true);
            setTimeout(() => {
                navigate('/logistics/dashboard');
            }, 2000);
        }
    };

    return (
        <div className="fade-in" style={{ minHeight: '100vh', background: '#f8fafc', paddingBottom: '3rem' }}>
            {/* Header */}
            <div style={{ background: 'white', borderBottom: '1px solid var(--border)', padding: '1.5rem 3rem' }}>
                <div className="container" style={{ maxWidth: '1200px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                            <span>Jobs</span> <span>/</span> <span>{id}</span> <span>/</span> <span style={{ color: 'var(--text-main)', fontWeight: '500' }}>Driver Assignment</span>
                        </div>
                        <h1 style={{ fontSize: '1.75rem', fontWeight: '700' }}>Driver Experience Matching</h1>
                    </div>
                    <div style={{ display: 'flex', gap: '2rem' }}>
                        <div style={{ textAlign: 'center', opacity: 0.5 }}>
                            <div style={{ width: '32px', height: '32px', background: '#e2e8f0', color: 'var(--text-muted)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600', margin: '0 auto 0.5rem' }}>1</div>
                            <span style={{ fontSize: '0.8rem', fontWeight: '500' }}>Route</span>
                        </div>
                        <div style={{ textAlign: 'center', opacity: 0.5 }}>
                            <div style={{ width: '32px', height: '32px', background: '#e2e8f0', color: 'var(--text-muted)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600', margin: '0 auto 0.5rem' }}>2</div>
                            <span style={{ fontSize: '0.8rem', fontWeight: '500' }}>Truck</span>
                        </div>
                        <div style={{ textAlign: 'center', opacity: 1 }}>
                            <div style={{ width: '32px', height: '32px', background: 'var(--text-main)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600', margin: '0 auto 0.5rem' }}>3</div>
                            <span style={{ fontSize: '0.8rem', fontWeight: '600' }}>Driver</span>
                        </div>
                    </div>
                </div>
            </div>

            <main className="container" style={{ maxWidth: '1200px', padding: '2rem 1rem' }}>

                {/* Info Alert */}
                <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '1rem', marginBottom: '2rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <Shield color="#2563eb" size={24} />
                    <div>
                        <h4 style={{ color: '#1e40af', fontWeight: '600', fontSize: '0.95rem' }}>High-Value Cargo Detected</h4>
                        <p style={{ color: '#1e3a8a', fontSize: '0.9rem' }}>Stability Mode is ON. Only drivers with Stability Score &gt; 90 are recommended for this shipment.</p>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
                    {drivers.map((driver) => (
                        <div
                            key={driver.id}
                            onClick={() => setSelectedDriver(driver.id)}
                            className="card"
                            style={{
                                padding: '2rem',
                                border: selectedDriver === driver.id ? '2px solid var(--text-main)' : '1px solid var(--border)',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                position: 'relative',
                                opacity: driver.stabilityScore < 80 ? 0.6 : 1
                            }}
                        >
                            {driver.id === 1 && (
                                <div style={{ position: 'absolute', top: 12, right: 12, background: '#ecfdf5', color: '#047857', fontSize: '0.7rem', fontWeight: '700', padding: '0.2rem 0.6rem', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <Star size={12} fill="#047857" /> TOP PICK
                                </div>
                            )}

                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '1.5rem' }}>
                                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#e2e8f0', marginBottom: '1rem', overflow: 'hidden' }}>
                                    {/* Placeholder Avatar */}
                                    <User size={80} color="#cbd5e1" style={{ marginTop: '10px' }} />
                                </div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.25rem' }}>{driver.name}</h3>
                                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{driver.experience} Experience</div>
                            </div>

                            <div style={{ background: '#f8fafc', borderRadius: '8px', padding: '1rem', marginBottom: '1.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Stability Score</span>
                                    <span style={{ fontWeight: '700', color: driver.stabilityScore > 90 ? '#10b981' : '#f59e0b' }}>{driver.stabilityScore}/100</span>
                                </div>
                                <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                                    <div style={{ width: `${driver.stabilityScore}%`, height: '100%', background: driver.stabilityScore > 90 ? '#10b981' : '#f59e0b' }}></div>
                                </div>
                            </div>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                                    <Map size={16} color="var(--text-muted)" />
                                    <span>{driver.familiarity}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                                    <Award size={16} color="var(--text-muted)" />
                                    <span>{driver.certs.join(', ')}</span>
                                </div>
                            </div>

                            <button
                                className={`btn ${selectedDriver === driver.id ? 'btn-primary' : 'btn-outline'}`}
                                style={{ width: '100%' }}
                            >
                                {selectedDriver === driver.id ? 'Selected' : 'Select Driver'}
                            </button>
                        </div>
                    ))}
                </div>

                <div style={{ marginTop: '3rem', textAlign: 'right' }}>
                    <button
                        onClick={handleAssign}
                        disabled={!selectedDriver}
                        className="btn btn-primary"
                        style={{ padding: '1rem 3rem', fontSize: '1rem' }}
                    >
                        Assign Driver & Initialize Job
                    </button>
                </div>

            </main>

            {/* Success Modal Simulation */}
            {showSuccess && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 1000, animation: 'fadeIn 0.2s ease-out'
                }}>
                    <div className="card" style={{ padding: '3rem', textAlign: 'center', maxWidth: '400px' }}>
                        <div style={{ width: '64px', height: '64px', background: '#ecfdf5', borderRadius: '50%', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                            <CheckCircle size={32} />
                        </div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>Job Assigned!</h2>
                        <p style={{ color: 'var(--text-muted)' }}>Logicstics workflow initialized. Driver has been notified.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DriverMatching;
