const crypto = require('crypto');

// Generate RSA key pair for the backend
const generateKeys = () => {
  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 4096,
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
  });
  return { publicKey, privateKey };
}

const encrypt = (pubKey, data) => {
  const encryptedData = crypto.publicEncrypt(
    {
      key: pubKey,
    },
    Buffer.from(data, 'utf8')
  );

  return encryptedData.toString('base64');
};

const decrypt = (privateKey, data) => {
  const decryptedData = crypto.privateDecrypt(
    {
      key: privateKey,
    },
    Buffer.from(data, 'base64')
  );

  return decryptedData.toString();
}

const decryptAll = (privateKey, data) => {
  return data.map((item) => {
    return decrypt(privateKey, item);
  });
}


module.exports = { generateKeys, decrypt, encrypt, decryptAll };