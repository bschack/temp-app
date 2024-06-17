const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { body, validationResult } = require('express-validator');
// const csrf = require('csurf');
const helmet = require('helmet');

const { paginatedScanUsingPaginator } = require('./helpers/scanTable');
const { validateUser, registerUser } = require('./helpers/scanTable');
const { generateToken, authenticateToken } = require('./auth/authToken');
const { loginLimiter, requestLimiter, registerLimiter } = require('./auth/limiters');

const app = express();
const port = 8080;

app.use(helmet());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// CSRF protection 
// const csrfProtection = csrf({ cookie: true });
// app.use(csrfProtection);

app.post('/register', requestLimiter, [
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

app.post('/login', loginLimiter, [
  body('username').isString().isLength({ min: 3 }),
  body('password').isLength({ min: 5 }),
], async(req, res) => {
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

  res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'strict' });
  res.json({ message: "Login successful", token });
});

// Endpoint to get CSRF token
// app.get('/csrf-token', (req, res) => {
//   try {
//     const csrfToken = req.csrfToken();
//     res.cookie('csrfToken', csrfToken, { httpOnly: true, secure: true, sameSite: 'strict' });
//     res.json({ csrfToken });
//   } catch (error) {
//     console.error('Error generating CSRF token:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// Secure endpoint
app.get('/secure-data', requestLimiter, authenticateToken, (req, res) => {
  res.json({ message: 'This is secure data', user: req.auth, data: '42' });
});

app.use((err, req, res, next) => {
  if (err.code === 'EBADCSRFTOKEN') {
      // Handle CSRF token errors
      res.status(403).send('CSRF Protection Error');
  } else {
      // Handle other errors
      next(err);
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});