import React from 'react';
import ReactDOM from 'react-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './app';
import './index.css';
const CLIENT_ID = '30047748006-4k65n4ae11c21nssorujmv2dlb1ci1aa.apps.googleusercontent.com'; // Replace with your actual client ID
ReactDOM.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>,
  document.getElementById('root')
);