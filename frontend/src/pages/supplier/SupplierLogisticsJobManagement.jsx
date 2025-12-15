import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, User, Truck, ArrowLeft, Package, Calendar, MapPin } from 'lucide-react';
import '../../index.css';

const SupplierLogisticsJobManagement = () => {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState('All'); // All, Active, Completed

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5081/api/BuyerLogisticsJob', {
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

    const filteredJobs = jobs.filter(job => {
        if (filter === 'All') return true;
        if (filter === 'Active') return ['Active', 'Assigned', 'Picked', 'In Transit'].includes(job.status);
        if (filter === 'Completed') return ['Completed', 'Delivered', 'Cancelled'].includes(job.status);
        return true;
    });

    return (
        <div className="fade-in" style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }}>
            {/* Navigation Bar */}
            <nav style={{ background: 'white', borderBottom: '1px solid var(--border)', padding: '1rem 3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-main)' }}>TriLink</div>
                    <div style={{ display: 'flex', gap: '2rem', fontSize: '0.95rem', fontWeight: '500' }}>
                        <a href="#" onClick={() => { const userId = localStorage.getItem('userId'); navigate(`/supplier/dashboard/${userId}`); }} style={{ color: 'var(--text-muted)', cursor: 'pointer', transition: 'color 0.2s' }}>Dashboard</a>
                        <a href="#" onClick={() => { const userId = localStorage.getItem('userId'); navigate(`/supplier/products/${userId}`); }} style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>Products</a>
                        <a href="#" onClick={() => { const userId = localStorage.getItem('userId'); navigate(`/supplier/orders/${userId}`); }} style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>Orders</a>
                        <a href="#" style={{ color: 'var(--text-main)', cursor: 'default', borderBottom: '2px solid var(--text-main)', paddingBottom: '0.25rem' }}>Logistics Jobs</a>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <Bell size={20} color="var(--text-muted)" />
                    <div
                        style={{ width: '32px', height: '32px', background: '#e2e8f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                        onClick={() => { const userId = localStorage.getItem('userId'); navigate(`/supplier/profile/${userId}`); }}
                    >
                        <User size={18} color="var(--text-muted)" />
                    </div>
                </div>
            </nav>

            <main className="container" style={{ padding: '3rem 1rem', maxWidth: '1400px', margin: '0 auto' }}>
                {/* Header with Back Button */}
                <div style={{ marginBottom: '2.5rem' }}>
                    <button
                        onClick={() => {
                            const userId = localStorage.getItem('userId');
                            navigate(`/supplier/logistics-job-creation/${userId}`);
                        }}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginBottom: '1rem', fontSize: '0.95rem' }}
                    >
                        <ArrowLeft size={18} /> Back to Create Job
                    </button>
                    <h1 style={{ fontSize: '2.25rem', fontWeight: '700', marginBottom: '0.5rem', color: '#1e293b' }}>My Logistics Jobs</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>View and manage all your created logistics jobs</p>
                </div>

                {/* Filter Tabs */}
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem' }}>
                    {['All', 'Active', 'Completed'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setFilter(tab)}
                            style={{
                                padding: '0.5rem 1.5rem',
                                background: filter === tab ? '#3b82f6' : 'transparent',
                                color: filter === tab ? 'white' : 'var(--text-muted)',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: '600',
                                fontSize: '0.95rem',
                                transition: 'all 0.2s'
                            }}
                        >
                            {tab} ({
                                tab === 'All' ? jobs.length :
                                    tab === 'Active' ? jobs.filter(j => ['Active', 'Assigned', 'Picked', 'In Transit'].includes(j.status)).length :
                                        jobs.filter(j => ['Completed', 'Delivered', 'Cancelled'].includes(j.status)).length
                            })
                        </button>
                    ))}
                </div>

                {/* Jobs Grid */}
                {loading ? (
                    <p>Loading jobs...</p>
                ) : filteredJobs.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '5rem 2rem', background: 'white', borderRadius: '16px', border: '2px dashed #cbd5e1', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                        <Truck size={64} color="#94a3b8" style={{ marginBottom: '1.5rem' }} />
                        <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.75rem', color: '#1e293b' }}>No Jobs Found</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', marginBottom: '2rem' }}>
                            {filter === 'All' ? 'You haven\'t created any logistics jobs yet.' : `No ${filter.toLowerCase()} jobs found.`}
                        </p>
                        <button
                            onClick={() => {
                                const userId = localStorage.getItem('userId');
                                navigate(`/supplier/logistics-job-creation/${userId}`);
                            }}
                            className="btn btn-primary"
                            style={{ padding: '0.75rem 2rem' }}
                        >
                            Create Your First Job
                        </button>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(500px, 1fr))', gap: '2rem' }}>
                        {filteredJobs.map(job => (
                            <div
                                key={job.id}
                                className="card"
                                style={{
                                    padding: '0',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    boxShadow: '0 4px 6px rgba(0,0,0,0.07)',
                                    transition: 'transform 0.2s, box-shadow 0.2s',
                                    borderLeft: `4px solid ${job.status === 'Active' ? '#22c55e' : '#94a3b8'}`,
                                    overflow: 'hidden'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-4px)';
                                    e.currentTarget.style.boxShadow = '0 8px 12px rgba(0,0,0,0.12)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.07)';
                                }}
                            >
                                {/* Header */}
                                <div style={{ padding: '1.5rem', background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)', borderBottom: '1px solid #e2e8f0' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                                        <div>
                                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Job ID</div>
                                            <div style={{ fontWeight: '700', fontSize: '1.15rem', color: '#1e293b', fontFamily: 'monospace' }}>#{job.id.substring(0, 12).toUpperCase()}</div>
                                        </div>
                                        <span style={{
                                            fontSize: '0.85rem',
                                            background: job.status === 'Active' ? '#dcfce7' : (job.status === 'Assigned' ? '#dbeafe' : '#f1f5f9'),
                                            color: job.status === 'Active' ? '#166534' : (job.status === 'Assigned' ? '#1e40af' : 'var(--text-muted)'),
                                            padding: '0.4rem 0.9rem',
                                            borderRadius: '20px',
                                            fontWeight: '600',
                                            display: 'flex', alignItems: 'center', gap: '0.5rem'
                                        }}>
                                            {job.status === 'Assigned' ?
                                                `Assigned to ${job.quotes.find(q => q.status === 'Accepted')?.logisticsProviderCompanyName || 'Provider'}`
                                                : job.status}
                                        </span>
                                    </div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                        Created: {new Date(job.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} at {new Date(job.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>

                                {/* Route Section */}
                                <div style={{ padding: '1.5rem', background: 'white' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'start', gap: '0.75rem' }}>
                                            <div style={{ width: '32px', height: '32px', background: '#dbeafe', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                <MapPin size={18} color="#3b82f6" />
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem', fontWeight: '600' }}>PICKUP LOCATION</div>
                                                <div style={{ fontWeight: '600', color: '#1e293b', marginBottom: '0.25rem' }}>{job.pickupAddressLine1}</div>
                                                {job.pickupAddressLine2 && <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{job.pickupAddressLine2}</div>}
                                                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{job.pickupCity}, {job.pickupState} - {job.pickupPincode}</div>
                                                {job.pickupLandmark && <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.25rem' }}>📍 {job.pickupLandmark}</div>}
                                            </div>
                                        </div>

                                        <div style={{ height: '2px', background: 'linear-gradient(90deg, #3b82f6 0%, #22c55e 100%)', marginLeft: '2.5rem' }}></div>

                                        <div style={{ display: 'flex', alignItems: 'start', gap: '0.75rem' }}>
                                            <div style={{ width: '32px', height: '32px', background: '#dcfce7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                <MapPin size={18} color="#22c55e" />
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem', fontWeight: '600' }}>DROP LOCATION</div>
                                                <div style={{ fontWeight: '600', color: '#1e293b', marginBottom: '0.25rem' }}>{job.dropAddressLine1}</div>
                                                {job.dropAddressLine2 && <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{job.dropAddressLine2}</div>}
                                                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{job.dropCity}, {job.dropState} - {job.dropPincode}</div>
                                                {job.dropLandmark && <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.25rem' }}>📍 {job.dropLandmark}</div>}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Details Grid */}
                                <div style={{ padding: '1.5rem', background: '#fafbfc', borderTop: '1px solid #e2e8f0' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                                        {/* Shipment Details */}
                                        <div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Shipment Info</div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                                <Package size={16} color="#6366f1" />
                                                <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>{job.palletCount} Pallet{job.palletCount > 1 ? 's' : ''}</span>
                                            </div>
                                            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                                Weight: <span style={{ fontWeight: '600', color: '#1e293b' }}>{job.totalWeight} kg</span>
                                            </div>
                                            {(job.length && job.width && job.height) && (
                                                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                                                    Dims: {job.length}×{job.width}×{job.height} cm
                                                </div>
                                            )}
                                        </div>

                                        {/* Expected Delivery */}
                                        <div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Expected Delivery</div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                                <Calendar size={16} color="#f59e0b" />
                                                <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>{new Date(job.deliveryExpectedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                            </div>
                                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                                By End of Day
                                            </div>
                                            <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.25rem' }}>
                                                Priority: <span style={{ fontWeight: '600', color: job.shipmentPriority === 'Express' ? '#ef4444' : '#1e293b' }}>{job.shipmentPriority}</span>
                                            </div>
                                        </div>

                                        {/* Material Type */}
                                        <div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Material</div>
                                            <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#1e293b' }}>{job.materialType}</div>
                                            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                                                {job.isFragile && (
                                                    <span style={{ fontSize: '0.75rem', background: '#fef3c7', color: '#92400e', padding: '0.25rem 0.5rem', borderRadius: '4px', fontWeight: '600' }}>Fragile</span>
                                                )}
                                                {job.isHighValue && (
                                                    <span style={{ fontSize: '0.75rem', background: '#fce7f3', color: '#831843', padding: '0.25rem 0.5rem', borderRadius: '4px', fontWeight: '600' }}>High Value</span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Contact */}
                                        <div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Sender</div>
                                            <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#1e293b' }}>{job.senderName}</div>
                                            {job.senderCompanyName && <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.15rem' }}>{job.senderCompanyName}</div>}
                                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{job.senderMobile}</div>
                                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{job.senderEmail}</div>
                                        </div>
                                    </div>

                                    {/* Additional Info */}
                                    {(job.ewayBillNumber || job.invoiceNumber || job.gstNumber) && (
                                        <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid #e2e8f0' }}>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Documentation</div>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.85rem' }}>
                                                {job.ewayBillNumber && (
                                                    <div>
                                                        <span style={{ color: 'var(--text-muted)' }}>E-Way Bill:</span>
                                                        <span style={{ fontWeight: '600', color: '#1e293b', marginLeft: '0.5rem' }}>{job.ewayBillNumber}</span>
                                                    </div>
                                                )}
                                                {job.invoiceNumber && (
                                                    <div>
                                                        <span style={{ color: 'var(--text-muted)' }}>Invoice:</span>
                                                        <span style={{ fontWeight: '600', color: '#1e293b', marginLeft: '0.5rem' }}>{job.invoiceNumber}</span>
                                                    </div>
                                                )}
                                                {job.gstNumber && (
                                                    <div style={{ gridColumn: '1 / -1' }}>
                                                        <span style={{ color: 'var(--text-muted)' }}>GST:</span>
                                                        <span style={{ fontWeight: '600', color: '#1e293b', marginLeft: '0.5rem' }}>{job.gstNumber}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                    {/* Quotes Received Section */}
                                    <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid #e2e8f0' }}>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Quotes Received ({job.quotes ? job.quotes.length : 0})</div>

                                        {job.quotes && job.quotes.length > 0 ? (
                                            <div style={{ overflowX: 'auto' }}>
                                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                                                    <thead>
                                                        <tr style={{ borderBottom: '1px solid #e2e8f0', textAlign: 'left', color: 'var(--text-muted)' }}>
                                                            <th style={{ padding: '0.5rem', fontWeight: '600' }}>Provider</th>
                                                            <th style={{ padding: '0.5rem', fontWeight: '600' }}>Amount</th>
                                                            <th style={{ padding: '0.5rem', fontWeight: '600' }}>Est. Delivery</th>
                                                            <th style={{ padding: '0.5rem', fontWeight: '600' }}>Status</th>
                                                            <th style={{ padding: '0.5rem', fontWeight: '600' }}>Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {job.quotes.map((quote, qIndex) => (
                                                            <tr key={quote.id || qIndex} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                                                <td style={{ padding: '0.75rem 0.5rem' }}>
                                                                    <div style={{ fontWeight: '600', color: '#1e293b' }}>{quote.logisticsProviderName}</div>
                                                                    {quote.logisticsProviderCompanyName && <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{quote.logisticsProviderCompanyName}</div>}
                                                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem', display: 'flex', flexDirection: 'column', gap: '0.1rem' }}>
                                                                        <span>{quote.logisticsProviderMobile}</span>
                                                                        <span>{quote.logisticsProviderEmail}</span>
                                                                    </div>
                                                                </td>
                                                                <td style={{ padding: '0.75rem 0.5rem', color: '#16a34a', fontWeight: '600', verticalAlign: 'top' }}>₹{quote.quoteAmount}</td>
                                                                <td style={{ padding: '0.75rem 0.5rem', color: '#64748b', verticalAlign: 'top' }}>{new Date(quote.estimatedDeliveryDate).toLocaleDateString()}</td>
                                                                <td style={{ padding: '0.75rem 0.5rem', verticalAlign: 'top' }}>
                                                                    <span style={{
                                                                        fontSize: '0.75rem', padding: '0.25rem 0.6rem', borderRadius: '12px', fontWeight: '500',
                                                                        background: quote.status === 'Accepted' ? '#dcfce7' : (quote.status === 'Rejected' ? '#fee2e2' : '#f1f5f9'),
                                                                        color: quote.status === 'Accepted' ? '#16a34a' : (quote.status === 'Rejected' ? '#991b1b' : '#64748b')
                                                                    }}>
                                                                        {quote.status}
                                                                    </span>
                                                                </td>
                                                                <td style={{ padding: '0.75rem 0.5rem', verticalAlign: 'top' }}>
                                                                    {quote.status === 'Pending' && job.status === 'Active' && (
                                                                        <button
                                                                            onClick={async () => {
                                                                                if (window.confirm(`Are you sure you want to accept this quote for ₹${quote.quoteAmount}?`)) {
                                                                                    try {
                                                                                        const token = localStorage.getItem('token');
                                                                                        const response = await fetch(`http://localhost:5081/api/BuyerLogisticsJob/quote/${quote.id}/accept`, {
                                                                                            method: 'POST',
                                                                                            headers: { 'Authorization': `Bearer ${token}` }
                                                                                        });
                                                                                        if (response.ok) {
                                                                                            fetchJobs(); // Refresh
                                                                                        } else {
                                                                                            const errorText = await response.text();
                                                                                            alert(`Failed to accept quote. Status: ${response.status}. Error: ${errorText}`);
                                                                                        }
                                                                                    } catch (err) {
                                                                                        console.error(err);
                                                                                    }
                                                                                }
                                                                            }}
                                                                            style={{
                                                                                background: '#3b82f6', color: 'white', border: 'none', padding: '0.3rem 0.8rem', borderRadius: '6px',
                                                                                fontSize: '0.8rem', cursor: 'pointer', fontWeight: '500'
                                                                            }}
                                                                        >
                                                                            Accept
                                                                        </button>
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        ) : (
                                            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                                                No quotes received yet.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default SupplierLogisticsJobManagement;
