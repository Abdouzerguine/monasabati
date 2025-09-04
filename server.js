const express = require('express');
const app = express();






});  res.sendFile(path.join(__dirname, 'node_modules', 'expo-router', 'entry.bundle'));  res.type('application/javascript');app.get('/node_modules/expo-router/entry.bundle', (req, res) => {const path = require('path');const path = require('path');

// Serve static files from node_modules
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));

app.listen(8082, () => {
  console.log('Server running on port 8082');
});