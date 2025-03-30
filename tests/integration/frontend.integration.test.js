import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import App from '../../client';

// Мокируем axios для тестирования API-вызовов
jest.mock('axios');

describe('Интеграционные тесты фронтенд-компонентов', () => {
  
  beforeEach(() => {
    // Очищаем все моки перед каждым тестом
    jest.clearAllMocks();
  });

  test('Полный поток работы пользователя: от создания проекта до просмотра результатов', async () => {
    // Настраиваем моки ответов API
    
    // Мок для создания проекта
    axios.post.mockImplementationOnce((url, data) => {
      if (url === '/projects') {
        return Promise.resolve({
          data: {
            id: 1,
            name: data.name,
            description: data.description,
            discountRate: data.discountRate
          }
        });
      }
    });

    // Мок для добавления денежных потоков
    axios.post.mockImplementationOnce((url, data) => {
      if (url === '/cashflows') {
        return Promise.resolve({
          data: data.map((cf, index) => ({
            ...cf,
            id: index + 1
          }))
        });
      }
    });

    // Мок для запуска расчета
    axios.post.mockImplementationOnce((url, data) => {
      if (url === '/calculate') {
        return Promise.resolve({
          data: {
            id: 1,
            projectId: data.projectId,
            npv: 500.25,
            irr: 15.75,
            pp: 3.2,
            dpp: 3.8
          }
        });
      }
    });
    
    // Рендерим приложение
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    // 1. Создание проекта
    // Находим и заполняем форму создания проекта
    const nameInput = screen.getByLabelText(/название проекта/i);
    userEvent.type(nameInput, 'Тестовый инвестиционный проект');
    
    const descriptionInput = screen.getByLabelText(/описание проекта/i);
    userEvent.type(descriptionInput, 'Описание тестового проекта');
    
    const discountRateInput = screen.getByLabelText(/ставка дисконтирования/i);
    userEvent.clear(discountRateInput);
    userEvent.type(discountRateInput, '10');
    
    const createButton = screen.getByRole('button', { name: /создать проект/i });
    userEvent.click(createButton);
    
    // Ждем перехода на форму ввода данных
    await waitFor(() => {
      expect(screen.getByText(/Ввод данных по годам/i)).toBeInTheDocument();
    });
    
    // 2. Добавление денежных потоков
    // Добавляем данные для года 0 (начальные инвестиции)
    const yearInput0 = screen.getByTestId('year-input-0');
    const capexInput0 = screen.getByTestId('capex-input-0');
    userEvent.clear(capexInput0);
    userEvent.type(capexInput0, '1000');
    
    // Добавляем новый год
    const addYearButton = screen.getByRole('button', { name: /добавить год/i });
    userEvent.click(addYearButton);
    
    // Добавляем данные для года 1
    const yearInput1 = screen.getByTestId('year-input-1');
    const revenueInput1 = screen.getByTestId('revenue-input-1');
    const opexInput1 = screen.getByTestId('opex-input-1');
    
    userEvent.clear(revenueInput1);
    userEvent.type(revenueInput1, '500');
    userEvent.clear(opexInput1);
    userEvent.type(opexInput1, '200');
    
    // Добавляем еще несколько лет
    for (let i = 2; i <= 5; i++) {
      userEvent.click(addYearButton);
      
      const revenueInput = screen.getByTestId(`revenue-input-${i}`);
      const opexInput = screen.getByTestId(`opex-input-${i}`);
      
      userEvent.clear(revenueInput);
      userEvent.type(revenueInput, `${300 + i * 200}`);
      userEvent.clear(opexInput);
      userEvent.type(opexInput, `${150 + i * 50}`);
    }
    
    // Отправляем данные и запускаем расчет
    const calculateButton = screen.getByRole('button', { name: /рассчитать/i });
    userEvent.click(calculateButton);
    
    // 3. Проверяем результаты
    await waitFor(() => {
      expect(screen.getByText(/Результаты расчетов/i)).toBeInTheDocument();
    });
    
    // Проверяем, что показатели отображаются корректно
    expect(screen.getByText(/NPV:/i)).toHaveTextContent('500.25');
    expect(screen.getByText(/IRR:/i)).toHaveTextContent('15.75%');
    expect(screen.getByText(/Срок окупаемости \(PP\):/i)).toHaveTextContent('3.2');
    expect(screen.getByText(/Дисконтированный срок окупаемости \(DPP\):/i)).toHaveTextContent('3.8');
    
    // Проверяем, что все API-вызовы были выполнены
    expect(axios.post).toHaveBeenCalledTimes(3);
    
    // Проверяем параметры вызова API
    expect(axios.post).toHaveBeenNthCalledWith(1, '/projects', {
      name: 'Тестовый инвестиционный проект',
      description: 'Описание тестового проекта',
      discountRate: 10
    });
    
    // Проверяем вызов расчета
    expect(axios.post).toHaveBeenNthCalledWith(3, '/calculate', { projectId: 1 });
  });
  
  test('Обработка ошибок API', async () => {
    // Настраиваем мок для имитации ошибки API
    axios.post.mockRejectedValueOnce(new Error('Ошибка API'));
    
    // Рендерим приложение
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );
    
    // Заполняем форму создания проекта
    const nameInput = screen.getByLabelText(/название проекта/i);
    userEvent.type(nameInput, 'Тестовый проект с ошибкой');
    
    const discountRateInput = screen.getByLabelText(/ставка дисконтирования/i);
    userEvent.clear(discountRateInput);
    userEvent.type(discountRateInput, '10');
    
    const createButton = screen.getByRole('button', { name: /создать проект/i });
    userEvent.click(createButton);
    
    // Проверяем, что отображается сообщение об ошибке
    await waitFor(() => {
      expect(screen.getByText(/Произошла ошибка/i)).toBeInTheDocument();
    });
  });
});