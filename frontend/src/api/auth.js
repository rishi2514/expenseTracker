import client from "./client";

// login function to send a POST request to the backend API for user authentication
export const login = async (email, password) => {
  try {
    const response = await client.post("/user/login", { email, password });
    return response;
  } catch (error) {
    throw error.response.data;
  }
};