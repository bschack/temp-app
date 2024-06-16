const bcrypt = require('bcryptjs');

const hashPassword = (password) => {
  const hashedPassword = bcrypt.hashSync(password, 10);
  return hashedPassword;
}

const verifyPassword = (plainPassword, hashedPassword) => {
  const match = bcrypt.compareSync(plainPassword, hashedPassword);
  return match;
}

module.exports = { hashPassword, verifyPassword };

