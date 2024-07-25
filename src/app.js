import { GoogleLogin } from '@react-oauth/google';
import './App.css';
function App() {
  const responseMessage = (response) => {
    console.log(response);
};
const errorMessage = (error) => {
    console.log(error);
};
  return (
    <div className='App' >
      <h2>React Google Sign-In</h2>
            <GoogleLogin
            className="sign"
  onSuccess={credentialResponse => {
    console.log(credentialResponse);
  }}
  onError={() => {
    console.log('Login Failed');
  }}
/>    </div>
  );
}
export default App;