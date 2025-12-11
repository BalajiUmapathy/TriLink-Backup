import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, User, Package, Handshake, ShoppingBag, Plus, Check, X } from 'lucide-react';
import '../../index.css';

const SupplierDashboard = () => {
    const navigate = useNavigate();

    const [statsData, setStatsData] = React.useState({
        totalActiveProducts: 0,
        ongoingOrders: 0,
        completedOrders: 0
    });

    const [recentOffers, setRecentOffers] = React.useState([]);

    React.useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                // Fetch Stats
                const statsResponse = await fetch('/api/DashboardStats/supplier', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (statsResponse.ok) {
                    const data = await statsResponse.json();
                    setStatsData(data);
                }

                // Fetch Recent Offers (Negotiations)
                // Use the configured api wrapper if available, or fetch directly
                const negResponse = await fetch('http://localhost:5081/api/Negotiation', { // Using direct URL or relative if proxy is set
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (negResponse.ok) {
                    const negotiationsData = await negResponse.json();
                    // Filter for Pending offers
                    const pendingOffers = (negotiationsData || []).filter(n => n.status === 'Pending');
                    setRecentOffers(pendingOffers);
                }

            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            }
        };

        fetchDashboardData();
    }, []);

    const stats = [
        { label: 'Total Active Products', value: statsData.totalActiveProducts, icon: <Package size={24} />, color: 'var(--text-main)' },
        { label: 'Ongoing Products', value: statsData.ongoingOrders, icon: <Handshake size={24} />, color: 'var(--text-main)' },
        { label: 'Completed', value: statsData.completedOrders, icon: <ShoppingBag size={24} />, color: 'var(--text-main)' },
    ];

    return (
        <div className="fade-in" style={{ minHeight: '100vh', background: '#f8fafc' }}>
            {/* Navigation Bar */}
            <nav style={{ background: 'white', borderBottom: '1px solid var(--border)', padding: '1rem 3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-main)' }}>TriLink</div>
                    <div style={{ display: 'flex', gap: '2rem', fontSize: '0.95rem', fontWeight: '500' }}>
                        <a href="#" style={{ color: 'var(--text-main)' }}>Dashboard</a>
                        <a href="#" onClick={() => navigate('/supplier/products')} style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>Products</a>
                        <a href="#" onClick={() => navigate('/supplier/orders')} style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>Orders</a>
                        <a href="#" onClick={() => navigate('/supplier/logistics-job-creation')} style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>Logistics Jobs</a>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <Bell size={20} color="var(--text-muted)" />
                    <div
                        style={{ width: '32px', height: '32px', background: '#e2e8f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                        onClick={() => navigate('/supplier/profile')}
                    >
                        <User size={18} color="var(--text-muted)" />
                    </div>
                </div>
            </nav>

            <main className="container" style={{ padding: '3rem 1rem', maxWidth: '1200px' }}>
                <div style={{ marginBottom: '3rem' }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: '600', marginBottom: '0.5rem' }}>Supplier Dashboard</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Manage your products and track offers</p>
                </div>

                {/* Stats Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
                    {stats.map((stat, index) => (
                        <div key={index} className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '160px' }}>
                            <div style={{ width: '40px', height: '40px', background: '#f1f5f9', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                                {stat.icon}
                            </div>
                            <div>
                                <div style={{ fontSize: '2rem', fontWeight: '700', lineHeight: '1' }}>{stat.value}</div>
                                <div style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>{stat.label}</div>
                            </div>
                        </div>
                    ))}

                    {/* Add Product Card */}
                    <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <button
                            onClick={() => navigate('/supplier/add-product')}
                            style={{ background: 'black', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '500' }}
                        >
                            <Plus size={18} /> Add Product
                        </button>
                    </div>
                </div>

                {/* Recent Offers Section */}
                <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
                    <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: '600' }}>Recent Offers</h3>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem' }}>
                            <thead style={{ background: '#f8fafc', color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                <tr>
                                    <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: '600' }}>Buyer</th>
                                    <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: '600' }}>Product</th>
                                    <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: '600' }}>Offered Price</th>
                                    <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: '600' }}>Contact</th>
                                    <th style={{ padding: '1rem 1.5rem', textAlign: 'right', fontWeight: '600' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentOffers.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No pending offers</td>
                                    </tr>
                                ) : (
                                    recentOffers.map((offer) => (
                                        <tr key={offer.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                            <td style={{ padding: '1.25rem 1.5rem', fontWeight: '500' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                    <div style={{ width: '32px', height: '32px', background: '#f1f5f9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: '600' }}>
                                                        {offer.buyerName ? offer.buyerName.charAt(0).toUpperCase() : 'U'}
                                                    </div>
                                                    <div>
                                                        <div style={{ fontWeight: '500' }}>{offer.buyerName}</div>
                                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{offer.buyerCompanyName || 'Individual'}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ padding: '1.25rem 1.5rem' }}>{offer.productName}</td>
                                            <td style={{ padding: '1.25rem 1.5rem', fontWeight: '500' }}>₹{offer.currentOfferAmount}</td>
                                            <td style={{ padding: '1.25rem 1.5rem' }}>
                                                {offer.buyerEmail}<br />
                                                {offer.buyerContactNumber}
                                            </td>
                                            <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right' }}>
                                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                                                    <button
                                                        onClick={async () => {
                                                            try {
                                                                const token = localStorage.getItem('token');
                                                                const response = await fetch(`http://localhost:5081/api/Negotiation/${offer.id}/status`, {
                                                                    method: 'PUT',
                                                                    headers: {
                                                                        'Authorization': `Bearer ${token}`,
                                                                        'Content-Type': 'application/json'
                                                                    },
                                                                    body: JSON.stringify({ status: 'Accepted' })
                                                                });

                                                                if (response.ok) {
                                                                    // Update UI: Remove from list
                                                                    setRecentOffers(prev => prev.filter(o => o.id !== offer.id));
                                                                    // Navigate to Orders (optional, or just show success)
                                                                    navigate('/supplier/orders');
                                                                } else {
                                                                    console.error("Failed to accept offer");
                                                                    alert("Failed to accept offer. Please try again.");
                                                                }
                                                            } catch (err) {
                                                                console.error("Error accepting offer:", err);
                                                                alert("Error accepting offer.");
                                                            }
                                                        }}
                                                        style={{ background: 'black', color: 'white', padding: '0.4rem 1rem', borderRadius: '6px', fontSize: '0.85rem' }}
                                                    >
                                                        Accept
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default SupplierDashboard;
