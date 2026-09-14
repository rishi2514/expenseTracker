import { Router } from "express"
import {registerUser} from "../controllers/user.controller.js"

// creating router from express.router
const router = Router()

router.route("/register").post(registerUser)

export default router