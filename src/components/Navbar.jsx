import React, { useState, useEffect } from 'react';
import { Menu, X, LayoutDashboard, LogOut, ArrowRight, Layers, Sparkles } from 'lucide-react';
import { isUserLoggedIn, getStoredUser, logoutUser } from '../services/api';

/**
 * Enterprise Navigation Bar (Dark / Charcoal / Black Theme)
 * Compact height (h-14), restrained translucency, fine borders, crisp typography.
 * Links: Product, How it works, Features, FAQ.
 * Actions: Sign in, Get started (or Workspaces / Logout if authenticated).
 */
export default function Navbar({ onNavigate, user, onLogout, activeView, selectedBusiness }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authValid, setAuthValid] = useState(isUserLoggedIn());

  useEffect(() => {
    const handleAuth = (e) => {
      setAuthValid(e.detail?.isAuthenticated ?? isUserLoggedIn());
    };
    window.addEventListener('knowra_auth_change', handleAuth);
    return () => window.removeEventListener('knowra_auth_change', handleAuth);
  }, []);

  const isAuthenticated = authValid;
  const storedUser = user || getStoredUser();

  const handleLogoutClick = async () => {
    await logoutUser();
    if (onLogout) onLogout();
    if (onNavigate) onNavigate('home');
  };

  const scrollToSection = (sectionId) => {
    setMobileMenuOpen(false);
    if (activeView !== 'home' && onNavigate) {
      onNavigate('home');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
        else window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
      return;
    }
    const el = document.getElementById(sectionId);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If in active workspace shell, BusinessWorkspace provides its own header/sidebar
  if (activeView === 'workspace' && selectedBusiness) {
    return null;
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/60 backdrop-blur-xl border-b border-white/[0.08] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        
        {/* Brand Logo & Context */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => {
              if (activeView !== 'home' && onNavigate) onNavigate('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center space-x-2.5 group text-left focus:outline-none cursor-pointer"
          >
            <div className="w-7 h-7 rounded-md bg-[#F97316] text-black flex items-center justify-center transition-all group-hover:bg-[#EA580C] shadow-[0_2px_12px_rgba(249,115,22,0.35)]">
              <Layers className="w-3.5 h-3.5 text-black" />
            </div>
            <span className="text-[15px] font-semibold tracking-tight text-white group-hover:text-zinc-200 transition-colors">
              Knowra
            </span>
          </button>

          {activeView === 'dashboard' && (
            <div className="hidden sm:flex items-center space-x-2 text-xs font-mono text-zinc-500">
              <span>/</span>
              <span className="text-zinc-300 font-sans font-medium">Workspaces</span>
            </div>
          )}
        </div>

        {/* Public SaaS Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8 text-xs font-medium text-zinc-400">
          <button
            onClick={() => scrollToSection('product-showcase')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Product
          </button>
          <button
            onClick={() => scrollToSection('how-it-works')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            How it works
          </button>
          <button
            onClick={() => scrollToSection('features')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Features
          </button>
          <button
            onClick={() => scrollToSection('faq')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            FAQ
          </button>
        </nav>

        {/* Right Action Bar */}
        <div className="hidden md:flex items-center space-x-3">
          {isAuthenticated ? (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onNavigate && onNavigate('dashboard')}
                className="flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-medium bg-white/[0.04] text-zinc-200 border border-white/[0.08] hover:bg-white/[0.08] hover:text-white transition-colors cursor-pointer"
                title="Open Workspaces Dashboard"
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-zinc-400" />
                <span>Workspaces</span>
              </button>

              <button
                onClick={handleLogoutClick}
                className="p-1.5 rounded-md text-zinc-400 hover:text-white hover:bg-white/[0.08] transition-colors border border-transparent hover:border-white/[0.08] cursor-pointer"
                title="Sign Out"
                aria-label="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <button
                onClick={() => onNavigate && onNavigate('login')}
                className="text-xs font-medium text-zinc-300 hover:text-white px-3 py-1.5 transition-colors cursor-pointer"
              >
                Sign in
              </button>
              <button
                onClick={() => onNavigate && onNavigate('signup')}
                className="inline-flex items-center justify-center px-4 py-1.5 text-xs font-semibold text-black bg-[#F97316] hover:bg-[#EA580C] rounded-md transition-all shadow-[0_2px_12px_rgba(249,115,22,0.35)] active:scale-[0.98] cursor-pointer"
              >
                <span>Get started</span>
                <ArrowRight className="w-3 h-3 ml-1.5" />
              </button>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-zinc-400 hover:text-white rounded-md hover:bg-white/[0.06] focus:outline-none cursor-pointer"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0A0A0E] border-b border-white/[0.08] px-5 py-4 space-y-3 shadow-2xl animate-in fade-in duration-150">
          <div className="space-y-2">
            <button
              onClick={() => scrollToSection('product-showcase')}
              className="block w-full text-left text-xs font-medium text-zinc-300 hover:text-white py-1.5 cursor-pointer"
            >
              Product
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="block w-full text-left text-xs font-medium text-zinc-300 hover:text-white py-1.5 cursor-pointer"
            >
              How it works
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className="block w-full text-left text-xs font-medium text-zinc-300 hover:text-white py-1.5 cursor-pointer"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('faq')}
              className="block w-full text-left text-xs font-medium text-zinc-300 hover:text-white py-1.5 cursor-pointer"
            >
              FAQ
            </button>
          </div>

          {isAuthenticated ? (
            <div className="space-y-2 pt-3 border-t border-white/[0.08]">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigate && onNavigate('dashboard');
                }}
                className="block w-full text-left text-xs font-medium text-white py-1.5 cursor-pointer"
              >
                Workspaces
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogoutClick();
                }}
                className="block w-full text-left text-xs font-medium text-rose-400 py-1.5 cursor-pointer"
              >
                Sign out
              </button>
            </div>
          ) : (
            <div className="pt-3 border-t border-white/[0.08] flex flex-col space-y-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigate && onNavigate('login');
                }}
                className="w-full text-center text-xs font-medium text-zinc-300 py-2 border border-white/[0.1] rounded-md hover:bg-white/[0.06] cursor-pointer"
              >
                Sign in
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigate && onNavigate('signup');
                }}
                className="w-full inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-black bg-[#F97316] hover:bg-[#EA580C] rounded-md transition-colors shadow-[0_2px_12px_rgba(249,115,22,0.35)] cursor-pointer"
              >
                <span>Get started</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
