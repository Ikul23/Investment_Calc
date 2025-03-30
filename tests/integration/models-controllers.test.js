
const { Project, CashFlow, FinancialResult } = require('../../models');
const projectController = require('../../controllers/projectController');
const { sequelize } = require('../../models');

// Мокируем Express req/res/next
const mockRequest = (body = {}, params = {}, query = {}) => ({
  body,
  params,
  query
});

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

const mockNext = jest.fn();

describe('Тесты взаимодействия моделей и контроллеров', () => {
  
  beforeAll(async () => {
    // Синхронизируем тестовую базу данных
    await sequelize.sync({ force: true });
  });
  
  afterAll(async () => {
    await sequelize.close();
  });
  
  beforeEach(async () => {
    // Очищаем данные перед каждым тестом
    await Project.destroy({ where: {} });
    await CashFlow.destroy({ where: {} });
    await FinancialResult.destroy({ where: {} });
  });
  
  test('Создание проекта через контроллер должно создавать запись в БД', async () => {
    // Подготавливаем тестовые данные
    const testProjectData = {
      name: "Тестовый проект через контроллер",
      description: "Тестовое описание",
      discountRate: 12
    };
    
    const req = mockRequest(testProjectData);
    const res = mockResponse();
    
    // Вызываем контроллер
    await projectController.createProject(req, res, mockNext);
    
    // Проверяем ответ
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalled();
    
    // Извлекаем ID созданного проекта
    const projectId = res.json.mock.calls[0][0].id;
    
    // Проверяем, что проект действительно создан в БД
    const savedProject = await Project.findByPk(projectId);
    
    expect(savedProject).not.toBeNull();
    expect(savedProject.name).toBe(testProjectData.name);
    expect(savedProject.description).toBe(testProjectData.description);
    expect(savedProject.discountRate).toBe(testProjectData.discountRate);
  });
  
  test('Расчет финансовых показателей должен работать корректно', async () => {
    // Создаем тестовый проект
    const project = await Project.create({
      name: "Тест расчета показателей",
      description: "Проверка правильности расчетов",
      discountRate: 10
    });
    
    // Создаем денежные потоки
    const cashFlows = [
      { year: 0, revenue: 0, opex: 0, capex: 1000, projectId: project.id },
      { year: 1, revenue: 500, opex: 200, capex: 0, projectId: project.id },
      { year: 2, revenue: 700, opex: 250, capex: 0, projectId: project.id },
      { year: 3, revenue: 900, opex: 300, capex: 0, projectId: project.id }
    ];
    
    await CashFlow.bulkCreate(cashFlows);
    
    // Подготавливаем запрос
    const req = mockRequest({ projectId: project.id });
    const res = mockResponse();
    
    // Вызываем функцию расчета (предполагаем, что она называется calculateFinancials)
    await projectController.calculateFinancials(req, res, mockNext);
    
    // Проверяем ответ
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
    
    const result = res.json.mock.calls[0][0];
    
    // Проверяем, что все показатели рассчитаны
    expect(result).toHaveProperty('npv');
    expect(result).toHaveProperty('irr');
    expect(result).toHaveProperty('pp');
    expect(result).toHaveProperty('dpp');
    
    // NPV должен быть положительным для данного примера
    expect(parseFloat(result.npv)).toBeGreaterThan(0);
    
    // IRR должна быть выше ставки дисконтирования
    expect(parseFloat(result.irr)).toBeGreaterThan(project.discountRate);
    
    // Проверяем, что результаты сохранены в БД
    const savedResult = await FinancialResult.findOne({
      where: { projectId: project.id }
    });
    
    expect(savedResult).not.toBeNull();
    expect(parseFloat(savedResult.npv)).toBe(parseFloat(result.npv));
    expect(parseFloat(savedResult.irr)).toBe(parseFloat(result.irr));
  });
  
  test('Должен корректно обрабатывать отсутствие данных', async () => {
    // Создаем проект без денежных потоков
    const project = await Project.create({
      name: "Проект без данных",
      description: "Тест обработки отсутствующих данных",
      discountRate: 10
    });
    
    const req = mockRequest({ projectId: project.id });
    const res = mockResponse();
    
    // Вызываем функцию расчета
    await projectController.calculateFinancials(req, res, mockNext);
    
    // Проверяем, что функция возвращает ошибку или специальное значение
    // В зависимости от реализации контроллера
    
    // К  онтроллер возвращает ошибку 400
    expect(res.status).toHaveBeenCalledWith(400);
    
    
  });
});