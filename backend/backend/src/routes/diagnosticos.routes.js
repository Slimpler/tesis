import { Router } from "express";
import {createDiagnostico, deleteDiagnostico, getDiagnostico, getDiagnosticos, updateDiagnostico} from "../controllers/diagnosticos.controller.js"
import { auth } from "../middlewares/auth.middleware.js";
import { isAdmin, isPaciente, isModerator } from "../middlewares/roles.middleware.js";

const router = Router();

router.post("/createDiagnostico", auth, isModerator, createDiagnostico);
router.put("/updateDiagnostico/:id", auth, isModerator, updateDiagnostico);
router.delete("/deleteDiagnostico/:id", auth, isModerator, deleteDiagnostico);
router.get("/getDiagnosticos", auth, isModerator, getDiagnosticos);
router.get("/getDiagnostico/:pacienteId", auth, isModerator, getDiagnostico);

export default router;
 