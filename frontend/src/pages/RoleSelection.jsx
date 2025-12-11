import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Factory, ShoppingCart, Truck, ArrowRight } from 'lucide-react';
import '../index.css';

const RoleSelection = () => {
    const navigate = useNavigate();

    const handleRoleSelect = (role) => {
        // Navigate to registration with role state
        navigate('/register', { state: { role } });
    };

    return (
        <div className="fade-in" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <header style={{ padding: '1.5rem 3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--surface)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: '700', fontSize: '1.25rem' }}>
                    <div style={{ width: '32px', height: '32px', background: 'var(--text-main)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                        <span style={{ fontSize: '1.2rem' }}>T</span>
                    </div>
                    TriLink
                </div>
                <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', fontSize: '0.9rem', fontWeight: '500' }}>
                    <a href="#" style={{ color: 'var(--text-muted)' }}>Features</a>
                    <a href="#" style={{ color: 'var(--text-muted)' }}>Contact</a>
                    <button
                        onClick={() => navigate('/login')}
                        className="btn btn-outline"
                        style={{ padding: '0.5rem 1.25rem', borderRadius: '8px', fontSize: '0.9rem' }}
                    >
                        Sign in
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
                <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center', maxWidth: '1100px' }}>

                    {/* Left Side: Welcome */}
                    <div style={{ background: '#f1f5f9', padding: '4rem', borderRadius: '24px', height: '100%', minHeight: '500px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '1.5rem', lineHeight: '1.2' }}>
                            Welcome to TriLink
                        </h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '2.5rem', lineHeight: '1.6' }}>
                            Streamline your B2B procurement process with our comprehensive platform.
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {['Automated vendor management', 'Real-time order tracking', 'Comprehensive analytics'].map((item, index) => (
                                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-main)', fontWeight: '500' }}>
                                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--text-main)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="20 6 9 17 4 12"></polyline>
                                        </svg>
                                    </div>
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Side: Role Selection */}
                    <div style={{ padding: '2rem' }}>
                        <h2 style={{ fontSize: '2rem', fontWeight: '600', marginBottom: '3rem', textAlign: 'center' }}>Select your role</h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <RoleCard
                                icon={<Factory size={24} />}
                                title="Supplier"
                                desc="Provide goods & services"
                                onClick={() => handleRoleSelect('supplier')}
                            />
                            <RoleCard
                                icon={<ShoppingCart size={24} />}
                                title="Buyer"
                                desc="Purchase goods & services"
                                onClick={() => handleRoleSelect('buyer')}
                            />
                            <RoleCard
                                icon={<Truck size={24} />}
                                title="Logistics Partner"
                                desc="Handle shipping & delivery"
                                onClick={() => handleRoleSelect('logistics')}
                            />
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
};

const RoleCard = ({ icon, title, desc, onClick }) => (
    <button
        onClick={onClick}
        style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
            padding: '1.5rem',
            background: 'white',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            textAlign: 'left',
            width: '100%',
            transition: 'all 0.2s ease',
            cursor: 'pointer'
        }}
        onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--text-main)';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = 'var(--shadow-md)';
        }}
        onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border)';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
        }}
    >
        <div style={{
            padding: '12px',
            background: '#f8fafc',
            borderRadius: '12px',
            color: 'var(--text-main)'
        }}>
            {icon}
        </div>
        <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.25rem' }}>{title}</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{desc}</p>
        </div>
        <ArrowRight size={20} color="var(--text-muted)" />
    </button>
);

export default RoleSelection;
