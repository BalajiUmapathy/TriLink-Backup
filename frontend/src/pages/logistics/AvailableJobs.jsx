import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Bell, User, Search, ChevronDown, MapPin, Package, Calendar, Clock } from 'lucide-react';
import '../../index.css';

const AvailableJobs = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('All');
    const [selectedStatus, setSelectedStatus] = useState(location.state?.filter || 'All');
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(false);

    // Modal State
    const [showQuoteModal, setShowQuoteModal] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
    const [quoteForm, setQuoteForm] = useState({ amount: '', date: '', time: '' });
    const [submittedQuotes, setSubmittedQuotes] = useState({});

    // Fetch jobs and my quotes from API
    React.useEffect(() => {
        fetchJobs();
        fetchMyQuotes();
    }, []);

    const fetchMyQuotes = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5081/api/BuyerLogisticsJob/my-quotes', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const quotes = await response.json();
                const quotesMap = {};
                quotes.forEach(q => {
                    quotesMap[`JOB-${q.jobId.substring(0, 8).toUpperCase()}`] = {
                        amount: q.quoteAmount,
                        date: new Date(q.createdAt).toLocaleDateString(), // Or quoted delivery date if available
                        timestamp: q.createdAt
                    };
                    // Also Key by full ID if needed, but ID mapping in fetchJobs uses formatted ID
                    // Wait, fetchJobs maps ID to formatted ID.
                    // But API returns Full GUID.
                    // Let's check fetchJobs mapping: id: `JOB-...`
                    // So I should map API JobId to this format? Or use FullId in map key?
                    // In UI: const quote = submittedQuotes[job.id];
                    // job.id is formatted.
                    // So I must format keys in quotesMap OR use job.fullId in lookup.
                    // The lookup uses job.id (formatted). So I will format the key here.
                    quotesMap[`JOB-${q.jobId.substring(0, 8).toUpperCase()}`] = {
                        amount: q.quoteAmount,
                        date: new Date(q.estimatedDeliveryDate).toLocaleDateString(),
                        timestamp: q.createdAt
                    };
                });
                setSubmittedQuotes(quotesMap);
            }
        } catch (error) {
            console.error("Failed to fetch my quotes", error);
        }
    };

    const fetchJobs = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:5081/api/BuyerLogisticsJob/available');
            if (response.ok) {
                const data = await response.json();
                // Transform data to match expected format
                const transformedJobs = data.map(job => ({
                    id: `JOB-${job.id.substring(0, 8).toUpperCase()}`,
                    fullId: job.id, // Keep full ID for API calls
                    orderId: 'N/A',
                    pickupAddressLine1: job.pickupAddressLine1,
                    pickupAddressLine2: job.pickupAddressLine2,
                    pickupLandmark: job.pickupLandmark,
                    pickupCity: job.pickupCity,
                    pickupState: job.pickupState,
                    pickupPincode: job.pickupPincode,
                    pickupCountry: 'India',
                    dropAddressLine1: job.dropAddressLine1,
                    dropAddressLine2: job.dropAddressLine2,
                    dropLandmark: job.dropLandmark,
                    dropCity: job.dropCity,
                    dropState: job.dropState,
                    dropPincode: job.dropPincode,
                    dropCountry: 'India',
                    estimatedWeightKg: job.totalWeight,
                    palletCount: job.palletCount,
                    materialType: job.materialType,
                    isFragile: job.isFragile,
                    isHighValue: job.isHighValue,
                    pickupDate: job.pickupDate,
                    pickupTimeSlot: job.pickupTimeSlot,
                    deliveryExpectedDate: job.deliveryExpectedDate,
                    shipmentPriority: job.shipmentPriority,
                    senderName: job.senderName,
                    senderCompanyName: job.senderCompanyName,
                    senderMobile: job.senderMobile,
                    senderEmail: job.senderEmail,
                    status: job.status === 'Active' ? 'Pending' : job.status,
                    eta: new Date(job.deliveryExpectedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                }));
                setJobs(transformedJobs);
            }
        } catch (error) {
            console.error("Failed to fetch jobs", error);
        } finally {
            setLoading(false);
        }
    };


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
        setQuoteForm({ amount: '', date: '', time: '' });
        setShowQuoteModal(true);
    };

    const handleQuoteSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('token');

            // Combine date and time into ISO datetime string
            let estimatedDeliveryDateTime = quoteForm.date;
            if (quoteForm.time) {
                estimatedDeliveryDateTime = `${quoteForm.date}T${quoteForm.time}:00`;
            }

            const response = await fetch('http://localhost:5081/api/BuyerLogisticsJob/quote', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    JobId: selectedJob.fullId,
                    QuoteAmount: parseFloat(quoteForm.amount),
                    EstimatedDeliveryDate: estimatedDeliveryDateTime
                })
            });

            if (response.ok) {
                const newQuote = await response.json();

                // Update local state immediately
                setSubmittedQuotes(prev => ({
                    ...prev,
                    [selectedJob.id]: {
                        amount: newQuote.quoteAmount,
                        date: new Date(newQuote.estimatedDeliveryDate).toLocaleDateString(),
                        timestamp: newQuote.createdAt
                    }
                }));

                setShowQuoteModal(false);
                // Optionally show success message (toast)
                alert(`Quote submitted for ${selectedJob.id} successfully!`);
            } else {
                console.error("Failed to submit quote");
                alert("Failed to submit quote. Please try again.");
            }
        } catch (error) {
            console.error("Error submitting quote", error);
            alert("Error submitting quote. Check console.");
        }
    };

    return (
        <div className="fade-in" style={{ minHeight: '100vh', background: '#f8fafc' }}>
            {/* Header */}
            <header style={{ background: 'white', borderBottom: '1px solid var(--border)', padding: '1rem 3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-main)', cursor: 'pointer' }} onClick={() => { const userId = localStorage.getItem('userId'); navigate(`/logistics/dashboard/${userId}`); }}>TriLink</div>
                    <div style={{ display: 'flex', gap: '2rem', fontSize: '0.95rem', fontWeight: '500' }}>
                        <span onClick={() => { const userId = localStorage.getItem('userId'); navigate(`/logistics/dashboard/${userId}`); }} style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>Dashboard</span>
                        <span onClick={() => { const userId = localStorage.getItem('userId'); navigate(`/logistics/available-jobs/${userId}`); }} style={{ color: 'var(--text-main)', cursor: 'pointer' }}>Search Jobs</span>
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

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                        <p>Loading available jobs...</p>
                    </div>
                ) : (
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
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>

                                        {/* Route Section */}
                                        <div style={{ padding: '1.5rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
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
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', padding: '0 0.5rem' }}>
                                            {/* Shipment Info */}
                                            <div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Shipment Info</div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                                    <Package size={16} color="#6366f1" />
                                                    <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>{job.palletCount || 1} Pallet{job.palletCount > 1 ? 's' : ''}</span>
                                                </div>
                                                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                                    Weight: <span style={{ fontWeight: '600', color: '#1e293b' }}>{job.estimatedWeightKg} kg</span>
                                                </div>
                                            </div>

                                            {/* Expected Delivery */}
                                            <div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Expected Delivery</div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                                    <Calendar size={16} color="#f59e0b" />
                                                    <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>{job.eta}</span>
                                                </div>
                                                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                                    By End of Day
                                                </div>
                                                <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.25rem' }}>
                                                    Priority: <span style={{ fontWeight: '600', color: job.shipmentPriority === 'Express' ? '#ef4444' : '#1e293b' }}>{job.shipmentPriority}</span>
                                                </div>
                                            </div>

                                            {/* Material */}
                                            <div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Material</div>
                                                <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#1e293b' }}>{job.materialType || 'General'}</div>
                                                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                                                    {job.isFragile && (
                                                        <span style={{ fontSize: '0.75rem', background: '#fef3c7', color: '#92400e', padding: '0.25rem 0.5rem', borderRadius: '4px', fontWeight: '600' }}>Fragile</span>
                                                    )}
                                                    {job.isHighValue && (
                                                        <span style={{ fontSize: '0.75rem', background: '#fce7f3', color: '#831843', padding: '0.25rem 0.5rem', borderRadius: '4px', fontWeight: '600' }}>High Value</span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Sender Contact */}
                                            <div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Sender</div>
                                                <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#1e293b' }}>{job.senderName}</div>
                                                {job.senderCompanyName && <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.15rem' }}>{job.senderCompanyName}</div>}
                                                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{job.senderMobile}</div>
                                                {job.senderEmail && <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{job.senderEmail}</div>}
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
                )}
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
                            <div className="input-group">
                                <label className="input-label">Estimated Delivery Time</label>
                                <input
                                    type="time"
                                    required
                                    className="input-field"
                                    value={quoteForm.time}
                                    onChange={(e) => setQuoteForm({ ...quoteForm, time: e.target.value })}
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
