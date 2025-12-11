import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, User, Truck, Plus, MapPin, X } from 'lucide-react';
import '../../index.css';

const BuyerLogisticsJobCreation = () => {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [loading, setLoading] = useState(false);

    // Form Data
    const [formData, setFormData] = useState({
        pickupAddressLine1: '',
        pickupAddressLine2: '',
        pickupCity: '',
        pickupState: '',
        pickupPincode: '',
        dropAddressLine1: '',
        dropAddressLine2: '',
        dropCity: '',
        dropState: '',
        dropPincode: '',
        estimatedWeightKg: '',
        status: 'Active' // Default
    });

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            // Using the same endpoint as supplier for now, assuming shared logic or will be updated
            const response = await fetch('/api/LogisticsJob', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setJobs(data);
            }
        } catch (error) {
            console.error("Failed to fetch jobs", error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/LogisticsJob', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...formData,
                    estimatedWeightKg: parseFloat(formData.estimatedWeightKg),
                    orderId: null // Optional
                })
            });

            if (response.ok) {
                setShowCreateForm(false);
                fetchJobs();
                // Reset form
                setFormData({
                    pickupAddressLine1: '', pickupAddressLine2: '', pickupCity: '', pickupState: '', pickupPincode: '',
                    dropAddressLine1: '', dropAddressLine2: '', dropCity: '', dropState: '', dropPincode: '',
                    estimatedWeightKg: '', status: 'Active'
                });
                alert('Logistics Job Created Successfully!');
            } else {
                const errorText = await response.text();
                // console.error('Create Job Failed:', response.status, errorText);
                // For now, if backend fails (unauthorized for buyer), we simulate success for frontend demo if needed, 
                // but better to show error. User said they will implement backend later.
                alert(`Note: Backend might not support Buyer job creation yet. Response: ${response.status}`);
            }
        } catch (error) {
            console.error("Error creating job", error);
        }
    };

    return (
        <div className="fade-in" style={{ minHeight: '100vh', background: '#f8fafc' }}>
            {/* Navigation Bar */}
            <nav style={{ background: 'white', borderBottom: '1px solid var(--border)', padding: '1rem 3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-main)' }}>TriLink</div>
                    <div style={{ display: 'flex', gap: '2rem', fontSize: '0.95rem', fontWeight: '500' }}>
                        <a href="#" onClick={() => navigate('/buyer/dashboard')} style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>Dashboard</a>
                        <a href="#" onClick={() => navigate('/buyer/search')} style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>Search Products</a>
                        <a href="#" onClick={() => navigate('/buyer/orders')} style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>Orders</a>
                        <a href="#" style={{ color: 'var(--text-main)', cursor: 'default' }}>Logistics Jobs</a>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <Bell size={20} color="var(--text-muted)" />
                    <div
                        style={{ width: '32px', height: '32px', background: '#e2e8f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                        onClick={() => navigate('/buyer/profile')}
                    >
                        <User size={18} color="var(--text-muted)" />
                    </div>
                </div>
            </nav>

            <main className="container" style={{ padding: '3rem 1rem', maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 style={{ fontSize: '2rem', fontWeight: '600', marginBottom: '0.5rem' }}>Logistics Job Management (Buyer)</h1>
                        <p style={{ color: 'var(--text-muted)' }}>Create and track your shipment requests</p>
                    </div>
                    <button
                        onClick={() => setShowCreateForm(true)}
                        className="btn btn-primary"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                        <Plus size={18} /> Create New Job
                    </button>
                </div>

                {/* Job List */}
                {!showCreateForm ? (
                    <div className="fade-in">
                        {loading ? <p>Loading jobs...</p> : jobs.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '4rem', background: 'white', borderRadius: '12px', border: '1px dashed var(--border)' }}>
                                <Truck size={48} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
                                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>No Jobs Created Yet</h3>
                                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Create a logistics job to get quotes from carriers.</p>
                                <button
                                    onClick={() => setShowCreateForm(true)}
                                    className="btn btn-primary"
                                >
                                    Create Job
                                </button>
                            </div>
                        ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
                                {jobs.map(job => (
                                    <div key={job.id} className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                            <div style={{ fontWeight: '600', fontSize: '1.1rem' }}>ID: #{job.id}</div>
                                            <span style={{
                                                fontSize: '0.8rem',
                                                background: job.status === 'Active' ? '#dcfce7' : '#f1f5f9',
                                                color: job.status === 'Active' ? '#166534' : 'var(--text-muted)',
                                                padding: '0.2rem 0.6rem',
                                                borderRadius: '20px',
                                                fontWeight: '500'
                                            }}>
                                                {job.status}
                                            </span>
                                        </div>

                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                            <MapPin size={16} />
                                            <div>
                                                <div style={{ color: 'black', fontWeight: '500' }}>{job.pickupLocation}</div>
                                                <div style={{ fontSize: '0.8rem' }}>to</div>
                                                <div style={{ color: 'black', fontWeight: '500' }}>{job.dropLocation}</div>
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                                            <div style={{ fontSize: '0.9rem' }}>
                                                <span style={{ color: 'var(--text-muted)' }}>Weight: </span>
                                                <span style={{ fontWeight: '600' }}>{job.estimatedWeightKg} kg</span>
                                            </div>
                                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                                {new Date(job.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    // Create Form
                    <div className="fade-in card" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: '600' }}>Create New Job</h2>
                            <button onClick={() => setShowCreateForm(false)} className="btn btn-outline" style={{ padding: '0.5rem' }}><X size={20} /></button>
                        </div>

                        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem' }}>
                            {/* Pickup Section */}
                            <div>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <div style={{ width: '24px', height: '24px', background: '#eff6ff', borderRadius: '50%', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>1</div>
                                    Pickup Details
                                </h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                                        <label className="input-label">Address Line 1</label>
                                        <input type="text" name="pickupAddressLine1" className="input-field" required value={formData.pickupAddressLine1} onChange={handleInputChange} />
                                    </div>
                                    <div className="input-group">
                                        <label className="input-label">City</label>
                                        <input type="text" name="pickupCity" className="input-field" required value={formData.pickupCity} onChange={handleInputChange} />
                                    </div>
                                    <div className="input-group">
                                        <label className="input-label">State</label>
                                        <input type="text" name="pickupState" className="input-field" required value={formData.pickupState} onChange={handleInputChange} />
                                    </div>
                                    <div className="input-group">
                                        <label className="input-label">Pincode</label>
                                        <input type="text" name="pickupPincode" className="input-field" required value={formData.pickupPincode} onChange={handleInputChange} />
                                    </div>
                                </div>
                            </div>

                            {/* Drop Section */}
                            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <div style={{ width: '24px', height: '24px', background: '#f0fdf4', borderRadius: '50%', color: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>2</div>
                                    Drop Details
                                </h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                                        <label className="input-label">Address Line 1</label>
                                        <input type="text" name="dropAddressLine1" className="input-field" required value={formData.dropAddressLine1} onChange={handleInputChange} />
                                    </div>
                                    <div className="input-group">
                                        <label className="input-label">City</label>
                                        <input type="text" name="dropCity" className="input-field" required value={formData.dropCity} onChange={handleInputChange} />
                                    </div>
                                    <div className="input-group">
                                        <label className="input-label">State</label>
                                        <input type="text" name="dropState" className="input-field" required value={formData.dropState} onChange={handleInputChange} />
                                    </div>
                                    <div className="input-group">
                                        <label className="input-label">Pincode</label>
                                        <input type="text" name="dropPincode" className="input-field" required value={formData.dropPincode} onChange={handleInputChange} />
                                    </div>
                                </div>
                            </div>

                            {/* Load Section */}
                            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <div style={{ width: '24px', height: '24px', background: '#fff7ed', borderRadius: '50%', color: '#f97316', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>3</div>
                                    Load Details
                                </h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div className="input-group">
                                        <label className="input-label">Estimated Weight (Kg)</label>
                                        <input type="number" step="0.01" name="estimatedWeightKg" className="input-field" required value={formData.estimatedWeightKg} onChange={handleInputChange} />
                                    </div>
                                    <div className="input-group">
                                        <label className="input-label">Initial Status</label>
                                        <select name="status" className="input-field" value={formData.status} onChange={handleInputChange}>
                                            <option value="Active">Active</option>
                                            <option value="Draft">Draft</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                                <button type="button" onClick={() => setShowCreateForm(false)} className="btn btn-outline">Cancel</button>
                                <button type="submit" className="btn btn-primary">Create Job</button>
                            </div>
                        </form>
                    </div>
                )}
            </main>
        </div>
    );
};

export default BuyerLogisticsJobCreation;
