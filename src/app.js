const express = require('express');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

app.use(express.static('public'));

// 初始化 passport
app.use(passport.initialize());

// 設定 Google OAuth2 策略
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
}, (accessToken, refreshToken, profile, done) => {
  // 這裡可整合資料庫，示範直接回傳 profile
  done(null, profile);
}));

// 啟動 Google OAuth2 流程
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google OAuth2 callback
app.get('/auth/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/' }),
  (req, res) => {
    const user = req.user;
    const payload = {
      id: user.id,
      displayName: user.displayName,
      emails: user.emails,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    // redirect 回前端首頁，並帶上 token
    res.redirect('/?token=' + token);
  }
);

// 預留路由
app.get('/', (req, res) => {
  res.send('RAG 文檔管理系統後端運行中');
});

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'RAG 文檔管理系統 API',
      version: '1.0.0',
    },
    servers: [
      { url: 'http://localhost:3000' }
    ],
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 掛載API路由
const uploadRoutes = require('./routes/uploadRoutes');
app.use('/api/upload', uploadRoutes);

const documentRoutes = require('./routes/documentRoutes');
app.use('/api/documents', documentRoutes);

const searchRoutes = require('./routes/searchRoutes');
app.use('/api/search', searchRoutes);

const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

const workspaceRoutes = require('./routes/workspaceRoutes');
app.use('/api', workspaceRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: '伺服器錯誤' });
});

module.exports = app;