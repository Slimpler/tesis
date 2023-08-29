import { Router } from "express";
import {
  login,
  logout,
  verifyToken,
} from "../controllers/auth.controller.js";
import { auth} from "../middlewares/auth.middleware.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { loginSchema} from "../schemas/auth.schema.js";

const router = Router(); 
router.post("/login", login);
router.get("/verify", verifyToken);
router.post("/logout", auth, logout);

export default router;
