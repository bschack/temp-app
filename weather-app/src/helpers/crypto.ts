import NodeRSA from 'node-rsa';

export const decrypt = (encryptedMessage: string, key: NodeRSA.Key): string => {
  const priv = key.exportKey();
  const pub = key.exportKey('public');
  // console.log(priv)
  // console.log(pub)
  // console.log(encryptedMessage)
  const decryptedMessage = key.decrypt(encryptedMessage, 'base64');
  return decryptedMessage;
}

export const encrypt = (message: string, key: string): string => {
  const k = new NodeRSA(key);
  const encryptedMessage = k.encrypt(message, 'base64');
  return encryptedMessage;
}