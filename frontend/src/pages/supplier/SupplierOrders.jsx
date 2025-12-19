import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Bell, User, Search, Filter, ChevronRight, Clock, CheckCircle, XCircle, AlertCircle, Truck, ArrowRight } from 'lucide-react';
import '../../index.css';

const SupplierOrders = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState('active');

    // Mock Data for Orders
    const [activeOrders, setActiveOrders] = useState([]);
    const [orderHistory, setOrderHistory] = useState([]);
    const [invoiceStatus, setInvoiceStatus] = useState({}); // Map of orderId -> invoice status

    // Negotiation requests (Keep as is or fetch separately if needed, focused on Orders now)
    const requests = [
        { id: 'NEG-2024-001', buyer: 'Skyline Infra', product: 'TMT Bars 16mm', originalOffer: '₹45,000/ton', counterOffer: '₹43,500/ton', quantity: '100 tons', status: 'Negotiation In Progress' },
    ];
    const [negotiationRequests, setNegotiationRequests] = useState(requests);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const response = await fetch('http://localhost:5081/api/Order', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (response.ok) {
                    const data = await response.json();

                    const mappedOrders = data.map(order => ({
                        id: order.id, // Display full ID or slice
                        buyer: order.buyerName || 'Unknown Buyer',
                        product: order.productName || 'Unknown Product',
                        quantity: `${order.quantity} ${order.unit}`,
                        date: new Date(order.createdAt).toLocaleDateString(),
                        status: order.status,
                        amount: `₹${order.finalPrice}`
                    }));

                    const activeOrdrs = mappedOrders.filter(o => o.status !== 'Completed' && o.status !== 'Cancelled');
                    const historyOrders = mappedOrders.filter(o => o.status === 'Completed' || o.status === 'Cancelled');

                    setActiveOrders(activeOrdrs);
                    setOrderHistory(historyOrders);

                    // Fetch invoice status for history orders
                    await fetchInvoiceStatus(historyOrders);
                }
            } catch (error) {
                console.error("Failed to fetch orders:", error);
            }
        };

        fetchOrders();
    }, [location.key]); // Re-fetch on navigation/mount

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
                            status: invoice.status // Draft or Finalized
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



    const handlePaymentReceived = async (orderId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5081/api/Order/${orderId}/status`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: 'Completed' })
            });

            if (response.ok) {
                // Update local state after successful API call
                const orderToMove = activeOrders.find(o => o.id === orderId);
                if (orderToMove) {
                    setActiveOrders(prev => prev.filter(o => o.id !== orderId));
                    setOrderHistory(prev => [{ ...orderToMove, status: 'Completed' }, ...prev]);
                }
            } else {
                console.error("Failed to update order status");
                alert("Failed to mark payment as received. Please try again.");
            }
        } catch (err) {
            console.error("Error updating order status:", err);
            alert("Error updating order status.");
        }
    };


    const handleCancelOrder = (orderId) => {
        if (confirm('Are you sure you want to cancel this order?')) {
            const orderToMove = activeOrders.find(o => o.id === orderId);
            if (orderToMove) {
                // Remove from active
                setActiveOrders(prev => prev.filter(o => o.id !== orderId));
                // Add to history with new status
                setOrderHistory(prev => [{ ...orderToMove, status: 'Cancelled' }, ...prev]);
            }
        }
    };

    // Modal State
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState(null);

    const handleCancelOrderClick = (orderId) => {
        setSelectedOrderId(orderId);
        setShowCancelModal(true);
    };

    const confirmCancelOrder = async () => {
        if (!selectedOrderId) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5081/api/Order/${selectedOrderId}/status`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: 'Cancelled' })
            });

            if (response.ok) {
                // Update UI
                const orderToMove = activeOrders.find(o => o.id === selectedOrderId);
                if (orderToMove) {
                    setActiveOrders(prev => prev.filter(o => o.id !== selectedOrderId));
                    setOrderHistory(prev => [{ ...orderToMove, status: 'Cancelled' }, ...prev]);
                }
                setShowCancelModal(false);
                setSelectedOrderId(null);
            } else {
                alert("Failed to cancel order.");
            }
        } catch (error) {
            console.error("Error cancelling order:", error);
            alert("Error cancelling order.");
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending Approval': return '#f59e0b'; // Amber
            case 'Supplier Accepted': return '#3b82f6'; // Blue
            case 'Payment Pending': return '#f59e0b'; // Amber/Orange
            case 'Awaiting Logistics': return '#8b5cf6'; // Purple
            case 'Scheduled for Dispatch': return '#06b6d4'; // Cyan
            case 'Delivered': return '#10b981'; // Green
            case 'Order Completed': return '#10b981'; // Green
            case 'Cancelled': return '#ef4444'; // Red
            case 'Negotiation In Progress': return '#f97316'; // Orange
            case 'Declined': return '#ef4444'; // Red
            case 'Waiting for Approval': return '#f59e0b'; // Amber
            case 'Confirmed': return '#10b981'; // Green (Confirmed Order)
            default: return '#64748b'; // Slate
        }
    };

    return (
        <div className="fade-in" style={{ minHeight: '100vh', background: '#f8fafc' }}>
            {/* Modal Overlay */}
            {showCancelModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                }}>
                    <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', width: '400px', maxWidth: '90%' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>Cancel Order</h3>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                            Are you sure you want to cancel this order? This action cannot be undone.
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                            <button
                                onClick={() => setShowCancelModal(false)}
                                style={{ padding: '0.5rem 1rem', border: '1px solid #e2e8f0', background: 'white', borderRadius: '6px' }}
                            >
                                No, Keep Order
                            </button>
                            <button
                                onClick={confirmCancelOrder}
                                style={{ padding: '0.5rem 1rem', background: '#ef4444', color: 'white', borderRadius: '6px', border: 'none' }}
                            >
                                Yes, Cancel Order
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Navigation Bar */}
            <nav style={{ background: 'white', borderBottom: '1px solid var(--border)', padding: '1rem 3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-main)' }}>TriLink</div>
                    <div style={{ display: 'flex', gap: '2rem', fontSize: '0.95rem', fontWeight: '500' }}>
                        <a href="#" onClick={() => { const userId = localStorage.getItem('userId'); navigate(`/supplier/dashboard/${userId}`); }} style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>Dashboard</a>
                        <a href="#" onClick={() => { const userId = localStorage.getItem('userId'); navigate(`/supplier/products/${userId}`); }} style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>Products</a>
                        <a href="#" style={{ color: 'var(--text-main)', cursor: 'default' }}>Orders</a>
                        <a href="#" onClick={() => { const userId = localStorage.getItem('userId'); navigate(`/supplier/logistics-job-creation/${userId}`); }} style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>Logistics Jobs</a>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <Bell size={20} color="var(--text-muted)" />
                    <div
                        style={{ width: '32px', height: '32px', background: '#e2e8f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                        onClick={() => { const userId = localStorage.getItem('userId'); navigate(`/supplier/profile/${userId}`); }}
                    >
                        <User size={18} color="var(--text-muted)" />
                    </div>
                </div>
            </nav>

            <main className="container" style={{ padding: '3rem 1rem', maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 style={{ fontSize: '2rem', fontWeight: '600', marginBottom: '0.5rem' }}>Order Management</h1>
                        <p style={{ color: 'var(--text-muted)' }}>Track and manage your orders and negotiations</p>
                    </div>
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border)' }}>
                    {['active', 'negotiations', 'history'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            style={{
                                padding: '0.75rem 1.5rem',
                                background: 'transparent',
                                border: 'none',
                                borderBottom: activeTab === tab ? '2px solid black' : '2px solid transparent',
                                color: activeTab === tab ? 'black' : 'var(--text-muted)',
                                fontWeight: '500',
                                cursor: 'pointer',
                                textTransform: 'capitalize'
                            }}
                        >
                            {tab === 'active' ? 'Active Orders' : tab === 'negotiations' ? 'Negotiation Requests' : 'Order History'}
                        </button>
                    ))}
                </div>

                {/* Content */}
                {activeTab === 'active' && (
                    <div className="fade-in">
                        {activeOrders.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No active orders.</div>
                        ) : (
                            activeOrders.map((order) => (
                                <div key={order.id} className="card" style={{ padding: '1.5rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                                            <span style={{ fontWeight: '600', fontSize: '1.1rem' }}>{order.buyer}</span>
                                            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', background: '#f1f5f9', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>{order.id}</span>
                                        </div>
                                        <div style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '0.25rem' }}>
                                            {order.product} • {order.quantity}
                                        </div>
                                        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                            Amount: <span style={{ color: 'black', fontWeight: '500' }}>{order.amount}</span>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ marginBottom: '0.5rem' }}>
                                            <span style={{
                                                background: `${getStatusColor(order.status)}15`,
                                                color: getStatusColor(order.status),
                                                padding: '0.3rem 0.8rem',
                                                borderRadius: '20px',
                                                fontSize: '0.85rem',
                                                fontWeight: '600',
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '0.4rem'
                                            }}>
                                                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: getStatusColor(order.status) }}></div>
                                                {order.status}
                                            </span>
                                        </div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>Expected: {order.date}</div>

                                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                            <button
                                                onClick={() => handleCancelOrderClick(order.id)}
                                                className="btn"
                                                style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', color: '#ef4444', border: '1px solid #fee2e2', background: '#fef2f2' }}
                                            >
                                                Cancel Order
                                            </button>
                                            <button
                                                onClick={() => handlePaymentReceived(order.id)}
                                                className="btn btn-primary"
                                                style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                                            >
                                                Payment Received
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {activeTab === 'negotiations' && (
                    <div className="fade-in">
                        {negotiationRequests.map((req) => (
                            <div key={req.id} className="card" style={{ padding: '1.5rem', marginBottom: '1rem', borderLeft: '4px solid #f97316' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                    <div>
                                        <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.25rem' }}>{req.buyer}</h3>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Requested a counter-offer for {req.product}</p>
                                    </div>
                                    <span style={{ color: '#f97316', fontWeight: '500', fontSize: '0.9rem', background: '#fff7ed', padding: '0.3rem 0.8rem', borderRadius: '6px', height: 'fit-content' }}>
                                        Action Required
                                    </span>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', background: '#f8fafc', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
                                    <div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Original Price</div>
                                        <div style={{ fontWeight: '500', textDecoration: 'line-through', color: '#94a3b8' }}>{req.originalOffer}</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Buyer's Counter</div>
                                        <div style={{ fontWeight: '600', color: 'black' }}>{req.counterOffer}</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Quantity</div>
                                        <div style={{ fontWeight: '500' }}>{req.quantity}</div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                                    <button
                                        onClick={() => {
                                            alert(`Order from ${req.buyer} has been marked as Declined.`);
                                        }}
                                        style={{ padding: '0.5rem 1rem', border: '1px solid #e2e8f0', background: 'white', borderRadius: '6px', fontWeight: '500', color: '#ef4444' }}
                                    >
                                        Reject
                                    </button>
                                    {req.status === 'Waiting for Approval' ? (
                                        <button
                                            onClick={() => {
                                                alert(`Counter Offer Accepted! Status changed to 'Negotiation Enabled'.`);
                                                navigate('/supplier/negotiation');
                                            }}
                                            style={{ padding: '0.5rem 1.5rem', background: 'black', color: 'white', borderRadius: '6px', fontWeight: '500' }}
                                        >
                                            Accept Counter Offer
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => navigate('/supplier/negotiation')}
                                            style={{ padding: '0.5rem 1.5rem', background: 'black', color: 'white', borderRadius: '6px', fontWeight: '500' }}
                                        >
                                            Negotiate
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                        {negotiationRequests.length === 0 && (
                            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                                <p>No pending negotiation requests.</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'history' && (
                    <div className="fade-in">
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem', background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                            <thead style={{ background: '#f8fafc', color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                <tr>
                                    <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: '600' }}>Order ID</th>
                                    <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: '600' }}>Buyer</th>
                                    <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: '600' }}>Product</th>
                                    <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: '600' }}>Date</th>
                                    <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: '600' }}>Status</th>
                                    <th style={{ padding: '1rem 1.5rem', textAlign: 'right', fontWeight: '600' }}>Amount</th>
                                    <th style={{ padding: '1rem 1.5rem', textAlign: 'right', fontWeight: '600' }}>Invoice</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orderHistory.map((order) => (
                                    <tr key={order.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                        <td style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)' }}>{order.id}</td>
                                        <td style={{ padding: '1rem 1.5rem', fontWeight: '500' }}>{order.buyer}</td>
                                        <td style={{ padding: '1rem 1.5rem' }}>{order.product}</td>
                                        <td style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)' }}>{order.date}</td>
                                        <td style={{ padding: '1rem 1.5rem' }}>
                                            <span style={{
                                                color: getStatusColor(order.status),
                                                fontWeight: '500',
                                                fontSize: '0.9rem'
                                            }}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem 1.5rem', textAlign: 'right', fontWeight: '500' }}>{order.amount}</td>
                                        <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                                            {invoiceStatus[order.id]?.exists ? (
                                                invoiceStatus[order.id].status === 'Draft' ? (
                                                    <button
                                                        onClick={() => navigate(`/supplier/invoice/edit/${invoiceStatus[order.id].invoiceId}`)}
                                                        className="btn"
                                                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', background: 'white', border: '1px solid var(--border)' }}
                                                    >
                                                        Edit Invoice
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => navigate(`/supplier/invoice/preview/${invoiceStatus[order.id].invoiceId}`)}
                                                        className="btn"
                                                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', background: 'white', border: '1px solid var(--border)' }}
                                                    >
                                                        View Invoice
                                                    </button>
                                                )
                                            ) : (
                                                <button
                                                    onClick={() => navigate(`/supplier/invoice/create/${order.id}`)}
                                                    className="btn btn-primary"
                                                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                                                >
                                                    Generate Invoice
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
        </div>
    );
};

export default SupplierOrders;
