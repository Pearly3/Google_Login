import React, { useEffect } from 'react';
const GoogleSignIn = () => {
  useEffect(() => {
    const loadGapi = () => {
      window.gapi.load('auth2', () => {
        window.gapi.auth2.init({
          client_id: 'YOUR_CLIENT_ID.apps.googleusercontent.com', // Replace with your client ID
        }).then(() => {
          window.gapi.signin2.render('google-signin-button', {
            scope: 'profile email',
            longtitle: true,
            theme: 'dark',
            onsuccess: handleSignIn,
            onfailure: handleSignInFailure,
          });
        });
      });
    };
    if (!window.gapi) {
      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/platform.js';
      script.onload = loadGapi;
      document.body.appendChild(script);
    } else {
      loadGapi();
    }
  }, []);
  const handleSignIn = (googleUser) => {
    const profile = googleUser.getBasicProfile();
    const email = profile.getEmail();
    // Redirect to the redirect page with the email as a query parameter
    window.location.href = `/redirect?email=${encodeURIComponent(email)}`;
  };
  const handleSignInFailure = (error) => {
    console.error('Google Sign-In error:', error);
  };
  return (
    <div>
      <div id="google-signin-button"></div>
    </div>
  );
};
export default GoogleSignIn;