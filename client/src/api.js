import axios from "axios";
export const fetchProjectResults = async (projectId) => {
  const response = await fetch(`/api/projects/${projectId}/results`);
  if (!response.ok) throw new Error("Ошибка при получении данных");
  return await response.json();
};

const API_URL = "http://localhost:5000"; 

export const sendProjectData = async (projectData, yearlyData) => {
  console.log("📤 Отправка данных:", {
    name: projectData.name,
    opex: projectData.opex,
    capex: projectData.capex,
    yearlyData: yearlyData,
  });
  try {
    const response = await axios.post(`${API_URL}/api/projects`, {
      name: projectData.name,
      opex: projectData.opex,
      capex: projectData.capex,
      yearlyData: yearlyData,
    });

    return response.data;
  } catch (error) {
    console.error("Ошибка при отправке данных:", error);
    throw error;
  }
};
export const saveProject = async (projectData) => {
  return axios.post("/api/projects", projectData);
};

export const downloadCSV = async (projectId) => {
  window.open(`/api/report/csv/${projectId}`, "_blank");
};
export const downloadReport = async (projectId) => {
    const response = await fetch(`${API_URL}/api/report/${projectId}`);
    if (!response.ok) throw new Error("Ошибка при скачивании отчета");

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `report_${projectId}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
};