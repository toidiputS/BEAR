import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'
import './index.css';
import { registerSW } from 'virtual:pwa-register';

// Register PWA Service Worker
const updateSW = registerSW({
  onNeedRefresh() {
    // Show a prompt to user if needed, or just auto reload for now
  },
  onOfflineReady() {
    console.log('App is ready for offline work.');
  },
});

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);