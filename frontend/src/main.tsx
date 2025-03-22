import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { Auth0Provider } from '@auth0/auth0-react';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <Auth0Provider 
  domain="dev-tuouf7y62vubigch.us.auth0.com"
  clientId="XpbGCMVTYdPtvfoWwEnYZhoaHUEl5EcV"
  authorizationParams={{
    redirect_uri: window.location.origin,
    audience: 'https://erp-api.example.com'
  }}
    >
    <App />
  </Auth0Provider>
);
