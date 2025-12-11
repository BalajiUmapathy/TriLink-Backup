import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Bell, User, Search, ChevronDown, MapPin, Package, Calendar, Clock } from 'lucide-react';
import '../../index.css';

const AvailableJobs = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('All');
    // Initialize status from location state if available, otherwise default to 'All'
    const [selectedStatus, setSelectedStatus] = useState(location.state?.filter || 'All'); // New Filter State

    // Modal State
    const [showQuoteModal, setShowQuoteModal] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
    const [quoteForm, setQuoteForm] = useState({ amount: '', date: '' });
    const [submittedQuotes, setSubmittedQuotes] = useState({}); // Track submitted quotes by Job ID

    // Load quotes from LocalStorage on mount
    React.useEffect(() => {
        const storedQuotes = JSON.parse(localStorage.getItem('submittedQuotes') || '{}');
        setSubmittedQuotes(storedQuotes);
    }, []);

    // Updated Mock Data with Detailed Fields as requested
    const jobs = [
        {
            id: 'JOB-2025-001',
            orderId: 'ORD-98765',
            pickupAddressLine1: '123, Industrial Area',
            pickupAddressLine2: 'Phase 2, Guindy',
            pickupCity: 'Chennai',
            pickupState: 'Tamil Nadu',
            pickupPincode: '600032',
            pickupCountry: 'India',
            dropAddressLine1: '456, GIDC Estate',
            dropAddressLine2: 'Near Highway',
            dropCity: 'Ahmedabad',
            dropState: 'Gujarat',
            dropPincode: '380015',
            dropCountry: 'India',
            estimatedWeightKg: 2500,
            status: 'Pending',
            eta: 'Jan 25, 2025'
        },
        {
            id: 'JOB-2025-002',
            orderId: 'ORD-98766',
            pickupAddressLine1: '78, Electronic City',
            pickupAddressLine2: 'Hosur Road',
            pickupCity: 'Bangalore',
            pickupState: 'Karnataka',
            pickupPincode: '560100',
            pickupCountry: 'India',
            dropAddressLine1: '890, Technopark',
            dropAddressLine2: 'Kazhakoottam',
            dropCity: 'Thiruvananthapuram',
            dropState: 'Kerala',
            dropPincode: '695581',
            dropCountry: 'India',
            estimatedWeightKg: 1800,
            status: 'Pending',
            eta: 'Jan 28, 2025'
        },
        {
            id: 'JOB-2025-003',
            orderId: 'ORD-98767',
            pickupAddressLine1: 'Plot 22, Sector 5',
            pickupAddressLine2: 'Salt Lake',
            pickupCity: 'Kolkata',
            pickupState: 'West Bengal',
            pickupPincode: '700091',
            pickupCountry: 'India',
            dropAddressLine1: '12, Okhla Ind. Estate',
            dropAddressLine2: 'Phase 3',
            dropCity: 'New Delhi',
            dropState: 'Delhi',
            dropPincode: '110020',
            dropCountry: 'India',
            estimatedWeightKg: 5000,
            status: 'Urgent',
            eta: 'Jan 22, 2025'
        }
    ];

    // Filtering Logic
    const filteredJobs = jobs.filter(job => {
        const matchesSearch =
            job.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.pickupCity.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.dropCity.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesLocation = selectedLocation === 'All' ||
            job.pickupCity === selectedLocation ||
            job.dropCity === selectedLocation;

        const isQuoted = submittedQuotes[job.id] !== undefined;
        const matchesStatus = selectedStatus === 'All' ||
            (selectedStatus === 'Quoted' && isQuoted) ||
            (selectedStatus === 'Not Quoted' && !isQuoted);

        return matchesSearch && matchesLocation && matchesStatus;
    });

    // Unique Locations for Dropdown
    const locations = ['All', ...new Set([...jobs.map(j => j.pickupCity), ...jobs.map(j => j.dropCity)])];

    const openQuoteModal = (job) => {
        setSelectedJob(job);
        setQuoteForm({ amount: '', date: '' });
        setShowQuoteModal(true);
    };

    const handleQuoteSubmit = (e) => {
        e.preventDefault();
        // Here you would typically send the data to the backend
        console.log("Submitting Quote for", selectedJob.id, quoteForm);

        const newQuotes = {
            ...submittedQuotes,
            [selectedJob.id]: {
                amount: quoteForm.amount,
                date: quoteForm.date,
                timestamp: new Date().toISOString()
            }
        };

        setSubmittedQuotes(newQuotes);
        localStorage.setItem('submittedQuotes', JSON.stringify(newQuotes));

        setShowQuoteModal(false);
        alert(`Quote submitted for ${selectedJob.id} successfully!`);
    };

    return (
        <div className="fade-in" style={{ minHeight: '100vh', background: '#f8fafc' }}>
            {/* Header */}
            <header style={{ background: 'white', borderBottom: '1px solid var(--border)', padding: '1rem 3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-main)', cursor: 'pointer' }} onClick={() => navigate('/logistics/dashboard')}>TriLink</div>
                    <div style={{ display: 'flex', gap: '2rem', fontSize: '0.95rem', fontWeight: '500' }}>
                        <a href="#" onClick={() => navigate('/logistics/dashboard')} style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>Dashboard</a>
                        <span onClick={() => navigate('/logistics/available-jobs')} style={{ color: 'var(--text-main)', cursor: 'pointer' }}>Search Jobs</span>
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
                <div style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: '600', color: 'var(--text-main)' }}>Available Jobs</h1>

                    <div style={{ display: 'flex', gap: '1rem', background: 'white', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border)', alignItems: 'center' }}>
                        <div style={{ position: 'relative', flex: 1 }}>
                            <Search size={20} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                            <input
                                type="text"
                                placeholder="Search by Order ID, Job ID, or City..."
                                className="input-field"
                                style={{ paddingLeft: '3rem', width: '100%', height: '48px', fontSize: '1rem' }}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div style={{ position: 'relative', width: '200px' }}>
                            <MapPin size={20} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', zIndex: 1 }} />
                            <select
                                className="input-field"
                                style={{ paddingLeft: '3rem', width: '100%', height: '48px', appearance: 'none', cursor: 'pointer' }}
                                value={selectedLocation}
                                onChange={(e) => setSelectedLocation(e.target.value)}
                            >
                                {locations.map(loc => <option key={loc} value={loc}>{loc === 'All' ? 'All Locations' : loc}</option>)}
                            </select>
                            <ChevronDown size={16} color="var(--text-muted)" style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                        </div>
                        <div style={{ position: 'relative', width: '180px' }}>
                            <select
                                className="input-field"
                                style={{ paddingLeft: '1rem', width: '100%', height: '48px', appearance: 'none', cursor: 'pointer' }}
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                            >
                                <option value="All">All Jobs</option>
                                <option value="Quoted">Quoted</option>
                                <option value="Not Quoted">Not Quoted</option>
                            </select>
                            <ChevronDown size={16} color="var(--text-muted)" style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                        </div>
                    </div>
                </div>

                <div style={{ display: 'grid', gap: '1.5rem' }}>
                    {filteredJobs.length > 0 ? filteredJobs.map((job, index) => {
                        const quote = submittedQuotes[job.id];

                        return (
                            <div key={index} className="card" style={{ padding: '1.5rem' }}>
                                {/* Top Row: IDs and Status */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
                                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                                        <div style={{ fontWeight: '600', color: 'var(--text-main)', fontSize: '1.1rem' }}>
                                            Job ID: {job.id}
                                        </div>
                                        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', background: '#f1f5f9', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>
                                            Order ID: {job.orderId}
                                        </div>
                                        {quote && (
                                            <div style={{
                                                display: 'flex', alignItems: 'center', gap: '0.5rem',
                                                background: '#f0fdf4', color: '#16a34a', padding: '0.2rem 0.8rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '600', border: '1px solid #bbf7d0'
                                            }}>
                                                <span>Quoted: ₹{quote.amount}</span>
                                            </div>
                                        )}
                                    </div>
                                    <span style={{
                                        fontSize: '0.8rem', padding: '0.3rem 0.8rem', borderRadius: '20px', fontWeight: '500',
                                        background: job.status === 'Urgent' ? '#fef2f2' : '#ecfdf5',
                                        color: job.status === 'Urgent' ? '#ef4444' : '#059669'
                                    }}>
                                        {job.status}
                                    </span>
                                </div>

                                {/* Middle Row: Details Grid */}
                                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(250px, 1fr) minmax(250px, 1fr) 1fr', gap: '2rem', marginBottom: '1.5rem' }}>

                                    {/* Pickup Details */}
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: '#2563eb', fontWeight: '600' }}>
                                            <div style={{ width: '8px', height: '8px', background: '#2563eb', borderRadius: '50%' }}></div>
                                            PICKUP
                                        </div>
                                        <div style={{ fontSize: '0.95rem', lineHeight: '1.5', color: 'var(--text-main)' }}>
                                            <div style={{ fontWeight: '500' }}>{job.pickupAddressLine1}</div>
                                            <div>{job.pickupAddressLine2}</div>
                                            <div>{job.pickupCity}, {job.pickupState} - {job.pickupPincode}</div>
                                            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{job.pickupCountry}</div>
                                        </div>
                                    </div>

                                    {/* Drop Details */}
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: '#16a34a', fontWeight: '600' }}>
                                            <div style={{ width: '8px', height: '8px', background: '#16a34a', borderRadius: '50%' }}></div>
                                            DROP
                                        </div>
                                        <div style={{ fontSize: '0.95rem', lineHeight: '1.5', color: 'var(--text-main)' }}>
                                            <div style={{ fontWeight: '500' }}>{job.dropAddressLine1}</div>
                                            <div>{job.dropAddressLine2}</div>
                                            <div>{job.dropCity}, {job.dropState} - {job.dropPincode}</div>
                                            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{job.dropCountry}</div>
                                        </div>
                                    </div>

                                    {/* Load & Time */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <div style={{ width: '36px', height: '36px', background: '#f8fafc', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <Package size={18} color="var(--text-muted)" />
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Est. Weight</div>
                                                <div style={{ fontWeight: '600' }}>{job.estimatedWeightKg} kg</div>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <div style={{ width: '36px', height: '36px', background: '#f8fafc', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <Calendar size={18} color="var(--text-muted)" />
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ETA by</div>
                                                <div style={{ fontWeight: '600' }}>{job.eta}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Button */}
                                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1rem' }}>
                                    {quote ? (
                                        <>
                                            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                                Quoted delivery by: <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>{quote.date}</span>
                                            </div>
                                            <button
                                                disabled
                                                className="btn"
                                                style={{ padding: '0.6rem 2rem', background: '#e2e8f0', color: 'var(--text-muted)', cursor: 'not-allowed' }}
                                            >
                                                Quote Submitted
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={() => openQuoteModal(job)}
                                            className="btn btn-primary"
                                            style={{ padding: '0.6rem 2rem' }}
                                        >
                                            Add Quote
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    }) : (
                        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                            <p>No jobs found matching your criteria.</p>
                        </div>
                    )}
                </div>
            </main>

            {/* Add Quote Modal */}
            {showQuoteModal && selectedJob && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} className="fade-in">
                    <div className="card" style={{ width: '500px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Submit Quote for {selectedJob.id}</h2>
                            <button onClick={() => setShowQuoteModal(false)} className="btn btn-outline" style={{ border: 'none', padding: '0.5rem' }}>X</button>
                        </div>

                        <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px' }}>
                            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Route</div>
                            <div style={{ fontWeight: '500' }}>{selectedJob.pickupCity} <span style={{ color: 'var(--text-muted)' }}>→</span> {selectedJob.dropCity}</div>
                            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Est. Weight: {selectedJob.estimatedWeightKg} kg</div>
                        </div>

                        <form onSubmit={handleQuoteSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div className="input-group">
                                <label className="input-label">Quote Amount (₹)</label>
                                <input
                                    type="number"
                                    required
                                    className="input-field"
                                    placeholder="Enter your quote amount"
                                    value={quoteForm.amount}
                                    onChange={(e) => setQuoteForm({ ...quoteForm, amount: e.target.value })}
                                />
                            </div>
                            <div className="input-group">
                                <label className="input-label">Estimated Delivery Date</label>
                                <input
                                    type="date"
                                    required
                                    className="input-field"
                                    value={quoteForm.date}
                                    onChange={(e) => setQuoteForm({ ...quoteForm, date: e.target.value })}
                                />
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                                <button type="button" onClick={() => setShowQuoteModal(false)} className="btn btn-outline">Cancel</button>
                                <button type="submit" className="btn btn-primary">Submit Quote</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AvailableJobs;
