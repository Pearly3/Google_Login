import React from 'react';
function RedirectPage() {
  const email = localStorage.getItem('email');
  return (
    <div>
      <h1>Redirect Page</h1>
      {email ? (
        <p>The Gmail email used to log in is: {email}</p>
      ) : (
        <p>No email found!</p>
      )}
    </div>
  );
}
export default RedirectPage;