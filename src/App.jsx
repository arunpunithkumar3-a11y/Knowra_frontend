import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import AuthPage from './components/AuthPage';
import ResetPassword from './components/ResetPassword';
import Dashboard from './components/Dashboard';
import BusinessWorkspace from './components/BusinessWorkspace';
import PublicWidgetModal from './components/PublicWidgetModal';
import ErrorBoundary from './components/ErrorBoundary';
import CinematicHero from './components/CinematicHero';
import ProductShowcase from './components/ProductShowcase';
import HowItWorks from './components/HowItWorks';
import FeaturesSection from './components/FeaturesSection';
import CustomerInsightsPreview from './components/CustomerInsightsPreview';
import FAQSection from './components/FAQSection';
import FinalCTA from './components/FinalCTA';
import Footer from './components/Footer';
import { getAccessToken, getRefreshToken, getValidAccessToken, getStoredUser, isUserLoggedIn, clearAuthTokens } from './services/api';

/**
 * Knowra AI — Primary Application Controller (Dark / Black Theme)
 * High-end enterprise SaaS platform with a pure black aesthetic.
 * Strictly separates the public marketing presentation from the authenticated workspace shell.
 */
export default function App() {
  const [currentView, setCurrentView] = useState('home'); // 'home' | 'login' | 'signup' | 'dashboard' | 'workspace' | 'reset-password'
  const [currentUser, setCurrentUser] = useState(getStoredUser());
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [publicWidgetKey, setPublicWidgetKey] = useState(null);
  const [resetToken, setResetToken] = useState(null);

  useEffect(() => {
    // Detect password reset token in URL query params, hash, or pathname
    const params = new URLSearchParams(window.location.search);
    const tokenFromQuery = params.get('token') || params.get('reset_token');

    let tokenFromHash = null;
    if (window.location.hash) {
      const hashClean = window.location.hash.replace(/^#\/?/, '');
      const hashParams = new URLSearchParams(hashClean.includes('?') ? hashClean.split('?')[1] : hashClean);
      tokenFromHash = hashParams.get('token') || hashParams.get('reset_token');
    }

    let tokenFromPath = null;
    const pathname = window.location.pathname;
    const pathMatch = pathname.match(/\/(?:api\/v1\/auth\/|api\/auth\/)?password_reset_confirm\/([^/?#]+)/) ||
                      pathname.match(/\/(?:api\/v1\/auth\/|api\/auth\/)?reset[-_]password\/([^/?#]+)/);
    if (pathMatch && pathMatch[1]) {
      tokenFromPath = decodeURIComponent(pathMatch[1]);
    }

    const token = tokenFromQuery || tokenFromHash || tokenFromPath;
    if (token) {
      setResetToken(token);
      setCurrentView('reset-password');
    }
  }, []);

  // Proactively check / refresh access token on mount if a valid session exists
  useEffect(() => {
    if (isUserLoggedIn()) {
      getValidAccessToken().then((token) => {
        if (token) {
          const user = getStoredUser();
          if (user) setCurrentUser(user);
        }
      });
    } else if (getAccessToken() || getRefreshToken()) {
      clearAuthTokens();
    }
  }, []);

  // Listen to centralized authentication status changes
  useEffect(() => {
    const handleAuthChange = (e) => {
      const { isAuthenticated, user } = e.detail || {};
      if (isAuthenticated) {
        if (user) setCurrentUser(user);
      } else {
        setCurrentUser(null);
        setSelectedBusiness(null);
        if (currentView === 'dashboard' || currentView === 'workspace') {
          setCurrentView('login');
        }
      }
    };

    window.addEventListener('knowra_auth_change', handleAuthChange);
    return () => window.removeEventListener('knowra_auth_change', handleAuthChange);
  }, [currentView]);

  useEffect(() => {
    if (isUserLoggedIn() && (currentView === 'login' || currentView === 'signup')) {
      setCurrentView('dashboard');
    }
  }, [currentView]);

  const handleAuthSuccess = (userData) => {
    setCurrentUser(userData);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setSelectedBusiness(null);
    setCurrentView('home');
  };

  const handleSelectBusiness = (biz) => {
    setSelectedBusiness(biz);
    setCurrentView('workspace');
  };

  const handleGetStarted = () => {
    if (isUserLoggedIn()) {
      setCurrentView('dashboard');
    } else {
      setCurrentView('signup');
    }
  };

  return (
    <div className="min-h-screen bg-black text-[#EDEDED] flex flex-col font-sans selection:bg-[#F97316] selection:text-black">
      
      {/* Fixed Top Navigation Bar (Hidden when inside active BusinessWorkspace shell) */}
      <Navbar
        onNavigate={(view) => {
          if (view === 'dashboard' && !isUserLoggedIn()) {
            setCurrentView('login');
          } else {
            setCurrentView(view);
          }
        }}
        user={currentUser}
        onLogout={handleLogout}
        activeView={currentView}
        selectedBusiness={selectedBusiness}
      />

      {/* Main Content Area: home hero starts at top: 0 behind the transparent navbar */}
      <div className={`${currentView === 'workspace' || currentView === 'home' ? '' : 'pt-14'} flex-grow flex flex-col`}>
        <ErrorBoundary>
          {currentView === 'reset-password' ? (
            <ResetPassword
              token={resetToken || ''}
              onBackToLogin={() => {
                if (window.location.search || window.location.hash || window.location.pathname !== '/') {
                  window.history.replaceState({}, document.title, '/');
                }
                setResetToken(null);
                setCurrentView('login');
              }}
              onBackToHome={() => {
                if (window.location.search || window.location.hash || window.location.pathname !== '/') {
                  window.history.replaceState({}, document.title, '/');
                }
                setResetToken(null);
                setCurrentView('home');
              }}
            />
          ) : currentView === 'login' || currentView === 'signup' ? (
            <AuthPage
              initialMode={currentView}
              onNavigateResetPassword={(token) => {
                setResetToken(token || null);
                setCurrentView('reset-password');
              }}
              onBackToHome={() => setCurrentView('home')}
              onAuthSuccess={handleAuthSuccess}
            />
          ) : currentView === 'workspace' && selectedBusiness ? (
            <BusinessWorkspace
              business={selectedBusiness}
              onBack={() => {
                setSelectedBusiness(null);
                setCurrentView('dashboard');
              }}
              onUpdateBusiness={(updated) => setSelectedBusiness(updated)}
              onOpenPublicWidget={(key) => setPublicWidgetKey(key)}
            />
          ) : currentView === 'dashboard' ? (
            <Dashboard
              onSelectBusiness={handleSelectBusiness}
              onLogout={handleLogout}
            />
          ) : (
          /* ================= CINEMATIC SAAS PRODUCT LAUNCH LANDING PAGE ================= */
          <main className="flex-grow flex flex-col bg-black relative">
            
            {/* 1. CINEMATIC FULL-SCREEN 3D BACKGROUND HERO */}
            <CinematicHero
              onGetStarted={handleGetStarted}
              onSeeHowItWorks={() => {
                const el = document.getElementById('how-it-works');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {/* 2. REAL PRODUCT INTERFACE SHOWCASE */}
            <ProductShowcase />

            {/* 3. HOW IT WORKS (3 STEPS) */}
            <HowItWorks />

            {/* 4. VARIED EDITORIAL FEATURES */}
            <FeaturesSection />

            {/* 5. CUSTOMER QUESTION INSIGHTS PREVIEW */}
            <CustomerInsightsPreview />

            {/* 6. FREQUENTLY ASKED QUESTIONS */}
            <FAQSection />

            {/* 7. FINAL CALL TO ACTION */}
            <FinalCTA
              onGetStarted={handleGetStarted}
            />

          </main>
        )}
        </ErrorBoundary>

      </div>

      {/* Floating Public Widget Test Modal */}
      {publicWidgetKey && (
        <PublicWidgetModal
          publicKey={publicWidgetKey}
          onClose={() => setPublicWidgetKey(null)}
        />
      )}

      {/* Monochromatic Enterprise Footer (Public / Main views) */}
      {currentView !== 'workspace' && (
        <Footer onNavigate={(view) => setCurrentView(view)} />
      )}

    </div>
  );
}
