const request = require('supertest');
const app = require('../../server'); // Убедись, что путь правильный

describe('API Ping Test', () => {
  it('Должен ответить 200 OK на GET /ping', async () => {
    const res = await request(app).get('/ping');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: 'pong' });
  });
});
