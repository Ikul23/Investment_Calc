document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("calc-form");
    const financialDataContainer = document.getElementById("financial-data");
    const addYearButton = document.getElementById("add-year");

    let yearIndex = 1; // Индекс года

    // Функция добавления нового года
    addYearButton.addEventListener("click", function () {
        const yearRow = document.createElement("div");
        yearRow.classList.add("mb-3", "financial-year");
        yearRow.innerHTML = `
            <h5>Год ${yearIndex}</h5>
            <div class="mb-2">
                <label class="form-label">OPEX (руб)</label>
                <input type="number" class="form-control opex" required />
            </div>
            <div class="mb-2">
                <label class="form-label">CAPEX (руб)</label>
                <input type="number" class="form-control capex" required />
            </div>
            <div class="mb-2">
                <label class="form-label">Выручка (руб)</label>
                <input type="number" class="form-control revenue" required />
            </div>
        `;
        financialDataContainer.appendChild(yearRow);
        yearIndex++;
    });

    // Обработчик формы
    form.addEventListener("submit", async function (event) {
        event.preventDefault(); // Предотвращаем перезагрузку страницы

        // Получаем значения из формы
        const projectName = document.getElementById("project-name").value.trim();
        const usefulLife = parseInt(document.getElementById("useful-life-years").value, 10);

        // Собираем данные по годам
        const financialData = [];
        document.querySelectorAll(".financial-year").forEach((row, index) => {
            const opex = parseFloat(row.querySelector(".opex").value);
            const capex = parseFloat(row.querySelector(".capex").value);
            const revenue = parseFloat(row.querySelector(".revenue").value);

            financialData.push({
                year: index + 1,
                opex: opex,
                capex: capex,
                revenue: revenue
            });
        });

        console.log("Финансовые данные по годам:", financialData); // Для отладки

        // Рассчитываем срок окупаемости (PP) как первый год, когда кумулятивный денежный поток становится положительным
        let cumulativeCashFlow = 0;
        let paybackPeriod = null;
        for (let i = 0; i < financialData.length; i++) {
            cumulativeCashFlow += financialData[i].revenue - financialData[i].opex - financialData[i].capex;
            if (cumulativeCashFlow >= 0) {
                paybackPeriod = i + 1;
                break;
            }
        }

        // Выводим результат на страницу
        document.getElementById("result").innerHTML = `
            <p><strong>Название проекта:</strong> ${projectName}</p>
            <p><strong>Срок окупаемости (лет):</strong> ${paybackPeriod !== null ? paybackPeriod : "Не окупается"}</p>
        `;

        // Формируем объект данных для отправки на сервер
        const projectData = {
            name: projectName,
            usefulLifeYears: usefulLife,
            financialData: financialData // Динамический список по годам
        };

        // Отправляем данные на бэкенд
        try {
            const response = await fetch("http://localhost:5001/api/projects", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(projectData)
            });

            const result = await response.json();
            if (response.ok) {
                alert("Проект успешно создан!");
                console.log("Ответ сервера:", result);
                form.reset(); // Очищаем форму
                financialDataContainer.innerHTML = ""; // Убираем динамически добавленные годы
                yearIndex = 1; // Сбрасываем индекс лет
            } else {
                alert("Ошибка при отправке данных: " + result.message);
            }
        } catch (error) {
            console.error("Ошибка при отправке данных:", error);
            alert("Не удалось отправить данные. Проверьте подключение к серверу.");
        }
    });
});
