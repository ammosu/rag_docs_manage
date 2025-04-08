const express = require('express');
const multer = require('multer');
const { handleUpload } = require('../controllers/uploadController');

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    // 修正中文亂碼
    const utf8Name = Buffer.from(file.originalname, 'latin1').toString('utf8');
    // 保留原始副檔名
    const ext = utf8Name.substring(utf8Name.lastIndexOf('.'));
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + ext);
    // 將修正後的檔名存回 file.originalname，供後續使用
    file.originalname = utf8Name;
  }
});
const upload = multer({ storage });

/**
 * @openapi
 * /api/upload:
 *   post:
 *     summary: 上傳單一檔案
 *     tags:
 *       - Upload
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: 上傳成功
 *       400:
 *         description: 上傳失敗
 */
router.post('/', upload.single('file'), handleUpload);

module.exports = router;