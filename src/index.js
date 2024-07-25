import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './app';
import RedirectPage from './RedirectPage';
import './index.css';
const CLIENT_ID = '30047748006-4k65n4ae11c21nssorujmv2dlb1ci1aa.apps.googleusercontent.com'; // Replace with your actual client ID
ReactDOM.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <Router>
        <Switch>
          <Route exact path="/" component={App} />
          <Route path="/redirect" component={RedirectPage} />
        </Switch>
      </Router>
    </GoogleOAuthProvider>
  </React.StrictMode>,
  document.getElementById('root')
);