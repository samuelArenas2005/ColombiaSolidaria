/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Dashboard from './components/Dashboard';
import OrganizationsSection from './components/OrganizationsSection';
import TransparencyAndFooter from './components/Footer';
import AdminView from './components/AdminView';
import AdminLogin from './components/AdminLogin';
import LegalView from './components/LegalView';
import GoogleFormView from './components/GoogleFormView';
import AccessibilityMenu from './components/AccessibilityMenu';
import { BusinessProvider, useBusinesses } from './context/BusinessContext';

function AppContent() {
  const [currentView, setCurrentView] = useState<'home' | 'admin-login' | 'admin' | 'legal' | 'google-form'>('home');
  const { user } = useBusinesses();

  const handleNavigate = (view: 'home' | 'admin-login' | 'admin' | 'legal' | 'google-form') => {
    if (view === 'admin') {
      // Guarded Private Route: Require authentication for Admin View
      if (!user) {
        setCurrentView('admin-login');
        return;
      }
    }
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white selection:bg-rose-200 selection:text-rose-900 scroll-smooth">
      <AccessibilityMenu />
      <Navbar currentView={currentView} onNavigate={handleNavigate} />
      
      {currentView === 'home' && (
        <>
          <main>
            <Hero onNavigate={handleNavigate} />
            <Dashboard />
            <OrganizationsSection />
          </main>
          <TransparencyAndFooter onNavigate={handleNavigate} />
        </>
      )}

      {currentView === 'google-form' && (
        <GoogleFormView onBack={() => handleNavigate('home')} />
      )}

      {currentView === 'admin-login' && (
        <AdminLogin 
          onLogin={() => setCurrentView('admin')} 
          onBack={() => setCurrentView('home')} 
        />
      )}
      
      {currentView === 'admin' && (
        user ? (
          <AdminView onBack={() => setCurrentView('home')} />
        ) : (
          <AdminLogin 
            onLogin={() => setCurrentView('admin')} 
            onBack={() => setCurrentView('home')} 
          />
        )
      )}

      {currentView === 'legal' && (
        <LegalView onBack={() => setCurrentView('home')} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <BusinessProvider>
      <AppContent />
    </BusinessProvider>
  );
}
