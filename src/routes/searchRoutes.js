const express = require('express');
const { search } = require('../controllers/searchController');

const router = express.Router();

/**
 * @openapi
 * /api/search:
 *   post:
 *     summary: 搜尋文件
 *     tags:
 *       - Search
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               query:
 *                 type: string
 *     responses:
 *       200:
 *         description: 搜尋結果
 *       400:
 *         description: 請求格式錯誤
 */
router.post('/', search);

module.exports = router;