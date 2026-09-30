const setAccessToken = (token) => {
  localStorage.setItem("accessToken", token);
}

const getAccessToken = () => {
  return localStorage.getItem("accessToken");
}

const removeAll = () => {
  localStorage.removeItem("accessToken");
}

export { setAccessToken, getAccessToken, removeAll };