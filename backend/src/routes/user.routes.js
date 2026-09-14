import { Router } from "express"
import {registerUser} from "../controllers/user.controller.js"
import {upload} from "../middlewares/multer.middleware.js"

// creating router from express.router
const router = Router()

// for using the middleware just before calling our controller we add another function in this case we called upload function from utils for processing image and then proceed to registerUser
router.route("/register").post(
    upload.single("avatar"),
    registerUser
)

export default router