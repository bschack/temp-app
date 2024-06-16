const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login requests per windowMs
  message: 'Too many login attempts, please try again later.',
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, 
  max: 1, 
  message: 'Too many registration attempts, please try again later.',
});

const requestLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 min
  max: 5, // 5 requests per windowMs
  message: 'Too many requests.',
});

module.exports = { loginLimiter, registerLimiter, requestLimiter };