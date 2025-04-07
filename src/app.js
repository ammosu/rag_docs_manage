const express = require('express');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

dotenv.config();

const app = express();
app.use(express.json());

// 提供靜態前端頁面
app.use(express.static('public'));

// JWT 驗證中介軟體（示範，未啟用）
// app.use((req, res, next) => {
//   const token = req.headers['authorization']?.split(' ')[1];
//   if (!token) return res.status(401).json({ error: 'No token provided' });
//   try {
//     req.user = jwt.verify(token, process.env.JWT_SECRET);
//     next();
//   } catch {
//     res.status(403).json({ error: 'Invalid token' });
//   }
// });

// 預留路由
app.get('/', (req, res) => {
  res.send('RAG 文檔管理系統後端運行中');
});

// 掛載API路由
const uploadRoutes = require('./routes/uploadRoutes');
app.use('/api/upload', uploadRoutes);

const documentRoutes = require('./routes/documentRoutes');
app.use('/api/documents', documentRoutes);

const searchRoutes = require('./routes/searchRoutes');
app.use('/api/search', searchRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});