const jwt = require('jsonwebtoken');
const { expressjwt: jwtMiddleware } = require('express-jwt');

const jwtSecret = process.env.AUTH_TOKEN_SECRET;

const generateToken = (username) => {
  const payload = { username };
  const options = { expiresIn: '1h' };
  const token = jwt.sign(payload, jwtSecret, options);
  return token;
};


// Middleware to protect routes
const authenticateToken = jwtMiddleware({
  secret: jwtSecret,
  algorithms: ['HS256'],
});

module.exports = { generateToken, authenticateToken };