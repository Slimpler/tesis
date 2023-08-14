import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import path from "path";

import rolesRoutes from "./routes/roles.routes.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/users.routes.js";
import comunidadRoutes from "./routes/comunidad.routes.js";
import reportesRoutes from "./routes/reportes.routes.js";
import diagnosticosRoutes from "./routes/diagnosticos.routes.js";
import tratamientosRoutes from "./routes/tratamientos.routes.js";

import { FRONTEND_URL } from "./config.js";
import { createUser, createInitialRoles } from "./libs/initialSetup.js";

const app = express();

// Middleware
app.use(
  cors({
    credentials: true,
    origin: FRONTEND_URL,
  })
);
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "./uploads",
  })
);


// Crear roles iniciales y usuario con rol "admin"
createInitialRoles();
createUser();

// Rutas
app.use("/api/reportes", reportesRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/roles", rolesRoutes);
app.use("/api/user", userRoutes);
app.use("/api/comunidad", comunidadRoutes);
app.use("/api/diagnosticos", diagnosticosRoutes);
app.use("/api/tratamientos", tratamientosRoutes);

app.use("/uploads", express.static(path.resolve("uploads")));

// Ruta para producción
if (process.env.NODE_ENV === "production") {
  import("path").then((path) => {
    app.use(express.static("client/dist"));

    app.get("*", (req, res) => {
      res.sendFile(path.resolve("client", "dist", "index.html"));
    });
  });
}

// Ruta para testeo
if (process.env.NODE_ENV === "test") {
  import("path").then((path) => {
    app.use(express.static("client/dist"));

    app.get("*", (req, res) => {
      res.sendFile(path.resolve("client", "dist", "index.html"));
    });
  });
}

// Manejo de errores (middleware de última instancia)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

export default app;



