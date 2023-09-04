import { Router } from "express";
import {
  login,
  logout,
  verifyToken,
  sendMailChangePassword,
  resetPassword
} from "../controllers/auth.controller.js";
import { auth} from "../middlewares/auth.middleware.js";

const router = Router(); 
router.post("/login", login);
router.get("/verify", verifyToken);
router.post("/logout", auth, logout);

//CHANGEPASSWORD
router.post("/forgot-password", sendMailChangePassword);
router.post("/reset-password/", resetPassword);

export default router;
