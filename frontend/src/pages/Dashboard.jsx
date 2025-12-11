import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Truck,
    Users,
    Settings,
    Bell,
    Search,
    LogOut,
    TrendingUp,
    Clock,
    AlertCircle
} from 'lucide-react';
import '../index.css';

const Dashboard = () => {
    const location = useLocation();
    const navigate = useNavigate();
    // Default to buyer if no state (e.g. direct access)
    const role = location.state?.role || 'buyer';

    const getRoleConfig = () => {
        switch (role) {
            case 'supplier':
                return {
                    title: 'Supplier Portal',
                    color: '#2563eb',
                    stats: [
                        { label: 'Active Listings', value: '24', icon: <Package />, change: '+12%' },
                        { label: 'Pending Orders', value: '7', icon: <Clock />, change: '-5%' },
                        { label: 'Total Revenue', value: '$45k', icon: <TrendingUp />, change: '+18%' },
                    ]
                };
            case 'logistics':
                return {
                    title: 'Logistics Hub',
                    color: '#10b981',
                    stats: [
                        { label: 'Active Shipments', value: '12', icon: <Truck />, change: '+8%' },
                        { label: 'On Route', value: '5', icon: <Users />, change: '+2%' },
                        { label: 'Avg. Delivery', value: '2d', icon: <Clock />, change: '-10%' },
                    ]
                };
            default: // buyer
                return {
                    title: 'Procurement Dashboard',
                    color: '#f59e0b', // Amber
                    stats: [
                        { label: 'Open Requests', value: '8', icon: <ShoppingCart />, change: '+4%' },
                        { label: 'Pending Approvals', value: '3', icon: <AlertCircle />, change: '0%' },
                        { label: 'Total Spend', value: '12k', icon: <TrendingUp />, change: '+15%' },
                    ]
                };
        }
    };

    const config = getRoleConfig();

    const handleLogout = () => {
        navigate('/login');
    };

    return (
        <div className="fade-in" style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>

            {/* Sidebar */}
            <aside style={{ width: '260px', background: 'white', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', position: 'fixed', height: '100vh' }}>
                <div style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ width: '32px', height: '32px', background: 'var(--text-main)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                        <span style={{ fontSize: '1.2rem', fontWeight: '700' }}>T</span>
                    </div>
                    <span style={{ fontSize: '1.25rem', fontWeight: '700' }}>TriLink</span>
                </div>

                <nav style={{ flex: 1, padding: '1.5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" active />
                        <NavItem icon={<Package size={20} />} label="Orders" />
                        <NavItem icon={<Users size={20} />} label="Partners" />
                        <NavItem icon={<Settings size={20} />} label="Settings" />
                    </div>
                </nav>

                <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border)' }}>
                    <button
                        onClick={handleLogout}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '0.75rem',
                            width: '100%', padding: '0.75rem',
                            borderRadius: '8px', background: '#fee2e2', color: '#ef4444',
                            fontWeight: '500', transition: 'all 0.2s'
                        }}
                    >
                        <LogOut size={18} />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main style={{ marginLeft: '260px', flex: 1, padding: '2rem' }}>

                {/* Top Bar */}
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                    <div>
                        <h1 style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--text-main)' }}>{config.title}</h1>
                        <p style={{ color: 'var(--text-muted)' }}>Welcome back, User</p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <div style={{ position: 'relative' }}>
                            <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
                            <input
                                type="text"
                                placeholder="Search..."
                                style={{
                                    padding: '0.6rem 1rem 0.6rem 2.5rem',
                                    borderRadius: '8px', border: '1px solid var(--border)',
                                    width: '250px', fontSize: '0.9rem'
                                }}
                            />
                        </div>
                        <button style={{ position: 'relative', background: 'white', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
                            <Bell size={20} color="var(--text-muted)" />
                            <span style={{ position: 'absolute', top: '-2px', right: '-2px', width: '10px', height: '10px', background: 'red', borderRadius: '50%', border: '2px solid white' }}></span>
                        </button>
                        <div style={{ width: '40px', height: '40px', background: '#e2e8f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600' }}>
                            US
                        </div>
                    </div>
                </header>

                {/* Stats Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
                    {config.stats.map((stat, index) => (
                        <div key={index} className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                            <div>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{stat.label}</p>
                                <h3 style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--text-main)' }}>{stat.value}</h3>
                                <span style={{
                                    display: 'inline-block', marginTop: '0.5rem',
                                    fontSize: '0.85rem', fontWeight: '500',
                                    color: stat.change.startsWith('+') ? '#10b981' : '#ef4444',
                                    background: stat.change.startsWith('+') ? '#ecfdf5' : '#fef2f2',
                                    padding: '0.25rem 0.5rem', borderRadius: '4px'
                                }}>
                                    {stat.change} from last month
                                </span>
                            </div>
                            <div style={{
                                padding: '1rem', borderRadius: '12px',
                                background: `${config.color}15`, color: config.color
                            }}>
                                {stat.icon}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Placeholder Content Area */}
                <div className="card" style={{ minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ width: '80px', height: '80px', background: '#f1f5f9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <LayoutDashboard size={40} color="var(--text-muted)" />
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>Dashboard Content</h3>
                        <p style={{ color: 'var(--text-muted)', maxWidth: '400px' }}>
                            This is where the main {role} specific modules and widgets will be loaded.
                        </p>
                    </div>
                </div>

            </main>
        </div>
    );
};

const NavItem = ({ icon, label, active }) => (
    <button style={{
        display: 'flex', alignItems: 'center', gap: '0.75rem',
        width: '100%', padding: '0.75rem 1rem',
        borderRadius: '8px',
        background: active ? 'var(--text-main)' : 'transparent',
        color: active ? 'white' : 'var(--text-muted)',
        fontWeight: active ? '500' : '400',
        transition: 'all 0.2s',
        cursor: 'pointer'
    }}>
        {icon}
        {label}
    </button>
);

export default Dashboard;
