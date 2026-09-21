import { Router } from "express";
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  refreshToken,
  registerUser,
  updateUser,
  updateUserProfilePicture,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

// creating router from express.router
const router = Router();

// for using the middleware just before calling our controller we add another function in this case we called upload function from utils for processing image and then proceed to registerUser
router.route("/register").post(upload.single("avatar"), registerUser);

router.route("/login").post(loginUser);

// secured routes
router.route("/update").patch(verifyJWT, updateUser)
router.route("/update-profile-pic").patch(verifyJWT, upload.single("avatar"), updateUserProfilePicture)
router.route("/update-password").patch(verifyJWT, updateUserProfilePicture)
router.route("/me").get(verifyJWT, getCurrentUser)

router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshToken);

export default router;
