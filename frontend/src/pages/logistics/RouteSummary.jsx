import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, User, Map, Truck, Clock, Leaf } from 'lucide-react';
import '../../index.css';

const RouteSummary = () => {
    const navigate = useNavigate();

    const handleAccept = () => {
        const newJob = {
            id: 'JOB-' + Math.floor(Math.random() * 10000), // Generate a random ID for now
            origin: 'Coimbatore',
            destination: 'Delhi',
            distance: '2122 km',
            eta: '32 hours',
            fuelCost: '₹50432',
            driverExp: '5+ Years',
            vehicleType: 'Heavy Truck',
            status: 'Accepted',
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        };

        const existingHistory = JSON.parse(localStorage.getItem('jobHistory') || '[]');
        const updatedHistory = [newJob, ...existingHistory];
        localStorage.setItem('jobHistory', JSON.stringify(updatedHistory));

        navigate('/logistics/dashboard');
    };

    return (
        <div className="fade-in" style={{ minHeight: '100vh', background: '#f8fafc' }}>
            {/* Header */}
            <header style={{ background: 'white', borderBottom: '1px solid var(--border)', padding: '1rem 3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-main)', cursor: 'pointer' }} onClick={() => navigate('/logistics/dashboard')}>TriLink</div>
                    <div style={{ display: 'flex', gap: '2rem', fontSize: '0.95rem', fontWeight: '500' }}>
                        <a href="#" onClick={() => navigate('/logistics/dashboard')} style={{ color: 'var(--text-main)', cursor: 'pointer' }}>Dashboard</a>
                        <span onClick={() => navigate('/logistics/available-jobs')} style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>Search Jobs</span>
                        <span onClick={() => navigate('/logistics/assigned-jobs')} style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>Assigned Jobs</span>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <Bell size={20} color="var(--text-muted)" />
                    <div style={{ width: '32px', height: '32px', background: '#e2e8f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <User size={18} color="var(--text-muted)" />
                    </div>
                </div>
            </header>

            <main className="container" style={{ padding: '3rem 1rem', maxWidth: '800px' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Route Summary</h1>

                <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
                    {/* Map Preview */}
                    <div style={{ height: '300px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                        <Map size={64} color="#cbd5e1" />
                        <span style={{ marginTop: '1rem', color: '#94a3b8', fontWeight: '500' }}>Interactive Map Preview</span>
                    </div>

                    <div style={{ padding: '2rem' }}>
                        {/* Tabs */}
                        <div style={{ display: 'flex', background: '#f8fafc', borderRadius: '8px', padding: '0.25rem', marginBottom: '2rem' }}>
                            <button style={{ flex: 1, padding: '0.5rem', borderRadius: '6px', background: 'white', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', fontWeight: '600', fontSize: '0.9rem' }}>Optimal Route</button>
                        </div>

                        {/* Stats List */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                            <StatBar icon={<Map size={20} />} label="Distance" value="2122 km" />
                            <StatBar icon={<Clock size={20} />} label="ETA" value="32 hours" />
                            <StatBar icon={<Truck size={20} />} label="Fuel Cost" value="₹50432" />
                            <StatBar icon={<User size={20} />} label="Driver Exp." value="5+ Years" />
                            <StatBar icon={<Truck size={20} />} label="Vehicle Type" value="Heavy Truck" />
                        </div>

                        {/* Waypoints */}
                        <div style={{ marginBottom: '2rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
                            <h3 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>Route Waypoints</h3>

                            <div style={{ position: 'relative', paddingLeft: '2rem' }}>
                                {/* Line */}
                                <div style={{ position: 'absolute', top: '10px', bottom: '10px', left: '9px', width: '2px', borderLeft: '2px dashed #cbd5e1' }}></div>

                                <div style={{ marginBottom: '1.5rem', position: 'relative' }}>
                                    <div style={{ width: '20px', height: '20px', background: 'var(--text-main)', borderRadius: '50%', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', position: 'absolute', left: '-32px', top: '0' }}>A</div>
                                    <h4 style={{ fontSize: '0.9rem', fontWeight: '600' }}>Pickup Point</h4>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>123 Industrial Park, Zone A, Coimbatore</p>
                                </div>

                                <div style={{ position: 'relative' }}>
                                    <div style={{ width: '20px', height: '20px', background: '#94a3b8', borderRadius: '50%', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', position: 'absolute', left: '-32px', top: '0' }}>B</div>
                                    <h4 style={{ fontSize: '0.9rem', fontWeight: '600' }}>Delivery Point</h4>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>456 Central Delhi, Maharastra</p>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleAccept}
                            className="btn btn-primary"
                            style={{ width: '100%', padding: '1rem' }}
                        >
                            Accept
                        </button>
                    </div>

                </div>
            </main>
        </div>
    );
};

const StatBar = ({ icon, label, value }) => (
    <div style={{ display: 'flex', alignItems: 'center', padding: '1rem', background: '#f8fafc', borderRadius: '8px' }}>
        <div style={{ margin: '0 1rem', color: 'var(--text-muted)' }}>{icon}</div>
        <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{label}</div>
            <div style={{ fontWeight: '600' }}>{value}</div>
        </div>
    </div>
);

export default RouteSummary;
