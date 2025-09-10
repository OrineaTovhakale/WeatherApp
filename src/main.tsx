import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import AppProvider from './context/AppContext.tsx'
import { useEffect } from 'react';


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AppProvider>
  </React.StrictMode>,
)
useEffect(() => {
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    navigator.serviceWorker.register('/service-worker.js');
    // Request permission
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        // Subscribe and send to server if needed; for simplicity, local alert simulation
      }
    });
  }
}, []);