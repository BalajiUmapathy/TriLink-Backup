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
import SupplierLogisticsJobManagement from './pages/supplier/SupplierLogisticsJobManagement';
import SupplierInvoiceCreation from './pages/supplier/SupplierInvoiceCreation';
import SupplierInvoicePreview from './pages/supplier/SupplierInvoicePreview';
import BuyerDashboard from './pages/buyer/BuyerDashboard';
import BuyerProfile from './pages/buyer/BuyerProfile';
import SearchProducts from './pages/buyer/SearchProducts';
import Negotiation from './pages/buyer/Negotiation';
import BuyerOfferSummary from './pages/buyer/OfferSummary';
import InvoicePreview from './pages/buyer/InvoicePreview';
import BuyerOrders from './pages/buyer/BuyerOrders';
import BuyerLogisticsJobCreation from './pages/buyer/BuyerLogisticsJobCreation';
import BuyerLogisticsJobManagement from './pages/buyer/BuyerLogisticsJobManagement';
import LogisticsDashboard from './pages/logistics/LogisticsDashboard';
import AvailableJobs from './pages/logistics/AvailableJobs';
import QuotedJobs from './pages/logistics/QuotedJobs';
import AssignedJobs from './pages/logistics/AssignedJobs';
import RouteSuggestion from './pages/logistics/RouteSuggestion';
import RouteSummary from './pages/logistics/RouteSummary';
import LogisticsInvoice from './pages/logistics/LogisticsInvoice';
import LogisticsProfile from './pages/logistics/LogisticsProfile';
import TruckRecommendation from './pages/logistics/TruckRecommendation';
import DriverMatching from './pages/logistics/DriverMatching';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RoleSelection />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Supplier Routes */}
        {/* Supplier Routes */}
        <Route path="/supplier/dashboard/:userId" element={<SupplierDashboard />} />
        <Route path="/supplier/dashboard" element={<SupplierDashboard />} /> {/* Fallback */}
        <Route path="/supplier/products/:userId" element={<MyProducts />} />
        <Route path="/supplier/add-product/:userId" element={<AddProduct />} />
        <Route path="/supplier/orders/:userId" element={<SupplierOrders />} />
        <Route path="/supplier/orders" element={<SupplierOrders />} /> {/* Fallback */}
        <Route path="/supplier/profile/:userId" element={<SupplierProfile />} />
        <Route path="/supplier/logistics-job-creation/:userId" element={<LogisticsJobCreation />} />
        <Route path="/supplier/logistics-job-management/:userId" element={<SupplierLogisticsJobManagement />} />
        <Route path="/supplier/negotiation/:userId" element={<SupplierNegotiation />} />
        <Route path="/negotiation/offer-summary/:userId" element={<OfferSummary />} />
        <Route path="/supplier/invoice/create/:orderId" element={<SupplierInvoiceCreation />} />
        <Route path="/supplier/invoice/edit/:invoiceId" element={<SupplierInvoiceCreation />} />
        <Route path="/supplier/invoice/preview/:invoiceId" element={<SupplierInvoicePreview />} />

        {/* Buyer Routes */}
        {/* Buyer Routes */}
        <Route path="/buyer/dashboard/:userId" element={<BuyerDashboard />} />
        <Route path="/buyer/dashboard" element={<BuyerDashboard />} /> {/* Fallback/Legacy */}
        <Route path="/buyer/profile/:userId" element={<BuyerProfile />} />
        <Route path="/buyer/search/:userId" element={<SearchProducts />} />
        <Route path="/buyer/negotiation/:userId" element={<Negotiation />} />
        <Route path="/buyer/offer-summary/:userId" element={<BuyerOfferSummary />} />
        <Route path="/buyer/invoice-preview/:userId/:invoiceId" element={<InvoicePreview />} />
        <Route path="/buyer/orders/:userId" element={<BuyerOrders />} />
        <Route path="/buyer/orders" element={<BuyerOrders />} /> {/* Fallback */}
        <Route path="/buyer/logistics-jobs/:userId" element={<BuyerLogisticsJobCreation />} />
        <Route path="/buyer/logistics-job-management/:userId" element={<BuyerLogisticsJobManagement />} />

        {/* Logistics Routes */}
        <Route path="/logistics/dashboard/:userId" element={<LogisticsDashboard />} />
        <Route path="/logistics/dashboard" element={<LogisticsDashboard />} /> {/* Fallback */}
        <Route path="/logistics/available-jobs/:userId" element={<AvailableJobs />} />
        <Route path="/logistics/quoted-jobs/:userId" element={<QuotedJobs />} />
        <Route path="/logistics/assigned-jobs/:userId" element={<AssignedJobs />} />
        <Route path="/logistics/route-suggestion/:userId/:id" element={<RouteSuggestion />} />
        <Route path="/logistics/route-summary/:userId" element={<RouteSummary />} />
        <Route path="/logistics/invoice/:userId" element={<LogisticsInvoice />} />
        <Route path="/logistics/profile/:userId" element={<LogisticsProfile />} />
        <Route path="/logistics/truck-recommendation/:id/:userId" element={<TruckRecommendation />} />
        <Route path="/logistics/driver-matching/:id/:userId" element={<DriverMatching />} />
      </Routes>
    </Router>
  );
}

export default App;
