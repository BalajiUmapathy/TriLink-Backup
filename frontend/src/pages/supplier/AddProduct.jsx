import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../api/api';
import { Bell, User, UploadCloud, Image as ImageIcon, FileText, ChevronDown } from 'lucide-react';
import '../../index.css';

const AddProduct = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        productName: '',
        category: '',
        unit: 'Ton',
        price: '',
        availableQty: '',
        minOrderQty: '',
        leadTime: '',
        location: '',
        description: '',
        images: null,
        documents: null
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e, type) => {
        if (e.target.files && e.target.files[0]) {
            setFormData({ ...formData, [type]: e.target.files[0] });
        }
    };

    const handleSubmit = async (status) => {
        const payload = new FormData();
        payload.append('Name', formData.productName); // Match DTO property names (Case-insensitive usually, but strict is initialized)
        payload.append('Category', formData.category);
        payload.append('Unit', formData.unit);
        payload.append('BasePrice', formData.price || 0);
        payload.append('Quantity', formData.availableQty || 0);
        payload.append('MinOrderQty', formData.minOrderQty || 0);
        payload.append('LeadTime', formData.leadTime || 7);
        payload.append('Description', formData.description || "");
        payload.append('Status', status);
        payload.append('Location', "Warehouse A"); // Hardcoded for now

        // Append Files
        if (formData.images) {
            payload.append('ImageFile', formData.images);
        }
        if (formData.documents) {
            payload.append('CertificateFile', formData.documents);
        }

        // SupplierId will be handled by token in backend, but DTO property exists.
        // It's safer to rely on backend token extraction.

        try {
            // Content-Type multipart/form-data is handled automatically by browser/axios/fetch when body is FormData
            const result = await api.post('/Product', payload, true);

            // Navigate
            navigate('/supplier/products', { state: { newProduct: true } });

        } catch (error) {
            console.error("Error submitting form:", error);
            alert('An error occurred while saving the product: ' + error.message);
        }
    };

    return (
        <div className="fade-in" style={{ minHeight: '100vh', background: '#f8fafc' }}>
            {/* Navigation Bar */}
            <nav style={{ background: 'white', borderBottom: '1px solid var(--border)', padding: '1rem 3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-main)' }}>TriLink</div>
                    <div style={{ display: 'flex', gap: '2rem', fontSize: '0.95rem', fontWeight: '500' }}>
                        <a href="#" onClick={() => navigate('/supplier/dashboard')} style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>Dashboard</a>
                        <a href="#" onClick={() => navigate('/supplier/products')} style={{ color: 'var(--text-main)', cursor: 'pointer' }}>Products</a>
                        <a href="#" onClick={() => navigate('/supplier/orders')} style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>Orders</a>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <Bell size={20} color="var(--text-muted)" />
                    <div
                        style={{ width: '32px', height: '32px', background: '#e2e8f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                        onClick={() => navigate('/supplier/profile')}
                    >
                        <User size={18} color="var(--text-muted)" />
                    </div>
                </div>
            </nav>

            <main className="container" style={{ padding: '3rem 1rem', maxWidth: '1200px' }}>
                <div style={{ marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: '600', marginBottom: '0.5rem' }}>Add New Product</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Fill in the details to list your product</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>

                    {/* Left Column: Form Details */}
                    <div className="card" style={{ padding: '2rem' }}>
                        <div className="input-group">
                            <label className="input-label">Product Name</label>
                            <input
                                type="text"
                                name="productName"
                                placeholder="e.g. Steel Rebar 12mm"
                                className="input-field"
                                value={formData.productName}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="input-group">
                            <label className="input-label">Category</label>
                            <div style={{ position: 'relative' }}>
                                <select
                                    name="category"
                                    className="input-field"
                                    style={{ appearance: 'none', cursor: 'pointer' }}
                                    value={formData.category}
                                    onChange={handleChange}
                                >
                                    <option value="">Select category</option>
                                    <option value="steel">Steel</option>
                                    <option value="cement">Cement</option>
                                    <option value="aggregates">Aggregates</option>
                                </select>
                                <ChevronDown size={18} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-muted)' }} />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div className="input-group">
                                <label className="input-label">Unit</label>
                                <div style={{ position: 'relative' }}>
                                    <select
                                        name="unit"
                                        className="input-field"
                                        style={{ appearance: 'none', cursor: 'pointer' }}
                                        value={formData.unit}
                                        onChange={handleChange}
                                    >
                                        <option value="Ton">Ton</option>
                                        <option value="Bag">Bag</option>
                                        <option value="Kg">Kg</option>
                                        <option value="M3">m³</option>
                                    </select>
                                    <ChevronDown size={18} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-muted)' }} />
                                </div>
                            </div>
                            <div className="input-group">
                                <label className="input-label">Price per Unit</label>
                                <input
                                    type="number"
                                    name="price"
                                    placeholder="₹0.00"
                                    className="input-field"
                                    value={formData.price}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div className="input-group">
                                <label className="input-label">Available Quantity</label>
                                <input
                                    type="number"
                                    name="availableQty"
                                    placeholder="0"
                                    className="input-field"
                                    value={formData.availableQty}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="input-group">
                                <label className="input-label">Min Order Quantity</label>
                                <input
                                    type="number"
                                    name="minOrderQty"
                                    placeholder="0"
                                    className="input-field"
                                    value={formData.minOrderQty}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div className="input-group">
                                <label className="input-label">Lead Time (days)</label>
                                <input
                                    type="number"
                                    name="leadTime"
                                    placeholder="7"
                                    className="input-field"
                                    value={formData.leadTime}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="input-group">
                                <label className="input-label">Location</label>
                                <input
                                    type="text"
                                    name="location"
                                    placeholder="e.g. Warehouse A"
                                    className="input-field"
                                    value={formData.location}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="input-group" style={{ marginBottom: 0 }}>
                            <label className="input-label">Description</label>
                            <textarea
                                name="description"
                                placeholder="Product description..."
                                className="input-field"
                                rows="5"
                                style={{ resize: 'none' }}
                                value={formData.description}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* Right Column: Uploads & Actions */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                        {/* Image Upload */}
                        <div className="card" style={{ padding: '2rem' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1.5rem' }}>Product Images</h3>
                            <div style={{
                                border: '2px dashed var(--border)', borderRadius: '12px', padding: '3rem 1rem',
                                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s'
                            }}>
                                <div style={{ width: '48px', height: '48px', background: '#f1f5f9', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                                    <ImageIcon size={24} color="var(--text-main)" />
                                </div>
                                <p style={{ fontWeight: '500', marginBottom: '0.25rem' }}>Upload product images</p>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>PNG, JPG up to 5MB</p>
                                <div style={{ position: 'relative', overflow: 'hidden', display: 'inline-block' }}>
                                    <button className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', pointerEvents: 'none' }}>Browse Files</button>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleFileChange(e, 'images')}
                                        style={{ position: 'absolute', top: 0, left: 0, opacity: 0, width: '100%', height: '100%', cursor: 'pointer' }}
                                    />
                                </div>
                                {formData.images && <p style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--accent)' }}>Selected: {formData.images.name}</p>}
                            </div>
                        </div>

                        {/* Document Upload */}
                        <div className="card" style={{ padding: '2rem' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1.5rem' }}>Documents</h3>
                            <div style={{
                                border: '2px dashed var(--border)', borderRadius: '12px', padding: '3rem 1rem',
                                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s'
                            }}>
                                <div style={{ width: '48px', height: '48px', background: '#f1f5f9', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                                    <FileText size={24} color="var(--text-main)" />
                                </div>
                                <p style={{ fontWeight: '500', marginBottom: '0.25rem' }}>Upload certificates</p>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>PDF up to 10MB</p>
                                <div style={{ position: 'relative', overflow: 'hidden', display: 'inline-block' }}>
                                    <button className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', pointerEvents: 'none' }}>Browse Files</button>
                                    <input
                                        type="file"
                                        accept=".pdf"
                                        onChange={(e) => handleFileChange(e, 'documents')}
                                        style={{ position: 'absolute', top: 0, left: 0, opacity: 0, width: '100%', height: '100%', cursor: 'pointer' }}
                                    />
                                </div>
                                {formData.documents && <p style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--accent)' }}>Selected: {formData.documents.name}</p>}
                            </div>
                        </div>

                        {/* Actions */}
                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                            <button
                                className="btn btn-primary"
                                style={{ padding: '1rem', fontSize: '1rem' }}
                                onClick={() => handleSubmit('Active')}
                            >
                                Save & Publish
                            </button>
                            <button
                                className="btn btn-outline"
                                style={{ padding: '1rem', fontSize: '1rem', background: 'white' }}
                                onClick={() => handleSubmit('Draft')}
                            >
                                Save Draft
                            </button>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
};

export default AddProduct;
