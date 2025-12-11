import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../index.css';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: formData.email, password: formData.password }),
            });

            const data = await response.json();

            if (!response.ok) {
                console.error('Login failed response:', data);
                throw new Error(data.message || data.title || 'Login failed'); // Handle ASP.NET default error structure
            }

            // Store token and redirect
            localStorage.setItem('token', data.jwtToken);
            localStorage.setItem('role', data.role); // Store role for persistence

            const role = data.role.toLowerCase();
            if (role === 'supplier') {
                navigate('/supplier/dashboard');
            } else if (role === 'buyer') {
                navigate('/buyer/dashboard');
            } else if (role === 'logistics') {
                navigate('/logistics/dashboard');
            } else {
                navigate('/buyer/dashboard');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fade-in" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <header style={{ padding: '1.5rem 3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--surface)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: '700', fontSize: '1.25rem', cursor: 'pointer' }} onClick={() => navigate('/')}>
                    <div style={{ width: '32px', height: '32px', background: 'var(--text-main)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                        <span style={{ fontSize: '1.2rem' }}>T</span>
                    </div>
                    TriLink
                </div>
                <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', fontSize: '0.9rem', fontWeight: '500' }}>
                    <a href="#" style={{ color: 'var(--text-muted)' }}>Features</a>
                    <a href="#" style={{ color: 'var(--text-muted)' }}>Contact</a>
                    <button className="btn btn-primary" style={{ padding: '0.5rem 1.25rem', borderRadius: '8px', fontSize: '0.9rem' }}>
                        Sign in
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
                <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center', maxWidth: '1100px' }}>

                    {/* Left Side: Static Welcome */}
                    <div style={{ background: '#f1f5f9', padding: '4rem', borderRadius: '24px', height: '100%', minHeight: '500px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '1.5rem', lineHeight: '1.2' }}>
                            Welcome back
                        </h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '2.5rem', lineHeight: '1.6' }}>
                            Access your dashboard to manage orders, track shipments, and connect with partners.
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-main)', fontWeight: '500' }}>
                                <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--text-main)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                </div>
                                Secure & Reliable
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-main)', fontWeight: '500' }}>
                                <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--text-main)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                </div>
                                Real-time Updates
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Login Form */}
                    <div style={{ padding: '2rem' }}>
                        <h2 style={{ fontSize: '2rem', fontWeight: '600', marginBottom: '0.5rem' }}>Sign in to your account</h2>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', fontSize: '0.95rem' }}>
                            Enter your details to proceed
                        </p>

                        <div className="input-group">
                            <label className="input-label">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                className="input-field"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="input-group">
                            <label className="input-label">Password</label>
                            <input
                                type="password"
                                name="password"
                                placeholder="Enter your password"
                                className="input-field"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', fontSize: '0.9rem' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: 'var(--text-muted)' }}>
                                <input type="checkbox" /> Remember me
                            </label>
                            <a href="#" style={{ color: 'var(--text-main)', fontWeight: '600' }}>Forgot password?</a>
                        </div>

                        <button
                            onClick={handleSubmit}
                            className="btn btn-primary"
                            style={{ width: '100%', padding: '1rem' }}
                        >
                            {loading ? 'Signing in...' : 'Sign in'}
                        </button>
                        {error && <p style={{ color: 'red', textAlign: 'center', marginTop: '1rem' }}>{error}</p>}

                        <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                            Don't have an account? <span onClick={() => navigate('/')} style={{ color: 'var(--text-main)', fontWeight: '600', cursor: 'pointer' }}>Register</span>
                        </p>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default Login;
