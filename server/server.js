const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
// Middleware to set headers that fix COOP error
app.use((req, res, next) => {
  res.header('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  res.header('Cross-Origin-Embedder-Policy', 'unsafe-none');
  next();
});
// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../build')));
// All other routes go to the React app
app.get('', (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});