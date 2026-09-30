import client from "./client";

// login function to send a POST request to the backend API for user authentication
export const login = async (email, password, isRememberMe) => {
  try {
    const response = await client.post("/user/login", {
      email,
      password,
      isRememberMe,
    });
    return response;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// register function to send a POST request to the backend API for user registration
export const register = async (userName, name, email, password, avatar) => {
  try {
    const response = await client.post("/user/register", {
      userName,
      name,
      email,
      password,
      avatar,
    });
    return response;
  } catch (error) {
    throw error.response?.data || error;
  }
};
