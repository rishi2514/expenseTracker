import axios from "axios";

// create a axios instance with base url and headers
const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "X-Client-Type": "web", // custom header to identify the client type
  },
  withCredentials: true, // include cookies in requests
});

export default client;