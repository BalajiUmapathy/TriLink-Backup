import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, User, FileText, MapPin, Star, Clock } from 'lucide-react';
import '../../index.css';

const OfferSummary = () => {
    const navigate = useNavigate();

    return (
        <div className="fade-in" style={{ minHeight: '100vh', background: '#f8fafc' }}>
            {/* Navigation Bar */}
            <nav style={{ background: 'white', borderBottom: '1px solid var(--border)', padding: '1rem 3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-main)' }}>TriLink</div>
                    <div style={{ display: 'flex', gap: '2rem', fontSize: '0.95rem', fontWeight: '500' }}>
                        <a href="#" onClick={() => navigate('/buyer/dashboard')} style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>Dashboard</a>
                        <a href="#" onClick={() => navigate('/buyer/search')} style={{ color: 'var(--text-main)', cursor: 'pointer' }}>Search Products</a>
                        <a href="#" style={{ color: 'var(--text-muted)' }}>My Offers</a>
                        <a href="#" style={{ color: 'var(--text-muted)' }}>Orders</a>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <Bell size={20} color="var(--text-muted)" />
                    <div style={{ width: '32px', height: '32px', background: '#e2e8f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <User size={18} color="var(--text-muted)" />
                    </div>
                </div>
            </nav>

            <main className="container" style={{ padding: '3rem 1rem', maxWidth: '1000px' }}>
                <div style={{ marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: '600', marginBottom: '0.5rem' }}>Current Offer Summary</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Review the final agreed terms before generating invoice</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                    {/* Product Summary */}
                    <div className="card" style={{ padding: '1.5rem', display: 'flex', gap: '1.5rem' }}>
                        <div style={{ width: '100px', height: '100px', background: '#e2e8f0', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                            Product Image
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.25rem' }}>Premium Cotton T-Shirts</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>SKU: TCT-2025-001</p>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <span style={{ background: '#f1f5f9', padding: '0.25rem 0.75rem', borderRadius: '4px', fontSize: '0.85rem' }}>Category: Apparel</span>
                                <span style={{ background: '#f1f5f9', padding: '0.25rem 0.75rem', borderRadius: '4px', fontSize: '0.85rem' }}>Size: M, L, XL</span>
                            </div>
                        </div>
                    </div>

                    {/* Pricing Details */}
                    <div className="card" style={{ padding: '2rem' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>Pricing Details</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.95rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Unit Price</span>
                                <span style={{ fontWeight: '500' }}>₹12.00</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Quantity</span>
                                <span style={{ fontWeight: '500' }}>5,000 units</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '1px dashed var(--border)' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Subtotal</span>
                                <span style={{ fontWeight: '500' }}>₹60,000.00</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Shipping (Est.)</span>
                                <span style={{ fontWeight: '500' }}>₹2,500.00</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '1px solid var(--border)', fontSize: '1.1rem', fontWeight: '700' }}>
                                <span>Total</span>
                                <span>₹62,500.00</span>
                            </div>
                        </div>
                    </div>

                    {/* Delivery Terms */}
                    <div className="card" style={{ padding: '2rem' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>Delivery Terms</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', fontSize: '0.95rem' }}>
                            <div>
                                <div style={{ color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Lead Time</div>
                                <div style={{ fontWeight: '500' }}>14 days</div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Estimated Delivery</div>
                                <div style={{ fontWeight: '500' }}>Jan 29, 2025</div>
                            </div>
                            <div>
                                <div style={{ color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Shipping Method</div>
                                <div style={{ fontWeight: '500' }}>Express Freight</div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Incoterms</div>
                                <div style={{ fontWeight: '500' }}>FOB</div>
                            </div>
                        </div>
                    </div>

                    {/* Supplier Info */}
                    <div className="card" style={{ padding: '2rem' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>Supplier Information</h3>
                        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                            <div style={{ width: '48px', height: '48px', background: '#f1f5f9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <User size={24} />
                            </div>
                            <div>
                                <h4 style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Global Textiles Co.</h4>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Verified Supplier</p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MapPin size={16} /> Delhi, India</div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Star size={16} /> 4.8 Rating (234 reviews)</div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Clock size={16} /> Response time: &lt;2 hours</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button
                        className="btn btn-primary"
                        style={{ padding: '1rem', fontSize: '1rem', marginTop: '1rem' }}
                        onClick={() => navigate('/buyer/invoice-preview')}
                    >
                        Generate Invoice
                    </button>

                </div>
            </main>
        </div>
    );
};

export default OfferSummary;

