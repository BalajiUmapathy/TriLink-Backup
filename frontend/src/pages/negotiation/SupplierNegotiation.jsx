import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, User, Send, Check, Clock, DollarSign, Package } from 'lucide-react';
import '../../index.css';

const SupplierNegotiation = () => {
    const navigate = useNavigate();
    const [messages, setMessages] = useState([
        { id: 1, sender: 'supplier', text: 'Initial offer for 100 tons at ₹45,000 per ton. Delivery in 3 weeks.', time: '2025-01-15, 09:23', details: { qty: '100 tons', price: '₹45,000', lead: '21 days' } },
        { id: 2, sender: 'buyer', text: 'Can you do 100 tons at ₹43,500? Also need delivery in 2 weeks if possible.', time: '2025-01-15, 10:15', details: { qty: '100 tons', price: '₹43,500', lead: '14 days' } },
    ]);

    const [offerDetails, setOfferDetails] = useState({
        quantity: '100 tons',
        price: '43,500',
        leadTime: '14'
    });

    return (
        <div className="fade-in" style={{ minHeight: '100vh', background: '#f8fafc' }}>
            {/* Navigation Bar */}
            <nav style={{ background: 'white', borderBottom: '1px solid var(--border)', padding: '1rem 3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-main)' }}>TriLink</div>
                    <div style={{ display: 'flex', gap: '2rem', fontSize: '0.95rem', fontWeight: '500' }}>
                        <a href="#" onClick={() => navigate('/supplier/dashboard')} style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>Dashboard</a>
                        <a href="#" onClick={() => navigate('/supplier/products')} style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>Products</a>
                        <a href="#" onClick={() => navigate('/supplier/orders')} style={{ color: 'var(--text-main)', cursor: 'pointer' }}>Orders</a>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <Bell size={20} color="var(--text-muted)" />
                    <div style={{ width: '32px', height: '32px', background: '#e2e8f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <User size={18} color="var(--text-muted)" />
                    </div>
                </div>
            </nav>

            <main className="container" style={{ padding: '3rem 1rem', maxWidth: '1000px', margin: '0 auto' }}>
                <div style={{ marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: '600', marginBottom: '0.5rem' }}>Negotiation Thread</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Buyer: Skyline Infra | Product: TMT Bars 16mm</p>
                </div>

                <div className="card" style={{ padding: '2rem', minHeight: '600px', display: 'flex', flexDirection: 'column' }}>

                    {/* Chat History */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2rem', marginBottom: '3rem' }}>
                        {messages.map((msg) => (
                            <div key={msg.id} style={{ display: 'flex', gap: '1rem', flexDirection: msg.sender === 'supplier' ? 'row-reverse' : 'row' }}>
                                <div style={{ width: '40px', height: '40px', background: msg.sender === 'supplier' ? 'black' : '#f1f5f9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <User size={20} color={msg.sender === 'supplier' ? 'white' : 'black'} />
                                </div>
                                <div style={{ maxWidth: '70%' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                        <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>{msg.sender === 'supplier' ? 'You' : 'Skyline Infra'}</span>
                                        <span>{msg.time}</span>
                                    </div>
                                    <div style={{
                                        background: msg.sender === 'supplier' ? '#1e293b' : '#f8fafc',
                                        color: msg.sender === 'supplier' ? 'white' : 'var(--text-main)',
                                        padding: '1.5rem', borderRadius: '12px', border: msg.sender === 'supplier' ? 'none' : '1px solid var(--border)'
                                    }}>
                                        <p style={{ marginBottom: '1rem', lineHeight: '1.5' }}>{msg.text}</p>
                                        {msg.details && (
                                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                                <span style={{ background: msg.sender === 'supplier' ? 'rgba(255,255,255,0.1)' : '#e2e8f0', padding: '0.25rem 0.75rem', borderRadius: '4px', fontSize: '0.8rem' }}>Qty: {msg.details.qty}</span>
                                                <span style={{ background: msg.sender === 'supplier' ? 'rgba(255,255,255,0.1)' : '#e2e8f0', padding: '0.25rem 0.75rem', borderRadius: '4px', fontSize: '0.8rem' }}>Price: {msg.details.price}</span>
                                                <span style={{ background: msg.sender === 'supplier' ? 'rgba(255,255,255,0.1)' : '#e2e8f0', padding: '0.25rem 0.75rem', borderRadius: '4px', fontSize: '0.8rem' }}>Lead Time: {msg.details.lead}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Offer Input Area */}
                    <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', marginBottom: '0.5rem' }}>Quantity</label>
                                <div style={{ position: 'relative' }}>
                                    <Package size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                    <input type="text" value={offerDetails.quantity} onChange={(e) => setOfferDetails({ ...offerDetails, quantity: e.target.value })} style={{ width: '100%', padding: '0.6rem 1rem 0.6rem 2.5rem', borderRadius: '6px', border: '1px solid var(--border)' }} />
                                </div>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', marginBottom: '0.5rem' }}>Price/Unit (₹)</label>
                                <div style={{ position: 'relative' }}>
                                    <DollarSign size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                    <input type="text" value={offerDetails.price} onChange={(e) => setOfferDetails({ ...offerDetails, price: e.target.value })} style={{ width: '100%', padding: '0.6rem 1rem 0.6rem 2.5rem', borderRadius: '6px', border: '1px solid var(--border)' }} />
                                </div>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', marginBottom: '0.5rem' }}>Lead Time (days)</label>
                                <div style={{ position: 'relative' }}>
                                    <Clock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                    <input type="text" value={offerDetails.leadTime} onChange={(e) => setOfferDetails({ ...offerDetails, leadTime: e.target.value })} style={{ width: '100%', padding: '0.6rem 1rem 0.6rem 2.5rem', borderRadius: '6px', border: '1px solid var(--border)' }} />
                                </div>
                            </div>
                        </div>

                        <textarea
                            placeholder="Add your message..."
                            rows="2"
                            style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border)', marginBottom: '1.5rem', resize: 'none' }}
                        ></textarea>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Send size={18} /> Send Counter Offer
                            </button>
                            <button
                                onClick={() => {
                                    navigate('/negotiation/offer-summary');
                                }}
                                className="btn btn-outline"
                                style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'white' }}
                            >
                                <Check size={18} /> Accept Offer
                            </button>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default SupplierNegotiation;
