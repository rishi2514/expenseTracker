import axios from "axios";
import { getAccessToken } from "../utils/storage.js";

// create a axios instance with base url and headers
const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "X-Client-Type": "web", // custom header to identify the client type
  },
  withCredentials: true, // include cookies in requests
});

client.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default client;