import axios from "axios";

const API_BASE_URL = "http://192.168.0.148:8000/api";

export const getDocument = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/document/get`);
    return response.data; // Return the data from the API
  } catch (error) {
    console.error("Error fetching document:", error);
    throw error; // Handle the error as needed
  }
};
