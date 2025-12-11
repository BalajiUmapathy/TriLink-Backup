import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, User, Handshake, Package, Star, Search } from 'lucide-react';
import '../../index.css';

const BuyerDashboard = () => {
    const navigate = useNavigate();

    const stats = [
        { label: 'Ongoing Orders', value: '24', icon: <Handshake size={24} />, color: 'var(--text-main)' },
        { label: 'Completed Orders', value: '15', icon: <Package size={24} />, color: 'var(--text-main)' },
        // { label: 'Recommended Suppliers', value: '8', change: 'New', icon: <Star size={24} />, color: 'var(--text-main)' },
    ];

    const suppliers = [
        { id: 1, name: 'MetalWorks Co.', category: 'Steel & Aluminum', rating: 4.2 },
        { id: 2, name: 'Copper Solutions', category: 'Copper & Brass', rating: 4.8 },
        { id: 3, name: 'Plastics Inc.', category: 'Polymers & Resins', rating: 4.5 },
        { id: 4, name: 'Global Metals', category: 'Multi-Material', rating: 4.3 },
    ];

    const recentOrders = [
        { id: 'ORD-2025-001', supplier: 'Global Textiles Co.', product: 'Cotton Yarn', amount: '₹1,25,000', status: 'Pending', date: '2025-01-20' },
        { id: 'ORD-2025-002', supplier: 'MetalWorks Ltd.', product: 'Steel Sheets', amount: '₹4,50,000', status: 'Dispatched', date: '2025-01-18' },
        { id: 'ORD-2025-003', supplier: 'Alpha Chemicals', product: 'Industrial Solvents', amount: '₹85,000', status: 'Delivered', date: '2025-01-15' },
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return '#f59e0b';
            case 'Negotiation': return '#f97316';
            case 'Accepted': return '#3b82f6';
            case 'Dispatched': return '#06b6d4';
            case 'Delivered': return '#10b981';
            default: return '#64748b';
        }
    };

    return (
        <div className="fade-in" style={{ minHeight: '100vh', background: '#f8fafc' }}>
            {/* Navigation Bar */}
            <nav style={{ background: 'white', borderBottom: '1px solid var(--border)', padding: '1rem 3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-main)' }}>TriLink</div>
                    <div style={{ display: 'flex', gap: '2rem', fontSize: '0.95rem', fontWeight: '500' }}>
                        <a href="#" style={{ color: 'var(--text-main)' }}>Dashboard</a>
                        <a href="#" onClick={() => navigate('/buyer/search')} style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>Search Products</a>
                        <a href="#" style={{ color: 'var(--text-muted)' }}>My Offers</a>
                        <a href="#" onClick={() => navigate('/buyer/orders')} style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>Orders</a>
                        <a href="#" onClick={() => navigate('/buyer/logistics-jobs')} style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>Logistics Jobs</a>
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

            <main className="container" style={{ padding: '3rem 1rem', maxWidth: '1200px' }}>
                <div style={{ marginBottom: '3rem' }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: '600', marginBottom: '0.5rem' }}>Buyer Dashboard</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Welcome back! Here's your overview</p>
                </div>

                {/* Stats Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
                    {stats.map((stat, index) => (
                        <div key={index} className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '160px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{ width: '40px', height: '40px', background: '#f1f5f9', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {stat.icon}
                                </div>
                                <span style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: '500' }}>{stat.change}</span>
                            </div>
                            <div>
                                <div style={{ fontSize: '2rem', fontWeight: '700', lineHeight: '1' }}>{stat.value}</div>
                                <div style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>{stat.label}</div>
                            </div>
                        </div>
                    ))}
                </div>



                {/* Recent Orders */}
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: '600' }}>Recent Orders</h3>
                        <a href="#" style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>View All</a>
                    </div>
                    <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem' }}>
                            <thead style={{ background: '#f8fafc', color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                <tr>
                                    <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: '600' }}>Order ID</th>
                                    <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: '600' }}>Supplier</th>
                                    <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: '600' }}>Product</th>
                                    <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: '600' }}>Amount</th>
                                    <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: '600' }}>Status</th>
                                    <th style={{ padding: '1rem 1.5rem', textAlign: 'right', fontWeight: '600' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrders.map((order) => (
                                    <tr key={order.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                        <td style={{ padding: '1rem 1.5rem', fontWeight: '500' }}>{order.id}</td>
                                        <td style={{ padding: '1rem 1.5rem' }}>{order.supplier}</td>
                                        <td style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)' }}>{order.product}</td>
                                        <td style={{ padding: '1rem 1.5rem', fontWeight: '500' }}>{order.amount}</td>
                                        <td style={{ padding: '1rem 1.5rem' }}>
                                            <span style={{
                                                background: `${getStatusColor(order.status)}15`,
                                                color: getStatusColor(order.status),
                                                padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '500'
                                            }}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                                            <button style={{ background: 'white', border: '1px solid var(--border)', padding: '0.4rem 1rem', borderRadius: '6px', fontSize: '0.85rem', cursor: 'pointer' }}>View Details</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default BuyerDashboard;
