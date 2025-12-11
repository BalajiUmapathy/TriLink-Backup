import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { api } from '../api/api';
import { Check, ShoppingCart, Factory, Truck, ChevronRight, UploadCloud, FileText, Edit2 } from 'lucide-react';
import '../index.css';

const Registration = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const role = location.state?.role || 'buyer'; // Default to buyer if accessed directly
    const [step, setStep] = useState(1);

    // Form State
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        companyName: '',
        gstNumber: '',
        panNumber: '',
        address: '',
        contactPerson: '',
        contactNumber: '',
        documents: {
            gstCertificate: null,
            panCard: null
        }
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleFileChange = (docType, file) => {
        setFormData({
            ...formData,
            documents: {
                ...formData.documents,
                [docType]: file
            }
        });
    };

    const nextStep = () => {
        if (step === 4) {
            handleRegister();
        } else {
            setStep(step + 1);
        }
    };
    const prevStep = () => setStep(step - 1);

    const handleRegister = async () => {
        setLoading(true);
        setError('');
        try {
            const submitData = new FormData();
            submitData.append('email', formData.email);
            submitData.append('username', formData.email); // Map email to username
            submitData.append('password', formData.password);
            submitData.append('role', role);

            // Handle optional company fields
            if (formData.companyName) submitData.append('companyName', formData.companyName);
            if (formData.gstNumber) submitData.append('gstNumber', formData.gstNumber);
            if (formData.panNumber) submitData.append('panNumber', formData.panNumber);
            if (formData.address) submitData.append('address', formData.address); // Changed from addressLine1 to address to match DTO
            if (formData.contactPerson) submitData.append('contactPerson', formData.contactPerson);
            if (formData.contactNumber) submitData.append('contactNumber', formData.contactNumber);

            if (formData.documents.gstCertificate) {
                submitData.append('gstCertificateFile', formData.documents.gstCertificate); // Changed to match DTO property
            }
            if (formData.documents.panCard) {
                submitData.append('panCardFile', formData.documents.panCard); // Changed to match DTO property
            }

            await api.post('/auth/register', submitData, true);

            setStep(5); // Move to completion step on success
        } catch (err) {
            console.error('Registration error:', err);
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
                    <button onClick={() => navigate('/login')} className="btn btn-outline" style={{ padding: '0.5rem 1.25rem', borderRadius: '8px', fontSize: '0.9rem' }}>
                        Sign in
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
                <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '4rem', alignItems: 'center', maxWidth: '1200px', width: '100%' }}>

                    {/* Left Side: Static Welcome */}
                    <div style={{ background: '#f1f5f9', padding: '4rem', borderRadius: '24px', height: '100%', minHeight: '600px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
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

                    {/* Right Side: Dynamic Form */}
                    <div style={{ padding: '2rem' }}>
                        {step === 1 && (
                            <Step1Account
                                formData={formData}
                                handleChange={handleChange}
                                onNext={nextStep}
                                navigate={navigate}
                            />
                        )}
                        {step === 2 && (
                            <Step2CompanyDetails
                                formData={formData}
                                handleChange={handleChange}
                                onNext={nextStep}
                            />
                        )}
                        {step === 3 && (
                            <Step3Documents
                                formData={formData}
                                handleFileChange={handleFileChange}
                                onNext={nextStep}
                                onPrev={prevStep}
                            />
                        )}
                        {step === 4 && (
                            <Step4Review
                                formData={formData}
                                onNext={nextStep}
                                onPrev={prevStep}
                                error={error}
                                loading={loading}
                            />
                        )}
                        {step === 5 && (
                            <Step5Complete
                                role={role}
                                navigate={navigate}
                            />
                        )}
                    </div>

                </div>
            </main>
        </div>
    );
};

// Shared Progress Indicator
const ProgressIndicator = ({ currentStep }) => {
    const steps = [
        { num: 1, label: 'Company Details' },
        { num: 2, label: 'Document Upload' },
        { num: 3, label: 'Review' }
    ];

    const activeStep = currentStep - 1;

    return (
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            {steps.map((s, index) => (
                <React.Fragment key={s.num}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        color: activeStep >= s.num ? 'var(--text-main)' : 'var(--text-muted)',
                        fontWeight: activeStep >= s.num ? '600' : '400'
                    }}>
                        <div style={{
                            width: '24px', height: '24px',
                            background: activeStep >= s.num ? 'var(--text-main)' : '#e2e8f0',
                            color: activeStep >= s.num ? 'white' : '#64748b',
                            borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '0.5rem',
                            transition: 'all 0.3s ease'
                        }}>
                            {activeStep > s.num ? <Check size={14} /> : s.num}
                        </div>
                        {s.label}
                    </div>
                    {index < steps.length - 1 && (
                        <div style={{ height: '1px', width: '40px', background: activeStep > s.num ? 'var(--text-main)' : 'var(--border)', margin: '0 1rem', transition: 'all 0.3s ease' }}></div>
                    )}
                </React.Fragment>
            ))}
        </div>
    );
};

// Step 1: Create Account
const Step1Account = ({ formData, handleChange, onNext, navigate }) => (
    <div className="fade-in">
        <h2 style={{ fontSize: '1.75rem', fontWeight: '600', marginBottom: '2rem' }}>Create your account</h2>

        <div className="input-group">
            <label className="input-label">Full Name</label>
            <input
                type="text"
                name="fullName"
                placeholder="Enter your full name"
                className="input-field"
                value={formData.fullName}
                onChange={handleChange}
            />
        </div>

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
                placeholder="Create a password"
                className="input-field"
                value={formData.password}
                onChange={handleChange}
            />
        </div>

        <div className="input-group">
            <label className="input-label">Confirm Password</label>
            <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm your password"
                className="input-field"
                value={formData.confirmPassword}
                onChange={handleChange}
            />
        </div>

        <button
            onClick={onNext}
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '1rem', padding: '1rem' }}
        >
            Register
        </button>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Already have an account? <span onClick={() => navigate('/login')} style={{ color: 'var(--text-main)', fontWeight: '600', cursor: 'pointer' }}>Sign in</span>
        </p>
    </div>
);

// Step 2: Company Details
const Step2CompanyDetails = ({ formData, handleChange, onNext }) => (
    <div className="fade-in">
        <h2 style={{ fontSize: '1.75rem', fontWeight: '600', marginBottom: '0.5rem' }}>Complete your profile</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.95rem' }}>
            Please provide the required information to verify your account
        </p>

        <ProgressIndicator currentStep={2} />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="input-group">
                <label className="input-label">Company Name</label>
                <input
                    type="text"
                    name="companyName"
                    placeholder="Enter company name"
                    className="input-field"
                    value={formData.companyName}
                    onChange={handleChange}
                />
            </div>
            <div className="input-group">
                <label className="input-label">GST Number</label>
                <input
                    type="text"
                    name="gstNumber"
                    placeholder="Enter GST number"
                    className="input-field"
                    value={formData.gstNumber}
                    onChange={handleChange}
                />
            </div>
            {/* Added PAN Number Field */}
            <div className="input-group">
                <label className="input-label">PAN Number</label>
                <input
                    type="text"
                    name="panNumber"
                    placeholder="Enter PAN number"
                    className="input-field"
                    value={formData.panNumber}
                    onChange={handleChange}
                />
            </div>
            {/* Spacer for grid to keep last item left aligned if needed, or just let it flow */}
            <div></div>
        </div>

        <div className="input-group">
            <label className="input-label">Business Address</label>
            <textarea
                name="address"
                placeholder="Enter complete business address"
                className="input-field"
                rows="3"
                style={{ resize: 'none' }}
                value={formData.address}
                onChange={handleChange}
            />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="input-group">
                <label className="input-label">Contact Person Name</label>
                <input
                    type="text"
                    name="contactPerson"
                    placeholder="Enter contact person name"
                    className="input-field"
                    value={formData.contactPerson}
                    onChange={handleChange}
                />
            </div>
            <div className="input-group">
                <label className="input-label">Contact Number</label>
                <input
                    type="text"
                    name="contactNumber"
                    placeholder="Enter contact number"
                    className="input-field"
                    value={formData.contactNumber}
                    onChange={handleChange}
                />
            </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
            <button
                onClick={onNext}
                className="btn btn-primary"
                style={{ padding: '0.75rem 2rem' }}
            >
                Next Step
            </button>
        </div>
    </div>
);

// Step 3: Document Upload
const Step3Documents = ({ formData, handleFileChange, onNext, onPrev }) => {
    return (
        <div className="fade-in">
            <h2 style={{ fontSize: '1.75rem', fontWeight: '600', marginBottom: '0.5rem' }}>Upload Documents</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.95rem' }}>
                Please upload the necessary documents for verification
            </p>

            <ProgressIndicator currentStep={3} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <FileUpload
                    label="GST Certificate"
                    subLabel="Upload your GST registration certificate (PDF/JPG)"
                    file={formData.documents.gstCertificate}
                    onChange={(e) => handleFileChange('gstCertificate', e.target.files[0])}
                />
                <FileUpload
                    label="PAN Card / Company ID"
                    subLabel="Upload company PAN card or ID proof (PDF/JPG)"
                    file={formData.documents.panCard}
                    onChange={(e) => handleFileChange('panCard', e.target.files[0])}
                />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
                <button
                    onClick={onPrev}
                    className="btn btn-outline"
                    style={{ padding: '0.75rem 2rem' }}
                >
                    Back
                </button>
                <button
                    onClick={onNext}
                    className="btn btn-primary"
                    style={{ padding: '0.75rem 2rem' }}
                >
                    Next Step
                </button>
            </div>
        </div>
    );
};

const FileUpload = ({ label, subLabel, file, onChange }) => (
    <div style={{
        border: '2px dashed var(--border)',
        borderRadius: '12px',
        padding: '2rem',
        textAlign: 'center',
        background: file ? '#f0fdf4' : '#f8fafc',
        borderColor: file ? 'var(--accent)' : 'var(--border)',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        position: 'relative'
    }}>
        <input
            type="file"
            onChange={onChange}
            style={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                opacity: 0, cursor: 'pointer'
            }}
        />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
                width: '48px', height: '48px',
                background: file ? 'var(--accent)' : '#e2e8f0',
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: file ? 'white' : 'var(--text-muted)'
            }}>
                {file ? <Check size={24} /> : <UploadCloud size={24} />}
            </div>
            <div>
                <h4 style={{ fontWeight: '600', color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                    {file ? file.name : label}
                </h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {file ? 'File selected' : subLabel}
                </p>
            </div>
        </div>
    </div>
);

// Step 4: Review
const Step4Review = ({ formData, onNext, onPrev, error, loading }) => (
    <div className="fade-in">
        <h2 style={{ fontSize: '1.75rem', fontWeight: '600', marginBottom: '0.5rem' }}>Review Details</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.95rem' }}>
            Please review your information before final submission
        </p>

        <ProgressIndicator currentStep={4} />

        <div style={{ background: '#f8fafc', borderRadius: '16px', padding: '2rem', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '600' }}>Company Information</h3>
                <button className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', gap: '0.5rem' }} onClick={onPrev}>
                    <Edit2 size={14} /> Edit
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <ReviewItem label="Company Name" value={formData.companyName} />
                <ReviewItem label="GST Number" value={formData.gstNumber} />
                <ReviewItem label="PAN Number" value={formData.panNumber} />
                <ReviewItem label="Contact Person" value={formData.contactPerson} />
                <ReviewItem label="Contact Number" value={formData.contactNumber} />
                <ReviewItem label="Email Address" value={formData.email} />
                <div style={{ gridColumn: 'span 2' }}>
                    <ReviewItem label="Business Address" value={formData.address} />
                </div>
            </div>

            <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem' }}>Uploaded Documents</h3>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <DocumentPreview name="GST Certificate" file={formData.documents.gstCertificate} />
                    <DocumentPreview name="PAN Card" file={formData.documents.panCard} />
                </div>
            </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
            <button
                onClick={onPrev}
                className="btn btn-outline"
                style={{ padding: '0.75rem 2rem' }}
            >
                Back
            </button>
            <button
                onClick={onNext}
                className="btn btn-primary"
                style={{ padding: '0.75rem 2rem' }}
            >
                Submit & Finish
            </button>
        </div>
        {error && <div style={{ color: 'red', marginTop: '1rem', textAlign: 'center' }}>{error}</div>}
        {loading && <div style={{ textAlign: 'center', marginTop: '1rem' }}>Registering...</div>}
    </div>
);

const ReviewItem = ({ label, value }) => (
    <div>
        <span style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>{label}</span>
        <span style={{ fontWeight: '500', color: 'var(--text-main)' }}>{value || '-'}</span>
    </div>
);

const DocumentPreview = ({ name, file }) => (
    <div style={{
        display: 'flex', alignItems: 'center', gap: '0.75rem',
        padding: '0.75rem 1rem', background: 'white',
        border: '1px solid var(--border)', borderRadius: '8px',
        fontSize: '0.9rem', fontWeight: '500'
    }}>
        <FileText size={18} color="var(--primary)" />
        {name}: <span style={{ color: file ? 'var(--accent)' : 'var(--text-muted)' }}>{file ? 'Uploaded' : 'Pending'}</span>
    </div>
);

// Step 5: Setup Complete
const Step5Complete = ({ role, navigate }) => {
    const getRoleData = () => {
        switch (role) {
            case 'supplier': return { label: 'Supplier Dashboard', icon: <Factory size={32} /> };
            case 'logistics': return { label: 'Logistics Dashboard', icon: <Truck size={32} /> };
            default: return { label: 'Buyer Dashboard', icon: <ShoppingCart size={32} /> };
        }
    };

    const { label, icon } = getRoleData();

    return (
        <div className="fade-in" style={{ textAlign: 'center', padding: '2rem 0' }}>
            <div style={{
                width: '64px', height: '64px', background: 'var(--text-main)', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
            }}>
                <Check color="white" size={32} strokeWidth={3} />
            </div>

            <h2 style={{ fontSize: '1.75rem', fontWeight: '600', marginBottom: '1rem' }}>Setup Complete!</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '3rem', maxWidth: '400px', margin: '0 auto 3rem auto' }}>
                Your account has been successfully verified and configured.
            </p>

            <div style={{
                border: '1px solid var(--border)', borderRadius: '16px', padding: '2rem',
                maxWidth: '350px', margin: '0 auto 2rem auto', background: 'white',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem'
            }}>
                <div style={{ color: 'var(--text-main)' }}>
                    {icon}
                </div>
                <h3 style={{ fontWeight: '600', fontSize: '1.1rem' }}>{label}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Access procurement tools, manage orders, and track deliveries
                </p>
            </div>

            <button
                onClick={() => {
                    if (role === 'supplier') {
                        navigate('/supplier/dashboard');
                    } else if (role === 'buyer') {
                        navigate('/buyer/dashboard');
                    } else if (role === 'logistics') {
                        navigate('/logistics/dashboard');
                    } else {
                        navigate('/dashboard', { state: { role } });
                    }
                }}
                className="btn btn-primary"
                style={{ width: '100%', maxWidth: '350px', padding: '1rem' }}
            >
                Go to Dashboard
            </button>
        </div>
    );
};

export default Registration;
