document.addEventListener("DOMContentLoaded", () => {
    const app = document.getElementById("app");

    // Функция для загрузки страниц
    function loadPage(page) {
        fetch(`pages/${page}.html`)
            .then(response => response.text())
            .then(html => {
                app.innerHTML = html;
                if (page === "results") loadResults(); // Загружаем данные для результатов
            })
            .catch(error => console.error("Ошибка загрузки страницы:", error));
    }

    // Обработчик навигации
    window.addEventListener("hashchange", () => {
        const page = location.hash.replace("#", "") || "home";
        loadPage(page);
    });

    // Загружаем первую страницу при старте
    loadPage(location.hash.replace("#", "") || "home");
});

// Функция для загрузки данных на страницу "results"
function loadResults() {
    fetch("http://localhost:5001/api/results")
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById("results-table");
            tableBody.innerHTML = "";

            data.years.forEach((yearData, index) => {
                const row = `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${yearData.cashFlow.toLocaleString()}</td>
                        <td>${yearData.npv.toLocaleString()}</td>
                        <td>${yearData.irr.toFixed(2)}%</td>
                        <td>${yearData.dpbp.toFixed(2)}</td>
                    </tr>
                `;
                tableBody.innerHTML += row;
            });
        })
        .catch(error => console.error("Ошибка загрузки данных:", error));
}
