const request = require('supertest');
const app = require('../../server'); // Импортируем express-приложение
const { sequelize } = require('../../models'); // Предполагаю, что sequelize экспортируется из моделей

// Мокируем данные для тестирования
const testProject = {
  name: "Тестовый инвестиционный проект",
  description: "Описание тестового проекта для интеграционных тестов",
  discountRate: 10 // ставка дисконтирования 10%
};

const testCashFlows = [
  { year: 0, revenue: 0, opex: 0, capex: 1000 }, // Начальные инвестиции
  { year: 1, revenue: 500, opex: 200, capex: 0 },
  { year: 2, revenue: 700, opex: 250, capex: 0 },
  { year: 3, revenue: 900, opex: 300, capex: 0 },
  { year: 4, revenue: 1100, opex: 350, capex: 0 },
  { year: 5, revenue: 1300, opex: 400, capex: 0 }
];

describe('Интеграционные тесты потока работы с инвестиционным проектом', () => {
  let projectId;
  
  // Перед всеми тестами очищаем базу данных
  beforeAll(async () => {
    // Очистка базы данных перед тестами
    await sequelize.sync({ force: true });
  });
  
  // После всех тестов закрываем соединение с БД
  afterAll(async () => {
    await sequelize.close();
  });

  test('1. Должен создать новый проект', async () => {
    const response = await request(app)
      .post('/projects')
      .send(testProject)
      .expect(201);
    
    expect(response.body.project).toHaveProperty("id");
    expect(response.body.name).toBe(testProject.name);
    expect(response.body.description).toBe(testProject.description);
    expect(response.body.discountRate).toBe(testProject.discountRate);
    
    projectId = response.body.id; // Сохраняем ID проекта для дальнейших тестов
  });

  test('2. Должен получить список проектов с созданным проектом', async () => {
    const response = await request(app)
      .get('/projects')
      .expect(200);
    
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
    
    // Проверяем, что созданный проект присутствует в списке
    const foundProject = response.body.find(project => project.id === projectId);
    expect(foundProject).toBeDefined();
    expect(foundProject.name).toBe(testProject.name);
  });

  test('3. Должен добавить денежные потоки к проекту', async () => {
    const cashFlowsWithProjectId = testCashFlows.map(cf => ({
      ...cf,
      projectId
    }));
    
    const response = await request(app)
      .post('/cashflows')
      .send(cashFlowsWithProjectId)
      .expect(201);
    
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(testCashFlows.length);
    
    // Проверяем, что все денежные потоки были сохранены
    for (let i = 0; i < testCashFlows.length; i++) {
      expect(response.body[i]).toHaveProperty('id');
      expect(response.body[i].year).toBe(testCashFlows[i].year);
      expect(response.body[i].revenue).toBe(testCashFlows[i].revenue);
      expect(response.body[i].opex).toBe(testCashFlows[i].opex);
      expect(response.body[i].capex).toBe(testCashFlows[i].capex);
      expect(response.body[i].projectId).toBe(projectId);
    }
  });

  test('4. Должен запустить расчет и получить финансовые показатели', async () => {
    const response = await request(app)
      .post('/calculate')
      .send({ projectId })
      .expect(200);
    
    expect(response.body.project).toHaveProperty("id");
    expect(response.body).toHaveProperty('npv');
    expect(response.body).toHaveProperty('irr');
    expect(response.body).toHaveProperty('pp');
    expect(response.body).toHaveProperty('dpp');
    expect(response.body.projectId).toBe(projectId);
    
    // Проверяем, что показатели рассчитаны корректно
    // NPV должен быть положительным для прибыльного проекта
    expect(response.body.npv).toBeGreaterThan(0);
    
    // IRR должна быть выше ставки дисконтирования для прибыльного проекта
    expect(response.body.irr).toBeGreaterThan(testProject.discountRate);
  });

  test('5. Должен получить результаты расчета по ID проекта', async () => {
    const response = await request(app)
      .get(`/results/${projectId}`)
      .expect(200);
    
    expect(response.body).toHaveProperty('npv');
    expect(response.body).toHaveProperty('irr');
    expect(response.body).toHaveProperty('pp');
    expect(response.body).toHaveProperty('dpp');
    expect(response.body.projectId).toBe(projectId);
  });
});