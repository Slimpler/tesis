import { Router } from "express";
import {createExamen, updateExamen, deleteExamen, getExamen, getExamenes} from "../controllers/examenes.controller.js"
import { auth } from "../middlewares/auth.middleware.js";
import { isAdmin, isPaciente, isModerator } from "../middlewares/roles.middleware.js";

const router = Router();

router.post("/createExamen", auth, isModerator, createExamen);
router.put("/updateExamen/:id", auth, isModerator, updateExamen);
router.delete("/deleteExamen/:id", auth, isModerator, deleteExamen);

// No utilizados actualmente...
router.get("/getExamenes", auth, isModerator, getExamenes);
router.get("/getExamen/:pacienteId", auth, isModerator, getExamen);

export default router;
 