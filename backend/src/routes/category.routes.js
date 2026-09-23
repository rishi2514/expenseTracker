import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createCategory,
  getAllCategories,
  getCategory,
  updateCategory,
} from "../controllers/category.controller.js";

const router = Router();

router.route("/create").post(verifyJWT, createCategory);
router.route("/update").patch(verifyJWT, updateCategory);
router.route("/:categoryId").get(verifyJWT, getCategory);
router.route("/").get(verifyJWT, getAllCategories);

export default router;
