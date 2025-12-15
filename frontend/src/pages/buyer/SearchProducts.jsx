import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../api/api';
import { Bell, User, Search, Filter, ChevronDown, SlidersHorizontal, Star, MapPin, X, CheckCircle, ShoppingCart, Info, Truck, ShieldCheck } from 'lucide-react';
import '../../index.css';

const SearchProducts = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('details'); // 'details' or 'counter'

    // Filter States
    const [filters, setFilters] = useState({
        categories: [],
        priceMin: '',
        priceMax: '',
        qtyMin: '',
        qtyMax: '',
        location: '',
        minRating: 0,
        verifiedOnly: false
    });

    // Mock Data
    // Data State
    const [allProducts, setAllProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await api.get('/Product');
                const uniqueProducts = data.map(p => ({
                    id: p.id,
                    name: p.name,
                    category: p.category || 'Uncategorized',
                    subCategory: p.category || 'General',
                    supplier: p.supplierName || 'Unknown Supplier',
                    supplierCompanyName: p.supplierCompanyName || 'N/A',
                    supplierContactPerson: p.supplierContactPerson || 'N/A',
                    supplierEmail: p.supplierEmail || 'N/A',
                    supplierContactNumber: p.supplierContactNumber || 'N/A',
                    price: `₹${p.basePrice}`,
                    priceValue: p.basePrice,
                    unit: p.unit || 'Unit',
                    availableQty: p.quantity,
                    minOrderQty: p.minOrderQty || 0,
                    location: p.location || 'Unknown',
                    imageUrl: p.imageUrl || null,
                    rating: 4.5, // Mock
                    verified: true, // Mock
                    description: p.description
                }));
                setAllProducts(uniqueProducts);
            } catch (error) {
                console.error("Failed to fetch products", error);
            }
        };
        fetchProducts();
    }, []);

    // Filter Logic
    const filteredProducts = useMemo(() => {
        return allProducts.filter(product => {
            // Keyword Search
            const searchMatch =
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.subCategory.toLowerCase().includes(searchTerm.toLowerCase());

            if (!searchMatch) return false;

            // Category Filter
            if (filters.categories.length > 0 && !filters.categories.includes(product.category)) return false;

            // Price Range
            if (filters.priceMin && product.priceValue < parseInt(filters.priceMin)) return false;
            if (filters.priceMax && product.priceValue > parseInt(filters.priceMax)) return false;

            // Quantity Filter
            if (filters.qtyMin && product.availableQty < parseInt(filters.qtyMin)) return false;
            if (filters.qtyMax && product.availableQty > parseInt(filters.qtyMax)) return false;

            // Location Filter
            if (filters.location && !product.location.toLowerCase().includes(filters.location.toLowerCase())) return false;

            // Rating Filter
            if (product.rating < filters.minRating) return false;

            // Verified Filter
            if (filters.verifiedOnly && !product.verified) return false;

            return true;
        });
    }, [searchTerm, filters, allProducts]);

    // Handlers
    const handleCategoryChange = (category) => {
        setFilters(prev => {
            const newCategories = prev.categories.includes(category)
                ? prev.categories.filter(c => c !== category)
                : [...prev.categories, category];
            return { ...prev, categories: newCategories };
        });
    };

    const handleReset = () => {
        setFilters({
            categories: [],
            priceMin: '',
            priceMax: '',
            qtyMin: '',
            qtyMax: '',
            location: '',
            minRating: 0,
            verifiedOnly: false
        });
        setSearchTerm('');
    };

    const removeFilter = (key, value = null) => {
        if (key === 'categories' && value) {
            handleCategoryChange(value);
        } else if (key === 'price') {
            setFilters(prev => ({ ...prev, priceMin: '', priceMax: '' }));
        } else if (key === 'qty') {
            setFilters(prev => ({ ...prev, qtyMin: '', qtyMax: '' }));
        } else if (key === 'location') {
            setFilters(prev => ({ ...prev, location: '' }));
        } else if (key === 'rating') {
            setFilters(prev => ({ ...prev, minRating: 0 }));
        } else if (key === 'verified') {
            setFilters(prev => ({ ...prev, verifiedOnly: false }));
        }
    };

    const handleRequestOrder = (product) => {
        setSelectedProduct(product);
        setModalMode('details');
        setShowModal(true);
    };

    const handleAcceptOffer = async () => {
        try {
            await api.post('/Negotiation', {
                productId: selectedProduct.id,
                initialOfferAmount: selectedProduct.priceValue,
                message: "I accept the initial offer."
            });
            setShowModal(false);
            const userId = localStorage.getItem('userId');
            navigate(`/buyer/orders/${userId}`);
        } catch (error) {
            console.error("Failed to create negotiation", error);
            alert("Failed to create order: " + error.message);
        }
    };

    const handleSendCounter = async (e) => {
        e.preventDefault();
        const price = e.target[0].value;
        const qty = e.target[1].value;
        const date = e.target[2].value;

        try {
            await api.post('/Negotiation', {
                productId: selectedProduct.id,
                initialOfferAmount: parseFloat(price),
                message: `Counter Offer: ${qty} units at ₹${price} by ${date}`
            });
            alert(`Counter offer sent for ${selectedProduct.name}!`);
            setShowModal(false);
            const userId = localStorage.getItem('userId');
            navigate(`/buyer/negotiation/${userId}`);
        } catch (error) {
            console.error("Failed to create negotiation", error);
            alert("Failed to send counter offer: " + error.message);
        }
    };

    return (
        <div className="fade-in" style={{ minHeight: '100vh', background: '#f8fafc' }}>
            {/* Navigation Bar */}
            <nav style={{ background: 'white', borderBottom: '1px solid var(--border)', padding: '1rem 3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-main)' }}>TriLink</div>
                    <div style={{ display: 'flex', gap: '2rem', fontSize: '0.95rem', fontWeight: '500' }}>
                        <a href="#" onClick={() => { const userId = localStorage.getItem('userId'); navigate(`/buyer/dashboard/${userId}`); }} style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>Dashboard</a>
                        <a href="#" style={{ color: 'var(--text-main)' }}>Search Products</a>
                        <a href="#" onClick={() => { const userId = localStorage.getItem('userId'); navigate(`/buyer/negotiation/${userId}`); }} style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>My Offers</a>
                        <a href="#" onClick={() => { const userId = localStorage.getItem('userId'); navigate(`/buyer/orders/${userId}`); }} style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>Orders</a>
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

            {/* Search Header */}
            <div style={{ background: 'white', borderBottom: '1px solid var(--border)', padding: '1.5rem 3rem', position: 'sticky', top: 0, zIndex: 10 }}>
                <div className="container" style={{ maxWidth: '1200px', display: 'flex', gap: '1rem' }}>
                    <div style={{ flex: 1, position: 'relative' }}>
                        <Search size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input
                            type="text"
                            placeholder="Search products, materials, suppliers, categories..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ width: '100%', padding: '0.8rem 1rem 0.8rem 3rem', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '1rem', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}
                        />
                    </div>
                </div>
            </div>

            <main className="container" style={{ padding: '2rem 1rem', maxWidth: '1200px', display: 'grid', gridTemplateColumns: '280px 1fr', gap: '2rem' }}>

                {/* Sidebar Filters */}
                <aside style={{ height: 'fit-content' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Filter size={18} /> Filters</h3>
                        <button onClick={handleReset} style={{ fontSize: '0.85rem', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Reset All</button>
                    </div>

                    {/* Category Filter */}
                    <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
                        <h4 style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '1rem' }}>Category</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {['Metals', 'Plastics', 'Chemicals', 'Construction', 'Agricultural'].map((cat) => (
                                <label key={cat} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', color: 'var(--text-main)', cursor: 'pointer' }}>
                                    <input
                                        type="checkbox"
                                        checked={filters.categories.includes(cat)}
                                        onChange={() => handleCategoryChange(cat)}
                                        style={{ accentColor: 'black', width: '16px', height: '16px' }}
                                    />
                                    {cat}
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Price Range Filter */}
                    <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
                        <h4 style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '1rem' }}>Price Range (₹)</h4>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <input
                                type="number"
                                placeholder="Min"
                                value={filters.priceMin}
                                onChange={(e) => setFilters({ ...filters, priceMin: e.target.value })}
                                style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid var(--border)', fontSize: '0.9rem' }}
                            />
                            <span style={{ color: 'var(--text-muted)' }}>-</span>
                            <input
                                type="number"
                                placeholder="Max"
                                value={filters.priceMax}
                                onChange={(e) => setFilters({ ...filters, priceMax: e.target.value })}
                                style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid var(--border)', fontSize: '0.9rem' }}
                            />
                        </div>
                    </div>

                    {/* Quantity Filter */}
                    <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
                        <h4 style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '1rem' }}>Available Quantity</h4>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <input
                                type="number"
                                placeholder="Min"
                                value={filters.qtyMin}
                                onChange={(e) => setFilters({ ...filters, qtyMin: e.target.value })}
                                style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid var(--border)', fontSize: '0.9rem' }}
                            />
                            <span style={{ color: 'var(--text-muted)' }}>-</span>
                            <input
                                type="number"
                                placeholder="Max"
                                value={filters.qtyMax}
                                onChange={(e) => setFilters({ ...filters, qtyMax: e.target.value })}
                                style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid var(--border)', fontSize: '0.9rem' }}
                            />
                        </div>
                    </div>

                    {/* Location Filter */}
                    <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
                        <h4 style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '1rem' }}>Location</h4>
                        <div style={{ position: 'relative' }}>
                            <MapPin size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                type="text"
                                placeholder="City or State"
                                value={filters.location}
                                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                                style={{ width: '100%', padding: '0.6rem 0.6rem 0.6rem 2.2rem', borderRadius: '6px', border: '1px solid var(--border)', fontSize: '0.9rem' }}
                            />
                        </div>
                    </div>

                </aside>

                {/* Results Grid */}
                <div>
                    {/* Active Filters & Sort */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <div style={{ color: 'var(--text-main)', fontWeight: '600' }}>
                                Showing {filteredProducts.length} results
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                                Sort by:
                                <select style={{ border: 'none', background: 'none', fontWeight: '600', cursor: 'pointer' }}>
                                    <option>Relevance</option>
                                    <option>Price: Low to High</option>
                                    <option>Price: High to Low</option>
                                    <option>Rating: High to Low</option>
                                </select>
                            </div>
                        </div>

                        {/* Filter Chips */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                            {filters.categories.map(cat => (
                                <span key={cat} style={{ background: '#e2e8f0', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    {cat} <X size={14} style={{ cursor: 'pointer' }} onClick={() => removeFilter('categories', cat)} />
                                </span>
                            ))}
                            {(filters.priceMin || filters.priceMax) && (
                                <span style={{ background: '#e2e8f0', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    Price: {filters.priceMin || '0'} - {filters.priceMax || 'Any'} <X size={14} style={{ cursor: 'pointer' }} onClick={() => removeFilter('price')} />
                                </span>
                            )}
                            {(filters.qtyMin || filters.qtyMax) && (
                                <span style={{ background: '#e2e8f0', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    Qty: {filters.qtyMin || '0'} - {filters.qtyMax || 'Any'} <X size={14} style={{ cursor: 'pointer' }} onClick={() => removeFilter('qty')} />
                                </span>
                            )}
                            {filters.location && (
                                <span style={{ background: '#e2e8f0', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    Loc: {filters.location} <X size={14} style={{ cursor: 'pointer' }} onClick={() => removeFilter('location')} />
                                </span>
                            )}
                            {filters.verifiedOnly && (
                                <span style={{ background: '#e2e8f0', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    Verified Only <X size={14} style={{ cursor: 'pointer' }} onClick={() => removeFilter('verified')} />
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Products Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                        {filteredProducts.map((product) => (
                            <div key={product.id} className="card" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'transform 0.2s', cursor: 'pointer' }}>
                                <div style={{ height: '180px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.9rem', position: 'relative', overflow: 'hidden' }}>
                                    {product.imageUrl ? (
                                        <img src={product.imageUrl} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <span>Product Image</span>
                                    )}
                                    {product.verified && (
                                        <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'white', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.25rem', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                                            Verified <CheckCircle size={12} fill="#3b82f6" color="white" />
                                        </div>
                                    )}
                                </div>
                                <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                        <div>
                                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{product.category}</span>
                                            <h4 style={{ fontWeight: '600', fontSize: '1.1rem' }}>{product.name}</h4>
                                        </div>
                                    </div>

                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>{product.supplier}</p>

                                    {/* Enhanced Supplier Details on Card */}
                                    <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                                        <div><span style={{ fontWeight: '600' }}>Company:</span> {product.supplierCompanyName}</div>
                                        <div><span style={{ fontWeight: '600' }}>Contact:</span> {product.supplierContactPerson}</div>
                                        <div><span style={{ fontWeight: '600' }}>Email:</span> {product.supplierEmail}</div>
                                        <div><span style={{ fontWeight: '600' }}>Phone:</span> {product.supplierContactNumber}</div>
                                    </div>

                                    <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Price</span>
                                            <span style={{ fontWeight: '600' }}>{product.price}/{product.unit}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Available</span>
                                            <span style={{ fontWeight: '600' }}>{product.availableQty} {product.unit}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.25rem' }}>
                                            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Min Order</span>
                                            <span style={{ fontWeight: '600' }}>{product.minOrderQty} {product.unit}</span>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                                        <MapPin size={14} /> {product.location}
                                    </div>

                                    <button
                                        onClick={() => handleRequestOrder(product)}
                                        style={{ marginTop: 'auto', width: '100%', background: 'black', color: 'white', padding: '0.75rem', borderRadius: '6px', fontSize: '0.9rem', fontWeight: '500', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                                    >
                                        <ShoppingCart size={16} /> Request Offer
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredProducts.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                            <Search size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                            <h3>No products found</h3>
                            <p>Try adjusting your filters or search terms.</p>
                            <button onClick={handleReset} style={{ marginTop: '1rem', color: 'black', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}>Clear all filters</button>
                        </div>
                    )}
                </div>

            </main>

            {/* Product Details Modal */}
            {showModal && selectedProduct && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                }}>
                    <div className="fade-in" style={{
                        background: 'white', width: '90%', maxWidth: '600px', borderRadius: '12px',
                        padding: '2rem', position: 'relative', maxHeight: '90vh', overflowY: 'auto'
                    }}>
                        <button
                            onClick={() => setShowModal(false)}
                            style={{ position: 'absolute', right: '1.5rem', top: '1.5rem', background: 'none', border: 'none', cursor: 'pointer' }}
                        >
                            <X size={24} color="var(--text-muted)" />
                        </button>

                        {modalMode === 'details' ? (
                            <>
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{selectedProduct.category} / {selectedProduct.subCategory}</span>
                                    <h2 style={{ fontSize: '1.75rem', fontWeight: '700', marginTop: '0.25rem' }}>{selectedProduct.name}</h2>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem', fontSize: '0.95rem' }}>
                                        <span style={{ fontWeight: '600' }}>{selectedProduct.supplier}</span>
                                        {selectedProduct.verified && <CheckCircle size={16} fill="#3b82f6" color="white" />}

                                    </div>

                                    {/* Supplier Info Section */}
                                    <div style={{ marginTop: '1rem', padding: '1rem', background: '#f0f9ff', borderRadius: '8px', border: '1px solid #bae6fd' }}>
                                        <h4 style={{ fontSize: '0.9rem', fontWeight: '600', color: '#0369a1', marginBottom: '0.5rem' }}>Supplier Details</h4>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.9rem' }}>
                                            <div><span style={{ color: '#52525b' }}>Company:</span> <span style={{ fontWeight: '500' }}>{selectedProduct.supplierCompanyName}</span></div>
                                            <div><span style={{ color: '#52525b' }}>Contact:</span> <span style={{ fontWeight: '500' }}>{selectedProduct.supplierContactPerson}</span></div>
                                            <div><span style={{ color: '#52525b' }}>Email:</span> <span style={{ fontWeight: '500' }}>{selectedProduct.supplierEmail}</span></div>
                                            <div><span style={{ color: '#52525b' }}>Phone:</span> <span style={{ fontWeight: '500' }}>{selectedProduct.supplierContactNumber}</span></div>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ marginBottom: '2rem' }}>
                                    <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>Description</h3>
                                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>{selectedProduct.description}</p>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem', background: '#f8fafc', padding: '1.5rem', borderRadius: '8px' }}>
                                    <div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Price per Unit</div>
                                        <div style={{ fontSize: '1.1rem', fontWeight: '600' }}>{selectedProduct.price}/{selectedProduct.unit}</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Available Quantity</div>
                                        <div style={{ fontSize: '1.1rem', fontWeight: '600' }}>{selectedProduct.availableQty} {selectedProduct.unit}</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Location</div>
                                        <div style={{ fontSize: '1rem', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MapPin size={16} /> {selectedProduct.location}</div>
                                    </div>

                                </div>

                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <button
                                        onClick={handleAcceptOffer}
                                        className="btn btn-primary"
                                        style={{ flex: 1, padding: '1rem', fontSize: '1rem' }}
                                    >
                                        Accept Offer
                                    </button>
                                    <button
                                        onClick={() => setModalMode('counter')}
                                        className="btn btn-outline"
                                        style={{ flex: 1, padding: '1rem', fontSize: '1rem' }}
                                    >
                                        Counter Offer
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem' }}>Propose Counter Offer</h2>
                                <form onSubmit={handleSendCounter}>
                                    <div style={{ marginBottom: '1.5rem' }}>
                                        <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '500', marginBottom: '0.5rem' }}>Proposed Price (₹)</label>
                                        <input type="number" defaultValue={selectedProduct.priceValue} style={{ width: '100%', padding: '0.8rem', borderRadius: '6px', border: '1px solid var(--border)' }} required />
                                    </div>
                                    <div style={{ marginBottom: '1.5rem' }}>
                                        <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '500', marginBottom: '0.5rem' }}>Quantity</label>
                                        <input type="number" defaultValue={selectedProduct.availableQty} style={{ width: '100%', padding: '0.8rem', borderRadius: '6px', border: '1px solid var(--border)' }} required />
                                    </div>
                                    <div style={{ marginBottom: '2rem' }}>
                                        <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '500', marginBottom: '0.5rem' }}>Required Delivery Date</label>
                                        <input type="date" style={{ width: '100%', padding: '0.8rem', borderRadius: '6px', border: '1px solid var(--border)' }} required />
                                    </div>
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <button
                                            type="button"
                                            onClick={() => setModalMode('details')}
                                            className="btn btn-outline"
                                            style={{ flex: 1, padding: '1rem' }}
                                        >
                                            Back
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                            style={{ flex: 1, padding: '1rem' }}
                                        >
                                            Send Counter Offer
                                        </button>
                                    </div>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchProducts;
