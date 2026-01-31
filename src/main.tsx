import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
// Tokens are now imported via index.css to share Tailwind context

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
