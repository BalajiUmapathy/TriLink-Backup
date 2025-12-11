import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, User, ArrowLeft, Printer, Download } from 'lucide-react';
import '../../index.css';

const InvoicePreview = () => {
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
                    <h1 style={{ fontSize: '1.75rem', fontWeight: '600', marginBottom: '0.5rem' }}>Invoice PDF Preview Viewer</h1>
                    <p style={{ color: 'var(--text-muted)' }}>View generated invoice documents</p>
                </div>

                {/* Toolbar */}
                <div style={{ background: 'white', padding: '1rem 1.5rem', borderRadius: '8px 8px 0 0', border: '1px solid var(--border)', borderBottom: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontWeight: '500' }}>
                        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem' }}>
                            <ArrowLeft size={20} />
                        </button>
                        INV-2025-001.pdf
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button className="btn btn-outline" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                            <Printer size={16} /> Print
                        </button>
                        <button className="btn btn-primary" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                            <Download size={16} /> Download
                        </button>
                    </div>
                </div>

                {/* Invoice Container */}
                <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '0 0 8px 8px', padding: '4rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>

                    {/* Header Section */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4rem' }}>
                        <div>
                            <div style={{ width: '120px', height: '60px', background: '#e2e8f0', borderRadius: '4px', marginBottom: '1rem' }}></div>
                            <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.25rem' }}>Global Textiles Co.</h3>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                                123 Business Street<br />
                                Mumbai, Maharashtra - 400001<br />
                                GST: 29XXXXX1234X12X
                            </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '1rem', letterSpacing: '0.05em' }}>INVOICE</h2>
                            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                                Invoice No: <span style={{ color: 'var(--text-main)', fontWeight: '500' }}>INV-2025-001</span><br />
                                Date: <span style={{ color: 'var(--text-main)', fontWeight: '500' }}>15 January 2025</span><br />
                                Due Date: <span style={{ color: 'var(--text-main)', fontWeight: '500' }}>15 February 2025</span>
                            </div>
                        </div>
                    </div>

                    {/* Bill To / Ship To */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
                        <div style={{ border: '1px solid var(--border)', borderRadius: '8px', padding: '1.5rem' }}>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Bill To</div>
                            <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>TriLink Buyer Corp</h4>
                            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                                456 Client Avenue<br />
                                Delhi - 110001<br />
                                GST: 07XXXXX5678X1ZY
                            </div>
                        </div>
                        <div style={{ border: '1px solid var(--border)', borderRadius: '8px', padding: '1.5rem' }}>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Ship To</div>
                            <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>Same as Billing</h4>
                            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                                456 Client Avenue<br />
                                Delhi - 110001
                            </div>
                        </div>
                    </div>

                    {/* Items Table */}
                    <div style={{ marginBottom: '2rem' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ background: '#f8fafc', borderBottom: '1px solid var(--border)' }}>
                                    <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-main)' }}>Description</th>
                                    <th style={{ padding: '1rem', textAlign: 'center', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-main)' }}>HSN/SAC</th>
                                    <th style={{ padding: '1rem', textAlign: 'center', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-main)' }}>Qty</th>
                                    <th style={{ padding: '1rem', textAlign: 'right', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-main)' }}>Rate</th>
                                    <th style={{ padding: '1rem', textAlign: 'right', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-main)' }}>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                                    <td style={{ padding: '1.5rem 1rem' }}>
                                        <div style={{ fontWeight: '500', marginBottom: '0.25rem' }}>Premium Cotton T-Shirts</div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>SKU: TCT-2025-001, Size: M, L, XL</div>
                                    </td>
                                    <td style={{ padding: '1.5rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>6109</td>
                                    <td style={{ padding: '1.5rem 1rem', textAlign: 'center' }}>5,000</td>
                                    <td style={{ padding: '1.5rem 1rem', textAlign: 'right' }}>₹12.00</td>
                                    <td style={{ padding: '1.5rem 1rem', textAlign: 'right', fontWeight: '500' }}>₹60,000.00</td>
                                </tr>
                                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                                    <td style={{ padding: '1.5rem 1rem' }}>
                                        <div style={{ fontWeight: '500', marginBottom: '0.25rem' }}>Express Freight Charges</div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Delivery to Delhi</div>
                                    </td>
                                    <td style={{ padding: '1.5rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>9965</td>
                                    <td style={{ padding: '1.5rem 1rem', textAlign: 'center' }}>1</td>
                                    <td style={{ padding: '1.5rem 1rem', textAlign: 'right' }}>₹2,500.00</td>
                                    <td style={{ padding: '1.5rem 1rem', textAlign: 'right', fontWeight: '500' }}>₹2,500.00</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Totals */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '3rem' }}>
                        <div style={{ width: '300px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', fontSize: '0.9rem' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Subtotal:</span>
                                <span style={{ fontWeight: '500' }}>₹62,500.00</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', fontSize: '0.9rem' }}>
                                <span style={{ color: 'var(--text-muted)' }}>CGST (9%):</span>
                                <span style={{ fontWeight: '500' }}>₹5,625.00</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', fontSize: '0.9rem' }}>
                                <span style={{ color: 'var(--text-muted)' }}>SGST (9%):</span>
                                <span style={{ fontWeight: '500' }}>₹5,625.00</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0', marginTop: '0.5rem', borderTop: '1px solid var(--border)', background: '#f8fafc', borderRadius: '4px', paddingLeft: '1rem', paddingRight: '1rem' }}>
                                <span style={{ fontWeight: '600' }}>Total Amount:</span>
                                <span style={{ fontWeight: '700', fontSize: '1.1rem' }}>₹73,750.00</span>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div style={{ borderTop: '1px solid var(--border)', paddingTop: '2rem' }}>
                        <h4 style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.5rem' }}>Terms & Conditions:</h4>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                            1. Payment due within 30 days. Please include invoice number with payment.<br />
                            2. Goods once sold will not be taken back.<br />
                            3. Interest @ 18% p.a. will be charged on delayed payments.
                        </p>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default InvoicePreview;
