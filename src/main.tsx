import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import './core/theme/tokens.css'; // Importing tokens here to be safe and helpful

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
