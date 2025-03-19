import axios from "axios";

const API_URL = "http://localhost:5000"; 

export const sendProjectData = async (projectData, yearlyData) => {
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
