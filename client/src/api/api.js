import axios from "axios";
const API_URL = process.env.REACT_APP_API_URL || "/api";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  timeout: 60000,
  headers: process.env.REACT_APP_API_KEY 
    ? { "x-api-key": process.env.REACT_APP_API_KEY } 
    : {},
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;