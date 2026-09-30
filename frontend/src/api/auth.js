import client from "./client";

// login function to send a POST request to the backend API for user authentication
export const login = async (identifier, password, isRememberMe) => {
  try {
    const isEmail = identifier?.includes("@");
    const response = await client.post("/user/login", {
      email: isEmail ? identifier : undefined,
      userName: !isEmail ? identifier : undefined,
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
    let payload;
    let config = {};

    if (avatar instanceof File) {
      const formData = new FormData();
      formData.append("userName", userName);
      if (name) formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("avatar", avatar);
      payload = formData;
      config.headers = { "Content-Type": "multipart/form-data" };
    } else {
      payload = {
        userName,
        name,
        email,
        password,
        avatar,
      };
    }

    const response = await client.post("/user/register", payload, config);
    return response;
  } catch (error) {
    throw error.response?.data || error;
  }
};
