import React, { useEffect, useState } from 'react';
import api from '../api';
const FetchData = () => {
  const [data, setData] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await api.getTestData();
        setData(result.message);
      } catch (error) {
        console.error('Error fetching data from Flask:', error);
      }
    };
    fetchData();
  }, []);
  return (
    <div>
      <h1>Data from Flask:</h1>
      {data ? <p>{data}</p> : <p>Loading...</p>}
    </div>
  );
};
export default FetchData;