import { GoogleLogin } from '@react-oauth/google';
import './App.css';
import { useHistory } from "react-router-dom";
function App() {
  const history = useHistory();
  const responseMessage = (response) => {
    const credential = response.credential;
    const decoded = jwt_decode(credential);
    const email = decoded.email;
    
    // Store email in local storage
    localStorage.setItem('email', email);
    // Redirect to the redirect page
    history.push('/redirect');
  };
  const errorMessage = (error) => {
    console.log(error);
  };
  return (
    <div className='App'>
      <h2>React Google Sign-In</h2>
      <GoogleLogin
        className="sign"
        onSuccess={responseMessage}
        onError={errorMessage}
      />
    </div>
  );
}
export default App;