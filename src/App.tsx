/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Dashboard from './components/Dashboard';
import OrganizationsSection from './components/OrganizationsSection';
import TransparencyAndFooter from './components/Footer';
import AdminView from './components/AdminView';
import AdminLogin from './components/AdminLogin';
import LegalView from './components/LegalView';
import CategoriesView from './components/CategoriesView';
import AccessibilityMenu from './components/AccessibilityMenu';
import { BusinessProvider, useBusinesses } from './context/BusinessContext';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user } = useBusinesses();
  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <div className="min-h-screen bg-white selection:bg-rose-200 selection:text-rose-900 scroll-smooth">
      <AccessibilityMenu />
      <Routes>
        <Route path="/" element={
          <>
            <Navbar />
            <main>
              <Hero />
              <Dashboard />
              <OrganizationsSection />
            </main>
            <TransparencyAndFooter />
          </>
        } />

        <Route path="/admin/login" element={<AdminLogin />} />

        <Route path="/admin" element={
          <PrivateRoute>
            <AdminView />
          </PrivateRoute>
        } />

        <Route path="/legal" element={
          <>
            <Navbar />
            <LegalView />
          </>
        } />

        <Route path="/categorias" element={
          <>
            <Navbar />
            <CategoriesView />
          </>
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <BusinessProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </BusinessProvider>
  );
}
