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

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'admin-login' | 'admin' | 'legal'>('home');

  return (
    <div className="min-h-screen bg-white selection:bg-rose-200 selection:text-rose-900 scroll-smooth">
      <Navbar currentView={currentView as any} onNavigate={(view) => setCurrentView(view as any)} />
      
      {currentView === 'home' && (
        <>
          <main>
            <Hero />
            <Dashboard />
            <OrganizationsSection />
          </main>
          <TransparencyAndFooter onNavigate={setCurrentView} />
        </>
      )}

      {currentView === 'admin-login' && (
        <AdminLogin onLogin={() => setCurrentView('admin')} onBack={() => setCurrentView('home')} />
      )}
      
      {currentView === 'admin' && (
        <AdminView onBack={() => setCurrentView('home')} />
      )}

      {currentView === 'legal' && (
        <LegalView onBack={() => setCurrentView('home')} />
      )}
    </div>
  );
}
