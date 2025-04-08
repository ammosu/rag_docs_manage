const request = require('supertest');
const app = require('../src/app'); // 需確保app.js導出app實例

describe('使用者註冊與登入', () => {
  it('應該成功註冊新使用者', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send({
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'password123'
      });
    expect(res.statusCode).toBe(201);
  });

  it('應該成功登入', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({
        username: 'testuser',
        password: 'password123'
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });
});

describe('權限管理 - 個人資料存取', () => {
  let token;

  beforeAll(async () => {
    // 先登入取得 token
    const res = await request(app)
      .post('/api/users/login')
      .send({
        username: 'testuser',
        password: 'password123'
      });
    token = res.body.token;
  });

  it('應該使用有效token成功取得個人資料', async () => {
    const res = await request(app)
      .get('/api/users/profile')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('username');
    expect(res.body).toHaveProperty('email');
  });

  it('未帶token應回傳401', async () => {
    const res = await request(app)
      .get('/api/users/profile');
    expect(res.statusCode).toBe(401);
  });

  it('帶無效token應回傳403', async () => {
    const res = await request(app)
      .get('/api/users/profile')
      .set('Authorization', 'Bearer invalidtoken');
    expect(res.statusCode).toBe(403);
  });
});