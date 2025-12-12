import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, FileText, CheckCircle, Bell, User, Edit2, Save, X, LogOut, Download } from 'lucide-react';
import '../../index.css';

const LogisticsProfile = () => {
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Profile state
    const [profile, setProfile] = useState({
        companyName: '',
        gstNumber: '',
        panNumber: '',
        email: '',
        phone: '', // Mapped to contactNumber
        contactPerson: '',
        address: '', // Mapped to addressLine1
        role: ''
    });

    const [documents, setDocuments] = useState([]);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            const response = await fetch('/api/user/profile', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                if (response.status === 401) {
                    navigate('/login');
                    return;
                }
                throw new Error('Failed to fetch profile');
            }

            const data = await response.json();

            // Map API response to state
            setProfile({
                companyName: data.companyName || '',
                gstNumber: data.gstNumber || '',
                panNumber: data.panNumber || '',
                email: data.email || '',
                phone: data.contactNumber || '',
                contactPerson: data.contactPerson || '',
                address: data.addressLine1 || '',
                role: data.role || ''
            });

            // Map documents
            const docs = [];
            if (data.gstCertificatePath) {
                docs.push({
                    name: 'GST Certificate',
                    type: 'PDF/Image',
                    url: `/${data.gstCertificatePath}`
                });
            }
            if (data.panCardPath) {
                docs.push({
                    name: 'PAN Card',
                    type: 'PDF/Image',
                    url: `/${data.panCardPath}`
                });
            }
            setDocuments(docs);

        } catch (err) {
            console.error(err);
            setError('Could not load profile data');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/user/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    companyName: profile.companyName,
                    addressLine1: profile.address,
                    contactPerson: profile.contactPerson,
                    contactNumber: profile.phone
                })
            });

            if (!response.ok) {
                throw new Error('Failed to update profile');
            }

            setIsEditing(false);
            // Optionally show success message
        } catch (err) {
            console.error(err);
            alert('Failed to save changes');
        }
    };

    const handleLogout = () => {
        if (confirm('Are you sure you want to logout?')) {
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            navigate('/');
        }
    };

    const handleDownload = (url, filename) => {
        // Create a temporary anchor element to trigger download or open in new tab
        window.open(url, '_blank');
    };

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading profile...</div>;

    return (
        <div className="fade-in" style={{ minHeight: '100vh', background: '#f8fafc' }}>
            {/* Navigation Bar */}
            <header style={{ background: 'white', borderBottom: '1px solid var(--border)', padding: '1rem 3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-main)', cursor: 'pointer' }} onClick={() => { const userId = localStorage.getItem('userId'); navigate(`/logistics/dashboard/${userId}`); }}>TriLink</div>
                    <div style={{ display: 'flex', gap: '2rem', fontSize: '0.95rem', fontWeight: '500' }}>
                        <a href="#" onClick={() => { const userId = localStorage.getItem('userId'); navigate(`/logistics/dashboard/${userId}`); }} style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>Dashboard</a>
                        <a href="#" onClick={() => { const userId = localStorage.getItem('userId'); navigate(`/logistics/available-jobs/${userId}`); }} style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>Search Jobs</a>
                        <a href="#" onClick={() => { const userId = localStorage.getItem('userId'); navigate(`/logistics/assigned-jobs/${userId}`); }} style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>Assigned Jobs</a>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <Bell size={20} color="var(--text-muted)" />
                    <div
                        style={{ width: '32px', height: '32px', background: '#eff6ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '1px solid var(--primary)' }}
                        onClick={() => navigate('/logistics/profile')}
                    >
                        <User size={18} color="var(--primary)" />
                    </div>
                </div>
            </header>

            <main className="container" style={{ padding: '3rem 1rem', maxWidth: '800px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2rem', fontWeight: '600', marginBottom: '0.5rem' }}>Logistics Partner Profile</h1>
                        <p style={{ color: 'var(--text-muted)' }}>Manage your account details and business information</p>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        {!isEditing ? (
                            <>
                                <button
                                    onClick={handleLogout}
                                    className="btn btn-outline"
                                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ef4444', borderColor: '#fee2e2', background: '#fef2f2' }}
                                >
                                    <LogOut size={18} /> Logout
                                </button>
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="btn btn-primary"
                                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                                >
                                    <Edit2 size={18} /> Edit Profile
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="btn btn-outline"
                                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                                >
                                    <X size={18} /> Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="btn btn-primary"
                                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                                >
                                    <Save size={18} /> Save Changes
                                </button>
                            </>
                        )}
                    </div>
                </div>

                <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>

                        {/* Company Details */}
                        <div style={{ gridColumn: '1 / -1' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
                                Business Information
                            </h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                <div className="input-group">
                                    <label className="input-label">Company Name</label>
                                    <input
                                        type="text"
                                        name="companyName"
                                        className="input-field"
                                        value={profile.companyName}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        style={{ backgroundColor: !isEditing ? '#f8fafc' : 'white' }}
                                    />
                                </div>
                                <div className="input-group">
                                    <label className="input-label">GST Number <span style={{ fontSize: '0.7rem', color: '#ef4444', fontWeight: 'normal' }}>(Read Only)</span></label>
                                    <input
                                        type="text"
                                        name="gstNumber"
                                        className="input-field"
                                        value={profile.gstNumber}
                                        disabled={true}
                                        style={{ backgroundColor: '#f1f5f9', cursor: 'not-allowed', color: 'var(--text-muted)' }}
                                    />
                                </div>
                                <div className="input-group">
                                    <label className="input-label">PAN Number <span style={{ fontSize: '0.7rem', color: '#ef4444', fontWeight: 'normal' }}>(Read Only)</span></label>
                                    <input
                                        type="text"
                                        name="panNumber"
                                        className="input-field"
                                        value={profile.panNumber}
                                        disabled={true}
                                        style={{ backgroundColor: '#f1f5f9', cursor: 'not-allowed', color: 'var(--text-muted)' }}
                                    />
                                </div>
                                <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                                    <label className="input-label">Address</label>
                                    <textarea
                                        name="address"
                                        className="input-field"
                                        value={profile.address}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        rows="2"
                                        style={{ backgroundColor: !isEditing ? '#f8fafc' : 'white', resize: 'none' }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Contact Details */}
                        <div style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
                                Contact Person Details
                            </h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                <div className="input-group">
                                    <label className="input-label">Contact Person</label>
                                    <input
                                        type="text"
                                        name="contactPerson"
                                        className="input-field"
                                        value={profile.contactPerson}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        style={{ backgroundColor: !isEditing ? '#f8fafc' : 'white' }}
                                    />
                                </div>
                                <div className="input-group">
                                    <label className="input-label">Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        className="input-field"
                                        value={profile.email}
                                        onChange={handleChange}
                                        disabled={true}
                                        style={{ backgroundColor: '#f1f5f9', cursor: 'not-allowed', color: 'var(--text-muted)' }}
                                    />
                                </div>
                                <div className="input-group">
                                    <label className="input-label">Phone Number</label>
                                    <input
                                        type="text"
                                        name="phone"
                                        className="input-field"
                                        value={profile.phone}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        style={{ backgroundColor: !isEditing ? '#f8fafc' : 'white' }}
                                    />
                                </div>
                                <div className="input-group">
                                    <label className="input-label">Role</label>
                                    <input
                                        type="text"
                                        name="role"
                                        className="input-field"
                                        value={profile.role}
                                        disabled={true}
                                        style={{ backgroundColor: '#f1f5f9', cursor: 'not-allowed' }}
                                    />
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Documents Section */}
                <div className="card" style={{ padding: '2rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
                        Uploaded Documents
                    </h3>
                    {documents.length > 0 ? (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem' }}>
                            {documents.map((doc, index) => (
                                <div key={index} style={{ border: '1px solid var(--border)', borderRadius: '8px', padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', background: '#f8fafc' }}>
                                    <div style={{ width: '48px', height: '48px', background: '#e0f2fe', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', color: '#0284c7' }}>
                                        <FileText size={24} />
                                    </div>
                                    <div style={{ fontWeight: '500', marginBottom: '0.25rem', fontSize: '0.9rem' }}>{doc.name}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>{doc.type}</div>
                                    <button
                                        className="btn btn-outline"
                                        style={{ width: '100%', fontSize: '0.85rem', padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                                        onClick={() => handleDownload(doc.url, doc.name)}
                                    >
                                        <Download size={14} /> Open File
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '1rem' }}>No documents found.</div>
                    )}
                </div>

            </main>
        </div>
    );
};

export default LogisticsProfile;
