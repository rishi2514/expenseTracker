import client from "./client";
import { cleanParams } from "./params";

// GET /api/v1/transaction (paginated: { data: Transaction[], meta })
export const getTransactions = async (params = {}) =>
  (await client.get("/transaction", { params: cleanParams(params) })).data;

// GET /api/v1/transaction/:transactionId
export const getTransaction = async (transactionId) =>
  (await client.get(`/transaction/${transactionId}`)).data;

// POST /api/v1/transaction/create
export const createTransaction = async (payload) =>
  (await client.post("/transaction/create", payload)).data;

// PATCH /api/v1/transaction/update (transactionId travels in the body)
export const updateTransaction = async (transactionId, payload) =>
  (
    await client.patch("/transaction/update", { transactionId, ...payload })
  ).data;
