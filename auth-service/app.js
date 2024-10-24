// app.js
const express = require('express');
const config = require('./config/index');
const authController = require('./controllers/auth');
const userRouter  = require('./routes/userRoutes');
const { createUser } = require('./controllers/userController');

const app = express();
app.use(express.json());
app.set('jwtSecretKey', config.jwtSecretKey);
app.set('tokenHeaderKey', config.tokenHeaderKey);

// app.post("/user/register",createUser );

// app.get("/user/validateToken", authController.validateToken);
app.use('/user',userRouter)

module.exports = app;