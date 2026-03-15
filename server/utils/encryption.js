const CryptoJS = require("crypto-js");

const encryptData = (data) => {
  if (!data) return data;
  return CryptoJS.AES.encrypt(data, process.env.AES_SECRET_KEY).toString();
};

const decryptData = (ciphertext) => {
  if (!ciphertext) return ciphertext;
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, process.env.AES_SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    return ciphertext; // Return original if decryption fails
  }
};

module.exports = { encryptData, decryptData };