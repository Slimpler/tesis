import { Router } from "express";
import {createTratamiento, updateTratamiento, deleteTratamiento, getTratamiento, getTratamientos} from "../controllers/tratamientos.controller.js"
import { auth } from "../middlewares/auth.middleware.js";
import { isAdmin, isPaciente, isModerator } from "../middlewares/roles.middleware.js";

const router = Router();


router.post("/createTratamiento", auth, isModerator, createTratamiento);
router.put("/updateTratamiento/:id", auth, isModerator, updateTratamiento);
router.delete("/deleteTratamiento/:id", auth, isModerator, deleteTratamiento);
router.get("/getTratamientos", auth, isModerator, getTratamientos);
router.get("/getTratamiento/:pacienteId", auth, isModerator, getTratamiento);

export default router;
 