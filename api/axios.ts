// axiosServer.ts (Server-Side)
"use server";

import axios from "axios";
import { cookies } from "next/headers";

const axiosServer = axios.create({
  baseURL: "http://192.168.0.148:8000/api",
  timeout: 3000,
});

// Add a request interceptor to attach the token
axiosServer.interceptors.request.use(
  (config) => {
    const token = cookies().get("token")?.value;

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosServer;
