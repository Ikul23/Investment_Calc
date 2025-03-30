const { sequelize } = require('../models');
const fs = require('fs');

process.env.NODE_ENV = 'test';

// Глобальные хуки для тестов
beforeAll(async () => {
  console.log('\n[Setup] Инициализация тестовой среды...');
  
  // Проверка подключения к БД
  try {
    await sequelize.authenticate();
    console.log('[Setup] Соединение с БД установлено');
    
    // Синхронизация моделей
    await sequelize.sync({ force: true });
    console.log('[Setup] Тестовая БД синхронизирована');
  } catch (error) {
    console.error('[Setup] Ошибка инициализации БД:', error.message);
    
    // Если нет тестовой БД, пытаемся создать
    if (error.message.includes('database "investment_calc_test" does not exist')) {
      console.log('[Setup] Пытаемся создать тестовую БД...');
      try {
        const adminSequelize = new Sequelize({
          database: 'postgres',
          username: process.env.DB_USERNAME,
          password: process.env.DB_PASSWORD,
          host: process.env.DB_HOST,
          dialect: 'postgres'
        });
        
        await adminSequelize.query(`CREATE DATABASE ${process.env.DB_DATABASE_TEST || 'investment_calc_test'}`);
        console.log('[Setup] Тестовая БД создана');
        await sequelize.sync({ force: true });
      } catch (createError) {
        console.error('[Setup] Ошибка создания БД:', createError.message);
      }
    }
  }
});

afterEach(async () => {
  // Очистка данных после каждого теста
  try {
    await sequelize.truncate({ cascade: true });
  } catch (error) {
    console.error('Ошибка очистки БД:', error);
  }
});

afterAll(async () => {
  console.log('\n[Teardown] Завершение тестов...');
  try {
    await sequelize.close();
    console.log('[Teardown] Соединение с БД закрыто');
  } catch (error) {
    console.error('[Teardown] Ошибка закрытия соединения:', error);
  }
});