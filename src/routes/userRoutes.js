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
router.post('/register', [
  body('username').isLength({ min: 3 }).withMessage('使用者名稱至少3字'),
  body('email').isEmail().withMessage('Email格式錯誤'),
  body('password').isLength({ min: 6 }).withMessage('密碼至少6字')
], register);

// 登入
router.post('/login', [
  body('username').notEmpty().withMessage('請輸入使用者名稱'),
  body('password').notEmpty().withMessage('請輸入密碼')
], login);

// 取得個人資料
router.get('/profile', authenticateJWT, getProfile);

router.get('/:userId/workspaces', require('../controllers/userController').getUserWorkspaces);

router.get('/', listUsers);

module.exports = router;