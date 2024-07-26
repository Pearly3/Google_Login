import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Updated import
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App';
import RedirectPage from './components/RedirectPage';
import './index.css';
const CLIENT_ID = '30047748006-4k65n4ae11c21nssorujmv2dlb1ci1aa.apps.googleusercontent.com';
ReactDOM.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <Router>
        <Routes>
          <Route path="/" element={<App />} /> {/* Updated Route */}
          <Route path="/redirect" element={<RedirectPage />} /> {/* Updated Route */}
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  </React.StrictMode>,
  document.getElementById('root')
);