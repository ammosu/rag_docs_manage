const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const ENCRYPTION_KEY = Buffer.from(process.env.FILE_KEY, 'hex');
const IV_LENGTH = 16;

/**
 * 加密文件，刪除原始檔案，回傳加密檔案路徑
 */
function encryptFile(filePath) {
  const data = fs.readFileSync(filePath);
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
  const encrypted = Buffer.concat([cipher.update(data), cipher.final()]);
  const encryptedPath = `${filePath}.enc`;
  fs.writeFileSync(encryptedPath, Buffer.concat([iv, encrypted]));
  fs.unlinkSync(filePath);
  return encryptedPath;
}

module.exports = { encryptFile };