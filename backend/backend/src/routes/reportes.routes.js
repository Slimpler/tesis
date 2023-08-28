import { Router } from "express";
import {createReporte, getReporte, deleteReporte, getReportes, responderReporte} from "../controllers/reportes.controller.js"
import { auth } from "../middlewares/auth.middleware.js";
import { isAdmin, isPaciente, isModerator } from "../middlewares/roles.middleware.js";

const router = Router();

//Rutas asociadas a reportes
router.get("/getReportes", auth, isModerator, getReportes);
router.post("/createReporte", auth, isPaciente, createReporte);
router.get("/getReporte/:id", auth, isModerator, getReporte);
router.delete("/deleteReporte/:id", auth, isModerator, deleteReporte);
router.put("/responderReporte/:reporteId", auth, isModerator, responderReporte);

export default router;
