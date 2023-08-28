import { Router } from "express";
import { auth } from "../middlewares/auth.middleware.js";
import {
  getRoles,
  getRole,
  createRole,
  updateRole,
  deleteRole,
  getAdminRole
} from "../controllers/roles.controller.js";
import { isAdmin } from "../middlewares/roles.middleware.js";

const router = Router();

router.get("/roles", auth, isAdmin, getRoles);
router.get("/roles/:id", auth, isAdmin, getRole);
router.post("/roles",auth, isAdmin, createRole);
router.put("/roles/:id",auth, isAdmin, updateRole);
router.delete("/roles/:id", auth,  isAdmin, deleteRole);
router.get("/admin", auth, getAdminRole);
export default router;
