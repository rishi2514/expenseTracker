const setAccessToken = (token) => {
  if (token) {
    localStorage.setItem("accessToken", token);
  }
};

const getAccessToken = () => {
  return localStorage.getItem("accessToken");
};

const setUser = (user) => {
  if (user) {
    localStorage.setItem("user", JSON.stringify(user));
  }
};

const getUser = () => {
  const user = localStorage.getItem("user");
  try {
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

const removeAll = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("user");
};

export { setAccessToken, getAccessToken, setUser, getUser, removeAll };