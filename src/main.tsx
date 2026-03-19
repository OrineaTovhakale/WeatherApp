import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import AppProvider from './context/AppContext.tsx';

// ─── Service worker registration ──────────────────────
// Must be called at module level, NOT inside a useEffect outside a component
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then(registration => {
        console.log('Service worker registered:', registration.scope);
      })
      .catch(err => {
        console.error('Service worker registration failed:', err);
      });
  });
}

// ─── Notification permission request ──────────────────
if ('Notification' in window && Notification.permission === 'default') {
  Notification.requestPermission();
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AppProvider>
  </React.StrictMode>
);