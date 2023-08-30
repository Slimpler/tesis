import { Router } from "express";
import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  userProfile,
  getAdmins,
  getModerators,
  getPacientes,
  getUsersTrue,
  changeState,
  sendMailChangePassword,
  resetPassword
} from "../controllers/users.controllers.js";
import { isAdmin, isModerator, isPaciente } from "../middlewares/roles.middleware.js";
import { auth } from "../middlewares/auth.middleware.js";
import { registerSchema} from "../schemas/auth.schema.js";
import { validateSchema } from "../middlewares/validator.middleware.js";

const router = Router();

//CHANGEPASSWORD
router.post("/forgot-password", sendMailChangePassword);
router.post("/reset-password/", resetPassword);

//STATE
router.get("/usersTrue", auth, isAdmin, getUsersTrue); 
router.put("/changeState/:userId",auth, isAdmin, changeState);

//CRUD DE LOS USUARIOS
router.get("/users", auth, isAdmin, getUsers);
router.get("/users/:id",auth, isAdmin, getUser);
router.post("/users", auth, isAdmin, validateSchema(registerSchema), createUser);
router.put("/users/:id",auth, isAdmin,  updateUser);
router.delete("/users/:id", auth, isAdmin, deleteUser);

//Busqueda por tipo de usuario
router.get("/admins", auth, isAdmin, getAdmins);
router.get("/moderators", auth, isAdmin, getModerators);
router.get("/pacientes", auth, isModerator, getPacientes);

//Creacion y actualizacion del usuario y su perfil

router.get("/profile/", auth, isPaciente, userProfile);


export default router;
 