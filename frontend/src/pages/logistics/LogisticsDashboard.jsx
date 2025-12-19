import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, FileText, CheckCircle, Clock, Bell, User, MapPin } from 'lucide-react';
import RouteViewModal from '../../components/RouteViewModal';
import '../../index.css';

const LogisticsDashboard = () => {
    const navigate = useNavigate();
    const [selectedJob, setSelectedJob] = useState('JOB-001');
    const [jobHistory, setJobHistory] = useState([]);
    const [showRouteModal, setShowRouteModal] = useState(false);
    const [selectedRouteData, setSelectedRouteData] = useState(null);

    // Stats
    // Hardcoded for now as per design, should not change when quoting
    const [availableJobsCount, setAvailableJobsCount] = useState(0);
    const [assignedJobsCount, setAssignedJobsCount] = useState(0);
    const [quotesSubmittedCount, setQuotesSubmittedCount] = useState(0);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                const headers = { 'Authorization': `Bearer ${token}` };

                // Fetch Available Jobs
                const availableRes = await fetch('http://localhost:5081/api/BuyerLogisticsJob/available', { headers });
                if (availableRes.ok) {
                    const data = await availableRes.json();
                    setAvailableJobsCount(data.length);
                }

                // Fetch Assigned Jobs
                const assignedRes = await fetch('http://localhost:5081/api/BuyerLogisticsJob/assigned', { headers });
                if (assignedRes.ok) {
                    const data = await assignedRes.json();
                    setAssignedJobsCount(data.length);
                }

                // Fetch Quotes Submitted (all quotes: Pending, Accepted, and Rejected)
                const quotesRes = await fetch('http://localhost:5081/api/BuyerLogisticsJob/my-quotes', { headers });
                if (quotesRes.ok) {
                    const data = await quotesRes.json();
                    // Count all quotes regardless of status to match the Quoted Jobs page
                    setQuotesSubmittedCount(data.length);
                }


                // Fetch Job History from database
                const userId = localStorage.getItem('userId');
                console.log('Fetching job history for userId:', userId);
                console.log('API URL:', `http://localhost:5081/api/JobHistory/my-history?userId=${userId}`);

                const historyRes = await fetch(`http://localhost:5081/api/JobHistory/my-history?userId=${userId}`, { headers });
                console.log('Job History Response Status:', historyRes.status);

                if (historyRes.ok) {
                    const data = await historyRes.json();
                    console.log('Job History from API:', data); // Debug log
                    console.log('Number of job history entries:', data.length);
                    // Map API response to match existing display format
                    const formattedHistory = data.map(job => ({
                        id: job.jobId,
                        origin: job.origin,
                        destination: job.destination,
                        status: job.status,
                        date: new Date(job.completedDate).toLocaleDateString(),
                        driverExp: job.driverExperience,
                        vehicleType: job.vehicleType,
                        distance: job.plannedDistance
                    }));
                    setJobHistory(formattedHistory);
                } else {
                    const errorText = await historyRes.text();
                    console.error('Failed to fetch job history:');
                    console.error('Status:', historyRes.status);
                    console.error('Response:', errorText);
                }


            } catch (error) {
                console.error("Error fetching dashboard stats:", error);
            }
        };

        fetchStats();
    }, []);

    const handleViewRoute = async (job) => {
        try {
            const response = await fetch(`http://localhost:5081/api/JobHistory/${job.id}/route`);
            if (response.ok) {
                const routeData = await response.json();
                setSelectedRouteData(routeData);
                setShowRouteModal(true);
            } else {
                console.error('Failed to fetch route data:', response.status);
                alert('Failed to load route data');
            }
        } catch (error) {
            console.error('Error fetching route:', error);
            alert('Error loading route data');
        }
    };

    const stats = [
        { label: 'Available Jobs', value: availableJobsCount, icon: <Truck size={24} />, route: `/logistics/available-jobs/${localStorage.getItem('userId')}` },
        { label: 'Assigned Jobs', value: assignedJobsCount, icon: <CheckCircle size={24} />, route: `/logistics/assigned-jobs/${localStorage.getItem('userId')}` },
        { label: 'Quotes Submitted', value: quotesSubmittedCount, icon: <FileText size={24} />, route: `/logistics/quoted-jobs/${localStorage.getItem('userId')}` },
    ];

    return (
        <div className="fade-in" style={{ minHeight: '100vh', background: '#f8fafc' }}>
            {/* Header */}
            <header style={{ background: 'white', borderBottom: '1px solid var(--border)', padding: '1rem 3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-main)' }}>TriLink</div>
                    <div style={{ display: 'flex', gap: '2rem', fontSize: '0.95rem', fontWeight: '500' }}>
                        <a href="#" onClick={() => { const userId = localStorage.getItem('userId'); navigate(`/logistics/dashboard/${userId}`); }} style={{ color: 'var(--text-main)', cursor: 'pointer' }}>Dashboard</a>
                        <span onClick={() => { const userId = localStorage.getItem('userId'); navigate(`/logistics/available-jobs/${userId}`); }} style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>Search Jobs</span>
                        <span onClick={() => { const userId = localStorage.getItem('userId'); navigate(`/logistics/quoted-jobs/${userId}`); }} style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>Quoted Jobs</span>
                        <span onClick={() => { const userId = localStorage.getItem('userId'); navigate(`/logistics/assigned-jobs/${userId}`); }} style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>Assigned Jobs</span>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <Bell size={20} color="var(--text-muted)" />
                    <div
                        style={{ width: '32px', height: '32px', background: '#e2e8f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                        onClick={() => { const userId = localStorage.getItem('userId'); navigate(`/logistics/profile/${userId}`); }}
                    >
                        <User size={18} color="var(--text-muted)" />
                    </div>
                </div>
            </header>

            <main className="container" style={{ padding: '3rem 1rem', maxWidth: '1200px' }}>
                <div style={{ marginBottom: '3rem' }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text-main)' }}>Logistics Dashboard</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Manage your logistics operations and job assignments</p>
                </div>

                {/* Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className="card"
                            onClick={() => stat.route && navigate(stat.route, { state: stat.state })}
                            style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: stat.route ? 'pointer' : 'default' }}
                        >
                            <div>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{stat.label}</p>
                                <h3 style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--text-main)', margin: 0 }}>{stat.value}</h3>
                            </div>
                            <div style={{ width: '50px', height: '50px', background: '#f1f5f9', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-main)' }}>
                                {stat.icon}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Job History */}
                {jobHistory.length > 0 && (
                    <div style={{ marginBottom: '3rem' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem', color: 'var(--text-main)' }}>Job History</h3>
                        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead style={{ background: '#f8fafc', borderBottom: '1px solid var(--border)' }}>
                                    <tr>
                                        <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Job ID</th>
                                        <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Route</th>
                                        <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Status</th>
                                        <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Date Accepted</th>
                                        <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Driver Experience</th>
                                        <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Vehicle Recommended</th>
                                        <th style={{ padding: '1rem 1.5rem', textAlign: 'right', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Distance</th>
                                        <th style={{ padding: '1rem 1.5rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {jobHistory.map((job, index) => (
                                        <tr key={index} style={{ borderBottom: '1px solid var(--border)' }}>
                                            <td style={{ padding: '1rem 1.5rem', fontWeight: '500' }}>
                                                {job.id && job.id.length > 8 ? `JOB-${job.id.substring(0, 8).toUpperCase()}` : job.id}
                                            </td>
                                            <td style={{ padding: '1rem 1.5rem' }}>{job.origin} → {job.destination}</td>
                                            <td style={{ padding: '1rem 1.5rem' }}>
                                                <span style={{
                                                    padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '500',
                                                    background: '#ecfdf5', color: '#059669'
                                                }}>
                                                    {job.status}
                                                </span>
                                            </td>
                                            <td style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)' }}>{job.date}</td>
                                            <td style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)' }}>{job.driverExp || '-'}</td>
                                            <td style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)' }}>{job.vehicleType || '-'}</td>
                                            <td style={{ padding: '1rem 1.5rem', textAlign: 'right', color: 'var(--text-muted)' }}>{job.distance}</td>
                                            <td style={{ padding: '1rem 1.5rem', textAlign: 'center' }}>
                                                <button
                                                    onClick={() => handleViewRoute(job)}
                                                    style={{
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '0.5rem',
                                                        padding: '0.5rem 1rem',
                                                        background: '#2563eb',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '6px',
                                                        fontSize: '0.85rem',
                                                        fontWeight: '500',
                                                        cursor: 'pointer',
                                                        transition: 'background-color 0.2s',
                                                    }}
                                                    onMouseEnter={(e) => e.target.style.backgroundColor = '#1d4ed8'}
                                                    onMouseLeave={(e) => e.target.style.backgroundColor = '#2563eb'}
                                                >
                                                    <MapPin size={14} />
                                                    View Route
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </main>

            {/* Route View Modal */}
            <RouteViewModal
                isOpen={showRouteModal}
                onClose={() => setShowRouteModal(false)}
                routeData={selectedRouteData}
            />
        </div>
    );
};


export default LogisticsDashboard;
