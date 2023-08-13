import { Router } from "express";
import {
  getAporte,
  getAportes,
  createAporte,
  deleteAporte,
  aceptarAporte,
  showAportes,
} from "../controllers/comunidad.controller.js";
import { auth } from "../middlewares/auth.middleware.js";
import { isAdmin, isPaciente, isModerator } from "../middlewares/roles.middleware.js";

const router = Router();  

//Rutas asociadas a reportes
router.get("/getAportes", auth, isAdmin, getAportes);
router.post("/createAporte", auth, createAporte);
router.get("/getAporte/:id", auth, isAdmin, getAporte);
router.delete("/deleteAporte/:id", auth, isAdmin, deleteAporte);
router.put("/aceptarAporte/:aporteId", auth, isAdmin, aceptarAporte);
router.get("/showAportes", auth, showAportes)
  
export default router;
