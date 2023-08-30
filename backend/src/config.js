import dotenv from "dotenv";
dotenv.config(); 

export const PORT = process.env.PORT || 4001;
export const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/nico";
export const TOKEN_SECRET = process.env.TOKEN_SECRET || "secret";
export const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

