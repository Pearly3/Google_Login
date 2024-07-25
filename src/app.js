import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import './App.css';
function App() {
  const navigate = useNavigate();
  const responseMessage = (response) => {
    const credential = response.credential;
    const decoded = jwt_decode(credential);
    const email = decoded.email;
    // Redirect to the redirect page with the email as a query parameter
    navigate(`/redirect?email=${encodeURIComponent(email)}`);
  };
  const errorMessage = (error) => {
    console.log(error);
  };
  return (
    <div className='App'>
      <h2>React Google Sign-In</h2>
      <GoogleLogin
        onSuccess={responseMessage}
        onError={errorMessage}
      />
    </div>
  );
}
export default App;