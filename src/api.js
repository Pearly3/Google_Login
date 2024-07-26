import axios from 'axios';
// Replace `YOUR_API_URL` with the actual URL of your Flask backend endpoint
const YOUR_API_URL = 'https://user-auth-backend-cown25ubvq-nw.a.run.app/api/test'; // Adjust to fit your actual Flask endpoint
const getTestData = async () => {
  try {
    const response = await axios.get(YOUR_API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching data from Flask API:', error);
    throw error;
  }
};
export default { getTestData };