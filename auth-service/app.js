// app.js
const express = require('express');
const config = require('./config/index');
const authController = require('./controllers/auth');

const app = express();

app.set('jwtSecretKey', config.jwtSecretKey);
app.set('tokenHeaderKey', config.tokenHeaderKey);

app.post("/user/generateToken", authController.generateToken);

app.get("/user/validateToken", authController.validateToken);

module.exports = app;