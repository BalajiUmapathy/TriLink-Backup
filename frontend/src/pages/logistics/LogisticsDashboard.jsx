import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, FileText, CheckCircle, Clock, Bell, User } from 'lucide-react';
import '../../index.css';

const LogisticsDashboard = () => {
    const navigate = useNavigate();
    const [selectedJob, setSelectedJob] = useState('JOB-001');
    const [jobHistory, setJobHistory] = useState([]);

    // Stats
    // Hardcoded for now as per design, should not change when quoting
    const availableJobsCount = 24;
    const assignedJobsCount = 12;
    // Calculate Quotes Submitted from LocalStorage
    const [quotesSubmittedCount, setQuotesSubmittedCount] = useState(8);

    useEffect(() => {
        const storedQuotes = JSON.parse(localStorage.getItem('submittedQuotes') || '{}');
        const count = Object.keys(storedQuotes).length;
        setQuotesSubmittedCount(8 + count);

        const history = JSON.parse(localStorage.getItem('jobHistory') || '[]');
        setJobHistory(history);
    }, []);

    const stats = [
        { label: 'Available Jobs', value: availableJobsCount, icon: <Truck size={24} />, route: '/logistics/available-jobs' },
        { label: 'Assigned Jobs', value: assignedJobsCount, icon: <CheckCircle size={24} />, route: '/logistics/assigned-jobs' },
        { label: 'Quotes Submitted', value: quotesSubmittedCount, icon: <FileText size={24} />, route: '/logistics/available-jobs', state: { filter: 'Quoted' } },
    ];

    return (
        <div className="fade-in" style={{ minHeight: '100vh', background: '#f8fafc' }}>
            {/* Header */}
            <header style={{ background: 'white', borderBottom: '1px solid var(--border)', padding: '1rem 3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-main)' }}>TriLink</div>
                    <div style={{ display: 'flex', gap: '2rem', fontSize: '0.95rem', fontWeight: '500' }}>
                        <a href="#" onClick={() => navigate('/logistics/dashboard')} style={{ color: 'var(--text-main)', cursor: 'pointer' }}>Dashboard</a>
                        <span onClick={() => navigate('/logistics/available-jobs')} style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>Search Jobs</span>
                        <span onClick={() => navigate('/logistics/assigned-jobs')} style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>Assigned Jobs</span>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <Bell size={20} color="var(--text-muted)" />
                    <div
                        style={{ width: '32px', height: '32px', background: '#e2e8f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                        onClick={() => navigate('/logistics/profile')}
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
                                        <th style={{ padding: '1rem 1.5rem', textAlign: 'right', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Distance</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {jobHistory.map((job, index) => (
                                        <tr key={index} style={{ borderBottom: '1px solid var(--border)' }}>
                                            <td style={{ padding: '1rem 1.5rem', fontWeight: '500' }}>#{job.id}</td>
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
                                            <td style={{ padding: '1rem 1.5rem', textAlign: 'right', color: 'var(--text-muted)' }}>{job.distance}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};


export default LogisticsDashboard;
