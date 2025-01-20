"use server";
import axios from "axios";
import { cookies } from "next/headers";

const API_BASE_URL = "http://192.168.0.148:8000/api";
export const getDocument = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/document/get`);
    return response.data; // Return the data from the API
  } catch (error) {
    console.error("Error fetching document:", error);
    throw error; 
  }
};
export const signin = async (data: { username: string; password: string }) => {
  const cook = await cookies();
  try {
    const response = await axios.post(`${API_BASE_URL}/user/login`, data);
    if (response.status !== 200) {
      return { success: false, message: response.data.message };
    }
    cook.set("token", response.data.access);
    return response.data; // Return the data from the API
  } catch (error) {
    console.error("Error during login:", error);
    throw error; 
  }
};

export const signUp = async (data: { username: string; password: string }) => {
  const cook = await cookies();
  try {
    const response = await axios.post(`${API_BASE_URL}/user/register`, data);
    if (response.status !== 201) {
      return { success: false, message: response.data.message };
    }
    cook.set("token", response.data.access);
    return response.data; // Return the data from the API
  } catch (error) {
    console.error("Error during signup:", error);
    throw error;
  }
};