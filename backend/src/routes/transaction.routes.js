import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createTransaction,
  getAllTransaction,
  getTransaction,
  updateTransaction,
} from "../controllers/transaction.controller.js";

const router = Router();

router.route("/create").post(verifyJWT, createTransaction);
router.route("/").get(verifyJWT, getAllTransaction);
router.route("/:transactionId").get(verifyJWT, getTransaction)
router.route("/update").patch(verifyJWT, updateTransaction)

export default router;
