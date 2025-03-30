// tests/integration/api.routes.test.js
const request = require('supertest');
const app = require('../../server');
const { sequelize } = require('../../models');

describe('API Routes Integration Tests', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('Projects CRUD', () => {
    let testProjectId;

    test('POST /api/projects - создание проекта', async () => {
      const response = await request(app)
        .post('/api/projects')
        .send({
          name: 'Тестовый проект',
          description: 'Описание тестового проекта',
          discountRate: 10,
          years: 5
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe('Тестовый проект');
      testProjectId = response.body.id;
    });

    test('GET /api/projects - получение списка проектов', async () => {
      const response = await request(app)
        .get('/api/projects')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(1);
      expect(response.body[0].id).toBe(testProjectId);
    });
  });

  describe('Cash Flows Operations', () => {
    let testProjectId;

    beforeAll(async () => {
      const response = await request(app)
        .post('/api/projects')
        .send({
          name: 'Проект для денежных потоков',
          discountRate: 12,
          years: 3
        });
      testProjectId = response.body.id;
    });

    test('POST /api/cashflows - добавление денежных потоков', async () => {
      const cashFlows = [
        { projectId: testProjectId, year: 1, revenue: 1000, opex: 500, capex: 2000 },
        { projectId: testProjectId, year: 2, revenue: 1500, opex: 600, capex: 1000 },
        { projectId: testProjectId, year: 3, revenue: 2000, opex: 700, capex: 500 }
      ];

      const response = await request(app)
        .post('/api/cashflows')
        .send(cashFlows)
        .expect(201);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(3);
    });
  });

  describe('Calculation Flow', () => {
    let testProjectId;

    beforeAll(async () => {
      const projectRes = await request(app)
        .post('/api/projects')
        .send({
          name: 'Проект для расчетов',
          discountRate: 15,
          years: 3
        });
      testProjectId = projectRes.body.id;

      const cashFlows = [
        { projectId: testProjectId, year: 1, revenue: 2000, opex: 800, capex: 3000 },
        { projectId: testProjectId, year: 2, revenue: 3000, opex: 900, capex: 1000 },
        { projectId: testProjectId, year: 3, revenue: 4000, opex: 1000, capex: 500 }
      ];

      await request(app)
        .post('/api/cashflows')
        .send(cashFlows);
    });

    test('POST /api/calculate - выполнение расчетов', async () => {
      const response = await request(app)
        .post('/api/calculate')
        .send({ projectId: testProjectId })
        .expect(200);

      expect(response.body).toHaveProperty('npv');
      expect(response.body).toHaveProperty('irr');
      expect(response.body).toHaveProperty('pp');
      expect(response.body).toHaveProperty('dpp');
    });

    test('GET /api/results/:projectId - получение результатов', async () => {
      const response = await request(app)
        .get(`/api/results/${testProjectId}`)
        .expect(200);

      expect(response.body).toHaveProperty('npv');
      expect(response.body).toHaveProperty('irr');
      expect(response.body).toHaveProperty('pp');
      expect(response.body).toHaveProperty('dpp');
    });
  });

  describe('Error Handling', () => {
    test('POST /api/projects - ошибка при невалидных данных', async () => {
      const response = await request(app)
        .post('/api/projects')
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/обязательные поля/i);
    });

    test('GET /api/results/:id - ошибка при несуществующем проекте', async () => {
      const nonExistentId = 9999;
      const response = await request(app)
        .get(`/api/results/${nonExistentId}`)
        .expect(404);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/не найден/i);
    });
  });
});