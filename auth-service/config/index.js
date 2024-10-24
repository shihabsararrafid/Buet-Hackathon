// config/index.js
const dotenv = require('dotenv');

dotenv.config();

const config = {
  port: process.env.PORT || 5000,
  jwtSecretKey: process.env.JWT_SECRET_KEY,
  tokenHeaderKey: process.env.TOKEN_HEADER_KEY,
};

module.exports = config;