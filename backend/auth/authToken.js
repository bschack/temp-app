const jwt = require('jsonwebtoken');

const secretKey = process.env.AUTH_TOKEN_SECRET;

const generateToken = (username) => {
  const payload = { username };
  const options = { expiresIn: '1h' };
  const token = jwt.sign(payload, secretKey, options);
  return token;
};

// Middleware to authenticate JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];


  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
};

// Middleware to protect routes
// const authenticateToken = jwtMiddleware({
//   secret: jwtSecret,
//   algorithms: ['HS256'],
// });

module.exports = { generateToken, authenticateToken };