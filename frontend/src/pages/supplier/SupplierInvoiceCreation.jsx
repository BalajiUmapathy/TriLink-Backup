import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../../api/api';
import { Bell, User, ArrowLeft, FileText, Calendar, DollarSign } from 'lucide-react';
import '../../index.css';

const SupplierInvoiceCreation = () => {
    const navigate = useNavigate();
    const { orderId, invoiceId } = useParams();
    const [orderDetails, setOrderDetails] = useState(null);
    const [supplierInfo, setSupplierInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    const [invoiceData, setInvoiceData] = useState({
        invoiceDate: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        taxRate: 18,
        notes: ''
    });

    const [calculatedAmounts, setCalculatedAmounts] = useState({
        subTotal: 0,
        taxAmount: 0,
        totalAmount: 0
    });

    useEffect(() => {
        fetchData();
    }, [orderId, invoiceId]);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('userId');

            // If editing, fetch existing invoice and get the order ID from it
            let fetchedOrderId = orderId; // Will be undefined in edit mode
            if (invoiceId) {
                try {
                    const invoiceResponse = await fetch(`http://localhost:5081/api/invoice/${invoiceId}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (invoiceResponse.ok) {
                        const invoiceData = await invoiceResponse.json();
                        fetchedOrderId = invoiceData.orderId; // Get order ID from invoice for edit mode
                        setInvoiceData({
                            invoiceDate: invoiceData.invoiceDate.split('T')[0],
                            dueDate: invoiceData.dueDate.split('T')[0],
                            taxRate: invoiceData.taxRate,
                            notes: invoiceData.notes || ''
                        });
                        setCalculatedAmounts({
                            subTotal: invoiceData.subTotal,
                            taxAmount: invoiceData.taxAmount,
                            totalAmount: invoiceData.totalAmount
                        });
                    } else {
                        alert('Failed to load invoice data');
                        const userId = localStorage.getItem('userId');
                        navigate(`/supplier/orders/${userId}`);
                        return;
                    }
                } catch (err) {
                    console.error('Failed to fetch invoice:', err);
                    alert('Error loading invoice. Please return to orders page.');
                    const userId = localStorage.getItem('userId');
                    navigate(`/supplier/orders/${userId}`);
                    return;
                }
            }

            // Make sure we have an orderId before proceeding
            if (!fetchedOrderId) {
                alert('Order ID not found. Please return to orders page.');
                const userId = localStorage.getItem('userId');
                navigate(`/supplier/orders/${userId}`);
                return;
            }

            // Fetch order details using the correct order ID
            const orderResponse = await fetch(`http://localhost:5081/api/Order`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!orderResponse.ok) {
                throw new Error('Failed to fetch orders');
            }

            const orders = await orderResponse.json();
            const order = orders.find(o => o.id === fetchedOrderId);

            if (!order) {
                console.error('Order not found:', fetchedOrderId);
                alert(`Order not found. Please return to orders page.`);
                setLoading(false);
                return;
            }

            setOrderDetails(order);

            if (!invoiceId && order.finalPrice) {
                // Calculate amounts for new invoice
                calculateAmounts(order.finalPrice, 18);
            }

            // Fetch supplier info
            try {
                const userResponse = await api.get(`/User/${userId}`);
                if (userResponse) {
                    setSupplierInfo(userResponse);
                }
            } catch (err) {
                console.error('Failed to fetch user info:', err);
            }

            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch data:', error);
            alert('Failed to load invoice data. Please try again.');
            setLoading(false);
        }
    };

    const calculateAmounts = (subTotal, taxRate) => {
        const tax = Math.round(subTotal * taxRate / 100 * 100) / 100;
        const total = subTotal + tax;
        setCalculatedAmounts({
            subTotal: subTotal,
            taxAmount: tax,
            totalAmount: total
        });
    };

    const handleTaxRateChange = (e) => {
        const newRate = parseFloat(e.target.value) || 0;
        setInvoiceData({ ...invoiceData, taxRate: newRate });
        if (orderDetails) {
            calculateAmounts(orderDetails.finalPrice, newRate);
        }
    };

    const handleSaveDraft = async () => {
        try {
            const token = localStorage.getItem('token');

            const payload = {
                orderId: orderId,
                invoiceDate: invoiceData.invoiceDate,
                dueDate: invoiceData.dueDate,
                taxRate: invoiceData.taxRate,
                notes: invoiceData.notes
            };

            let response;
            if (invoiceId) {
                // Update existing invoice
                response = await fetch(`http://localhost:5081/api/invoice/${invoiceId}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });
            } else {
                // Create new invoice
                response = await fetch('http://localhost:5081/api/invoice', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });
            }

            if (response.ok) {
                alert('Invoice saved as draft successfully!');
                const userId = localStorage.getItem('userId');
                navigate(`/supplier/orders/${userId}`);
            } else {
                const error = await response.json();
                alert(`Failed to save invoice: ${error.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error saving invoice:', error);
            alert('Error saving invoice. Please try again.');
        }
    };

    const handleFinalize = async () => {
        try {
            if (!confirm('Are you sure you want to finalize this invoice? Once finalized, it cannot be edited.')) {
                return;
            }

            const token = localStorage.getItem('token');
            let finalInvoiceId = invoiceId;

            // If creating new invoice, create it first
            if (!invoiceId) {
                const payload = {
                    orderId: orderId,
                    invoiceDate: invoiceData.invoiceDate,
                    dueDate: invoiceData.dueDate,
                    taxRate: invoiceData.taxRate,
                    notes: invoiceData.notes
                };

                const createResponse = await fetch('http://localhost:5081/api/invoice', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });

                if (!createResponse.ok) {
                    const error = await createResponse.json();
                    alert(`Failed to create invoice: ${error.message || 'Unknown error'}`);
                    return;
                }

                const createdInvoice = await createResponse.json();
                finalInvoiceId = createdInvoice.id;
            }

            // Now finalize the invoice
            const finalizeResponse = await fetch(`http://localhost:5081/api/invoice/${finalInvoiceId}/finalize`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (finalizeResponse.ok) {
                alert('Invoice finalized successfully!');
                const userId = localStorage.getItem('userId');
                navigate(`/supplier/orders/${userId}`);
            } else {
                const error = await finalizeResponse.json();
                alert(`Failed to finalize invoice: ${error.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error finalizing invoice:', error);
            alert('Error finalizing invoice. Please try again.');
        }
    };

    if (loading) {
        return <div style={{ padding: '3rem', textAlign: 'center' }}>Loading...</div>;
    }

    if (!orderDetails) {
        return <div style={{ padding: '3rem', textAlign: 'center' }}>Order not found</div>;
    }

    return (
        <div className="fade-in" style={{ minHeight: '100vh', background: '#f8fafc' }}>
            {/* Navigation */}
            <nav style={{ background: 'white', borderBottom: '1px solid var(--border)', padding: '1rem 3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
                {/* Header */}
                <div style={{ marginBottom: '2rem' }}>
                    <button onClick={() => { const userId = localStorage.getItem('userId'); navigate(`/supplier/orders/${userId}`); }}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginBottom: '1rem' }}>
                        <ArrowLeft size={18} />
                        Back to Orders
                    </button>
                    <h1 style={{ fontSize: '2rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                        {invoiceId ? 'Edit Invoice' : 'Create Invoice'}
                    </h1>
                    <p style={{ color: 'var(--text-muted)' }}>Order #{orderDetails.id}</p>
                </div>

                {/* Invoice Form */}
                <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <FileText size={20} />
                        Invoice Details
                    </h2>

                    {/* Date Fields */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.9rem' }}>
                                Invoice Date
                            </label>
                            <input
                                type="date"
                                value={invoiceData.invoiceDate}
                                onChange={(e) => setInvoiceData({ ...invoiceData, invoiceDate: e.target.value })}
                                className="input"
                                style={{ width: '100%' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.9rem' }}>
                                Due Date
                            </label>
                            <input
                                type="date"
                                value={invoiceData.dueDate}
                                onChange={(e) => setInvoiceData({ ...invoiceData, dueDate: e.target.value })}
                                className="input"
                                style={{ width: '100%' }}
                            />
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                                Payment deadline - date by which buyer must pay
                            </p>
                        </div>
                    </div>

                    {/* Order & Product Information */}
                    <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>Order & Product Details</h3>
                        <div style={{ display: 'grid', gap: '0.75rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Order ID:</span>
                                <span style={{ fontWeight: '500', fontFamily: 'monospace', fontSize: '0.9rem' }}>{orderDetails.id}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Product ID:</span>
                                <span style={{ fontWeight: '500', fontFamily: 'monospace', fontSize: '0.9rem' }}>{orderDetails.productId}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Product Name:</span>
                                <span style={{ fontWeight: '500' }}>{orderDetails.productName}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Quantity:</span>
                                <span style={{ fontWeight: '500' }}>{orderDetails.quantity} {orderDetails.unit}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Unit Price:</span>
                                <span style={{ fontWeight: '500' }}>₹{(orderDetails.finalPrice / orderDetails.quantity).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Buyer Information */}
                    <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>Buyer Information</h3>
                        <div style={{ display: 'grid', gap: '0.75rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Name:</span>
                                <span style={{ fontWeight: '500' }}>{orderDetails.buyerName}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Email:</span>
                                <span style={{ fontWeight: '500' }}>{orderDetails.buyerEmail}</span>
                            </div>
                        </div>
                    </div>

                    {/* Tax and Amount Calculation */}
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.9rem' }}>
                            GST/Tax Rate (%)
                        </label>
                        <input
                            type="number"
                            value={invoiceData.taxRate}
                            onChange={handleTaxRateChange}
                            className="input"
                            style={{ width: '200px', marginBottom: '1.5rem' }}
                            step="0.01"
                            min="0"
                            max="100"
                        />

                        <div style={{ background: '#f0f9ff', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e0f2fe' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                                <span>Subtotal:</span>
                                <span style={{ fontWeight: '500' }}>₹{calculatedAmounts.subTotal.toFixed(2)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                                <span>GST ({invoiceData.taxRate}%):</span>
                                <span style={{ fontWeight: '500' }}>₹{calculatedAmounts.taxAmount.toFixed(2)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '2px solid #bae6fd', fontSize: '1.1rem' }}>
                                <span style={{ fontWeight: '600' }}>Total Amount:</span>
                                <span style={{ fontWeight: '700', color: '#0369a1' }}>₹{calculatedAmounts.totalAmount.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Notes */}
                    <div style={{ marginTop: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.9rem' }}>
                            Payment Terms & Additional Notes
                        </label>
                        <textarea
                            value={invoiceData.notes}
                            onChange={(e) => setInvoiceData({ ...invoiceData, notes: e.target.value })}
                            className="input"
                            rows="5"
                            style={{ width: '100%', resize: 'vertical' }}
                            placeholder={`Add payment terms and banking details here. For example:

Payment Terms:
- Payment due within ${Math.ceil((new Date(invoiceData.dueDate) - new Date(invoiceData.invoiceDate)) / (1000 * 60 * 60 * 24))} days of invoice date
- Late payments may incur additional charges

Bank Details:
- Bank Name: [Your Bank]
- Account Number: [Your Account]
- IFSC Code: [Your IFSC]
- Account Holder: [Company Name]

Additional Notes:
- Please reference Invoice Number in payment description
- For any queries, contact: [Your Contact]`}
                        />
                    </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                    <button
                        onClick={() => { const userId = localStorage.getItem('userId'); navigate(`/supplier/orders/${userId}`); }}
                        className="btn"
                        style={{ padding: '0.75rem 1.5rem', background: 'white', border: '1px solid var(--border)' }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSaveDraft}
                        className="btn"
                        style={{ padding: '0.75rem 1.5rem', background: 'white', border: '1px solid var(--border)' }}
                    >
                        Save as Draft
                    </button>
                    <button
                        onClick={handleFinalize}
                        className="btn btn-primary"
                        style={{ padding: '0.75rem 1.5rem' }}
                    >
                        Finalize Invoice
                    </button>
                </div>
            </main>
        </div>
    );
};

export default SupplierInvoiceCreation;
