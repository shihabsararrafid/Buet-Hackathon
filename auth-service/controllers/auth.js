// controllers/auth.js
const jwt = require('jsonwebtoken');

const generateToken = (req, res) => {
  // Validate User Here
  // Then generate JWT Token

  const data = {
    time: Date(),
    userId: 12,
  };

  const token = jwt.sign(data, req.app.get('jwtSecretKey'));

  res.send(token);
};

const validateToken = (req, res) => {
  try {
    const token = req.header(req.app.get('tokenHeaderKey'));
    console.log(token,req.app.get('tokenHeaderKey'));
    const verified = jwt.verify(token, req.app.get('jwtSecretKey'));
    if (verified) {
      return res.send("Successfully Verified");
    } else {
      // Access Denied
      return res.status(401).send({ error: 'Invalid token' });
    }
  } catch (error) {
    // Access Denied
    return res.status(401).send({ error: 'Invalid token' });
  }
};

module.exports = { generateToken, validateToken };