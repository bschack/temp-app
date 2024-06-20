const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const next = require('next');
const path = require('path');
const crypto = require('crypto');

const { body, validationResult } = require('express-validator');

const { validateUser, registerUser } = require('./helpers/scanTable');
const { generateToken, authenticateToken } = require('./auth/authToken');
const { loginLimiter, requestLimiter } = require('./auth/limiters');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev, dir: path.join(__dirname, '../frontend') });
const handle = app.getRequestHandler();

const port = process.env.PORT || 3000;

app.prepare().then(() => {
  const server = express();

  server.use(bodyParser.json());
  server.use(bodyParser.urlencoded({ extended: true }));

  // Middleware to generate a nonce and set CSP headers
  server.use((req, res, next) => {
    res.locals.nonce = crypto.randomBytes(16).toString('base64');

    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", `'nonce-${res.locals.nonce}'`],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", "data:"],
          connectSrc: ["'self'", "ws:"],
          fontSrc: ["'self'", "https:", "data:"],
          objectSrc: ["'none'"],
          frameSrc: ["'none'"],
          formAction: ["'self'"],
          frameAncestors: ["'self'"],
        },
      },
    })(req, res, next);
  });

  // API routes
  server.post('/api/register', requestLimiter, [
    body('username').isString().isLength({ min: 3 }),
    body('password').isLength({ min: 5 }),
  ], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    const registration = await registerUser(username, password);

    if (!registration.success) {
      return res.status(400).json({ error: registration.message });
    }

    res.status(201).json({ message: "Registration successful" });
  });

  server.post('/api/login', loginLimiter, [
    body('username').isString().isLength({ min: 3 }),
    body('password').isLength({ min: 5 }),
  ], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    const validUser = await validateUser(username, password);

    if (!validUser) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(username);

    res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'Strict' });
    res.json({ message: "Login successful", token });
  });

  // Secure endpoint
  server.get('/api/secure-data', requestLimiter, authenticateToken, (req, res) => {
    res.json({ message: 'This is secure data', user: req.auth, data: '42' });
  });

  // Catch all other routes and let Next.js handle them
  server.get('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`Server is running on http://localhost:${port}`);
  });
}).catch((ex) => {
  console.error(ex.stack);
  process.exit(1);
});
