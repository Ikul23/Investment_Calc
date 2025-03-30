module.exports = {
  testEnvironment: 'node',
  testMatch: [
    '**/__tests__/**/*.js',
    '**/?(*.)+(spec|test).js',
    '!**/client/**' // Исключаем фронтенд тесты
  ],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'controllers/**/*.js',
    'models/**/*.js',
    'services/**/*.js',
    'utils/**/*.js',
    'routes/**/*.js', 
    '!**/node_modules/**',
    '!**/migrations/**',
    '!**/seeders/**'
  ],
  setupFilesAfterEnv: ['./tests/setup.js'],
  testTimeout: 15000, // Увеличили таймаут для интеграционных тестов
  clearMocks: true, // Автоматически очищаем моки между тестами
  resetModules: true, // Сбрасываем кэш модулей между тестами
  coverageThreshold: { // Минимальные требования к покрытию
    global: {
      statements: 70,
      branches: 50,
      functions: 70,
      lines: 70
    }
  }
};