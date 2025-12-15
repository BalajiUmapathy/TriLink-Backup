import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, User, ChevronLeft, MapPin, Truck, Package, Calendar, Eye, X } from 'lucide-react';
import '../../index.css';

const AssignedJobs = () => {
    const navigate = useNavigate();
    const [assignedJobs, setAssignedJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedJob, setSelectedJob] = useState(null);

    useEffect(() => {
        fetchAssignedJobs();
    }, []);

    const fetchAssignedJobs = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5081/api/BuyerLogisticsJob/assigned', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setAssignedJobs(data);

                // Auto-save any Delivered/Completed jobs to Job History
                const existingHistory = JSON.parse(localStorage.getItem('jobHistory') || '[]');
                const deliveredJobs = data.filter(job => job.status === 'Delivered' || job.status === 'Completed');

                deliveredJobs.forEach(job => {
                    console.log('[DEBUG] Job data for history:', job);
                    console.log('[DEBUG] pickupCity:', job.pickupCity, '| dropCity:', job.dropCity);
                    const jobExists = existingHistory.some(h => h.id === job.id);
                    if (!jobExists) {
                        const historyEntry = {
                            id: job.id,
                            origin: job.pickupCity || 'Unknown',
                            destination: job.dropCity || 'Unknown',
                            status: job.status,
                            date: new Date().toLocaleDateString(),
                            driverExp: '-',
                            vehicleType: '-',
                            distance: 'N/A'
                        };
                        existingHistory.push(historyEntry);
                    }
                });

                if (deliveredJobs.length > 0) {
                    localStorage.setItem('jobHistory', JSON.stringify(existingHistory));
                }
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (jobId, newStatus) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5081/api/BuyerLogisticsJob/${jobId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newStatus)
            });

            if (response.ok) {
                // If status is Delivered, add to Job History
                if (newStatus === 'Delivered') {
                    const jobToSave = assignedJobs.find(j => j.id === jobId);
                    if (jobToSave) {
                        const historyEntry = {
                            id: jobToSave.id,
                            origin: jobToSave.pickupCity || 'Unknown',
                            destination: jobToSave.dropCity || 'Unknown',
                            status: 'Delivered',
                            date: new Date().toLocaleDateString(),
                            driverExp: '-',
                            vehicleType: '-',
                            distance: 'N/A'
                        };

                        const existingHistory = JSON.parse(localStorage.getItem('jobHistory') || '[]');
                        const jobExists = existingHistory.some(h => h.id === jobToSave.id);
                        if (!jobExists) {
                            existingHistory.push(historyEntry);
                            localStorage.setItem('jobHistory', JSON.stringify(existingHistory));
                        }
                    }
                }

                fetchAssignedJobs(); // Refresh list
                if (selectedJob && selectedJob.id === jobId) {
                    setSelectedJob({ ...selectedJob, status: newStatus });
                }
            } else {
                alert('Failed to update status');
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const JobDetailsModal = ({ job, onClose }) => {
        if (!job) return null;

        const nextStatusOptions = {
            'Assigned': 'Picked',
            'Picked': 'In Transit',
            'In Transit': 'Delivered'
        };

        const nextStatus = nextStatusOptions[job.status];

        return (
            <div className="modal-overlay" onClick={onClose} style={{
                position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
                backdropFilter: 'blur(4px)'
            }}>
                <div className="modal-content fade-in" onClick={e => e.stopPropagation()} style={{
                    background: 'white', borderRadius: '16px', padding: '2rem', width: '90%', maxWidth: '800px',
                    maxHeight: '90vh', overflowY: 'auto', position: 'relative', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
                }}>
                    <button onClick={onClose} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', cursor: 'pointer' }}>
                        <X size={24} color="#64748b" />
                    </button>

                    <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e293b', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Truck size={28} color="#3b82f6" />
                        Job Details #{job.id?.substring(0, 8).toUpperCase()}
                    </h2>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '2rem', paddingLeft: '2.5rem' }}>
                        Created on {new Date(job.createdAt).toLocaleDateString()}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>

                        {/* Route Section */}
                        <div style={{ gridColumn: '1 / -1', background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                            <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem', color: '#334155', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Route Information</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <div style={{ marginTop: '0.25rem' }}><MapPin size={20} color="#3b82f6" /></div>
                                    <div>
                                        <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', marginBottom: '0.25rem' }}>PICKUP</div>
                                        <div style={{ fontWeight: '600', color: '#1e293b' }}>{job.pickupAddressLine1}</div>
                                        {job.pickupAddressLine2 && <div style={{ color: '#475569', fontSize: '0.9rem' }}>{job.pickupAddressLine2}</div>}
                                        <div style={{ color: '#475569' }}>{job.pickupCity}, {job.pickupState} - {job.pickupPincode}</div>
                                        <div style={{ fontSize: '0.85rem', color: '#3b82f6', marginTop: '0.25rem', fontWeight: '500' }}>
                                            SCHEDULED: {new Date(job.pickupDate).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>

                                <div style={{ height: '1px', background: '#e2e8f0', marginLeft: '2.5rem' }}></div>

                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <div style={{ marginTop: '0.25rem' }}><MapPin size={20} color="#22c55e" /></div>
                                    <div>
                                        <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', marginBottom: '0.25rem' }}>DROP</div>
                                        <div style={{ fontWeight: '600', color: '#1e293b' }}>{job.dropAddressLine1}</div>
                                        {job.dropAddressLine2 && <div style={{ color: '#475569', fontSize: '0.9rem' }}>{job.dropAddressLine2}</div>}
                                        <div style={{ color: '#475569' }}>{job.dropCity}, {job.dropState} - {job.dropPincode}</div>
                                        <div style={{ fontSize: '0.85rem', color: '#ea580c', marginTop: '0.25rem', fontWeight: '500' }}>
                                            EXPECTED: {new Date(job.deliveryExpectedDate).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Cargo Details */}
                        <div>
                            <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem', color: '#334155', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Package size={18} /> Cargo Details
                            </h3>
                            <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.25rem' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div>
                                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Total Weight</div>
                                        <div style={{ fontWeight: '600', fontSize: '1.1rem', color: '#1e293b' }}>{job.totalWeight} kg</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Pallet Count</div>
                                        <div style={{ fontWeight: '600', fontSize: '1.1rem', color: '#1e293b' }}>{job.palletCount}</div>
                                    </div>
                                    <div style={{ gridColumn: '1 / -1' }}>
                                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Material Type</div>
                                        <div style={{ fontWeight: '600', color: '#1e293b' }}>{job.materialType || 'General'}</div>
                                    </div>
                                    {(job.length && job.width && job.height) && (
                                        <div style={{ gridColumn: '1 / -1' }}>
                                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Dimensions (L x W x H)</div>
                                            <div style={{ fontWeight: '600', color: '#1e293b' }}>{job.length} x {job.width} x {job.height} cm</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Status Update Action */}
                        <div>
                            <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem', color: '#334155', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                Manage Job
                            </h3>
                            <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '12px', padding: '1.25rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                    <div style={{ fontSize: '0.85rem', color: '#64748b' }}>current Status</div>
                                    <span style={{ padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '600', background: '#e0f2fe', color: '#0284c7' }}>
                                        {job.status}
                                    </span>
                                </div>
                                {nextStatus && (
                                    <button
                                        onClick={() => handleUpdateStatus(job.id, nextStatus)}
                                        className="btn btn-primary"
                                        style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
                                    >
                                        Update to {nextStatus}
                                    </button>
                                )}
                                {!nextStatus && (
                                    <div style={{ textAlign: 'center', color: '#16a34a', fontWeight: '600' }}>Job Completed</div>
                                )}
                            </div>
                        </div>

                    </div>

                    <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
                        <button onClick={onClose} className="btn-secondary" style={{ padding: '0.75rem 2rem' }}>Close</button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="fade-in" style={{ minHeight: '100vh', background: '#f8fafc' }}>
            {/* Header */}
            <header style={{ background: 'white', borderBottom: '1px solid var(--border)', padding: '1rem 3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-main)', cursor: 'pointer' }} onClick={() => { const userId = localStorage.getItem('userId'); navigate(`/logistics/dashboard/${userId}`); }}>TriLink</div>
                    <div style={{ display: 'flex', gap: '2rem', fontSize: '0.95rem', fontWeight: '500' }}>
                        <span onClick={() => { const userId = localStorage.getItem('userId'); navigate(`/logistics/dashboard/${userId}`); }} style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>Dashboard</span>
                        <span onClick={() => { const userId = localStorage.getItem('userId'); navigate(`/logistics/available-jobs/${userId}`); }} style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>Search Jobs</span>
                        <span onClick={() => { const userId = localStorage.getItem('userId'); navigate(`/logistics/quoted-jobs/${userId}`); }} style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>Quoted Jobs</span>
                        <span onClick={() => { const userId = localStorage.getItem('userId'); navigate(`/logistics/assigned-jobs/${userId}`); }} style={{ color: 'var(--text-main)', cursor: 'pointer' }}>Assigned Jobs</span>
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
                <div style={{ marginBottom: '2rem' }}>
                    <button
                        onClick={() => navigate(-1)}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginBottom: '1rem' }}
                    >
                        <ChevronLeft size={20} /> Back
                    </button>
                    <h1 style={{ fontSize: '2rem', fontWeight: '600', color: 'var(--text-main)' }}>Assigned Jobs</h1>
                </div>

                {loading ? (
                    <div>Loading...</div>
                ) : assignedJobs.length === 0 ? (
                    <div className="card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                        You have no assigned jobs yet.
                    </div>
                ) : (
                    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead style={{ background: '#f8fafc', borderBottom: '1px solid var(--border)' }}>
                                <tr>
                                    <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Job ID</th>
                                    <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Route</th>
                                    <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Status</th>
                                    <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Pickup Date</th>
                                    <th style={{ padding: '1rem 1.5rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Route</th>
                                    <th style={{ padding: '1rem 1.5rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {assignedJobs.map((job) => (
                                    <tr key={job.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background-color 0.2s', cursor: 'pointer' }} onClick={() => setSelectedJob(job)} className="hover:bg-slate-50">
                                        <td style={{ padding: '1rem 1.5rem', fontWeight: '500' }}>#{job.id.substring(0, 8).toUpperCase()}</td>
                                        <td style={{ padding: '1rem 1.5rem' }}>
                                            {job.pickupCity} → {job.dropCity}
                                        </td>
                                        <td style={{ padding: '1rem 1.5rem' }}>
                                            <span style={{
                                                padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '600',
                                                background: '#e0f2fe', color: '#0284c7'
                                            }}>
                                                {job.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)' }}>{new Date(job.pickupDate).toLocaleDateString()}</td>
                                        <td style={{ padding: '1rem 1.5rem', textAlign: 'center' }}>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    const userId = localStorage.getItem('userId');
                                                    navigate(`/logistics/route-suggestion/${userId}/${job.id}`);
                                                }}
                                                className="btn"
                                                style={{
                                                    fontSize: '0.75rem',
                                                    padding: '0.4rem 0.8rem',
                                                    background: 'white',
                                                    border: '1px solid #10b981',
                                                    color: '#10b981',
                                                    borderRadius: '6px',
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '0.25rem',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                <MapPin size={12} /> Finalize Route
                                            </button>
                                        </td>
                                        <td style={{ padding: '1rem 1.5rem', textAlign: 'center' }}>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setSelectedJob(job); }}
                                                className="btn btn-primary"
                                                style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
                                            >
                                                Update Status
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>

            {/* Modal */}
            {selectedJob && <JobDetailsModal job={selectedJob} onClose={() => setSelectedJob(null)} />}
        </div>
    );
};

export default AssignedJobs;
