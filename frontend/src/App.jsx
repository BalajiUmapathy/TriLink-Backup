import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RoleSelection from './pages/RoleSelection';
import Registration from './pages/Registration';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import SupplierDashboard from './pages/supplier/SupplierDashboard';
import MyProducts from './pages/supplier/MyProducts';
import AddProduct from './pages/supplier/AddProduct';
import SupplierOrders from './pages/supplier/SupplierOrders';
import SupplierProfile from './pages/supplier/SupplierProfile';
import LogisticsJobCreation from './pages/supplier/LogisticsJobCreation';
import SupplierNegotiation from './pages/negotiation/SupplierNegotiation';
import OfferSummary from './pages/negotiation/OfferSummary';
import BuyerDashboard from './pages/buyer/BuyerDashboard';
import BuyerProfile from './pages/buyer/BuyerProfile';
import SearchProducts from './pages/buyer/SearchProducts';
import Negotiation from './pages/buyer/Negotiation';
import BuyerOfferSummary from './pages/buyer/OfferSummary';
import InvoicePreview from './pages/buyer/InvoicePreview';
import BuyerOrders from './pages/buyer/BuyerOrders';
import BuyerLogisticsJobCreation from './pages/buyer/BuyerLogisticsJobCreation';
import LogisticsDashboard from './pages/logistics/LogisticsDashboard';
import AvailableJobs from './pages/logistics/AvailableJobs';
import AssignedJobs from './pages/logistics/AssignedJobs';
import RouteSuggestion from './pages/logistics/RouteSuggestion';
import RouteSummary from './pages/logistics/RouteSummary';
import LogisticsInvoice from './pages/logistics/LogisticsInvoice';
import LogisticsProfile from './pages/logistics/LogisticsProfile';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RoleSelection />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Supplier Routes */}
        <Route path="/supplier/dashboard" element={<SupplierDashboard />} />
        <Route path="/supplier/products" element={<MyProducts />} />
        <Route path="/supplier/add-product" element={<AddProduct />} />
        <Route path="/supplier/add-product" element={<AddProduct />} />
        <Route path="/supplier/orders" element={<SupplierOrders />} />
        <Route path="/supplier/profile" element={<SupplierProfile />} />
        <Route path="/supplier/logistics-job-creation" element={<LogisticsJobCreation />} />
        <Route path="/supplier/negotiation" element={<SupplierNegotiation />} />
        <Route path="/negotiation/offer-summary" element={<OfferSummary />} />

        {/* Buyer Routes */}
        <Route path="/buyer/dashboard" element={<BuyerDashboard />} />
        <Route path="/buyer/profile" element={<BuyerProfile />} />
        <Route path="/buyer/search" element={<SearchProducts />} />
        <Route path="/buyer/negotiation" element={<Negotiation />} />
        <Route path="/buyer/offer-summary" element={<BuyerOfferSummary />} />
        <Route path="/buyer/invoice-preview" element={<InvoicePreview />} />
        <Route path="/buyer/orders" element={<BuyerOrders />} />
        <Route path="/buyer/logistics-jobs" element={<BuyerLogisticsJobCreation />} />

        {/* Logistics Routes */}
        <Route path="/logistics/dashboard" element={<LogisticsDashboard />} />
        <Route path="/logistics/available-jobs" element={<AvailableJobs />} />
        <Route path="/logistics/assigned-jobs" element={<AssignedJobs />} />
        <Route path="/logistics/route-suggestion/:id" element={<RouteSuggestion />} />
        <Route path="/logistics/route-summary" element={<RouteSummary />} />
        <Route path="/logistics/invoice" element={<LogisticsInvoice />} />
        <Route path="/logistics/profile" element={<LogisticsProfile />} />
      </Routes>
    </Router>
  );
}

export default App;
