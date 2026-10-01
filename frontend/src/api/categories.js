import client from "./client";
import { cleanParams } from "./params";

// GET /api/v1/category (paginated: { data: Category[], meta })
export const getCategories = async (params = {}) =>
  (await client.get("/category", { params: cleanParams(params) })).data;

// GET /api/v1/category/:categoryId
export const getCategory = async (categoryId) =>
  (await client.get(`/category/${categoryId}`)).data;

// POST /api/v1/category/create
export const createCategory = async (name) =>
  (await client.post("/category/create", { name })).data;

// PATCH /api/v1/category/update
export const updateCategory = async (categoryId, name) =>
  (await client.patch("/category/update", { categoryId, name })).data;
