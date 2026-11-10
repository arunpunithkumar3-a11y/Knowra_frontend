import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Self-healing: Purge any legacy localhost cache or corrupted sessions from browser
try {
  const apiUrl = localStorage.getItem('knowra_api_url');
  if (apiUrl && (apiUrl.includes('localhost') || apiUrl.includes('127.0.0.1'))) {
    localStorage.removeItem('knowra_api_url');
  }
  // Expose global helper for manual cache reset
  window.clearKnowraCache = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.reload();
  };
} catch {}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
