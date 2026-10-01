import client from "./client";

// GET /api/v1/user/me
export const getMe = async () => (await client.get("/user/me")).data;

// PATCH /api/v1/user/update
// The backend expects at least one of name / userName (and reads an undefined
// `email` when only userName is sent), so we always send both fields together.
export const updateProfile = async ({ name, userName }) =>
  (await client.patch("/user/update", { name, userName })).data;

// PATCH /api/v1/user/update-avatar (multipart)
export const updateAvatar = async (file) => {
  const formData = new FormData();
  formData.append("avatar", file);
  const response = await client.patch("/user/update-avatar", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// PATCH /api/v1/user/update-password
export const updatePassword = async ({ oldPassword, newPassword }) =>
  (await client.patch("/user/update-password", { oldPassword, newPassword }))
    .data;

// POST /api/v1/user/logout
export const logout = async () => (await client.post("/user/logout")).data;
