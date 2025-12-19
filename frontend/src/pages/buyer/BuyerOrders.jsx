import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { api } from '../../api/api';
import { Bell, User, Search, Filter, ChevronDown, FileText, CheckCircle, Clock, AlertCircle, DollarSign, Package } from 'lucide-react';
import '../../index.css';

const BuyerOrders = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState('active');

    const [activeOrders, setActiveOrders] = useState([]);
    const [orderHistory, setOrderHistory] = useState([]);
    const [invoiceStatus, setInvoiceStatus] = useState({}); // Map of orderId -> invoice info

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                // Fetch Orders
                const response = await api.get('/Order');
                if (response) {
                    const mappedOrders = response.map(order => ({
                        id: order.id,
                        supplier: order.sellerName || 'Unknown Supplier',
                        product: order.productName || 'Unknown Product',
                        amount: `₹${order.finalPrice}`,
                        quantity: `${order.quantity} ${order.unit}`,
                        date: new Date(order.createdAt).toLocaleDateString(),
                        status: order.status,
                        actionRequired: order.status === 'Confirmed', // Action required for payment
                        actionLabel: 'Make Payment',
                        invoiceAvailable: order.status === 'Completed'
                    }));

                    const activeOrdrs = mappedOrders.filter(o => o.status !== 'Completed' && o.status !== 'Cancelled');
                    const historyOrders = mappedOrders.filter(o => o.status === 'Completed' || o.status === 'Cancelled');

                    setActiveOrders(activeOrdrs);
                    setOrderHistory(historyOrders);

                    // Fetch invoice data for completed orders
                    await fetchInvoiceStatus(historyOrders);
                }

            } catch (error) {
                console.error("Failed to fetch orders", error);
            }
        };

        const fetchInvoiceStatus = async (orders) => {
            try {
                const token = localStorage.getItem('token');
                const statusMap = {};

                for (const order of orders) {
                    try {
                        const response = await fetch(`http://localhost:5081/api/invoice/order/${order.id}`, {
                            headers: { 'Authorization': `Bearer ${token}` }
                        });

                        if (response.ok) {
                            const invoice = await response.json();
                            statusMap[order.id] = {
                                exists: true,
                                invoiceId: invoice.id,
                                status: invoice.status
                            };
                        } else {
                            statusMap[order.id] = { exists: false };
                        }
                    } catch {
                        statusMap[order.id] = { exists: false };
                    }
                }

                setInvoiceStatus(statusMap);
            } catch (error) {
                console.error("Failed to fetch invoice status:", error);
            }
        };
        fetchOrders();
    }, [location.key]); // Re-fetch when navigation changes

    const getStatusColor = (status) => {
        if (status === 'Confirmed') return '#f59e0b'; // Amber for Payment Pending
        if (status.includes('Waiting')) return '#f59e0b';
        if (status.includes('Payment') && !status.includes('Completed')) return '#ef4444';
        if (status.includes('Negotiation')) return '#f97316';
        if (status.includes('Completed')) return '#3b82f6';
        if (status.includes('Invoice')) return '#10b981';
        return '#64748b';
    };

    return (
        <div className="fade-in" style={{ minHeight: '100vh', background: '#f8fafc' }}>
            {/* Navigation Bar */}
            <nav style={{ background: 'white', borderBottom: '1px solid var(--border)', padding: '1rem 3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-main)' }}>TriLink</div>
                    <div style={{ display: 'flex', gap: '2rem', fontSize: '0.95rem', fontWeight: '500' }}>
                        <a href="#" onClick={() => { const userId = localStorage.getItem('userId'); navigate(`/buyer/dashboard/${userId}`); }} style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>Dashboard</a>
                        <a href="#" onClick={() => { const userId = localStorage.getItem('userId'); navigate(`/buyer/search/${userId}`); }} style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>Search Products</a>
                        <a href="#" onClick={() => { const userId = localStorage.getItem('userId'); navigate(`/buyer/negotiation/${userId}`); }} style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>My Offers</a>
                        <a href="#" style={{ color: 'var(--text-main)' }}>Orders</a>
                        <a href="#" onClick={() => { const userId = localStorage.getItem('userId'); navigate(`/buyer/logistics-jobs/${userId}`); }} style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>Logistics Jobs</a>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <Bell size={20} color="var(--text-muted)" />
                    <div
                        style={{ width: '32px', height: '32px', background: '#e2e8f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                        onClick={() => { const userId = localStorage.getItem('userId'); navigate(`/buyer/profile/${userId}`); }}
                    >
                        <User size={18} color="var(--text-muted)" />
                    </div>
                </div>
            </nav>

            <main className="container" style={{ padding: '3rem 1rem', maxWidth: '1200px' }}>
                <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 style={{ fontSize: '1.75rem', fontWeight: '600', marginBottom: '0.5rem' }}>My Orders</h1>
                        <p style={{ color: 'var(--text-muted)' }}>Manage your ongoing and past orders</p>
                    </div>
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', gap: '2rem', borderBottom: '1px solid var(--border)', marginBottom: '2rem' }}>
                    <button
                        onClick={() => setActiveTab('active')}
                        style={{
                            padding: '0.75rem 0',
                            background: 'none',
                            border: 'none',
                            borderBottom: activeTab === 'active' ? '2px solid black' : '2px solid transparent',
                            fontWeight: activeTab === 'active' ? '600' : '400',
                            color: activeTab === 'active' ? 'black' : 'var(--text-muted)',
                            cursor: 'pointer'
                        }}
                    >
                        Active Orders
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        style={{
                            padding: '0.75rem 0',
                            background: 'none',
                            border: 'none',
                            borderBottom: activeTab === 'history' ? '2px solid black' : '2px solid transparent',
                            fontWeight: activeTab === 'history' ? '600' : '400',
                            color: activeTab === 'history' ? 'black' : 'var(--text-muted)',
                            cursor: 'pointer'
                        }}
                    >
                        Order History
                    </button>
                </div>

                {/* Orders List */}
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
                            {(activeTab === 'active' ? activeOrders : orderHistory).map((order) => (
                                <tr key={order.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                    <td style={{ padding: '1rem 1.5rem', fontWeight: '500' }}>{order.id}</td>
                                    <td style={{ padding: '1rem 1.5rem' }}>{order.supplier}</td>
                                    <td style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)' }}>
                                        <div>{order.product}</div>
                                        <div style={{ fontSize: '0.8rem' }}>Qty: {order.quantity}</div>
                                    </td>
                                    <td style={{ padding: '1rem 1.5rem', fontWeight: '500' }}>{order.amount}</td>
                                    <td style={{ padding: '1rem 1.5rem' }}>
                                        <span style={{
                                            background: `${getStatusColor(order.status)}15`,
                                            color: getStatusColor(order.status),
                                            padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '500',
                                            display: 'inline-flex', alignItems: 'center', gap: '0.4rem'
                                        }}>
                                            {order.status === 'Invoice Generated' && <CheckCircle size={14} />}
                                            {order.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                                        {order.actionRequired ? (
                                            <button
                                                onClick={() => {
                                                    if (order.status.includes('Negotiation')) navigate('/buyer/negotiation');
                                                    else alert('Redirecting to Payment Gateway...');
                                                }}
                                                className="btn btn-primary"
                                                style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                                            >
                                                {order.actionLabel}
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => {
                                                    const invoiceInfo = invoiceStatus[order.id];
                                                    if (invoiceInfo?.exists) {
                                                        const userId = localStorage.getItem('userId');
                                                        navigate(`/buyer/invoice-preview/${userId}/${invoiceInfo.invoiceId}`);
                                                    } else {
                                                        alert('No invoice available for this order yet.');
                                                    }
                                                }}
                                                style={{ background: 'white', border: '1px solid var(--border)', padding: '0.5rem 1rem', borderRadius: '6px', fontSize: '0.85rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                                            >
                                                {invoiceStatus[order.id]?.exists ? <><FileText size={14} /> View Invoice</> : 'View Details'}
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
};

export default BuyerOrders;
