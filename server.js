const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('Hello from Zion Memorial Garden! ✅');
});

app.get('/test', (req, res) => {
    res.send('Test route is working! ✅');
});

module.exports = app;
