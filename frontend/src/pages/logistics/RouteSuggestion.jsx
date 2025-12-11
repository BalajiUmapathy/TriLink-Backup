import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Bell, User, MapPin, Clock, Truck, Zap, Map, CheckCircle } from 'lucide-react';
import '../../index.css';

const RouteSuggestion = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [showComparison, setShowComparison] = useState(false);
    const [selectedRoute, setSelectedRoute] = useState(null);
    const [jobData, setJobData] = useState(null);

    // Mock Database
    const mockJobsDatabase = {
        'JOB-001': {
            id: 'JOB-001',
            referenceId: 'JOB-2025-001',
            origin: 'Chennai',
            destination: 'Delhi',
            pickupLocation: '123 Industrial Park, Zone A, Chennai',
            deliveryLocation: '456 Central Delhi, Delhi',
            scheduledTime: 'Jan 25, 2025 - 10:00 AM',
            driver: 'Parthiban',
            status: 'Pending'
        },
        'JOB-002': {
            id: 'JOB-002',
            referenceId: 'JOB-2025-002',
            origin: 'Delhi',
            destination: 'Hossur',
            pickupLocation: '789 Logistics Hub, Delhi',
            deliveryLocation: '101 Manufacturing Unit, Hossur',
            scheduledTime: 'Jan 22, 2025 - 08:30 AM',
            driver: 'Rajesh Kumar',
            status: 'In Transit'
        }
    };

    useEffect(() => {
        // Fetch job data based on ID
        const data = mockJobsDatabase[id];
        if (data) {
            setJobData(data);
        } else {
            // Fallback or handle not found
            setJobData({
                id: id,
                referenceId: `JOB-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`,
                origin: 'Unknown',
                destination: 'Unknown',
                pickupLocation: 'N/A',
                deliveryLocation: 'N/A',
                scheduledTime: 'N/A',
                driver: 'Unassigned',
                status: 'Unknown'
            });
        }
    }, [id]);

    const handleSuggest = () => {
        // Simulate API call delay
        setTimeout(() => {
            setShowComparison(true);
        }, 500);
    };

    const handleConfirm = () => {
        if (selectedRoute) {
            navigate('/logistics/route-summary');
        }
    };

    if (!jobData) return <div className="fade-in" style={{ padding: '2rem' }}>Loading...</div>;

    return (
        <div className="fade-in" style={{ minHeight: '100vh', background: '#f8fafc' }}>
            {/* Header */}
            <header style={{ background: 'white', borderBottom: '1px solid var(--border)', padding: '1rem 3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-main)', cursor: 'pointer' }} onClick={() => navigate('/logistics/dashboard')}>TriLink</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <Bell size={20} color="var(--text-muted)" />
                    <div style={{ width: '32px', height: '32px', background: '#e2e8f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <User size={18} color="var(--text-muted)" />
                    </div>
                </div>
            </header>

            <main className="container" style={{ padding: '2rem 1rem', maxWidth: '1200px' }}>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                    Jobs &gt; {id} &gt; Route Suggestion
                </div>
                <h1 style={{ fontSize: '2rem', fontWeight: '600', marginBottom: '2rem', color: 'var(--text-main)' }}>Route Suggestion</h1>

                {/* Job Details Card */}
                <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ width: '100%' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Delivery to {jobData.destination} Warehouse</h2>
                            <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem', background: '#f1f5f9', borderRadius: '4px', fontWeight: '500' }}>{jobData.status}</span>
                        </div>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>{jobData.referenceId}</div>

                        <div style={{ display: 'flex', gap: '3rem', marginTop: '1.5rem' }}>
                            <div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Pickup Location</div>
                                <div style={{ fontWeight: '500' }}>{jobData.pickupLocation}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Delivery Location</div>
                                <div style={{ fontWeight: '500' }}>{jobData.deliveryLocation}</div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '3rem', marginTop: '1rem' }}>
                            <div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Scheduled Time</div>
                                <div style={{ fontWeight: '500' }}>{jobData.scheduledTime}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Driver Assigned</div>
                                <div style={{ fontWeight: '500' }}>{jobData.driver}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Route Planning / Comparison Section */}
                <div className="card" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: '600' }}>
                            {showComparison ? 'Compare Routes' : 'Route Planning'}
                        </h3>
                        {!showComparison && (
                            <button onClick={handleSuggest} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#0f172a', color: 'white' }}>
                                <Zap size={16} /> Suggest Route
                            </button>
                        )}
                        {showComparison && (
                            <button onClick={() => setShowComparison(false)} className="btn" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', border: '1px solid var(--border)' }}>
                                Generate New Routes
                            </button>
                        )}
                    </div>

                    {!showComparison ? (
                        <>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
                                <StatPlaceholder label="Distance" icon={<MapPin size={16} />} />
                                <StatPlaceholder label="Est. Time" icon={<Clock size={16} />} />
                                <StatPlaceholder label="Fuel Cost" icon={<Truck size={16} />} />
                            </div>
                            <div style={{ background: '#f8fafc', border: '2px dashed var(--border)', borderRadius: '12px', height: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                                <Map size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                                <p>Click "Suggest Route" to generate route options</p>
                            </div>
                        </>
                    ) : (
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            {/* Route Options */}
                            <div style={{ maxWidth: '600px', width: '100%' }}>
                                <RouteCard
                                    title="Optimal Route"
                                    tag="Recommended"
                                    tagColor="#10b981"
                                    selected={selectedRoute === 'optimal'}
                                    onClick={() => setSelectedRoute('optimal')}
                                    stats={{ distance: '2122 km', time: '32 hr', cost: '₹50432' }}
                                    details="Via Highway 101 & Main Street"
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Route Confirmation */}
                {selectedRoute && (
                    <div className="card" style={{ marginTop: '2rem', padding: '1.5rem', border: '1px solid var(--border)', background: 'var(--surface)' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.5rem' }}>
                            <div style={{ width: '32px', height: '32px', background: 'var(--text-main)', borderRadius: '50%', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <CheckCircle size={18} />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.25rem' }}>Route Confirmation</h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                    You have selected the for this job. This route will be assigned to the driver. <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>{selectedRoute === 'optimal' ? 'Optimal Route' : 'Alternative Route'}</span>
                                </p>
                            </div>
                        </div>

                        <div style={{ background: '#f8fafc', borderRadius: '8px', padding: '1.5rem', marginBottom: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <h4 style={{ fontSize: '0.95rem', fontWeight: '600' }}>Selected Route Details</h4>
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', cursor: 'pointer' }}>Edit</span>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', fontSize: '0.9rem' }}>
                                <div>
                                    <div style={{ color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Route Type</div>
                                    <div style={{ fontWeight: '500' }}>{selectedRoute === 'optimal' ? 'Optimal Route' : 'Alternative Route'}</div>
                                </div>
                                <div>
                                    <div style={{ color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Total Distance</div>
                                    <div style={{ fontWeight: '500' }}>{selectedRoute === 'optimal' ? '2122 km' : '2428 km'}</div>
                                </div>
                                <div>
                                    <div style={{ color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Estimated Duration</div>
                                    <div style={{ fontWeight: '500' }}>{selectedRoute === 'optimal' ? '32 hours' : '38 hours'}</div>
                                </div>
                                <div>
                                    <div style={{ color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Expected Arrival</div>
                                    <div style={{ fontWeight: '500' }}>2:32 PM</div>
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button onClick={handleConfirm} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#0f172a', color: 'white' }}>
                                <CheckCircle size={16} /> Confirm & Assign Route
                            </button>
                            <button onClick={() => setSelectedRoute(null)} className="btn" style={{ border: '1px solid var(--border)' }}>Cancel</button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

const StatPlaceholder = ({ label, icon }) => (
    <div style={{ background: '#f9fafb', padding: '1rem', borderRadius: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
            {icon} {label}
        </div>
        <div style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--text-muted)' }}>--</div>
    </div>
);

const RouteCard = ({ title, tag, tagColor, selected, onClick, stats, details }) => (
    <div
        onClick={onClick}
        style={{
            border: selected ? '2px solid var(--text-main)' : '1px solid var(--border)',
            borderRadius: '12px',
            padding: '1.5rem',
            cursor: 'pointer',
            transition: 'all 0.2s',
            position: 'relative'
        }}
    >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Zap size={18} fill={selected ? "var(--text-main)" : "none"} />
                <h3 style={{ fontWeight: '600' }}>{title}</h3>
            </div>
            {tag && (
                <span style={{
                    background: 'var(--text-main)', color: 'white',
                    fontSize: '0.75rem', padding: '0.2rem 0.6rem', borderRadius: '4px', fontWeight: '500'
                }}>
                    {tag}
                </span>
            )}
        </div>

        {/* Map Preview Placeholder */}
        <div style={{ height: '120px', background: '#f1f5f9', borderRadius: '8px', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
            <Map size={32} color="#cbd5e1" />
            <span style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.5rem' }}>Route Preview</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', fontSize: '0.9rem', marginBottom: '0.75rem' }}>
            <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Distance</span>
                <div style={{ fontWeight: '500' }}>{stats.distance}</div>
            </div>
            <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Est. Time</span>
                <div style={{ fontWeight: '500' }}>{stats.time}</div>
            </div>
            <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Fuel Cost</span>
                <div style={{ fontWeight: '500' }}>{stats.cost}</div>
            </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.9rem' }}>
            <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Driver Experience</span>
                <div style={{ fontWeight: '500' }}>{stats.experience}</div>
            </div>
            <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Vehicle Type</span>
                <div style={{ fontWeight: '500' }}>{stats.vehicle}</div>
            </div>
        </div>

        <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)', fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {details}
        </div>
    </div>
);

export default RouteSuggestion;
