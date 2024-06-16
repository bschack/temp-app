const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const { generateKeys, decryptAll } = require('./helpers/crypto');
const { paginatedScanUsingPaginator } = require('./helpers/scanTable');
const { validateUser, registerUser } = require('./helpers/scanTable');
const { generateToken, authenticateToken } = require('./auth/authToken');

const app = express();
const port = 8080;

const { publicKey, privateKey } = generateKeys();

app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());

app.get('/', (req, res) => {
  let ip = req.ip;
  console.log(`Request from ${ip}`);
  paginatedScanUsingPaginator();
  res.send('Hello World!');
});

// Endpoint to provide the backend's public key to the frontend
app.get('/public-key', (req, res) => {
  let ip = req.ip;
  console.log(`Public key request from ${ip}`);
  res.json({ publicKey });
});

app.get('/protected', authenticateToken, (req, res) => {
  res.status(200).json({ message: 'This is a protected route', user: req.user });
});

/**
 * User endpoints
 */

app.post('/login', async(req, res) => {
  const { username, password } = req.body;

  // Check if username and password are defined
  if (!username || !password) {
    return res.status(400).json({ error: 'Invalid request body' });
  }

  const decrypted = decryptAll(privateKey, [username, password]);

  const validUser = await validateUser(decrypted[0], decrypted[1]);

  if (!validUser) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = generateToken(decrypted[0]);

  res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'strict' });
  res.json({ message: "Login successful" });
});

app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Invalid request body' });
  }

  const decrypted = decryptAll(privateKey, [username, password]);

  const registration = await registerUser(decrypted[0], decrypted[1]);

  if (!registration.success) {
    return res.status(400).json({ error: registration.message });
  }

  res.json({ message: "Registration successful" });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});