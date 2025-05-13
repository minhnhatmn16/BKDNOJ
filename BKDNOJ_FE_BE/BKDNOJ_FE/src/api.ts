import axios from "axios";
import config from "../config.json";
const API_BASE_URL = config.API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getCurrentUser = async () => {
  return api.get("/auth/profile/myProfile");
};

export default api;
