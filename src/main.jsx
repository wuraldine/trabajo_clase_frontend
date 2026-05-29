import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './App.jsx';
import AuthProviderServer from './contexts/AuthContextServer';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProviderServer>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProviderServer>
  </StrictMode>
);