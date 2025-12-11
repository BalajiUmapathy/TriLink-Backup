import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, User, ChevronLeft, Check, X, Truck, Package, CheckCircle } from 'lucide-react';
import '../../index.css';

const AssignedJobs = () => {
    const navigate = useNavigate();

    // Mock Data State
    const [assignedJobs, setAssignedJobs] = useState([
        { id: 'JOB-001', origin: 'Chennai', destination: 'Delhi', status: 'Pending', date: 'Jan 25, 2025', experience: '5+ Years', vehicle: 'Heavy Truck' },
        { id: 'JOB-002', origin: 'Delhi', destination: 'Hossur', status: 'In Transit', date: 'Jan 22, 2025', experience: '3+ Years', vehicle: 'Mini Truck' },
    ]);

    // Modal State
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);

    const statusSteps = ['Pending', 'Picked', 'In Transit', 'Delivered'];

    const handleUpdateStatusClick = (job) => {
        setSelectedJob(job);
        setShowStatusModal(true);
    };

    const handleStatusChange = (newStatus) => {
        if (!selectedJob) return;

        const updatedJobs = assignedJobs.map(job =>
            job.id === selectedJob.id ? { ...job, status: newStatus } : job
        );
        setAssignedJobs(updatedJobs);
        setSelectedJob({ ...selectedJob, status: newStatus });
    };

    const closeModal = () => {
        setShowStatusModal(false);
        setSelectedJob(null);
    };

    const getStatusIndex = (status) => statusSteps.indexOf(status);

    return (
        <div className="fade-in" style={{ minHeight: '100vh', background: '#f8fafc' }}>
            {/* Header */}
            <header style={{ background: 'white', borderBottom: '1px solid var(--border)', padding: '1rem 3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-main)', cursor: 'pointer' }} onClick={() => navigate('/logistics/dashboard')}>TriLink</div>
                    <div style={{ display: 'flex', gap: '2rem', fontSize: '0.95rem', fontWeight: '500' }}>
                        <a href="#" onClick={() => navigate('/logistics/dashboard')} style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>Dashboard</a>
                        <span onClick={() => navigate('/logistics/available-jobs')} style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>Search Jobs</span>
                        <span onClick={() => navigate('/logistics/assigned-jobs')} style={{ color: 'var(--text-main)', cursor: 'pointer' }}>Assigned Jobs</span>
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
                <div style={{ marginBottom: '2rem' }}>
                    <button
                        onClick={() => navigate('/logistics/dashboard')}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginBottom: '1rem' }}
                    >
                        <ChevronLeft size={20} /> Back to Dashboard
                    </button>
                    <h1 style={{ fontSize: '2rem', fontWeight: '600', color: 'var(--text-main)' }}>Assigned Jobs</h1>
                </div>

                <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ background: '#f8fafc', borderBottom: '1px solid var(--border)' }}>
                            <tr>
                                <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Job ID</th>
                                <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Route</th>
                                <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Driver Exp.</th>
                                <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Vehicle Type</th>
                                <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Status</th>
                                <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Pickup Date</th>
                                <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Route</th>
                                <th style={{ padding: '1rem 1.5rem', textAlign: 'right', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {assignedJobs.map((job) => (
                                <tr key={job.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                    <td style={{ padding: '1rem 1.5rem', fontWeight: '500' }}>#{job.id}</td>
                                    <td style={{ padding: '1rem 1.5rem' }}>
                                        {job.origin} → {job.destination}
                                    </td>
                                    <td style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)' }}>{job.experience}</td>
                                    <td style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)' }}>{job.vehicle}</td>
                                    <td style={{ padding: '1rem 1.5rem' }}>
                                        <span style={{
                                            padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '500',
                                            background: '#f1f5f9', color: 'var(--text-main)'
                                        }}>
                                            {job.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)' }}>{job.date}</td>
                                    <td style={{ padding: '1rem 1.5rem' }}>
                                        <button
                                            className="btn"
                                            onClick={() => navigate(`/logistics/route-suggestion/${job.id}`)}
                                            style={{
                                                padding: '0.4rem 0.75rem',
                                                fontSize: '0.85rem',
                                                color: '#10b981',
                                                border: '1px solid #10b981',
                                                background: 'transparent'
                                            }}
                                        >
                                            Finalize Route
                                        </button>
                                    </td>
                                    <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                                        <button
                                            className="btn"
                                            onClick={() => handleUpdateStatusClick(job)}
                                            style={{ padding: '0.4rem 1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}
                                        >
                                            Update Status
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>

            {/* Status Update Modal */}
            {showStatusModal && selectedJob && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                }}>
                    <div className="card fade-in" style={{ width: '100%', maxWidth: '800px', padding: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Job #{selectedJob.id} Status</h2>
                            <button onClick={closeModal} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                                <X size={24} />
                            </button>
                        </div>

                        {/* Stepper */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3rem', position: 'relative' }}>
                            {/* Line */}
                            <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '2px', background: '#e2e8f0', zIndex: 0, transform: 'translateY(-50%)' }}></div>

                            {statusSteps.map((step, index) => {
                                const currentIndex = getStatusIndex(selectedJob.status);
                                const isCompleted = index <= currentIndex;
                                const isCurrent = index === currentIndex;

                                return (
                                    <div key={step} style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'white', padding: '0 0.5rem' }}>
                                        <div style={{
                                            width: '32px', height: '32px', borderRadius: '50%',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            background: isCompleted ? '#10b981' : 'white', // Green for completed
                                            border: isCompleted ? 'none' : '2px solid #e2e8f0',
                                            color: isCompleted ? 'white' : 'var(--text-muted)',
                                            fontWeight: '600', fontSize: '0.9rem'
                                        }}>
                                            {isCompleted ? <Check size={16} /> : index + 1}
                                        </div>
                                        <span style={{
                                            color: isCompleted ? '#10b981' : 'var(--text-muted)',
                                            fontWeight: isCurrent ? '600' : '400'
                                        }}>{step}</span>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Actions */}
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button
                                className="btn"
                                style={{
                                    background: selectedJob.status === 'Pending' ? '#000000' : '#e2e8f0', // Black if active, Gray if disabled
                                    color: selectedJob.status === 'Pending' ? 'white' : '#94a3b8',
                                    cursor: selectedJob.status === 'Pending' ? 'pointer' : 'not-allowed',
                                    border: 'none',
                                    padding: '0.75rem 1.5rem',
                                    fontWeight: '500',
                                    borderRadius: '8px'
                                }}
                                onClick={() => handleStatusChange('Picked')}
                                disabled={selectedJob.status !== 'Pending'}
                            >
                                Mark as Picked
                            </button>
                            <button
                                className="btn"
                                style={{
                                    background: selectedJob.status === 'Picked' ? '#000000' : '#e2e8f0',
                                    color: selectedJob.status === 'Picked' ? 'white' : '#94a3b8',
                                    cursor: selectedJob.status === 'Picked' ? 'pointer' : 'not-allowed',
                                    border: 'none',
                                    padding: '0.75rem 1.5rem',
                                    fontWeight: '500',
                                    borderRadius: '8px'
                                }}
                                onClick={() => handleStatusChange('In Transit')}
                                disabled={selectedJob.status !== 'Picked'}
                            >
                                Mark In Transit
                            </button>
                            <button
                                className="btn"
                                style={{
                                    background: selectedJob.status === 'In Transit' ? '#000000' : '#e2e8f0',
                                    color: selectedJob.status === 'In Transit' ? 'white' : '#94a3b8',
                                    cursor: selectedJob.status === 'In Transit' ? 'pointer' : 'not-allowed',
                                    border: 'none',
                                    padding: '0.75rem 1.5rem',
                                    fontWeight: '500',
                                    borderRadius: '8px'
                                }}
                                onClick={() => handleStatusChange('Delivered')}
                                disabled={selectedJob.status !== 'In Transit'}
                            >
                                Mark Delivered
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AssignedJobs;
