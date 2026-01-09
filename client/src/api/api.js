import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000/api";


const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  timeout: 60000,
  headers: {
    "x-api-key": process.env.REACT_APP_API_KEY,
  },
});

export default api;
