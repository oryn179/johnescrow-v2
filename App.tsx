import React from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { CreateEscrow } from './pages/CreateEscrow';
import { AdminDashboard } from './pages/AdminDashboard';
import { Profile } from './pages/Profile';
import { UserRole } from './types';

// Generic placeholder page for static links
const PlaceholderPage: React.FC<{ title: string }> = ({ title }) => (
  <div className="max-w-7xl mx-auto px-4 py-20 text-center animate-fade-in">
    <h1 className="text-4xl font-bold text-brand-dark dark:text-white mb-4">{title}</h1>
    <p className="text-gray-500">This page is under construction for the demo.</p>
    <a href="/" className="inline-block mt-8 text-brand-gold hover:underline">Return Home</a>
  </div>
);

const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-brand-darker"><div className="w-10 h-10 border-4 border-brand-gold border-t-transparent rounded-full animate-spin"></div></div>;
  
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

const AdminRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-brand-darker"><div className="w-10 h-10 border-4 border-brand-gold border-t-transparent rounded-full animate-spin"></div></div>;

  if (!isAuthenticated || user?.role !== UserRole.ADMIN) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Static Pages */}
        <Route path="/how-it-works" element={<PlaceholderPage title="How It Works" />} />
        <Route path="/services" element={<PlaceholderPage title="Services" />} />
        <Route path="/pricing" element={<PlaceholderPage title="Pricing" />} />
        <Route path="/contact" element={<PlaceholderPage title="Contact Us" />} />
        <Route path="/about" element={<PlaceholderPage title="About Johnescrow" />} />

        {/* Protected User Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/create-escrow" element={<ProtectedRoute><CreateEscrow /></ProtectedRoute>} />
        <Route path="/track/:id" element={<PlaceholderPage title="Transaction Details" />} />

        {/* Protected Admin Routes */}
        <Route path="/admin-dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
      </Routes>
    </Layout>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <HashRouter>
          <AppRoutes />
        </HashRouter>
      </DataProvider>
    </AuthProvider>
  );
}