const prisma = require('../db/prismaClient');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { username, email, password } = req.body;
  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username },
          { email }
        ]
      }
    });
    if (existingUser) {
      return res.status(400).json({ error: '使用者名稱或Email已存在' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        username,
        email,
        password: passwordHash,
        role: 'user'
      }
    });

    res.status(201).json({ message: '註冊成功' });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({
      error: '伺服器錯誤',
      message: err.message,
      details: JSON.stringify(err)
    });
  }
};

const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { username, password } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: { username }
    });
    if (!user) return res.status(400).json({ error: '帳號或密碼錯誤' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: '帳號或密碼錯誤' });

    const token = jwt.sign(
      { userId: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token });
  } catch (err) {
   console.error('Login error:', err);
   res.status(500).json({
     error: '伺服器錯誤',
     message: err.message,
     details: JSON.stringify(err)
   });
 }
};

async function listUsers(req, res) {
 try {
   const users = await prisma.user.findMany();
   res.json(users);
 } catch (err) {
   console.error(err);
   res.status(500).json({ error: '查詢用戶失敗' });
 }
}

const getProfile = async (req, res) => {
 try {
   const user = await prisma.user.findUnique({
     where: { id: req.user.userId }
   });
   if (!user) return res.status(404).json({ error: '使用者不存在' });
   res.json(user);
 } catch (err) {
   console.error(err);
   res.status(500).json({ error: '取得個人資料失敗' });
 }
};
async function getUserWorkspaces(req, res) {
  const { userId } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { workspaces: true }
    });
    if (!user) return res.status(404).json({ error: '使用者不存在' });
    res.json(user.workspaces);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '查詢使用者 Workspace 失敗' });
  }
}


module.exports = {
 register,
 login,
 getProfile,
 listUsers,
 getUserWorkspaces
};