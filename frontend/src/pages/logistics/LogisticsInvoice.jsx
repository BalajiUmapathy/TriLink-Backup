import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, User, Download, Printer, Share2, CheckCircle } from 'lucide-react';
import '../../index.css';

const LogisticsInvoice = () => {
    const navigate = useNavigate();
    const [sent, setSent] = useState(false);

    const handleSend = () => {
        setSent(true);
        const userId = localStorage.getItem('userId');
        setTimeout(() => navigate(`/logistics/dashboard/${userId}`), 2000);
    };

    return (
        <div className="fade-in" style={{ minHeight: '100vh', background: '#f8fafc' }}>
            {/* Header */}
            <header style={{ background: 'white', borderBottom: '1px solid var(--border)', padding: '1rem 3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-main)', cursor: 'pointer' }} onClick={() => { const userId = localStorage.getItem('userId'); navigate(`/logistics/dashboard/${userId}`); }}>TriLink</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <Bell size={20} color="var(--text-muted)" />
                    <div style={{ width: '32px', height: '32px', background: '#e2e8f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <User size={18} color="var(--text-muted)" />
                    </div>
                </div>
            </header>

            <main className="container" style={{ padding: '3rem 1rem', maxWidth: '900px' }}>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2rem', fontWeight: '600', marginBottom: '0.5rem' }}>Invoice Preview</h1>
                        <p style={{ color: 'var(--text-muted)' }}>INV-2025-001</p>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button className="btn btn-outline" style={{ padding: '0.6rem 1rem', fontSize: '0.9rem', display: 'flex', gap: '0.5rem' }}>
                            <Printer size={18} /> Print
                        </button>
                        <button className="btn btn-outline" style={{ padding: '0.6rem 1rem', fontSize: '0.9rem', display: 'flex', gap: '0.5rem' }}>
                            <Download size={18} /> Download
                        </button>
                        <button onClick={handleSend} className="btn btn-primary" style={{ padding: '0.6rem 1.5rem', fontSize: '0.9rem', display: 'flex', gap: '0.5rem' }}>
                            <Share2 size={18} /> {sent ? 'Sent!' : 'Send Invoice'}
                        </button>
                    </div>
                </div>

                <div className="card" style={{ padding: '3rem', background: 'white' }}>
                    {/* Invoice Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3rem', borderBottom: '1px solid var(--border)', paddingBottom: '2rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ width: '40px', height: '40px', background: 'var(--text-main)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '700', fontSize: '1.2rem' }}>T</div>
                            <div>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: '700', lineHeight: 1 }}>TriLink Logistics</h2>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>Global Supply Chain Solutions</p>
                            </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--text-muted)' }}>INVOICE</h3>
                            <div style={{ fontSize: '1.25rem', fontWeight: '600', marginTop: '0.5rem' }}>#INV-2025-001</div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>Date: Jan 20, 2025</div>
                        </div>
                    </div>

                    {/* Addresses */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', marginBottom: '3rem' }}>
                        <div>
                            <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.75rem', fontWeight: '600' }}>Bill To:</h4>
                            <p style={{ fontWeight: '600', fontSize: '1.1rem', marginBottom: '0.5rem' }}>Acme Manufacturing Ltd.</p>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                                123 Industrial Park, Zone A,<br />
                                Coimbatore, Tamil Nadu, 641001<br />
                                India
                            </p>
                        </div>
                        <div>
                            <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.75rem', fontWeight: '600' }}>Shipment Details:</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '0.5rem 1rem', fontSize: '0.95rem' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Job ID:</span> <span>JOB-2025-0342</span>
                                <span style={{ color: 'var(--text-muted)' }}>Route:</span> <span>Chennai → Delhi</span>
                                <span style={{ color: 'var(--text-muted)' }}>Distance:</span> <span>2122 km</span>
                                <span style={{ color: 'var(--text-muted)' }}>Weight:</span> <span>2.5 tons</span>
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div style={{ marginBottom: '2rem' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead style={{ background: '#f8fafc', color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '0.85rem' }}>
                                <tr>
                                    <th style={{ padding: '1rem', textAlign: 'left' }}>Description</th>
                                    <th style={{ padding: '1rem', textAlign: 'right' }}>Rate</th>
                                    <th style={{ padding: '1rem', textAlign: 'right' }}>Qty</th>
                                    <th style={{ padding: '1rem', textAlign: 'right' }}>Amount</th>
                                </tr>
                            </thead>
                            <tbody style={{ fontSize: '0.95rem' }}>
                                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                                    <td style={{ padding: '1.25rem 1rem' }}>
                                        <div style={{ fontWeight: '600' }}>Freight Charges</div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Standard Truck - Zone 1 to Zone 4</div>
                                    </td>
                                    <td style={{ padding: '1.25rem 1rem', textAlign: 'right' }}>₹45,000</td>
                                    <td style={{ padding: '1.25rem 1rem', textAlign: 'right' }}>1</td>
                                    <td style={{ padding: '1.25rem 1rem', textAlign: 'right', fontWeight: '600' }}>₹45,000</td>
                                </tr>
                                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                                    <td style={{ padding: '1.25rem 1rem' }}>
                                        <div style={{ fontWeight: '600' }}>Fuel Surcharge</div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Indexed rate</div>
                                    </td>
                                    <td style={{ padding: '1.25rem 1rem', textAlign: 'right' }}>₹5,432</td>
                                    <td style={{ padding: '1.25rem 1rem', textAlign: 'right' }}>1</td>
                                    <td style={{ padding: '1.25rem 1rem', textAlign: 'right', fontWeight: '600' }}>₹5,432</td>
                                </tr>
                                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                                    <td style={{ padding: '1.25rem 1rem' }}>
                                        <div style={{ fontWeight: '600' }}>Handling Fees</div>
                                    </td>
                                    <td style={{ padding: '1.25rem 1rem', textAlign: 'right' }}>₹1,500</td>
                                    <td style={{ padding: '1.25rem 1rem', textAlign: 'right' }}>2</td>
                                    <td style={{ padding: '1.25rem 1rem', textAlign: 'right', fontWeight: '600' }}>₹3,000</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Totals */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <div style={{ width: '300px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.95rem' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Subtotal</span>
                                <span>₹53,432</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.95rem' }}>
                                <span style={{ color: 'var(--text-muted)' }}>GST (18%)</span>
                                <span>₹9,617</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '2px solid var(--border)', fontSize: '1.25rem', fontWeight: '700' }}>
                                <span>Total</span>
                                <span>₹63,049</span>
                            </div>
                        </div>
                    </div>
                </div>

            </main>

            {sent && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 1000, animation: 'fadeIn 0.2s ease-out'
                }}>
                    <div className="card" style={{ padding: '3rem', textAlign: 'center', maxWidth: '400px' }}>
                        <div style={{ width: '64px', height: '64px', background: '#ecfdf5', borderRadius: '50%', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                            <CheckCircle size={32} />
                        </div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>Invoice Sent!</h2>
                        <p style={{ color: 'var(--text-muted)' }}>Redirecting to dashboard...</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LogisticsInvoice;
