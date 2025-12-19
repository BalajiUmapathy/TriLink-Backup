import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Bell, User, ArrowLeft, Download, Edit, CheckCircle, Printer } from 'lucide-react';
import html2pdf from 'html2pdf.js';
import '../../index.css';

const SupplierInvoicePreview = () => {
    const navigate = useNavigate();
    const { invoiceId } = useParams();
    const [invoice, setInvoice] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchInvoice();

        // Add print styles
        const style = document.createElement('style');
        style.textContent = `
            @media print {
                /* Hide everything except invoice */
                nav, .no-print {
                    display: none !important;
                }
                
                /* Reset page margins */
                @page {
                    margin: 0.5cm;
                    size: A4;
                }
                
                body {
                    margin: 0;
                    padding: 0;
                }
                
                /* Make invoice fit on one page */
                .invoice-container {
                    max-width: 100% !important;
                    padding: 1rem !important;
                    box-shadow: none !important;
                    page-break-inside: avoid;
                    transform: scale(0.95);
                    transform-origin: top left;
                }
                
                /* Reduce spacing for print */
                .invoice-container h2 {
                    font-size: 1.75rem !important;
                    margin-bottom: 0.25rem !important;
                }
                
                .invoice-container > div {
                    margin-bottom: 1rem !important;
                }
                
                /* Compact table */
                table {
                    font-size: 0.85rem !important;
                }
                
               table th, table td {
                    padding: 0.5rem !important;
                }
            }
        `;
        document.head.appendChild(style);

        return () => document.head.removeChild(style);
    }, [invoiceId]);

    const fetchInvoice = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5081/api/invoice/${invoiceId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                setInvoice(data);
            } else {
                alert('Failed to load invoice');
                const userId = localStorage.getItem('userId');
                navigate(`/supplier/orders/${userId}`);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching invoice:', error);
            alert('Error loading invoice');
            setLoading(false);
        }
    };

    const handleFinalize = async () => {
        if (!confirm('Are you sure you want to finalize this invoice? Once finalized, it cannot be edited.')) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5081/api/invoice/${invoiceId}/finalize`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                alert('Invoice finalized successfully!');
                fetchInvoice(); // Refresh invoice data
            } else {
                const error = await response.json();
                alert(`Failed to finalize invoice: ${error.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error finalizing invoice:', error);
            alert('Error finalizing invoice');
        }
    };

    const handleDownload = () => {
        const element = document.querySelector('.invoice-container');
        const opt = {
            margin: 0.5,
            filename: `Invoice-${invoice.invoiceNumber}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
        };
        html2pdf().set(opt).from(element).save();
    };

    const handlePrint = () => {
        window.print();
    };

    if (loading) {
        return <div style={{ padding: '3rem', textAlign: 'center' }}>Loading invoice...</div>;
    }

    if (!invoice) {
        return <div style={{ padding: '3rem', textAlign: 'center' }}>Invoice not found</div>;
    }

    return (
        <div className="fade-in" style={{ minHeight: '100vh', background: '#f8fafc' }}>
            {/* Navigation */}
            <nav className="no-print" style={{ background: 'white', borderBottom: '1px solid var(--border)', padding: '1rem 3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-main)' }}>TriLink</div>
                    <div style={{ display: 'flex', gap: '2rem', fontSize: '0.95rem', fontWeight: '500' }}>
                        <a href="#" onClick={() => { const userId = localStorage.getItem('userId'); navigate(`/supplier/dashboard/${userId}`); }} style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>Dashboard</a>
                        <a href="#" onClick={() => { const userId = localStorage.getItem('userId'); navigate(`/supplier/products/${userId}`); }} style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>Products</a>
                        <a href="#" onClick={() => { const userId = localStorage.getItem('userId'); navigate(`/supplier/orders/${userId}`); }} style={{ color: 'var(--text-main)', cursor: 'pointer' }}>Orders</a>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <Bell size={20} color="var(--text-muted)" />
                    <div style={{ width: '32px', height: '32px', background: '#e2e8f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                        onClick={() => { const userId = localStorage.getItem('userId'); navigate(`/supplier/profile/${userId}`); }}>
                        <User size={18} color="var(--text-muted)" />
                    </div>
                </div>
            </nav>

            <main className="container" style={{ padding: '3rem 1rem', maxWidth: '900px', margin: '0 auto' }}>
                {/* Header with Actions */}
                <div className="no-print" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <button onClick={() => { const userId = localStorage.getItem('userId'); navigate(`/supplier/orders/${userId}`); }}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginBottom: '1rem' }}>
                            <ArrowLeft size={18} />
                            Back to Orders
                        </button>
                        <h1 style={{ fontSize: '2rem', fontWeight: '600', marginBottom: '0.5rem' }}>Invoice Preview</h1>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <span style={{ color: 'var(--text-muted)' }}>Invoice #{invoice.invoiceNumber}</span>
                            <span style={{
                                background: invoice.status === 'Finalized' ? '#dcfce7' : '#fef3c7',
                                color: invoice.status === 'Finalized' ? '#15803d' : '#b45309',
                                padding: '0.25rem 0.75rem',
                                borderRadius: '20px',
                                fontSize: '0.85rem',
                                fontWeight: '600',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.4rem'
                            }}>
                                {invoice.status === 'Finalized' && <CheckCircle size={14} />}
                                {invoice.status}
                            </span>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        {invoice.status === 'Draft' && (
                            <>
                                <button
                                    onClick={() => navigate(`/supplier/invoice/edit/${invoiceId}`)}
                                    className="btn"
                                    style={{ padding: '0.75rem 1.5rem', background: 'white', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                                >
                                    <Edit size={18} />
                                    Edit Invoice
                                </button>
                                <button
                                    onClick={handleFinalize}
                                    className="btn btn-primary"
                                    style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                                >
                                    <CheckCircle size={18} />
                                    Finalize Invoice
                                </button>
                            </>
                        )}
                        {/* Download and Print buttons */}
                        <button
                            onClick={handleDownload}
                            className="btn btn-primary"
                            style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                        >
                            <Download size={18} />
                            Download PDF
                        </button>
                        <button
                            onClick={handlePrint}
                            className="btn"
                            style={{ padding: '0.75rem 1.5rem', background: 'white', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                        >
                            <Printer size={18} />
                            Print
                        </button>
                    </div>
                </div>

                {/* Invoice Document */}
                <div className="card invoice-container" style={{ padding: '3rem', background: 'white' }}>
                    {/* Invoice Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3rem', paddingBottom: '2rem', borderBottom: '2px solid #e2e8f0' }}>
                        <div>
                            <h2 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>INVOICE</h2>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Invoice Number: {invoice.invoiceNumber}</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ marginBottom: '0.5rem' }}>
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Invoice Date: </span>
                                <span style={{ fontWeight: '500' }}>{new Date(invoice.invoiceDate).toLocaleDateString()}</span>
                            </div>
                            <div>
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Due Date: </span>
                                <span style={{ fontWeight: '500' }}>{new Date(invoice.dueDate).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* From/To Section */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', marginBottom: '3rem' }}>
                        {/* From - Supplier */}
                        <div>
                            <h3 style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>From (Supplier)</h3>
                            <div style={{ fontSize: '0.95rem', lineHeight: '1.6' }}>
                                <div style={{ fontWeight: '600', fontSize: '1.1rem', marginBottom: '0.5rem' }}>{invoice.supplierCompanyName || invoice.supplierName}</div>
                                {invoice.supplierGSTNumber && <div style={{ color: 'var(--text-muted)' }}>GST: {invoice.supplierGSTNumber}</div>}
                                {invoice.supplierAddress && <div style={{ color: 'var(--text-muted)' }}>{invoice.supplierAddress}</div>}
                                {invoice.supplierContactNumber && <div style={{ color: 'var(--text-muted)' }}>Phone: {invoice.supplierContactNumber}</div>}
                            </div>
                        </div>

                        {/* To - Buyer */}
                        <div>
                            <h3 style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>To (Buyer)</h3>
                            <div style={{ fontSize: '0.95rem', lineHeight: '1.6' }}>
                                <div style={{ fontWeight: '600', fontSize: '1.1rem', marginBottom: '0.5rem' }}>{invoice.buyerCompanyName || invoice.buyerName}</div>
                                {invoice.buyerGSTNumber && <div style={{ color: 'var(--text-muted)' }}>GST: {invoice.buyerGSTNumber}</div>}
                                {invoice.buyerAddress && <div style={{ color: 'var(--text-muted)' }}>{invoice.buyerAddress}</div>}
                            </div>
                        </div>
                    </div>

                    {/* Order Details Table */}
                    <div style={{ marginBottom: '2rem' }}>
                        <h3 style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>Order Details</h3>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead style={{ background: '#f8fafc', borderTop: '2px solid #e2e8f0', borderBottom: '2px solid #e2e8f0' }}>
                                <tr>
                                    <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.9rem', fontWeight: '600' }}>Description</th>
                                    <th style={{ padding: '1rem', textAlign: 'right', fontSize: '0.9rem', fontWeight: '600' }}>Quantity</th>
                                    <th style={{ padding: '1rem', textAlign: 'right', fontSize: '0.9rem', fontWeight: '600' }}>Unit Price</th>
                                    <th style={{ padding: '1rem', textAlign: 'right', fontSize: '0.9rem', fontWeight: '600' }}>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                                    <td style={{ padding: '1rem' }}>{invoice.productName}</td>
                                    <td style={{ padding: '1rem', textAlign: 'right' }}>{invoice.quantity} {invoice.unit}</td>
                                    <td style={{ padding: '1rem', textAlign: 'right' }}>₹{(invoice.subTotal / invoice.quantity).toFixed(2)}</td>
                                    <td style={{ padding: '1rem', textAlign: 'right', fontWeight: '500' }}>₹{invoice.subTotal.toFixed(2)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Totals Section */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '2rem' }}>
                        <div style={{ width: '300px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid #e2e8f0' }}>
                                <span>Subtotal:</span>
                                <span style={{ fontWeight: '500' }}>₹{invoice.subTotal.toFixed(2)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid #e2e8f0' }}>
                                <span>GST ({invoice.taxRate}%):</span>
                                <span style={{ fontWeight: '500' }}>₹{invoice.taxAmount.toFixed(2)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', background: '#f0f9ff', margin: '0 -1rem', padding: '1rem', borderRadius: '8px', marginTop: '0.5rem' }}>
                                <span style={{ fontSize: '1.1rem', fontWeight: '700' }}>Total Amount:</span>
                                <span style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0369a1' }}>₹{invoice.totalAmount.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Notes */}
                    {invoice.notes && (
                        <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '8px', marginTop: '2rem' }}>
                            <h3 style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.75rem' }}>Notes / Terms & Conditions</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>{invoice.notes}</p>
                        </div>
                    )}

                    {/* Footer */}
                    <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '2px solid #e2e8f0', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        <p>Thank you for your business!</p>
                        <p style={{ marginTop: '0.5rem' }}>Generated on {new Date(invoice.createdAt).toLocaleDateString()}</p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default SupplierInvoicePreview;
