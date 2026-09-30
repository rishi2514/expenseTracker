import axios from "axios";
import { getAccessToken, setAccessToken, removeAll } from "../utils/storage.js";

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

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Do not attempt refresh for login, register, or refresh-token calls itself to avoid loops
    const isAuthEndpoint =
      originalRequest?.url?.includes("/user/login") ||
      originalRequest?.url?.includes("/user/register") ||
      originalRequest?.url?.includes("/user/refresh-token");

    if (
      error.response?.status === 401 &&
      !originalRequest?._retry &&
      !isAuthEndpoint
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return client(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await client.post("/user/refresh-token");
        const newAccessToken =
          response.data?.data?.accessToken || response.data?.accessToken;

        if (newAccessToken) {
          setAccessToken(newAccessToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          processQueue(null, newAccessToken);
          return client(originalRequest);
        } else {
          throw new Error("Unable to refresh access token");
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        removeAll();
        if (
          typeof window !== "undefined" &&
          !window.location.pathname.includes("/login")
        ) {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default client;