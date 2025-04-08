const express = require('express');
const { body } = require('express-validator');
const { register, login, getProfile, listUsers } = require('../controllers/userController');
const jwt = require('jsonwebtoken');

const router = express.Router();

// JWT驗證中介軟體
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: '未提供Token' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token格式錯誤' });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(403).json({ error: 'Token無效' });
  }
};

// 註冊
/**
 * @openapi
 * /api/users/register:
 *   post:
 *     summary: 使用者註冊
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: 註冊成功
 *       400:
 *         description: 請求格式錯誤
 */
router.post('/register', [
  body('username').isLength({ min: 3 }).withMessage('使用者名稱至少3字'),
  body('email').isEmail().withMessage('Email格式錯誤'),
  body('password').isLength({ min: 6 }).withMessage('密碼至少6字')
], register);

// 登入
/**
 * @openapi
 * /api/users/login:
 *   post:
 *     summary: 使用者登入
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: 登入成功
 *       401:
 *         description: 認證失敗
 */
router.post('/login', [
  body('username').notEmpty().withMessage('請輸入使用者名稱'),
  body('password').notEmpty().withMessage('請輸入密碼')
], login);

// 取得個人資料
/**
 * @openapi
 * /api/users/profile:
 *   get:
 *     summary: 取得個人資料
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 個人資料
 *       401:
 *         description: 未授權
 */
router.get('/profile', authenticateJWT, getProfile);

/**
 * @openapi
 * /api/users/{userId}/workspaces:
 *   get:
 *     summary: 取得用戶的工作區列表
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: 使用者ID
 *     responses:
 *       200:
 *         description: 工作區列表
 *       404:
 *         description: 找不到使用者
 */
router.get('/:userId/workspaces', require('../controllers/userController').getUserWorkspaces);

/**
 * @openapi
 * /api/users:
 *   get:
 *     summary: 取得所有使用者
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: 使用者列表
 */
router.get('/', listUsers);

module.exports = router;